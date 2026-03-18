import * as React from 'react';
import { getPostData, getAllPostSlugs } from '@/lib/posts';
import PostLayout from '@/components/PostLayout';

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((s) => ({
    slug: s.params.slug,
  }));
}

export const dynamicParams = false;

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <PostLayout
      title={postData.title}
      date={postData.date}
      last_updated={postData.last_updated}
      contentHtml={postData.contentHtml}
      previous={postData.previous}
      next={postData.next}
    />
  );
}
