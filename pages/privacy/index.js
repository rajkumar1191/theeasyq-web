import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PrivacyPolicy() {
  const [isClient, setIsClient] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const router = useRouter();

  // Animation observer effect
  useEffect(() => {
    setIsClient(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimatedElements(
            (prev) => new Set([...prev, entry.target.className])
          );
          entry.target.classList.add("visible");

          // Handle text animations with staggered delays
          const textElements = entry.target.querySelectorAll(".animate-text");
          textElements.forEach((element, index) => {
            setTimeout(() => {
              element.classList.add("visible");
            }, index * 150); // 150ms delay between text elements
          });

          // Handle list item animations
          const listItems = entry.target.querySelectorAll("ul li");
          listItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("visible");
            }, index * 100); // 100ms delay between list items
          });
        }
      });
    }, observerOptions);

    // Observe all animation elements after a short delay to ensure DOM is ready
    const observeElements = () => {
      const elementsToObserve = document.querySelectorAll(
        ".fade-up, .zoom-out, .slide-left, .slide-right, .scale-in"
      );
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
      document.body.classList.remove("mobile-nav-active");
      const mobileToggle = document.querySelector(".mobile-nav-toggle");
      if (mobileToggle) {
        mobileToggle.classList.remove("bi-x");
        mobileToggle.classList.add("bi-list");
      }
    };

    const handleRouteChangeComplete = () => {
      // Re-initialize any necessary scripts after route change
      if (window.initializePageScripts) {
        window.initializePageScripts();
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Privacy Policy | EasyQ – Book OPD Tokens Instantly</title>
        <meta
          name="description"
          content="Learn about EasyQ's privacy policy, data collection, usage, and protection practices for our hospital OPD token booking service."
        />
        <meta
          name="keywords"
          content="EasyQ privacy, privacy policy, data protection, hospital token booking privacy, OPD app privacy"
        />
        <meta name="author" content="EasyQ Team" />
        <link rel="canonical" href="https://theeasyq.com/privacy" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Privacy Policy | EasyQ" />
        <meta
          property="og:description"
          content="Privacy Policy for EasyQ hospital token booking service."
        />
        <meta
          property="og:image"
          content="https://theeasyq.com/assets/img/logo.png"
        />
        <meta property="og:url" content="https://theeasyq.com/privacy" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | EasyQ" />
        <meta
          name="twitter:description"
          content="Privacy Policy for EasyQ hospital token booking service."
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
            animation: titleFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
              forwards;
            animation-delay: 0.2s;
          }

          .page-title .breadcrumbs {
            opacity: 0;
            transform: translateY(20px);
            animation: titleFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
              forwards;
            animation-delay: 0.4s;
          }

          @keyframes titleFade {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Content animations with staggered delays */
          .content-section h4:nth-of-type(1) .animate-text {
            transition-delay: 0.1s;
          }
          .content-section h4:nth-of-type(2) .animate-text {
            transition-delay: 0.2s;
          }
          .content-section h4:nth-of-type(3) .animate-text {
            transition-delay: 0.3s;
          }
          .content-section h4:nth-of-type(4) .animate-text {
            transition-delay: 0.4s;
          }
          .content-section h4:nth-of-type(5) .animate-text {
            transition-delay: 0.5s;
          }
          .content-section h4:nth-of-type(6) .animate-text {
            transition-delay: 0.6s;
          }
          .content-section h4:nth-of-type(7) .animate-text {
            transition-delay: 0.7s;
          }
          .content-section h4:nth-of-type(8) .animate-text {
            transition-delay: 0.8s;
          }
          .content-section h4:nth-of-type(9) .animate-text {
            transition-delay: 0.9s;
          }
          .content-section h4:nth-of-type(10) .animate-text {
            transition-delay: 1s;
          }

          /* List item animations */
          .content-section ul li {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .content-section.visible ul li {
            opacity: 1;
            transform: translateX(0);
          }

          .content-section ul li:nth-child(1) {
            transition-delay: 0.1s;
          }
          .content-section ul li:nth-child(2) {
            transition-delay: 0.2s;
          }
          .content-section ul li:nth-child(3) {
            transition-delay: 0.3s;
          }
          .content-section ul li:nth-child(4) {
            transition-delay: 0.4s;
          }
          .content-section ul li:nth-child(5) {
            transition-delay: 0.5s;
          }

          /* Hover effects */
          .content-section h4:hover {
            transform: translateX(10px);
            color: #4154f1;
            transition: all 0.3s ease;
          }

          .content-section p:hover {
            transform: scale(1.02);
            transition: all 0.3s ease;
          }

          .content-section ul li:hover {
            transform: translateX(5px);
            color: #4154f1;
            transition: all 0.3s ease;
          }

          /* Strong text highlight animation */
          .content-section strong {
            position: relative;
            transition: all 0.3s ease;
          }

          .content-section strong:hover {
            color: #4154f1;
            transform: scale(1.05);
          }

          /* Animation delays */
          .animate-delay-100 {
            transition-delay: 0.1s;
          }
          .animate-delay-200 {
            transition-delay: 0.2s;
          }
          .animate-delay-300 {
            transition-delay: 0.3s;
          }
          .animate-delay-400 {
            transition-delay: 0.4s;
          }
          .animate-delay-500 {
            transition-delay: 0.5s;
          }
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
          style={{ backgroundImage: "url(/assets/img/hero-bg.png)" }}
        >
          <div className="container position-relative">
            <h1>Privacy Policy</h1>
            <nav className="breadcrumbs">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className="current">Privacy Policy</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <section id="starter-section" className="starter-section section">
          <div className="container content-section fade-up" data-aos="fade-up">
            <p className="animate-text">
              Welcome to <strong>EasyQ</strong>. We value your privacy and are
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store, and protect your data
              when you use our website, mobile app, and related services.
            </p>

            <h4>
              <span className="animate-text">1. Information We Collect</span>
            </h4>
            <p className="animate-text">
              We may collect the following types of personal and usage
              information:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, phone number,
                email, age, gender, location, appointment details.
              </li>
              <li>
                <strong>Technical/Usage Info:</strong> Device type, IP, browser
                info, app behavior, location data (with permission).
              </li>
            </ul>

            <h4>
              <span className="animate-text">
                2. How We Use Your Information
              </span>
            </h4>
            <ul>
              <li>Book and manage hospital tokens</li>
              <li>Send real-time queue updates and travel alerts</li>
              <li>Improve user experience and troubleshoot issues</li>
              <li>Respond to support requests</li>
              <li>Send important updates or promotions (with consent)</li>
            </ul>

            <h4>
              <span className="animate-text">3. Location Permissions</span>
            </h4>
            <p className="animate-text">
              Location is used to calculate travel time and send timely alerts.
              You can revoke location access in your device settings at any
              time.
            </p>

            <h4>
              <span className="animate-text">4. Sharing and Disclosure</span>
            </h4>
            <p className="animate-text">
              We do <strong>not</strong> sell or rent your data. We may share
              limited data with partner hospitals or service providers under
              strict agreements, or if required by law.
            </p>

            <h4>
              <span className="animate-text">5. Data Security</span>
            </h4>
            <p className="animate-text">
              Your data is stored securely using encryption and access control
              measures.
            </p>

            <h4>
              <span className="animate-text">6. Cookies and Tracking</span>
            </h4>
            <p className="animate-text">
              We may use cookies or analytics tools (e.g., Firebase, Google
              Analytics) to improve services. You can disable cookies in your
              browser settings.
            </p>

            <h4>
              <span className="animate-text">7. Your Rights</span>
            </h4>
            <p className="animate-text">
              You can access, correct, delete your data, or withdraw consent by
              contacting us at{" "}
              <a href="mailto:support@theeasyq.com">support@theeasyq.com</a>.
            </p>

            <h4>
              <span className="animate-text">8. Children's Privacy</span>
            </h4>
            <p className="animate-text">
              EasyQ is not intended for children under 13. We do not knowingly
              collect data from minors without parental consent.
            </p>

            <h4>
              <span className="animate-text">9. Changes to This Policy</span>
            </h4>
            <p className="animate-text">
              We may update this policy. Significant changes will be notified
              via app or email.
            </p>

            <h4>
              <span className="animate-text">10. Contact Us</span>
            </h4>
            <p className="animate-text">
              For questions, contact us at: <br />
              <a href="mailto:support@theeasyq.com">support@theeasyq.com</a>
            </p>
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
