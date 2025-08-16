import { getAllPosts } from "./lib/blog";

function generateSiteMap(posts) {
  const baseUrl = "https://theeasyq.com";

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Main pages -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/blog</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <!-- Blog posts -->
     ${posts
       .map(({ slug, date }) => {
         return `
       <url>
         <loc>${baseUrl}/blog/${slug}</loc>
         <lastmod>${new Date(date).toISOString()}</lastmod>
         <changefreq>monthly</changefreq>
         <priority>0.7</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Get all blog posts
  const posts = getAllPosts();

  // Generate the XML sitemap
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // Cache the sitemap for 24 hours
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate"
  );
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
