import * as React from 'react';
import { getPostData } from '@/lib/posts';
import PostLayout from '@/components/PostLayout';
import fs from 'fs';
import path from 'path';

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const fileNames = fs.readdirSync(path.join(process.cwd(), '_posts'));
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
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
