import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts - moved from index.js */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&family=Poppins&family=Raleway&display=swap"
          rel="stylesheet"
        />
        
        {/* External stylesheets */}
        <link
          href="/assets/vendor/bootstrap/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/bootstrap-icons/bootstrap-icons.css"
          rel="stylesheet"
        />
        {/* Removed AOS CSS to prevent conflicts */}
        <link
          href="/assets/vendor/swiper/swiper-bundle.min.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/glightbox/css/glightbox.min.css"
          rel="stylesheet"
        />
        <link href="/assets/css/main.css" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* External JavaScript libraries - loaded after React hydration */}
        <script
          src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
          defer
        />
        {/* Removed AOS JS to prevent conflicts */}
        <script src="/assets/vendor/swiper/swiper-bundle.min.js" defer />
        <script src="/assets/vendor/glightbox/js/glightbox.min.js" defer />
        <script src="/assets/js/main.js" defer />
      </body>
    </Html>
  );
}