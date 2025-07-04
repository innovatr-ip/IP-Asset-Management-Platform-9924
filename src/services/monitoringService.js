import usptoAPI from './usptoAPI.js';

class MonitoringService {
  constructor() {
    this.isRunning = false;
    this.checkInterval = null;
  }

  // Start monitoring for a specific item
  async startMonitoring(monitoringItem) {
    console.log(`Starting monitoring for: ${monitoringItem.name}`);

    try {
      switch (monitoringItem.type) {
        case 'trademark':
          return await this.monitorTrademarks(monitoringItem);
        case 'domain':
          return await this.monitorDomains(monitoringItem);
        case 'marketplace':
          return await this.monitorMarketplaces(monitoringItem);
        case 'social':
          return await this.monitorSocialMedia(monitoringItem);
        default:
          throw new Error(`Unsupported monitoring type: ${monitoringItem.type}`);
      }
    } catch (error) {
      console.error('Monitoring error:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  // Monitor USPTO trademarks
  async monitorTrademarks(monitoringItem) {
    const results = [];
    const alerts = [];

    for (const keyword of monitoringItem.keywords) {
      try {
        // Search for new applications
        const newApplications = await usptoAPI.monitorNewApplications(
          [keyword], 
          monitoringItem.lastChecked || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        );

        // Search for similar marks
        const similarMarks = await usptoAPI.findSimilarTrademarks(keyword, {
          includeVariations: monitoringItem.includeVariations
        });

        // Process results
        for (const app of newApplications) {
          const alert = {
            id: `trademark-${app.serialNumber}-${Date.now()}`,
            type: 'new_application',
            keyword: keyword,
            title: `New Trademark Application: ${app.markDescription}`,
            description: `New application filed by ${app.applicantName}`,
            data: app,
            severity: this.calculateTradmarkSeverity(keyword, app),
            detectedAt: new Date().toISOString(),
            actionRequired: this.suggestTrademarkAction(keyword, app)
          };
          alerts.push(alert);
          results.push(app);
        }

        for (const mark of similarMarks) {
          const similarity = usptoAPI.calculateSimilarity(keyword, mark.markDescription);
          if (similarity > 0.7) { // High similarity threshold
            const alert = {
              id: `trademark-similar-${mark.serialNumber}-${Date.now()}`,
              type: 'similar_mark',
              keyword: keyword,
              title: `Similar Trademark Found: ${mark.markDescription}`,
              description: `${Math.round(similarity * 100)}% similar to your brand`,
              data: { ...mark, similarity },
              severity: similarity > 0.9 ? 'high' : 'medium',
              detectedAt: new Date().toISOString(),
              actionRequired: this.suggestSimilarityAction(similarity, mark)
            };
            alerts.push(alert);
            results.push({ ...mark, similarity });
          }
        }
      } catch (error) {
        console.error(`Error monitoring trademark keyword "${keyword}":`, error);
      }
    }

    return {
      success: true,
      type: 'trademark',
      results: results,
      alerts: alerts,
      checkedAt: new Date().toISOString(),
      nextCheck: this.calculateNextCheck(monitoringItem.frequency)
    };
  }

  // Monitor domain names (mock implementation - ready for real API)
  async monitorDomains(monitoringItem) {
    const results = [];
    const alerts = [];

    // This would integrate with domain monitoring APIs like:
    // - WhoisAPI for new registrations
    // - DomainTools for comprehensive monitoring
    // - SecurityTrails for DNS changes

    for (const keyword of monitoringItem.keywords) {
      // Mock domain monitoring results
      const mockDomains = this.generateMockDomains(keyword, monitoringItem.extensions);
      
      for (const domain of mockDomains) {
        if (this.isDomainSuspicious(keyword, domain.name)) {
          const alert = {
            id: `domain-${domain.name}-${Date.now()}`,
            type: 'domain_registration',
            keyword: keyword,
            title: `Suspicious Domain Registered: ${domain.name}`,
            description: `Domain registered on ${domain.registrationDate}`,
            data: domain,
            severity: this.calculateDomainSeverity(keyword, domain.name),
            detectedAt: new Date().toISOString(),
            actionRequired: 'Review domain and consider action if trademark infringement'
          };
          alerts.push(alert);
          results.push(domain);
        }
      }
    }

    return {
      success: true,
      type: 'domain',
      results: results,
      alerts: alerts,
      checkedAt: new Date().toISOString(),
      nextCheck: this.calculateNextCheck(monitoringItem.frequency)
    };
  }

  // Monitor marketplaces (mock implementation - ready for real APIs)
  async monitorMarketplaces(monitoringItem) {
    const results = [];
    const alerts = [];

    // This would integrate with:
    // - Amazon Product Advertising API
    // - eBay Finding API
    // - Etsy Open API
    // - Custom scrapers for other platforms

    for (const keyword of monitoringItem.keywords) {
      for (const platform of monitoringItem.platforms) {
        const mockListings = this.generateMockListings(keyword, platform);
        
        for (const listing of mockListings) {
          if (this.isListingSuspicious(keyword, listing)) {
            const alert = {
              id: `marketplace-${platform}-${listing.id}-${Date.now()}`,
              type: 'suspicious_listing',
              keyword: keyword,
              platform: platform,
              title: `Suspicious Listing on ${platform}: ${listing.title}`,
              description: `Potential trademark infringement detected`,
              data: listing,
              severity: 'medium',
              detectedAt: new Date().toISOString(),
              actionRequired: `Review listing and consider takedown request`
            };
            alerts.push(alert);
            results.push(listing);
          }
        }
      }
    }

    return {
      success: true,
      type: 'marketplace',
      results: results,
      alerts: alerts,
      checkedAt: new Date().toISOString(),
      nextCheck: this.calculateNextCheck(monitoringItem.frequency)
    };
  }

  // Monitor social media (mock implementation)
  async monitorSocialMedia(monitoringItem) {
    const results = [];
    const alerts = [];

    // This would integrate with:
    // - Instagram Basic Display API
    // - Twitter API v2
    // - Facebook Graph API
    // - TikTok API
    // - Custom monitoring tools

    for (const keyword of monitoringItem.keywords) {
      for (const platform of monitoringItem.socialPlatforms) {
        const mockPosts = this.generateMockSocialPosts(keyword, platform);
        
        for (const post of mockPosts) {
          if (this.isSocialPostSuspicious(keyword, post)) {
            const alert = {
              id: `social-${platform}-${post.id}-${Date.now()}`,
              type: 'brand_mention',
              keyword: keyword,
              platform: platform,
              title: `Brand Mention on ${platform}`,
              description: `Your brand was mentioned in a ${post.type}`,
              data: post,
              severity: post.sentiment === 'negative' ? 'high' : 'low',
              detectedAt: new Date().toISOString(),
              actionRequired: post.sentiment === 'negative' ? 'Consider response to negative mention' : 'Monitor for engagement'
            };
            alerts.push(alert);
            results.push(post);
          }
        }
      }
    }

    return {
      success: true,
      type: 'social',
      results: results,
      alerts: alerts,
      checkedAt: new Date().toISOString(),
      nextCheck: this.calculateNextCheck(monitoringItem.frequency)
    };
  }

  // Calculate trademark alert severity
  calculateTradmarkSeverity(keyword, trademark) {
    const similarity = usptoAPI.calculateSimilarity(keyword, trademark.markDescription);
    
    if (similarity > 0.9) return 'high';
    if (similarity > 0.7) return 'medium';
    return 'low';
  }

  // Suggest trademark action
  suggestTrademarkAction(keyword, trademark) {
    const similarity = usptoAPI.calculateSimilarity(keyword, trademark.markDescription);
    
    if (similarity > 0.9) {
      return 'Consider filing opposition - high similarity detected';
    } else if (similarity > 0.7) {
      return 'Review application details and assess conflict potential';
    }
    return 'Monitor for status changes';
  }

  // Suggest similarity action
  suggestSimilarityAction(similarity, mark) {
    if (similarity > 0.9) {
      return 'High similarity - consider legal review';
    } else if (similarity > 0.8) {
      return 'Moderate similarity - monitor closely';
    }
    return 'Low risk - periodic monitoring sufficient';
  }

  // Calculate domain severity
  calculateDomainSeverity(keyword, domainName) {
    if (domainName.includes(keyword.toLowerCase())) return 'high';
    if (this.isTyposquatting(keyword, domainName)) return 'medium';
    return 'low';
  }

  // Check if domain is typosquatting
  isTyposquatting(keyword, domainName) {
    const cleanDomain = domainName.replace(/\.[a-z]+$/, ''); // Remove TLD
    const similarity = usptoAPI.calculateSimilarity(keyword.toLowerCase(), cleanDomain);
    return similarity > 0.7 && similarity < 0.95; // Similar but not exact
  }

  // Determine if domain is suspicious
  isDomainSuspicious(keyword, domainName) {
    return domainName.toLowerCase().includes(keyword.toLowerCase()) ||
           this.isTyposquatting(keyword, domainName);
  }

  // Determine if listing is suspicious
  isListingSuspicious(keyword, listing) {
    const title = listing.title.toLowerCase();
    const description = listing.description.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    return title.includes(keywordLower) || description.includes(keywordLower);
  }

  // Determine if social post is suspicious/relevant
  isSocialPostSuspicious(keyword, post) {
    const content = post.content.toLowerCase();
    return content.includes(keyword.toLowerCase());
  }

  // Calculate next check time
  calculateNextCheck(frequency) {
    const now = new Date();
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // Mock data generators for development
  generateMockDomains(keyword, extensions) {
    const variations = [
      `${keyword}shop`,
      `${keyword}-store`,
      `${keyword}plus`,
      `buy${keyword}`,
      `${keyword}online`
    ];

    return variations.flatMap(variation =>
      extensions.slice(0, 2).map(ext => ({
        name: `${variation}${ext}`,
        registrationDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrant: 'Private Registration',
        status: 'active'
      }))
    );
  }

  generateMockListings(keyword, platform) {
    return [
      {
        id: `${platform}-${Date.now()}-1`,
        title: `${keyword} Compatible Accessories`,
        description: `High quality accessories for ${keyword} products`,
        price: '$29.99',
        seller: 'TechAccessories123',
        platform: platform,
        url: `https://${platform}.com/listing/123`,
        detectedAt: new Date().toISOString()
      },
      {
        id: `${platform}-${Date.now()}-2`,
        title: `Genuine ${keyword} Replacement Parts`,
        description: `Original ${keyword} parts and components`,
        price: '$49.99',
        seller: 'PartsSupplier',
        platform: platform,
        url: `https://${platform}.com/listing/456`,
        detectedAt: new Date().toISOString()
      }
    ];
  }

  generateMockSocialPosts(keyword, platform) {
    return [
      {
        id: `${platform}-${Date.now()}-1`,
        content: `Just got my new ${keyword} product and loving it! #${keyword} #tech`,
        author: '@happycustomer',
        platform: platform,
        type: 'post',
        sentiment: 'positive',
        engagement: { likes: 45, shares: 12, comments: 8 },
        url: `https://${platform}.com/post/123`,
        detectedAt: new Date().toISOString()
      },
      {
        id: `${platform}-${Date.now()}-2`,
        content: `Has anyone had issues with ${keyword}? Mine stopped working after a week...`,
        author: '@techreviewer',
        platform: platform,
        type: 'post',
        sentiment: 'negative',
        engagement: { likes: 23, shares: 5, comments: 15 },
        url: `https://${platform}.com/post/456`,
        detectedAt: new Date().toISOString()
      }
    ];
  }
}

export default new MonitoringService();