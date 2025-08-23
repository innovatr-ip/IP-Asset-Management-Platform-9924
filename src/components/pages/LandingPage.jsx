import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiShield, FiTrendingUp, FiUsers, FiGlobe, FiCheckCircle, 
  FiArrowRight, FiStar, FiPlay, FiChevronUp, FiTarget,
  FiLock, FiClock, FiZap, FiAward, FiBarChart3, FiDatabase
} = FiIcons;

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      id: 'protection',
      icon: FiShield,
      title: 'IP Protection',
      description: 'Comprehensive monitoring and protection of your intellectual property assets across multiple jurisdictions.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      benefits: ['24/7 Monitoring', 'Global Coverage', 'Automated Alerts', 'Legal Integration']
    },
    {
      id: 'analytics',
      icon: FiTrendingUp,
      title: 'Analytics',
      description: 'Advanced reporting and insights to help you make data-driven decisions about your IP portfolio.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      benefits: ['Real-time Reports', 'Custom Dashboards', 'Performance Metrics', 'Trend Analysis']
    },
    {
      id: 'collaboration',
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Seamless workflow management that enables your legal team to work together efficiently.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      benefits: ['Task Management', 'Team Communication', 'Document Sharing', 'Deadline Tracking']
    },
    {
      id: 'monitoring',
      icon: FiGlobe,
      title: 'Global Monitoring',
      description: 'Monitor trademark and patent activity worldwide with our comprehensive surveillance system.',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
      benefits: ['International Coverage', 'Multi-language Support', 'Jurisdiction Alerts', 'Competitor Tracking']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'IP Assets Protected' },
    { number: '500+', label: 'Legal Professionals' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Expert Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'IP Director',
      company: 'TechCorp Legal',
      content: 'Innovatr has revolutionized how we manage our IP portfolio. The automated monitoring saves us countless hours.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b093?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Managing Partner',
      company: 'Chen & Associates',
      content: 'The collaboration features have transformed our team workflow. We can now handle 3x more cases efficiently.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patent Attorney',
      company: 'Innovation Law Group',
      content: 'The global monitoring capabilities are unmatched. We catch potential conflicts before they become problems.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const benefits = [
    {
      icon: FiZap,
      title: 'Automated Workflows',
      description: 'Streamline repetitive tasks with intelligent automation that saves time and reduces errors.'
    },
    {
      icon: FiLock,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance, encryption, and multi-factor authentication.'
    },
    {
      icon: FiClock,
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications about changes to your IP assets and deadlines.'
    },
    {
      icon: FiAward,
      title: 'Expert Support',
      description: '24/7 support from IP professionals who understand your business and legal requirements.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'Perfect for small law firms and solo practitioners',
      features: [
        'Up to 500 IP assets',
        'Basic monitoring alerts',
        'Email support',
        'Standard reporting',
        '5 team members',
        'Document storage (10GB)'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 299,
      period: 'month',
      description: 'Comprehensive solution for large organizations',
      features: [
        'Unlimited IP assets',
        'Advanced monitoring & alerts',
        'Priority phone support',
        'Custom reporting & analytics',
        '50 team members',
        'Document storage (100GB)',
        'API access',
        'Single sign-on (SSO)'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise Plus',
      price: 599,
      period: 'month',
      description: 'Enterprise solution with dedicated support',
      features: [
        'Everything in Enterprise',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features',
        'Unlimited team members',
        'Document storage (1TB)',
        'White-label options',
        'SLA guarantee'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <SafeIcon icon={FiAward} className="h-4 w-4 mr-2" />
                Trusted by 500+ Legal Professionals
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Protect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600"> Intellectual Property</span>
                <br />with Confidence
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The comprehensive IP management platform that helps legal professionals monitor, protect, and optimize their intellectual property portfolios with advanced analytics and automation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/customer-login')}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Start Free Trial</span>
                  <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiPlay} className="h-5 w-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                  alt="IP Management Dashboard"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiShield} className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Protected</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 z-20">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive IP Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to protect, monitor, and optimize your intellectual property portfolio in one powerful platform.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Tabs */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-white shadow-lg border-l-4 border-primary-600'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === index ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <SafeIcon icon={feature.icon} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        activeFeature === index ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                      {activeFeature === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 grid grid-cols-2 gap-2"
                        >
                          {feature.benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center space-x-2">
                              <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feature Image */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <img
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-xl font-semibold mb-2">{features[activeFeature].title}</h4>
                <p className="text-white/90">{features[activeFeature].description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Innovatr?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by IP professionals, for IP professionals. Experience the difference that specialized expertise makes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <SafeIcon icon={benefit.icon} className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Legal Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with Innovatr.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-primary-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features with no hidden fees.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/customer-login')}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">Get the latest IP industry insights and product updates delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
          >
            <SafeIcon icon={FiChevronUp} className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;