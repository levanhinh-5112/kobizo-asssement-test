import { Request, Response } from 'express';
import { DirectusService } from '../services/DirectusService';

const directus = new DirectusService();

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await directus.getItems('Blog_Posts');
    res.json(blogs);
  } catch (error: any) {
    console.error('Get Blogs Error:', error.message, JSON.stringify(error.response?.data || error));
    res.status(500).json({ error: 'Failed to fetch Blog_Posts' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string') {
      console.error('Get Blog Post Error: Invalid slug', { params: req.params });
      return res.status(400).json({ error: 'Slug is required' });
    }
    const posts = await directus.getItems<any[]>('Blog_Posts', { slug: { _eq: slug } });
    if (!posts || posts.length === 0) {
      console.error('Get Blog Post Error: Post not found', { slug });
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(posts[0]);
  } catch (error: any) {
    console.error('Get Blog Post Error:', error.message, JSON.stringify(error.response?.data || error));
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};