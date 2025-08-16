import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function BlogAdmin({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Health",
    author: "EasyQ Team",
    tags: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      date: new Date().toISOString(),
      slug,
    };

    try {
      const response = await fetch("/api/blog", {
        method: editingPost ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...postData,
          slug: editingPost ? editingPost.slug : slug,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (editingPost) {
          setPosts(
            posts.map((p) =>
              p.slug === editingPost.slug
                ? { ...postData, slug: editingPost.slug }
                : p
            )
          );
        } else {
          setPosts([{ ...postData, slug }, ...posts]);
        }

        resetForm();
        alert(
          editingPost
            ? "Post updated successfully!"
            : "Post created successfully!"
        );
      } else {
        alert("Error saving post");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving post");
    }
  };

  const handleEdit = async (post) => {
    try {
      // Fetch the full post content including the markdown content
      const response = await fetch(`/api/blog/${post.slug}`);
      const fullPost = await response.json();

      setEditingPost(fullPost);
      setFormData({
        title: fullPost.title,
        excerpt: fullPost.excerpt,
        content: fullPost.content || "", // This should now have the markdown content
        category: fullPost.category,
        author: fullPost.author,
        tags: fullPost.tags.join(", "),
        image: fullPost.image || "",
      });
      setShowNewPostForm(true);
    } catch (error) {
      console.error("Error fetching post:", error);
      // Fallback to existing data
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: "", // Will be empty but at least form shows
        category: post.category,
        author: post.author,
        tags: post.tags.join(", "),
        image: post.image || "",
      });
      setShowNewPostForm(true);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
        alert("Post deleted successfully!");
      } else {
        alert("Error deleting post");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting post");
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
            <button
              className="btn-primary"
              onClick={() => setShowNewPostForm(!showNewPostForm)}
            >
              {showNewPostForm ? "Cancel" : "New Post"}
            </button>
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
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    {/* <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="15"
                      placeholder="Write your post content in Markdown format..."
                      required
                    /> */}
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
                    <button type="submit" className="btn-primary">
                      {editingPost ? "Update Post" : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="posts-list">
              <h2>All Posts ({posts.length})</h2>

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
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="btn-danger"
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
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
}
