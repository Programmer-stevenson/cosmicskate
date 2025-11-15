import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './App.css';
import SaturnNebula from './components/saturnNebula';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  // Memoize star positions
  const stars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 2 + Math.random() * 2
    })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ['hero', 'boards', 'gear', 'innovation', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="loading-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="loading-logo"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="loading-emoji">🛹</span>
          </motion.div>
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="loading-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading the Skatepark...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="app">
      {/* Saturn Nebula - Fixed Background for Entire Page */}
      <SaturnNebula />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Navigation */}
      <motion.nav 
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-icon">🛹</span>
            <div>
              <div className="logo-galaxy">COSMIC SKATE</div>
              <div className="logo-subtitle">Ride the Galaxy</div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {['Home', 'Boards', 'Gear', 'Innovation', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={activeSection === item.toLowerCase() || (item === 'Home' && activeSection === 'hero') ? 'nav-link active' : 'nav-link'}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          <motion.button 
            className="chrome-button nav-cta desktop-nav"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-text">Shop Now</span>
            <div className="button-shine"></div>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="mobile-nav-menu"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <SaturnNebula />
              <div className="space-background">
                {stars.map((star) => (
                  <div
                    key={star.id}
                    className="star"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      animationDelay: `${star.animationDelay}s`,
                      animationDuration: `${star.animationDuration}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <motion.div 
                className="mobile-nav-content"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="mobile-nav-logo"
                  variants={fadeInUp}
                >
                  <span style={{ fontSize: '4rem' }}>🛹</span>
                  <h2 className="gradient-text">COSMIC SKATE</h2>
                </motion.div>
                
                {['Home', 'Boards', 'Gear', 'Innovation', 'Contact'].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()}`}
                    className="mobile-nav-link"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            className="hero-badge"
            variants={scaleIn}
          >
            <span className="badge-text">🚀 Skateboarding Since 1995</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            variants={fadeInUp}
          >
            <span className="title-line">COSMIC</span>
            <span className="title-line gradient-text">SKATE SHOP</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={fadeInUp}
          >
            Premium skateboards, decks, and gear for riders who push boundaries.
            Ride with the cosmos, skate beyond limits.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            variants={fadeInUp}
          >
            <motion.a 
              href="#boards" 
              className="chrome-button primary large"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0, 212, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-text">Shop Boards</span>
              <div className="button-shine"></div>
            </motion.a>
            <motion.a 
              href="#gear" 
              className="chrome-button secondary large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-text">View Gear</span>
              <div className="button-shine"></div>
            </motion.a>
          </motion.div>

          <motion.div 
            className="hero-stats"
            variants={staggerContainer}
          >
            {[
              { number: '30+', label: 'Years Experience' },
              { number: '5000+', label: 'Happy Skaters' },
              { number: '100%', label: 'Street Tested' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                {index < 2 && <div className="stat-divider"></div>}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="floating-board"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span style={{ fontSize: '8rem', filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.6))' }}>🛹</span>
        </motion.div>
      </section>

      {/* Boards Section */}
      <motion.section 
        id="boards" 
        className="guitars-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <span className="section-tag">Premium Collection</span>
          <h2 className="section-title">
            Epic <span className="gradient-text">Skateboards</span>
          </h2>
          <p className="section-description">
            Hand-crafted decks designed for street, park, and vert skating.
            Built for performance, styled for the cosmos.
          </p>
        </motion.div>

        <motion.div 
          className="guitars-grid"
          variants={staggerContainer}
        >
          {[
            {
              name: 'Nebula Pro Deck',
              description: 'Professional 8.25" deck with cosmic graphics. Perfect pop and control.',
              price: '$89.99',
              specs: ['8.25" Width', '31.5" Length', '7-Ply Maple', 'Medium Concave'],
              emoji: '🌌'
            },
            {
              name: 'Street Crusher',
              description: 'Built for technical street skating. Durable and responsive.',
              price: '$79.99',
              specs: ['8.0" Width', '31" Length', 'Heavy Duty', 'Street Shape'],
              emoji: '⚡'
            },
            {
              name: 'Vert Master',
              description: 'Wide deck for vert and bowl riding. Maximum stability.',
              price: '$94.99',
              specs: ['8.5" Width', '32" Length', 'Pool/Vert', 'Deep Concave'],
              emoji: '🌊'
            }
          ].map((board, index) => (
            <motion.div
              key={index}
              className="guitar-card"
              variants={scaleIn}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="guitar-image-placeholder"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span style={{ fontSize: '6rem' }}>{board.emoji}</span>
              </motion.div>
              
              <div className="guitar-info">
                <h3 className="guitar-name">{board.name}</h3>
                <p className="guitar-description">{board.description}</p>
                
                <div className="guitar-specs">
                  {board.specs.map((spec, i) => (
                    <motion.span 
                      key={i} 
                      className="spec-badge"
                      whileHover={{ scale: 1.1 }}
                    >
                      {spec}
                    </motion.span>
                  ))}
                </div>
                
                <div className="guitar-footer">
                  <span className="guitar-price">{board.price}</span>
                  <motion.button 
                    className="chrome-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="button-text">Add to Cart</span>
                    <div className="button-shine"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Gear Section */}
      <motion.section 
        id="gear" 
        className="prosthetics-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div className="prosthetics-hero" variants={fadeInUp}>
          <motion.div 
            className="prosthetics-icon"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span style={{ fontSize: '5rem' }}>⚙️</span>
          </motion.div>
          <h2 className="prosthetics-headline">
            Essential <span className="gradient-text">Skate Gear</span>
          </h2>
          <p className="prosthetics-description">
            Premium trucks, wheels, bearings, and protective gear.
            Everything you need to ride like a pro.
          </p>
        </motion.div>

        <motion.div 
          className="products-grid"
          variants={staggerContainer}
        >
          {[
            {
              name: 'Pro Trucks',
              description: 'Lightweight aluminum trucks with smooth turning.',
              features: ['139mm-149mm', 'Hollow Kingpin', 'High/Low Options'],
              price: '$54.99',
              emoji: '🔩'
            },
            {
              name: 'Street Wheels',
              description: 'Durable urethane wheels for street and park.',
              features: ['52-54mm', '99A-101A', 'Various Colors'],
              price: '$34.99',
              emoji: '⭕'
            },
            {
              name: 'Speed Bearings',
              description: 'ABEC-9 precision bearings for maximum speed.',
              features: ['ABEC-9', 'Steel Shields', '8-Pack'],
              price: '$29.99',
              emoji: '💨'
            },
            {
              name: 'Safety Gear',
              description: 'Complete protection set for safe riding.',
              features: ['Helmet', 'Knee Pads', 'Elbow Pads'],
              price: '$79.99',
              emoji: '🛡️'
            }
          ].map((gear, index) => (
            <motion.div
              key={index}
              className="product-card"
              variants={scaleIn}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 60px rgba(123, 104, 238, 0.4)"
              }}
            >
              <motion.div 
                className="product-icon"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <span style={{ fontSize: '4rem' }}>{gear.emoji}</span>
              </motion.div>
              <h3 className="product-name">{gear.name}</h3>
              <p className="product-description">{gear.description}</p>
              <ul className="product-features">
                {gear.features.map((feature, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5, color: '#00d4ff' }}
                  >
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="product-footer">
                <span className="product-price">{gear.price}</span>
                <motion.button 
                  className="chrome-button product-cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="button-text">Buy Now</span>
                  <div className="button-shine"></div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Innovation Section */}
      <motion.section 
        id="innovation" 
        className="innovation-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="innovation-grid">
          <motion.div 
            className="innovation-content"
            variants={fadeInUp}
          >
            <span className="section-tag">Performance Meets Style</span>
            <h2 className="section-title">
              Next-Gen <span className="gradient-text">Innovation</span>
            </h2>
            <p className="innovation-text">
              We use cutting-edge materials and construction techniques to create
              boards that perform at the highest level. Every deck is tested by
              professional riders before it reaches your hands.
            </p>
            
            <motion.div 
              className="features-list"
              variants={staggerContainer}
            >
              {[
                {
                  title: '7-Ply Maple',
                  description: 'Premium Canadian maple for ultimate strength and pop.'
                },
                {
                  title: 'Heat Transfer Graphics',
                  description: 'Vibrant designs that won\'t fade or peel off.'
                },
                {
                  title: 'Pro Tested',
                  description: 'Every board tested by sponsored team riders.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  variants={scaleIn}
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className="feature-icon"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="icon-circle"></div>
                  </motion.div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button 
              className="chrome-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-text">Learn More</span>
              <div className="button-shine"></div>
            </motion.button>
          </motion.div>

          <motion.div 
            className="innovation-showcase"
            variants={fadeInUp}
          >
            <motion.div 
              className="showcase-image-container"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                style={{ 
                  fontSize: '15rem', 
                  display: 'block',
                  filter: 'drop-shadow(0 0 50px rgba(0, 212, 255, 0.6))'
                }}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                🛹
              </motion.span>
            </motion.div>
            <motion.div 
              className="showcase-stats"
              variants={staggerContainer}
            >
              {[
                { number: '30', label: 'Years Experience' },
                { number: '100+', label: 'Board Designs' },
                { number: '100%', label: 'Quality Wood' },
                { number: '5000+', label: 'Happy Riders' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-box"
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 15px 40px rgba(123, 104, 238, 0.5)"
                  }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        className="contact-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="contact-content">
          <motion.span 
            className="section-tag"
            variants={fadeInUp}
          >
            Get In Touch
          </motion.span>
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            Start Your <span className="gradient-text">Journey</span>
          </motion.h2>
          <motion.p 
            className="section-description"
            variants={fadeInUp}
          >
            Whether you're a beginner or pro, we're here to help you find
            the perfect setup and elevate your skating game.
          </motion.p>
          
          <motion.div 
            className="contact-methods"
            variants={staggerContainer}
          >
            {[
              { icon: '📧', title: 'Email Us', detail: 'shop@cosmicskate.com' },
              { icon: '🌐', title: 'Visit Website', detail: 'cosmicskate.com' },
              { icon: '📦', title: 'Fast Shipping', detail: 'Free Shipping Over $50' }
            ].map((method, index) => (
              <motion.div
                key={index}
                className="contact-card"
                variants={scaleIn}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(123, 104, 238, 0.5)"
                }}
              >
                <motion.div 
                  className="contact-icon"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {method.icon}
                </motion.div>
                <h4 className="contact-title">{method.title}</h4>
                <p className="contact-detail">{method.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button 
            className="chrome-button large"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-text">Contact Us</span>
            <div className="button-shine"></div>
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="footer-content">
          <div className="footer-logo">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{ fontSize: '3rem' }}>🛹</span>
            </motion.div>
            <div className="footer-brand">COSMIC SKATE</div>
            <p className="footer-tagline">Skateboarding Since 1995</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h5 className="footer-title">Products</h5>
              <a href="#boards" className="footer-link">Skateboards</a>
              <a href="#gear" className="footer-link">Gear & Parts</a>
              <a href="#gear" className="footer-link">Accessories</a>
            </div>
            
            <div className="footer-column">
              <h5 className="footer-title">Support</h5>
              <a href="#" className="footer-link">Size Guide</a>
              <a href="#" className="footer-link">Setup Tips</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
            
            <div className="footer-column">
              <h5 className="footer-title">Company</h5>
              <a href="#innovation" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Team Riders</a>
              <a href="#" className="footer-link">Sustainability</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© 2024 Cosmic Skate Shop. All rights reserved. Template by Plexura</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;