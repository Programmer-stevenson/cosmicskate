import { useState, useEffect, useMemo } from 'react';
import './App.css';
import SaturnNebula from './components/saturnNebula';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Memoize star positions to prevent recalculation on every render
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
    // Disable body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling 100px
      setScrolled(window.scrollY > 100);

      const sections = ['hero', 'guitars', 'prosthetics', 'innovation', 'contact'];
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

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <img src="/logo.png" alt="Galaxy Guitar Products USA" style={{ width: '300px', marginBottom: '2rem' }} />
          </div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Entering the Galaxy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <SaturnNebula />
      
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="Galaxy" style={{ height: '45px' }} />
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <a href="#hero" className={activeSection === 'hero' ? 'nav-link active' : 'nav-link'}>Home</a>
            <a href="#guitars" className={activeSection === 'guitars' ? 'nav-link active' : 'nav-link'}>Guitars</a>
            <a href="#prosthetics" className={activeSection === 'prosthetics' ? 'nav-link active' : 'nav-link'}>Finger Protectors</a>
            <a href="#innovation" className={activeSection === 'innovation' ? 'nav-link active' : 'nav-link'}>Innovation</a>
            <a href="#contact" className={activeSection === 'contact' ? 'nav-link active' : 'nav-link'}>Contact</a>
          </div>
          
          <button className="chrome-button nav-cta desktop-nav">
            <span className="button-text">Shop Now</span>
            <div className="button-shine"></div>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Menu with Space Theme */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            {/* Space Background with Stars */}
            <div className="space-background">
              {/* Generate multiple sparkling stars */}
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
            
            <div className="mobile-nav-content">
              {/* Logo at top */}
              <div className="mobile-nav-logo">
                <img src="/logo.png" alt="Galaxy Guitar Products USA" />
              </div>
              
              <a href="#hero" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#guitars" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Guitars</a>
              <a href="#prosthetics" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Finger Protectors</a>
              <a href="#innovation" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Innovation</a>
              <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <button className="chrome-button mobile-cta">
                <span className="button-text">Shop Now</span>
                <div className="button-shine"></div>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">Crafting Excellence Since 2004</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">GALAXY</span>
            <span className="title-line gradient-text">Guitar Products USA</span>
          </h1>
          
          <p className="hero-subtitle">
            The global leader in professional guitar finger protectors and custom instruments.
            Trusted by thousands of musicians worldwide.
          </p>
          
          <div className="hero-buttons">
            <a href="#guitars" className="chrome-button primary large">
              <span className="button-text">Shop Guitars</span>
              <div className="button-shine"></div>
            </a>
            <a href="#prosthetics" className="chrome-button secondary large">
              <span className="button-text">Finger Protectors</span>
              <div className="button-shine"></div>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">29+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">1000s</div>
              <div className="stat-label">Musicians Helped</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">USA Made</div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* Guitars Section */}
      <section id="guitars" className="guitars-section">
        <div className="section-header">
          <span className="section-tag">Premium Instruments</span>
          <h2 className="section-title">
            Custom <span className="gradient-text">Guitars</span>
          </h2>
          <p className="section-description">
            Handcrafted instruments built to your exact specifications. Each guitar is a work of art.
          </p>
        </div>

        <div className="guitars-grid">
          {/* TRB-3 Invader */}
          <div className="guitar-card">
            <div className="card-image-wrapper">
              <img src="/trb.jpg" alt="TRB-3 Galaxy Invader" className="card-image" />
              <div className="card-overlay">
                <button className="chrome-button card-button">
                  <span className="button-text">View Details</span>
                  <div className="button-shine"></div>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="card-badge">Limited Edition</div>
              <h3 className="card-title">TRB-3 Galaxy Invader</h3>
              <p className="card-description">
                Revolutionary aerospace-inspired design with custom F-17 Stinger pickups and advanced electronics.
              </p>
              <div className="card-specs">
                <span className="spec-item">7-String</span>
                <span className="spec-divider">•</span>
                <span className="spec-item">Custom Shop</span>
              </div>
            </div>
          </div>

          {/* Trans Starr F-24 */}
          <div className="guitar-card featured">
            <div className="featured-badge">Most Popular</div>
            <div className="card-image-wrapper">
              <img src="/guitar1.jpg" alt="Galaxy Trans Starr F-24" className="card-image" />
              <div className="card-overlay">
                <button className="chrome-button card-button">
                  <span className="button-text">View Details</span>
                  <div className="button-shine"></div>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="card-badge premium">Premium</div>
              <h3 className="card-title">Galaxy Trans Starr F-24</h3>
              <p className="card-description">
                Our flagship model with sublime playability and stunning sunburst finish.
              </p>
              <div className="card-specs">
                <span className="spec-item">F-24 Series</span>
                <span className="spec-divider">•</span>
                <span className="spec-item">Pro Grade</span>
              </div>
            </div>
          </div>

          {/* Custom Build */}
          <div className="guitar-card">
            <div className="card-image-wrapper">
              <img src="/guitar_4.jpg" alt="Custom Galaxy Guitar" className="card-image" />
              <div className="card-overlay">
                <button className="chrome-button card-button">
                  <span className="button-text">View Details</span>
                  <div className="button-shine"></div>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="card-badge">Bespoke</div>
              <h3 className="card-title">Custom Build Series</h3>
              <p className="card-description">
                Design your dream instrument with our master craftsmen. Your vision, our expertise.
              </p>
              <div className="card-specs">
                <span className="spec-item">Your Specs</span>
                <span className="spec-divider">•</span>
                <span className="spec-item">Handcrafted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Guitar Gallery */}
        <div className="guitar-gallery">
          <h3 className="gallery-title">Our Craftsmanship</h3>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/gal1.jpg" alt="Galaxy Guitar Detail" className="gallery-image" />
            </div>
            <div className="gallery-item">
              <img src="/gal2.jpg" alt="Galaxy Guitar Headstock" className="gallery-image" />
            </div>
            <div className="gallery-item">
              <img src="/gal3.jpg" alt="Galaxy TRB-3 Invader" className="gallery-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Prosthetics Section */}
      <section id="prosthetics" className="prosthetics-section">
        <div className="section-header">
          <span className="section-tag">Professional Solutions</span>
          <h2 className="section-title">
            Guitar Finger <span className="gradient-text">Protectors</span>
          </h2>
          <p className="section-description">
            The #1 finger protectors and extensions on planet Earth. Created by Rock Guitarist Randy Young.
          </p>
        </div>

        <div className="prosthetics-hero">
          <div className="prosthetics-content">
            <h3 className="prosthetics-headline">Do You Have A Finger Injury?</h3>
            <p className="prosthetics-subheadline">Your Search Is Over.</p>
            
            <div className="prosthetics-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <h4>Professional Protection</h4>
                  <p>Ultra-Flex cores provide superior pain and pressure barrier</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <h4>Custom Fit</h4>
                  <p>7 diameter sizes available - from 1/2" to 1" interior</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <h4>Built To Last</h4>
                  <p>Won't tear, rip, dry-out or crack. Made in USA to last years</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <h4>Free USA Shipping</h4>
                  <p>Same-day shipping on standard orders. FedEx Express available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {/* FT-1 Standard */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <img src="/pros1.jpg" alt="FT-1 Finger Protector" className="product-image" />
            </div>
            <div className="product-content">
              <div className="product-badge">Best Seller</div>
              <h3 className="product-title">FT-1 Finger Protector</h3>
              <p className="product-description">
                Professional protection for guitarists, bass players, and all musicians. 
                7/8" length with 1/16" thick Ultra-Flex core.
              </p>
              <div className="product-features">
                <span className="feature">✓ Normal: 5/8" diameter</span>
                <span className="feature">✓ Large: 3/4" diameter</span>
                <span className="feature">✓ Custom sizes available</span>
              </div>
              <div className="product-pricing">
                <span className="price-label">Ready to Ship</span>
              </div>
              <button className="chrome-button product-cta">
                <span className="button-text">Buy Now</span>
                <div className="button-shine"></div>
              </button>
            </div>
          </div>

          {/* FT-1 XL */}
          <div className="product-card featured">
            <div className="featured-badge">Extended Length</div>
            <div className="product-image-wrapper">
              <img src="/pros4.jpg" alt="FT-1 XL Finger Extension" className="product-image" />
            </div>
            <div className="product-content">
              <div className="product-badge premium">FT-1 XL</div>
              <h3 className="product-title">FT-1 XL Extension</h3>
              <p className="product-description">
                Longer 1.5" extension for missing finger tips. Custom built for your exact needs.
              </p>
              <div className="product-features">
                <span className="feature">✓ 1.5" extended length</span>
                <span className="feature">✓ All custom diameters</span>
                <span className="feature">✓ Ships in 5-7 days</span>
              </div>
              <div className="product-pricing">
                <span className="price-label">Custom Order</span>
              </div>
              <button className="chrome-button product-cta">
                <span className="button-text">Custom Order</span>
                <div className="button-shine"></div>
              </button>
            </div>
          </div>

          {/* FT-2 */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <img src="/pros3process.jpg" alt="FT-2 Finger Extension" className="product-image" />
            </div>
            <div className="product-content">
              <div className="product-badge">Professional</div>
              <h3 className="product-title">FT-2 Extension</h3>
              <p className="product-description">
                Maximum length extension for severe injuries. Full custom fabrication.
              </p>
              <div className="product-features">
                <span className="feature">✓ Longest extension</span>
                <span className="feature">✓ Custom engineered</span>
                <span className="feature">✓ VIP tech support</span>
              </div>
              <div className="product-pricing">
                <span className="price-label">Custom Order</span>
              </div>
              <button className="chrome-button product-cta">
                <span className="button-text">Custom Order</span>
                <div className="button-shine"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="prosthetics-info">
          <div className="info-card">
            <h4 className="info-title">Who Uses Our Protectors?</h4>
            <ul className="info-list">
              <li>Guitarists & Bass Players</li>
              <li>Violinists, Cellists, Viola Players</li>
              <li>Mandolin, Banjo, Ukulele Players</li>
              <li>Horn Players (Sax, Clarinet)</li>
              <li>Keyboard Players</li>
              <li>Non-Musicians with Finger Injuries</li>
              <li>Gamers (Speed Advantage)</li>
            </ul>
          </div>

          <div className="info-card">
            <h4 className="info-title">Available Sizes</h4>
            <ul className="info-list">
              <li>Small: 1/2", 9/16"</li>
              <li>Normal: 5/8" (Ready to Ship)</li>
              <li>Medium: 11/16"</li>
              <li>Large: 3/4" (Ready to Ship)</li>
              <li>Extra Large: 7/8"</li>
              <li>Largest: 1"</li>
            </ul>
          </div>

          <div className="info-card">
            <h4 className="info-title">Custom Options</h4>
            <ul className="info-list">
              <li>FT-1 Ultra (1.8" length)</li>
              <li>Ultra-Thin Option (Free)</li>
              <li>Stealth Force Graphics</li>
              <li>Custom Colors Available</li>
              <li>Flame & Stripe Designs</li>
              <li>Expert Tech Support Included</li>
            </ul>
          </div>
        </div>

        <div className="section-cta">
          <h3 className="cta-title">Ready to Play Again?</h3>
          <p className="cta-description">
            29 years of experience helping musicians overcome finger challenges. 
            Free ground shipping in USA. International orders ship daily via FedEx.
          </p>
          <button className="chrome-button large">
            <span className="button-text">Contact Us For Expert Guidance</span>
            <div className="button-shine"></div>
          </button>
        </div>
      </section>

      {/* Innovation Section */}
      <section id="innovation" className="innovation-section">
        <div className="innovation-grid">
          <div className="innovation-content">
            <span className="section-tag">Technology Meets Tradition</span>
            <h2 className="section-title">
              Breakthrough <span className="gradient-text">Innovation</span>
            </h2>
            <p className="innovation-text">
              Our patented FT-1 technology represents 29 years of refinement. Unlike cheap 
              silicone or rubber alternatives, our Ultra-Flex cores provide a true professional 
              solution for serious musicians.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">Patented Design</h4>
                  <p className="feature-description">
                    1/16" thick Ultra-Flex core creates optimal pain and pressure barrier.
                  </p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">Precision Crafted</h4>
                  <p className="feature-description">
                    Hand-made in America with materials that won't tear, crack, or dry out.
                  </p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">Expert Support</h4>
                  <p className="feature-description">
                    Relentless technical support before and after your purchase.
                  </p>
                </div>
              </div>
            </div>

            <button className="chrome-button">
              <span className="button-text">Learn More</span>
              <div className="button-shine"></div>
            </button>
          </div>

          <div className="innovation-showcase">
            <div className="showcase-image-container">
              <img src="/galaxy_guitar.jpg" alt="Galaxy FT-1 XL Innovation" className="showcase-image" />
            </div>
            <div className="showcase-stats">
              <div className="stat-box">
                <div className="stat-number">29</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">7</div>
                <div className="stat-label">Size Options</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">100%</div>
                <div className="stat-label">USA Made</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">1000s</div>
                <div className="stat-label">Musicians Helped</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">
            Start Your <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-description">
            Whether you need a custom guitar or finger protector, our expert team is here 
            to guide you through every step of the process.
          </p>
          
          <div className="contact-methods">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4 className="contact-title">Email Us</h4>
              <p className="contact-detail">info@galaxyguitar.com</p>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">🌐</div>
              <h4 className="contact-title">Visit Website</h4>
              <p className="contact-detail">galaxyguitar.com</p>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">📦</div>
              <h4 className="contact-title">Fast Shipping</h4>
              <p className="contact-detail">Free USA Ground Shipping</p>
            </div>
          </div>

          <button className="chrome-button large">
            <span className="button-text">Contact Us</span>
            <div className="button-shine"></div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.png" alt="Galaxy Guitar Products USA" style={{ height: '50px', marginBottom: '1rem' }} />
            <p className="footer-tagline">Crafting Excellence Since 2004</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h5 className="footer-title">Products</h5>
              <a href="#guitars" className="footer-link">Custom Guitars</a>
              <a href="#prosthetics" className="footer-link">Finger Protectors</a>
              <a href="#prosthetics" className="footer-link">FT-1 Extensions</a>
            </div>
            
            <div className="footer-column">
              <h5 className="footer-title">Support</h5>
              <a href="#" className="footer-link">Tech Support</a>
              <a href="#" className="footer-link">Sizing Guide</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
            
            <div className="footer-column">
              <h5 className="footer-title">Company</h5>
              <a href="#innovation" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Testimonials</a>
              <a href="#" className="footer-link">USA Made</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© 2024 Galaxy Guitar Products USA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;