import express from 'express';
import { getProductBySlug, getProducts, updateProductBySlug } from './controllers/ProductController';
import { signup, signin } from './controllers/AuthController';
import { checkout } from './controllers/CheckoutController';
import { authenticate } from './middlewares/AuthMiddleware';
import cors from 'cors';
import { getBlogBySlug, getBlogs } from './controllers/BlogPostController';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true, 
}));

app.use(express.json());

app.post('/api/v1/signup', signup);
app.post('/api/v1/signin', signin);
app.get('/api/v1/products', getProducts);
app.get('/api/v1/products/:slug', getProductBySlug);
app.patch('/api/v1/products/:slug', authenticate, updateProductBySlug);
app.get('/api/v1/blog_posts', getBlogs);
app.get('/api/v1/blog_posts/:slug', getBlogBySlug);
app.post('/api/v1/checkout', authenticate, checkout);

export default app;