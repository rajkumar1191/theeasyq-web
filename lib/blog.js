// lib/blog.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  setDoc,
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { remark } from "remark";
import html from "remark-html";

const COLLECTION_NAME = 'blog_posts';

// Get all posts from Firestore
export async function getAllPosts() {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore timestamps to ISO strings for JSON serialization
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null;
      
      posts.push({
        id: doc.id,
        slug: doc.id, // Use document ID as slug
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "Health",
        author: data.author || "EasyQ Team",
        tags: data.tags || [],
        image: data.image || null,
        date: createdAt,
        updatedAt: updatedAt
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

// Get a single post by slug/ID
export async function getPostBySlug(slug) {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(data.content || '');
    const contentHtml = processedContent.toString();
    
    // Convert Firestore timestamps to ISO strings for JSON serialization
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null;
    
    return {
      id: docSnap.id,
      slug: docSnap.id,
      contentHtml,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      content: data.content || "", // Keep raw markdown content
      category: data.category || "Health",
      author: data.author || "EasyQ Team",
      tags: data.tags || [],
      image: data.image || null,
      date: createdAt,
      updatedAt: updatedAt
    };
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

// Create a new blog post
export async function createPost(postData) {
  try {
    const { slug, ...data } = postData;
    
    // Prepare the document data
    const docData = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category || "Health",
      author: data.author || "EasyQ Team",
      tags: data.tags || [],
      image: data.image || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // If slug is provided, use it as document ID, otherwise let Firestore generate one
    let docRef;
    if (slug) {
      docRef = doc(db, COLLECTION_NAME, slug);
      await setDoc(docRef, docData);
    } else {
      docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    }
    
    return {
      id: docRef.id,
      slug: docRef.id,
      success: true
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Update an existing post
export async function updatePost(slug, postData) {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Post with slug "${slug}" not found`);
    }
    
    const updateData = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      category: postData.category || "Health",
      author: postData.author || "EasyQ Team",
      tags: postData.tags || [],
      image: postData.image || null,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    return {
      id: slug,
      slug: slug,
      success: true
    };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

// Delete a post
export async function deletePost(slug) {
  try {
    const docRef = doc(db, COLLECTION_NAME, slug);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Post with slug "${slug}" not found`);
    }
    
    await deleteDoc(docRef);
    
    return {
      slug: slug,
      deleted: true,
      success: true
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}