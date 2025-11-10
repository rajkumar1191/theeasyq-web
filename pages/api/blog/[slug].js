// import { getPostBySlug } from "../../../lib/blog";
// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";

// export default function handler(req, res) {
//   const { slug } = req.query;
//   const { method } = req;

//   try {
//     if (method === "GET") {
//       // Get the raw markdown content (not processed HTML)
//       const postsDirectory = path.join(process.cwd(), "posts");
//       const fullPath = path.join(postsDirectory, `${slug}.md`);

//       if (!fs.existsSync(fullPath)) {
//         return res.status(404).json({ error: "Post not found" });
//       }

//       const fileContents = fs.readFileSync(fullPath, "utf8");
//       const matterResult = matter(fileContents);

//       const post = {
//         slug,
//         content: matterResult.content, // Raw markdown content for editing
//         title: matterResult.data.title || "Untitled",
//         date: matterResult.data.date || new Date().toISOString(),
//         excerpt: matterResult.data.excerpt || "",
//         category: matterResult.data.category || "Health",
//         author: matterResult.data.author || "EasyQ Team",
//         image: matterResult.data.image || null,
//         tags: matterResult.data.tags || [],
//         ...matterResult.data,
//       };

//       res.status(200).json(post);
//     } else {
//       res.setHeader("Allow", ["GET"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//     }
//   } catch (error) {
//     console.error("API Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }


// pages/api/blog/[slug].js
import { getPostBySlug } from '../../../lib/blog'

export default async function handler(req, res) {
  const { slug } = req.query
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const post = await getPostBySlug(slug)
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        
        res.status(200).json(post)
        break

      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}