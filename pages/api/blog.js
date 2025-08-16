import { createPost, updatePost, deletePost, getAllPosts } from '../../lib/blog'

export default function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        // Get all posts
        const posts = getAllPosts()
        res.status(200).json(posts)
        break

      case 'POST':
        // Create new post
        const { title, excerpt, content, category, author, tags, image, slug } = req.body
        
        if (!title || !excerpt || !content) {
          return res.status(400).json({ error: 'Title, excerpt, and content are required' })
        }

        const frontMatter = {
          title,
          excerpt,
          category: category || 'Health',
          author: author || 'EasyQ Team',
          tags: tags || [],
          date: new Date().toISOString(),
          ...(image && { image })
        }

        const newPost = createPost(slug, frontMatter, content)
        res.status(201).json({ message: 'Post created successfully', post: newPost })
        break

      case 'PUT':
        // Update existing post
        const updateData = req.body
        
        if (!updateData.slug) {
          return res.status(400).json({ error: 'Slug is required for updates' })
        }

        const updateFrontMatter = {
          title: updateData.title,
          excerpt: updateData.excerpt,
          category: updateData.category || 'Health',
          author: updateData.author || 'EasyQ Team',
          tags: updateData.tags || [],
          date: updateData.date || new Date().toISOString(),
          ...(updateData.image && { image: updateData.image })
        }

        const updatedPost = updatePost(updateData.slug, updateFrontMatter, updateData.content)
        res.status(200).json({ message: 'Post updated successfully', post: updatedPost })
        break

      case 'DELETE':
        // Delete post
        const { slug: deleteSlug } = req.body
        
        if (!deleteSlug) {
          return res.status(400).json({ error: 'Slug is required for deletion' })
        }

        const deletedPost = deletePost(deleteSlug)
        res.status(200).json({ message: 'Post deleted successfully', post: deletedPost })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}