import { BlogPost as BlogPostType } from '@/types';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">By {post.author} on {new Date(post.published_date).toLocaleDateString()}</p>
      <div className="prose">{post.content}</div>
    </article>
  );
}