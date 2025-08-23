import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiGithub, FiArrowRight } = FiIcons;

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (href, id) => {
    if (href.startsWith('/#')) {
      if (window.location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(href);
    }
  };

  const productLinks = [
    { name: 'Features', href: '/#features', id: 'features' },
    { name: 'Benefits', href: '/#benefits', id: 'benefits' },
    { name: 'Pricing', href: '/#pricing', id: 'pricing' },
    { name: 'Reviews', href: '/#reviews', id: 'reviews' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'System Status', href: '#' },
    { name: 'Contact Support', href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Blog', href: '#' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR Compliance', href: '#' },
    { name: 'Security', href: '#' },
  ];

  const socialLinks = [
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751635789797-innovatr.png" 
                  alt="Innovatr" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold">Innovatr</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The comprehensive intellectual property management platform trusted by legal professionals worldwide. 
                Protect, monitor, and optimize your IP portfolio with confidence.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-primary-400" />
                  <a href="mailto:contact@innovatr.com" className="text-gray-300 hover:text-white transition-colors">
                    contact@innovatr.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPhone} className="h-5 w-5 text-primary-400" />
                  <a href="tel:+1-555-123-4567" className="text-gray-300 hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiMapPin} className="h-5 w-5 text-primary-400 mt-0.5" />
                  <span className="text-gray-300">
                    123 Innovation Street<br />
                    Tech District, CA 94105
                  </span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavClick(link.href, link.id)}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay in the loop</h3>
              <p className="text-gray-300">Get the latest IP industry insights and product updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 w-full sm:w-80"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap">
                <span>Subscribe</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Innovatr. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <SafeIcon icon={social.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center space-x-8 space-y-4">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiIcons.FiShield} className="h-4 w-4" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiIcons.FiLock} className="h-4 w-4" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiIcons.FiCheck} className="h-4 w-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiIcons.FiClock} className="h-4 w-4" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;