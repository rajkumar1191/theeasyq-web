// pages/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { getAllPosts } from "../lib/blog";

export default function Home({ latestPosts = [] }) {
  const [isClient, setIsClient] = useState(false);
  const [animatedElements, setAnimatedElements] = useState(new Set());
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
        }
      });
    }, observerOptions);

    // Observe all animation elements after a short delay to ensure DOM is ready
    const observeElements = () => {
      const elementsToObserve = document.querySelectorAll('.fade-up, .zoom-out');
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

  // Router events effect (includes GA pageview tracking)
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

    const handleRouteChangeComplete = (url) => {
      // Google Analytics pageview
      gtag.pageview(url);
      // Re-initialize any necessary scripts after route change
      if (window.initializePageScripts) {
        window.initializePageScripts();
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    // Initial page load
    gtag.pageview(window.location.pathname);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  // Initialize Swiper after component mounts
  useEffect(() => {
    if (isClient) {
      // Wait for external scripts to load
      const initializeSwiper = () => {
        if (typeof window !== 'undefined' && window.Swiper) {
          const swiperElement = document.querySelector('.init-swiper');
          if (swiperElement && !swiperElement.swiper) {
            const configElement = swiperElement.querySelector('.swiper-config');
            if (configElement) {
              try {
                const config = JSON.parse(configElement.textContent);
                new window.Swiper(swiperElement, config);
              } catch (error) {
                console.warn('Swiper initialization error:', error);
              }
            }
          }
        } else {
          // Retry if Swiper is not loaded yet
          setTimeout(initializeSwiper, 500);
        }
      };

      const timeoutId = setTimeout(initializeSwiper, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isClient]);

  return (
    <>
      <Head>
        <title>EasyQ – Book OPD Tokens Instantly | Skip Hospital Queues</title>
        <meta
          name="description"
          content="EasyQ lets you book hospital tokens from your phone, skip long queues, and see doctors in 15 minutes. Trusted by top hospitals for fast, secure OPD visits."
        />
        <meta
          name="keywords"
          content="hospital token booking, OPD appointment, healthcare app, skip queues, doctor appointment"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theeasyq.com/" />
        <meta property="og:title" content="EasyQ – Book OPD Tokens Instantly" />
        <meta
          property="og:description"
          content="Skip the waiting room. See your doctor in 15 minutes with EasyQ's smart token booking system."
        />
        <meta
          property="og:image"
          content="https://theeasyq.com/assets/img/logo.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://theeasyq.com/" />
        <meta
          property="twitter:title"
          content="EasyQ – Book OPD Tokens Instantly"
        />
        <meta
          property="twitter:description"
          content="Skip the waiting room. See your doctor in 15 minutes with EasyQ's smart token booking system."
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EasyQ",
              description: "Smart OPD token booking system for hospitals",
              url: "https://theeasyq.com",
              logo: "https://theeasyq.com/assets/img/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
              },
            }),
          }}
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://theeasyq.com/" />

        <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js"></script>
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-BEMYG17HM0"
    ></script>

        {/* Enhanced CSS animations */}
        <style jsx>{`
          .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .zoom-out {
            opacity: 0;
            transform: scale(1.1);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .zoom-out.visible {
            opacity: 1;
            transform: scale(1);
          }
          .animate-delay-100 { transition-delay: 0.1s; }
          .animate-delay-200 { transition-delay: 0.2s; }
          .animate-delay-300 { transition-delay: 0.3s; }
          .animate-delay-400 { transition-delay: 0.4s; }
          .animate-delay-500 { transition-delay: 0.5s; }

          /* Ensure hero section gets proper background */
          .hero {
            background-image: url('/assets/img/hero-bg.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
          }

          /* Fix gallery initialization issue */
          .gallery .swiper {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .gallery .swiper.swiper-initialized {
            opacity: 1;
          }
          
          /* Ensure images are properly sized during loading */
          .gallery .swiper-slide img {
            width: 100%;
            height: auto;
            display: block;
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
                <Link href="#hero" className={router.pathname === '/' ? "active" : ""}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about">About</Link>
              </li>
              <li>
                <Link href="#features">Features</Link>
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
        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-4 order-lg-last hero-img zoom-out">
                <img
                  src="/assets/img/sc1.png"
                  alt="Phone 1"
                  className="phone-1"
                />
                <img
                  src="/assets/img/sc2.png"
                  alt="Phone 2"
                  className="phone-2"
                />
              </div>
              <div className="col-lg-8 d-flex flex-column justify-content-center align-items text-center text-md-start fade-up">
                <h2>Skip the Waiting Room. See Your Doctor in 15 Minutes.</h2>
                <p>
                  EasyQ lets you book a hospital token from your phone, so you
                  spend less time waiting and more time healing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container fade-up animate-delay-100">
            <div className="row align-items-xl-center gy-5">
              <div className="col-xl-5 content">
                <h3>About Us</h3>
                <h2>Reimagining Healthcare Access</h2>
                <p>
                  EasyQ is a tech-driven startup streamlining OPD visits with
                  smart token booking. We're a small team on a mission to make
                  healthcare faster, stress-free, and more accessible for
                  everyone.
                </p>
              </div>

              <div className="col-xl-7">
                <div className="row gy-4 icon-boxes">
                  <div className="col-md-6 fade-up animate-delay-200">
                    <div className="icon-box">
                      <i className="bi bi-buildings"></i>
                      <h3>Our Mission</h3>
                      <p>
                        We're on a mission to make hospital visits stress-free
                        by removing the one thing everyone hates—waiting.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 fade-up animate-delay-300">
                    <div className="icon-box">
                      <i className="bi bi-clipboard-pulse"></i>
                      <h3>Why We Built EasyQ</h3>
                      <p>
                        EasyQ ends hospital queues with fast, smart OPD token
                        booking.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 fade-up animate-delay-400">
                    <div className="icon-box">
                      <i className="bi bi-command"></i>
                      <h3>Who We Are</h3>
                      <p>
                        Small team, big goal: saving time and improving health
                        through tech.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 fade-up animate-delay-500">
                    <div className="icon-box">
                      <i className="bi bi-graph-up-arrow"></i>
                      <h3>What's Next</h3>
                      <p>
                        In beta now—partnering with hospitals and refining for
                        faster healthcare access. Stay tuned or connect with us.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards" className="cards section">
          <div className="container">
            <div className="text-center mb-4 steps-img zoom-out">
              <img src="/assets/img/steps.svg" alt="Steps illustration" />
            </div>

            <div className="row gy-4">
              <div className="col-lg-3 fade-up animate-delay-100">
                <div className="card-item">
                  <span>01</span>
                  <h4>
                    <Link href="#" className="stretched-link">
                      Choose a Hospital
                    </Link>
                  </h4>
                </div>
              </div>

              <div className="col-lg-3 fade-up animate-delay-200">
                <div className="card-item">
                  <span>02</span>
                  <h4>
                    <Link href="#" className="stretched-link">
                      Pick a Department & Doctor
                    </Link>
                  </h4>
                </div>
              </div>

              <div className="col-lg-3 fade-up animate-delay-300">
                <div className="card-item">
                  <span>03</span>
                  <h4>
                    <Link href="#" className="stretched-link">
                      Book a Token Instantly
                    </Link>
                  </h4>
                </div>
              </div>

              <div className="col-lg-3 fade-up animate-delay-400">
                <div className="card-item">
                  <span>04</span>
                  <h4>
                    <Link href="#" className="stretched-link">
                      Walk in Just 15 Minutes Before Your Turn
                    </Link>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features section">
          <div className="container section-title fade-up">
            <h2>Features</h2>
            <p>
              Book your hospital token from anywhere—skip long lines and walk in
              just on time.
            </p>
          </div>

          <div className="container">
            <div className="row gy-4 align-items-center features-item">
              <div className="col-md-5 d-flex align-items-center zoom-out animate-delay-100">
                <img
                  src="/assets/img/features-1.svg"
                  className="img-fluid"
                  alt="Features illustration"
                />
              </div>
              <div className="col-md-7 fade-up animate-delay-100">
                <p>
                  EasyQ lets you book hospital tokens instantly, skip long
                  queues, and see doctors faster. Trusted by top hospitals, it's
                  secure, reliable, and built to simplify your OPD visits.
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check"></i>
                    <span> Book Anytime, Anywhere</span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>
                    <span>15-Minute Doctor Access</span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>
                    <span>Trusted Hospital Partners</span>
                  </li>
                  <li>
                    <i className="bi bi-check"></i>
                    <span>Fast, Secure & Reliable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="gallery section">
          <div className="container section-title fade-up">
            <h2>Gallery</h2>
            <p>
              Browse EasyQ app screenshots to see how simple it is to book
              hospital tokens, track queues, and get care faster—right from your
              phone.
            </p>
          </div>

          <div className="container-fluid fade-up animate-delay-100">
            {isClient && (
              <div className="swiper init-swiper">
                <script
                  type="application/json"
                  className="swiper-config"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      loop: true,
                      speed: 600,
                      autoplay: {
                        delay: 5000
                      },
                      slidesPerView: "auto",
                      centeredSlides: true,
                      pagination: {
                        el: ".swiper-pagination",
                        type: "bullets",
                        clickable: true
                      },
                      breakpoints: {
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 0
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 30
                        },
                        992: {
                          slidesPerView: 5,
                          spaceBetween: 30
                        },
                        1200: {
                          slidesPerView: 7,
                          spaceBetween: 30
                        }
                      }
                    })
                  }}
                />
                <div className="swiper-wrapper align-items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <div key={num} className="swiper-slide">
                      <a
                        className="glightbox"
                        data-gallery="images-gallery-full"
                        href={`/assets/img/app-gallery/app-gallery-${num}.png`}
                      >
                        <img
                          src={`/assets/img/app-gallery/app-gallery-${num}.png`}
                          className="img-fluid"
                          alt={`App gallery image ${num}`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
                <div className="swiper-pagination"></div>
              </div>
            )}
          </div>
        </section>

        {/* Blog Section (if you want to show latest posts) */}
        {latestPosts.length > 0 && (
          <section id="latest-posts" className="blog section">
            <div className="container section-title fade-up">
              <h2>Latest Blog Posts</h2>
              <p>Stay updated with our latest insights and healthcare tips.</p>
            </div>

            <div className="container">
              <div className="row gy-4">
                {latestPosts.map((post, index) => (
                  <div key={post.slug} className={`col-lg-4 fade-up animate-delay-${(index + 1) * 100}`}>
                    <div className="post-item">
                      {post.image && (
                        <div className="post-img">
                          <img src={post.image} alt={post.title} className="img-fluid" />
                        </div>
                      )}
                      <div className="post-content">
                        <div className="post-meta">
                          <span className="post-category">{post.category}</span>
                          <span className="post-date">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3>
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p>{post.excerpt}</p>
                        <div className="post-author">
                          <span>by {post.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 fade-up">
                <Link href="/blog" className="btn btn-primary">
                  View All Posts
                </Link>
              </div>
            </div>
          </section>
        )}
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

export async function getServerSideProps() {
  try {
    const allPosts = await getAllPosts();
    const latestPosts = allPosts.slice(0, 3);

    return {
      props: {
        latestPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching posts for home page:', error);
    return {
      props: {
        latestPosts: [],
      },
    };
  }
}