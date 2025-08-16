function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /blog/
Allow: /assets/

# Sitemap
Sitemap: https://theeasyq.com/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1
`;
}

function RobotsTxt() {
  // getServerSideProps will handle the response
}

export async function getServerSideProps({ res }) {
  const robotsTxt = generateRobotsTxt();

  res.setHeader("Content-Type", "text/plain");
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default RobotsTxt;
