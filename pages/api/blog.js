// pages/api/blog.js
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  generateSlug,
} from "../../lib/blog";

// Helper function to trigger revalidation
async function triggerRevalidation(slug = null) {
  try {
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    if (!revalidateSecret) return; // Skip if no secret is set

    const baseUrl = process.env.DEPLOYED_URL
      ? "https://https://the-easy-q.web.app/"
      : "http://localhost:3000";

    // Revalidate home page and blog index
    await fetch(`${baseUrl}/api/revalidate?secret=${revalidateSecret}`);

    // Revalidate specific post if slug is provided
    if (slug) {
      await fetch(
        `${baseUrl}/api/revalidate?secret=${revalidateSecret}&slug=${slug}`
      );
    }
  } catch (error) {
    console.log("Revalidation failed:", error.message);
    // Don't throw error, just log it
  }
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        // Get all posts
        const posts = await getAllPosts();
        res.status(200).json(posts);
        break;

      case "POST":
        // Create new post
        const { title, excerpt, content, category, author, tags, image, slug } =
          req.body;

        if (!title || !excerpt || !content) {
          return res
            .status(400)
            .json({ error: "Title, excerpt, and content are required" });
        }

        const postSlug = slug || generateSlug(title);

        const postData = {
          title,
          excerpt,
          content,
          category: category || "Health",
          author: author || "EasyQ Team",
          tags: tags || [],
          image: image || null,
          slug: postSlug,
        };

        const newPost = await createPost(postData);

        // Trigger revalidation after creating post
        await triggerRevalidation(postSlug);

        res
          .status(201)
          .json({ message: "Post created successfully", post: newPost });
        break;

      case "PUT":
        // Update existing post
        const updateData = req.body;

        if (!updateData.slug) {
          return res
            .status(400)
            .json({ error: "Slug is required for updates" });
        }

        const updatedPost = await updatePost(updateData.slug, {
          title: updateData.title,
          excerpt: updateData.excerpt,
          content: updateData.content,
          category: updateData.category || "Health",
          author: updateData.author || "EasyQ Team",
          tags: updateData.tags || [],
          image: updateData.image || null,
        });

        // Trigger revalidation after updating post
        await triggerRevalidation(updateData.slug);

        res
          .status(200)
          .json({ message: "Post updated successfully", post: updatedPost });
        break;

      case "DELETE":
        // Delete post
        const { slug: deleteSlug } = req.body;

        if (!deleteSlug) {
          return res
            .status(400)
            .json({ error: "Slug is required for deletion" });
        }

        const deletedPost = await deletePost(deleteSlug);

        // Trigger revalidation after deleting post
        await triggerRevalidation();

        res
          .status(200)
          .json({ message: "Post deleted successfully", post: deletedPost });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
}
