import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContactUs() {
  const [isClient, setIsClient] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: false });
  const router = useRouter();

  // Animation observer effect
  useEffect(() => {
    setIsClient(true);
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => new Set([...prev, entry.target.className]));
          entry.target.classList.add('visible');
          
          // Handle text animations with staggered delays
          const textElements = entry.target.querySelectorAll('.animate-text');
          textElements.forEach((element, index) => {
            setTimeout(() => {
              element.classList.add('visible');
            }, index * 150); // 150ms delay between text elements
          });

          // Handle info items animation
          const infoItems = entry.target.querySelectorAll('.info-item');
          infoItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 200); // 200ms delay between info items
          });

          // Handle form fields animation
          const formFields = entry.target.querySelectorAll('.form-field');
          formFields.forEach((field, index) => {
            setTimeout(() => {
              field.classList.add('visible');
            }, index * 100); // 100ms delay between form fields
          });
        }
      });
    }, observerOptions);

    // Observe all animation elements after a short delay to ensure DOM is ready
    const observeElements = () => {
      const elementsToObserve = document.querySelectorAll('.fade-up, .zoom-out, .slide-left, .slide-right, .scale-in');
      elementsToObserve.forEach((el) => {
        observer.observe(el);
      });
    };

    // Delay observation to ensure DOM is fully rendered
    const timeoutId = setTimeout(observeElements, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Router events effect
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Clean up mobile nav state
      document.body.classList.remove('mobile-nav-active');
      const mobileToggle = document.querySelector('.mobile-nav-toggle');
      if (mobileToggle) {
        mobileToggle.classList.remove('bi-x');
        mobileToggle.classList.add('bi-list');
      }
    };

    const handleRouteChangeComplete = () => {
      // Re-initialize any necessary scripts after route change
      if (window.initializePageScripts) {
        window.initializePageScripts();
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: '', success: false });

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('https://formspree.io/f/mayvpypb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus({ loading: false, error: '', success: true });
        e.target.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setFormStatus({ loading: false, error: 'Failed to send message. Please try again.', success: false });
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | EasyQ – Book OPD Tokens Instantly</title>
        <meta
          name="description"
          content="Get in touch with EasyQ team. Contact us for support, inquiries about hospital token booking, or partnership opportunities."
        />
        <meta
          name="keywords"
          content="EasyQ contact, hospital token booking support, OPD app contact, healthcare app support"
        />
        <meta name="author" content="EasyQ Team" />
        <link rel="canonical" href="https://theeasyq.com/contact" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Contact Us | EasyQ" />
        <meta
          property="og:description"
          content="Get in touch with EasyQ team for support and inquiries."
        />
        <meta
          property="og:image"
          content="https://theeasyq.com/assets/img/logo.png"
        />
        <meta property="og:url" content="https://theeasyq.com/contact" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | EasyQ" />
        <meta
          name="twitter:description"
          content="Get in touch with EasyQ team for support and inquiries."
        />
        <meta
          name="twitter:image"
          content="https://theeasyq.com/assets/img/logo.png"
        />

        {/* Enhanced CSS animations with text delays */}
        <style jsx>{`
          /* Text Animation Classes */
          .animate-text {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .animate-text.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* Basic animation classes */
          .fade-up {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
          }

          .slide-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .slide-left.visible {
            opacity: 1;
            transform: translateX(0);
          }

          .slide-right {
            opacity: 0;
            transform: translateX(50px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .slide-right.visible {
            opacity: 1;
            transform: translateX(0);
          }

          .scale-in {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .scale-in.visible {
            opacity: 1;
            transform: scale(1);
          }

          /* Page Title Animation */
          .page-title h1 {
            opacity: 0;
            transform: translateY(30px);
            animation: titleFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            animation-delay: 0.2s;
          }

          .page-title .breadcrumbs {
            opacity: 0;
            transform: translateY(20px);
            animation: titleFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            animation-delay: 0.4s;
          }

          @keyframes titleFade {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Info item animations */
          .info-item {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .info-item.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          .info-item:hover {
            transform: translateY(-5px) scale(1.02);
            transition: all 0.3s ease;
          }

          /* Form field animations */
          .form-field {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .form-field.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* Form animations */
          .php-email-form {
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .php-email-form.visible {
            opacity: 1;
            transform: translateX(0);
          }

          /* Contact info animations */
          .contact-info {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .contact-info.visible {
            opacity: 1;
            transform: translateX(0);
          }

          /* Button hover effect */
          .php-email-form button[type="submit"] {
            transition: all 0.3s ease;
          }
          .php-email-form button[type="submit"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(65, 84, 241, 0.3);
          }

          /* Success/Error message animations */
          .sent-message, .error-message {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s ease;
          }
          .sent-message.show, .error-message.show {
            opacity: 1;
            transform: translateY(0);
          }

          /* Loading animation */
          .loading {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .loading.show {
            opacity: 1;
          }

          /* Animation delays */
          .animate-delay-100 { transition-delay: 0.1s; }
          .animate-delay-200 { transition-delay: 0.2s; }
          .animate-delay-300 { transition-delay: 0.3s; }
          .animate-delay-400 { transition-delay: 0.4s; }
          .animate-delay-500 { transition-delay: 0.5s; }
        `}</style>
      </Head>

      {/* Header */}
      <header
        id="header"
        className="header d-flex align-items-center fixed-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt="EasyQ Logo" />
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <Link href="/#hero">Home</Link>
              </li>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#features">Features</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </header>

      <main className="main">
        {/* Page Title */}
        <div
          className="page-title dark-background"
          style={{ backgroundImage: 'url(/assets/img/hero-bg.png)' }}
        >
          <div className="container position-relative">
            <h1>Contact Us</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Contact Us</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container fade-up animate-delay-100">
            <div className="row gy-4">
              <div className="col-lg-4 contact-info slide-left">
                <div className="info-item d-flex animate-delay-200">
                  <i className="bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3 className="animate-text">Address</h3>
                    <p className="animate-text">Salem</p>
                  </div>
                </div>

                <div className="info-item d-flex animate-delay-300">
                  <i className="bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3 className="animate-text">Call Us</h3>
                    <p className="animate-text">+91 9876543210</p>
                  </div>
                </div>

                <div className="info-item d-flex animate-delay-400">
                  <i className="bi bi-envelope flex-shrink-0"></i>
                  <div>
                    <h3 className="animate-text">Email Us</h3>
                    <p className="animate-text">info@theeasyq.com</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <form
                  onSubmit={handleSubmit}
                  className="php-email-form slide-right animate-delay-200"
                >
                  <div className="row gy-4">
                    <div className="col-md-6 form-field">
                      <input
                        type="text"
                        name="name"
                        className="form-control animate-text"
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div className="col-md-6 form-field">
                      <input
                        type="email"
                        className="form-control animate-text"
                        name="email"
                        placeholder="Your Email"
                        required
                      />
                    </div>

                    <div className="col-md-12 form-field">
                      <textarea
                        className="form-control animate-text"
                        name="message"
                        rows="6"
                        placeholder="Message"
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12 text-center form-field">
                      <div className={`loading ${formStatus.loading ? 'show' : ''}`}>
                        Loading
                      </div>
                      <div className={`error-message ${formStatus.error ? 'show' : ''}`}>
                        {formStatus.error}
                      </div>
                      <div className={`sent-message ${formStatus.success ? 'show' : ''}`}>
                        Your message has been sent. Thank you!
                      </div>

                      <button type="submit" disabled={formStatus.loading}>
                        {formStatus.loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer dark-background">
        <div className="container text-center">
          <h3 className="sitename">EasyQ</h3>
          <p>
            EasyQ helps you skip hospital queues with smart token booking. Fast,
            reliable, and stress-free healthcare access.
          </p>

          <div className="footer-links d-flex justify-content-center flex-wrap gap-3 mb-3">
            <Link href="/contact" className="text-white">
              Contact
            </Link>
            <Link href="/privacy" className="text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white">
              Terms of Use
            </Link>
          </div>

          <div className="social-links d-flex justify-content-center mb-3">
            <a href="#" aria-label="Twitter">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            {/* <a href="#" aria-label="Skype">
              <i className="bi bi-skype"></i>
            </a> */}
            <a href="#" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>

          <div className="copyright">
            <span>©</span>
            <strong className="px-1 sitename">EasyQ</strong>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>

      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
        aria-label="Scroll to top"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}