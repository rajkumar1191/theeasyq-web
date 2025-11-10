// pages/blog/index.js
import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

export default function Blog({ posts = [] }) {
  return (
    <>
      <Head>
        <title>Health Tips & Healthcare News | EasyQ Blog</title>
        <meta
          name="description"
          content="Stay informed with the latest healthcare tips, medical news, and insights from EasyQ. Learn about hospital visits, health management, and medical technology."
        />
        <meta
          name="keywords"
          content="health tips, healthcare news, medical advice, hospital visits, healthcare technology"
        />
        <link rel="canonical" href="https://theeasyq.com/blog" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "EasyQ Health Blog",
              description: "Healthcare tips and medical insights",
              url: "https://theeasyq.com/blog",
              publisher: {
                "@type": "Organization",
                name: "EasyQ",
              },
            }),
          }}
        />
      </Head>

      <div className="blog-container">
        <header className="blog-header">
          <div className="container">
            <Link href="/" className="back-link">
              ← Back to Home
            </Link>
            <h1>Health Tips & News</h1>
            <p>Stay informed with the latest healthcare insights and tips</p>
          </div>
        </header>

        <main className="blog-main">
          <div className="container">
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.slug} className="blog-card">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="blog-card-content">
                      {post.image && (
                        <div className="blog-image">
                          <img src={post.image} alt={post.title} />
                        </div>
                      )}
                      <div className="blog-info">
                        <div className="blog-meta">
                          <span className="blog-category">{post.category}</span>
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <h2>{post.title}</h2>
                        <p>{post.excerpt}</p>
                        <div className="read-more">Read More →</div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="empty-state">
                <h2>No blog posts yet</h2>
                <p>Check back soon for health tips and healthcare insights!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const posts = await getAllPosts();

    return {
      props: {
        posts,
      },
      revalidate: 60, // Revalidate every 60 seconds for new posts
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    };
  }
}
