import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

// Ensure posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

export function getAllPosts() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
          slug,
          title: matterResult.data.title || "Untitled",
          date: matterResult.data.date || new Date().toISOString(),
          excerpt: matterResult.data.excerpt || "",
          category: matterResult.data.category || "Health",
          author: matterResult.data.author || "EasyQ Team",
          image: matterResult.data.image || null,
          tags: matterResult.data.tags || [],
          ...matterResult.data,
        };
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      contentHtml,
      title: matterResult.data.title || "Untitled",
      date: matterResult.data.date || new Date().toISOString(),
      excerpt: matterResult.data.excerpt || "",
      category: matterResult.data.category || "Health",
      author: matterResult.data.author || "EasyQ Team",
      image: matterResult.data.image || null,
      tags: matterResult.data.tags || [],
      ...matterResult.data,
    };
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}

// Helper function to create a new blog post
export function createPost(slug, frontMatter, content) {
  const fileName = `${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  const fileContent = matter.stringify(content, frontMatter);

  fs.writeFileSync(filePath, fileContent, "utf8");

  return { slug, fileName };
}

// Helper function to update an existing post
export function updatePost(slug, frontMatter, content) {
  const fileName = `${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const fileContent = matter.stringify(content, frontMatter);

  fs.writeFileSync(filePath, fileContent, "utf8");

  return { slug, fileName };
}

// Helper function to delete a post
export function deletePost(slug) {
  const fileName = `${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  fs.unlinkSync(filePath);

  return { slug, deleted: true };
}
