// pages/blog/[slug].js
import Head from "next/head";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "../../lib/blog";

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <div className="error-container">
        <div className="container">
          <h1>Post not found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn-primary">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Ensure we have absolute URLs for sharing
  const baseUrl = "https://theeasyq.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const postImage = post.image?.startsWith('http') 
    ? post.image 
    : `${baseUrl}${post.image || "/assets/img/logo.png"}`;

  return (
    <>
      <Head>
        <title>{post.title} | EasyQ Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.join(", ")} />
        <meta name="author" content={post.author || "EasyQ Team"} />
        <link rel="canonical" href={postUrl} />

        {/* Open Graph - Fixed with absolute URLs */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={postImage} />
        <meta property="og:site_name" content="EasyQ Blog" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author || "EasyQ Team"} />

        {/* Twitter Card - Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@EasyQ" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={postImage} />
        <meta name="twitter:url" content={postUrl} />

        {/* Structured Data - Enhanced */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              author: {
                "@type": "Person",
                name: post.author || "EasyQ Team",
              },
              publisher: {
                "@type": "Organization",
                name: "EasyQ",
                logo: {
                  "@type": "ImageObject",
                  url: `${baseUrl}/assets/img/logo.png`
                }
              },
              datePublished: post.date,
              dateModified: post.updatedAt || post.date,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": postUrl,
              },
              image: postImage,
              url: postUrl
            }),
          }}
        />
      </Head>

      <article className="blog-post">
        <header className="post-header">
          <div className="container">
            <Link href="/blog" className="back-link">
              ← Back to Blog
            </Link>

            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <time className="post-time" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.updatedAt && post.updatedAt !== post.date && (
                <span className="post-updated">
                  Updated: {new Date(post.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1>{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>

            {post.author && (
              <div className="post-author">
                <span>By {post.author}</span>
              </div>
            )}
          </div>
        </header>

        {post.image && (
          <div className="post-featured-image">
            <div className="container">
              <img src={post.image} alt={post.title} loading="lazy" />
            </div>
          </div>
        )}

        <main className="post-content">
          <div className="container">
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                <h3>Tags:</h3>
                <div className="tags-list">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="post-footer">
          <div className="container">
            <div className="post-navigation">
              <Link href="/blog" className="btn-secondary">
                ← Back to All Posts
              </Link>
              <div className="share-buttons">
                <span>Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${post.title} - ${post.excerpt}`
                  )}&url=${encodeURIComponent(postUrl)}&hashtags=${encodeURIComponent(
                    post.tags?.slice(0, 3).join(',') || 'blog'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn twitter"
                  aria-label="Share on Twitter"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    postUrl
                  )}&quote=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn facebook"
                  aria-label="Share on Facebook"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    postUrl
                  )}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(
                    post.excerpt
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn linkedin"
                  aria-label="Share on LinkedIn"
                >
                  LinkedIn
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.excerpt,
                        url: postUrl,
                      }).catch(console.error);
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(postUrl).then(() => {
                        alert('Link copied to clipboard!');
                      }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = postUrl;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Link copied to clipboard!');
                      });
                    }
                  }}
                  className="share-btn copy-link"
                  aria-label="Copy link or share"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const posts = await getAllPosts();
    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Changed to 'blocking' for better UX with new posts
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
      },
      revalidate: 60, // Revalidate every 60 seconds for updates
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
}