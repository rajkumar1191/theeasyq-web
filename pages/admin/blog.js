// pages/admin/blog.js - Updated with authentication
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog";
import dynamic from "next/dynamic";
import AdminLogin from "./login";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function BlogAdmin({ posts: initialPosts }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [posts, setPosts] = useState(initialPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Health",
    author: "EasyQ Team",
    tags: "",
    image: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('/api/admin/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setAuthToken(token);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    const postData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      slug: editingPost ? editingPost.slug : slug,
    };

    try {
      const response = await makeAuthenticatedRequest("/api/blog", {
        method: editingPost ? "PUT" : "POST",
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Refresh posts list
        const updatedPosts = await fetch("/api/blog");
        const postsData = await updatedPosts.json();
        setPosts(postsData);

        resetForm();
        alert(
          editingPost
            ? "Post updated successfully!"
            : "Post created successfully!"
        );
      } else {
        const error = await response.json();
        alert(`Error saving post: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving post");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (post) => {
    setFormLoading(true);
    try {
      const response = await fetch(`/api/blog/${post.slug}`);
      const fullPost = await response.json();

      setEditingPost(fullPost);
      setFormData({
        title: fullPost.title,
        excerpt: fullPost.excerpt,
        content: fullPost.content || "",
        category: fullPost.category,
        author: fullPost.author,
        tags: fullPost.tags.join(", "),
        image: fullPost.image || "",
      });
      setShowNewPostForm(true);
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Error loading post for editing");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setFormLoading(true);
    try {
      const response = await makeAuthenticatedRequest("/api/blog", {
        method: "DELETE",
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
        alert("Post deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Error deleting post: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting post");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Health",
      author: "EasyQ Team",
      tags: "",
      image: "",
    });
    setShowNewPostForm(false);
    setEditingPost(null);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show admin interface if authenticated
  return (
    <>
      <Head>
        <title>Blog Admin | EasyQ</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-container">
        <header className="admin-header">
          <div className="container">
            <Link href="/" className="back-link">
              ← Back to Home
            </Link>
            <h1>Blog Administration</h1>
            <div className="header-actions">
              <button
                className="btn-primary"
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                disabled={formLoading}
              >
                {showNewPostForm ? "Cancel" : "New Post"}
              </button>
              <button
                className="btn-secondary"
                onClick={handleLogout}
                style={{ marginLeft: '10px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <div className="container">
            {showNewPostForm && (
              <div className="post-form-container">
                <h2>{editingPost ? "Edit Post" : "Create New Post"}</h2>
                <form onSubmit={handleSubmit} className="post-form">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="excerpt">Excerpt *</label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows="3"
                      required
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={formLoading}
                      >
                        <option value="Health">Health</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Tips">Tips</option>
                        <option value="News">News</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="author">Author</label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags">Tags (comma separated)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="health, technology, tips"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Featured Image URL</label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={formLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    <MDEditor
                      value={formData.content}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: value || "",
                        }))
                      }
                      preview="edit"
                      height={400}
                      data-color-mode="light"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={formLoading}
                    >
                      {formLoading
                        ? "Saving..."
                        : editingPost
                        ? "Update Post"
                        : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                      disabled={formLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="posts-list">
              <h2>All Posts ({posts.length})</h2>

              {formLoading && <div className="loading">Loading...</div>}

              {posts.length === 0 ? (
                <div className="empty-state">
                  <p>No blog posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="posts-table">
                  {posts.map((post) => (
                    <div key={post.slug} className="post-row">
                      <div className="post-info">
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <div className="post-meta">
                          <span className="category">{post.category}</span>
                          <span className="author">by {post.author}</span>
                          <span className="date">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="post-actions">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="btn-link"
                          target="_blank"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEdit(post)}
                          className="btn-secondary"
                          disabled={formLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="btn-danger"
                          disabled={formLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const posts = await getAllPosts();
  return { props: { posts } };
}