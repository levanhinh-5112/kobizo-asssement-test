import BlogPost from '@/components/BlogPost';
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/api';
import { BlogPost as BlogPostType } from '@/types';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return <BlogPost post={post} />;
}

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((post: BlogPostType) => ({
    slug: post.slug,
  }));
}

export const revalidate = 60;