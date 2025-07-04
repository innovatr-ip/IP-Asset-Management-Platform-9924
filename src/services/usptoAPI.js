// USPTO Trademark Status Document Retrieval (TSDR) API Integration
class USPTOService {
  constructor() {
    this.baseURL = 'https://tsdrapi.uspto.gov/ts/cd';
    this.searchURL = 'https://tmsearch.uspto.gov/search/v1.0';
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  // Search for trademark applications by keyword
  async searchTrademarks(keyword, options = {}) {
    await this.rateLimit();
    
    try {
      const searchParams = {
        q: keyword,
        f: options.format || 'json',
        s: options.start || 0,
        rows: options.rows || 50,
        sort: options.sort || 'score desc',
        fl: 'serialNumber,registrationNumber,markDrawingCode,typeOfMark,markDescription,goodsAndServices,applicantName,applicationDate,registrationDate,statusCode,statusDate'
      };

      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${this.searchURL}/trademark/search?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'IPTracker-BrandMonitoring/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`USPTO API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.processSearchResults(data);
    } catch (error) {
      console.error('USPTO Search Error:', error);
      // Fallback to mock data for development
      return this.getMockSearchResults(keyword);
    }
  }

  // Get detailed trademark information by serial number
  async getTrademarkDetails(serialNumber) {
    await this.rateLimit();
    
    try {
      const response = await fetch(`${this.baseURL}/casestatus/${serialNumber}/info?format=json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'IPTracker-BrandMonitoring/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`USPTO TSDR Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.processTrademarkDetails(data);
    } catch (error) {
      console.error('USPTO Details Error:', error);
      return this.getMockTrademarkDetails(serialNumber);
    }
  }

  // Monitor for new trademark applications
  async monitorNewApplications(keywords, lastCheckDate) {
    const newApplications = [];
    
    for (const keyword of keywords) {
      try {
        const results = await this.searchTrademarks(keyword, {
          sort: 'applicationDate desc',
          rows: 20
        });

        // Filter applications filed after last check
        const recentApplications = results.filter(app => {
          const appDate = new Date(app.applicationDate);
          return appDate > new Date(lastCheckDate);
        });

        newApplications.push(...recentApplications);
      } catch (error) {
        console.error(`Error monitoring keyword "${keyword}":`, error);
      }
    }

    return this.removeDuplicates(newApplications, 'serialNumber');
  }

  // Check for trademark status changes
  async checkStatusChanges(monitoredApplications) {
    const statusChanges = [];

    for (const app of monitoredApplications) {
      try {
        const currentDetails = await this.getTrademarkDetails(app.serialNumber);
        
        if (currentDetails.status !== app.lastKnownStatus) {
          statusChanges.push({
            ...currentDetails,
            previousStatus: app.lastKnownStatus,
            changeDetected: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error checking status for ${app.serialNumber}:`, error);
      }
    }

    return statusChanges;
  }

  // Find similar trademarks using phonetic and visual similarity
  async findSimilarTrademarks(targetMark, options = {}) {
    const variations = this.generateMarkVariations(targetMark);
    const similarMarks = [];

    for (const variation of variations) {
      try {
        const results = await this.searchTrademarks(variation, {
          rows: 10,
          sort: 'score desc'
        });

        // Filter for actual similar marks (not exact matches)
        const similar = results.filter(mark => 
          mark.markDescription !== targetMark && 
          this.calculateSimilarity(targetMark, mark.markDescription) > 0.7
        );

        similarMarks.push(...similar);
      } catch (error) {
        console.error(`Error searching variation "${variation}":`, error);
      }
    }

    return this.removeDuplicates(similarMarks, 'serialNumber');
  }

  // Process and normalize search results
  processSearchResults(data) {
    if (!data.response || !data.response.docs) {
      return [];
    }

    return data.response.docs.map(doc => ({
      serialNumber: doc.serialNumber?.[0],
      registrationNumber: doc.registrationNumber?.[0],
      markDescription: doc.markDescription?.[0] || 'N/A',
      applicantName: doc.applicantName?.[0],
      applicationDate: doc.applicationDate?.[0],
      registrationDate: doc.registrationDate?.[0],
      status: doc.statusCode?.[0],
      statusDate: doc.statusDate?.[0],
      markType: doc.typeOfMark?.[0],
      goodsAndServices: doc.goodsAndServices?.[0],
      drawingCode: doc.markDrawingCode?.[0],
      similarity: null // Will be calculated when needed
    }));
  }

  // Process detailed trademark information
  processTrademarkDetails(data) {
    const trademark = data.trademark || {};
    const applicant = trademark.applicant?.[0] || {};
    const prosecution = trademark.prosecution?.[0] || {};

    return {
      serialNumber: trademark.serialNumber,
      registrationNumber: trademark.registrationNumber,
      markDescription: trademark.markDescription,
      applicantName: applicant.applicantName,
      applicationDate: trademark.applicationDate,
      registrationDate: trademark.registrationDate,
      status: prosecution.statusCode,
      statusDescription: prosecution.statusDescription,
      statusDate: prosecution.statusDate,
      markType: trademark.typeOfMark,
      goodsAndServices: trademark.goodsAndServices,
      attorney: trademark.attorney?.[0],
      correspondent: trademark.correspondent?.[0],
      events: trademark.prosecutionEvent || []
    };
  }

  // Generate mark variations for similarity searching
  generateMarkVariations(mark) {
    const variations = [mark];
    const cleanMark = mark.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Add common variations
    variations.push(cleanMark);
    variations.push(mark.replace(/\s+/g, ''));
    variations.push(mark.replace(/\s+/g, '-'));
    variations.push(mark.replace(/-/g, ' '));
    
    // Add phonetic variations (simplified)
    const phoneticMap = {
      'c': 'k', 'k': 'c', 'f': 'ph', 'ph': 'f',
      'z': 's', 's': 'z', 'i': 'y', 'y': 'i'
    };
    
    let phoneticVariation = cleanMark;
    for (const [from, to] of Object.entries(phoneticMap)) {
      phoneticVariation = phoneticVariation.replace(new RegExp(from, 'g'), to);
    }
    variations.push(phoneticVariation);

    return [...new Set(variations)]; // Remove duplicates
  }

  // Calculate similarity between two marks
  calculateSimilarity(mark1, mark2) {
    const clean1 = mark1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const clean2 = mark2.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Simple Levenshtein distance ratio
    const distance = this.levenshteinDistance(clean1, clean2);
    const maxLength = Math.max(clean1.length, clean2.length);
    return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
  }

  // Levenshtein distance algorithm
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Remove duplicate entries from array
  removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  // Mock data for development/fallback
  getMockSearchResults(keyword) {
    return [
      {
        serialNumber: '97000001',
        registrationNumber: null,
        markDescription: `${keyword.toUpperCase()} TECH`,
        applicantName: 'Tech Innovations LLC',
        applicationDate: '2024-01-15',
        registrationDate: null,
        status: '1A',
        statusDate: '2024-01-15',
        markType: 'TRADEMARK',
        goodsAndServices: 'Computer software; Technology services',
        drawingCode: '4'
      },
      {
        serialNumber: '97000002',
        registrationNumber: '7123456',
        markDescription: `${keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()}Plus`,
        applicantName: 'Innovation Corp',
        applicationDate: '2023-06-10',
        registrationDate: '2024-02-20',
        status: '6',
        statusDate: '2024-02-20',
        markType: 'TRADEMARK',
        goodsAndServices: 'Business services; Consulting',
        drawingCode: '4'
      }
    ];
  }

  getMockTrademarkDetails(serialNumber) {
    return {
      serialNumber: serialNumber,
      registrationNumber: null,
      markDescription: 'SAMPLE TRADEMARK',
      applicantName: 'Sample Company LLC',
      applicationDate: '2024-01-15',
      registrationDate: null,
      status: '1A',
      statusDescription: 'Use Claimed In Application',
      statusDate: '2024-01-15',
      markType: 'TRADEMARK',
      goodsAndServices: 'Sample goods and services',
      events: []
    };
  }
}

export default new USPTOService();