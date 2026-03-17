import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  last_updated?: string;
  contentHtml: string;
  previous?: string | null;
  next?: string | null;
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // Jekyll format: 2026-03-17-feed.md
      // We can extract the date from the filename or from the title if not present in frontmatter
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : '';

      return {
        slug,
        date,
        title: matterResult.data.title as string,
        ...matterResult.data,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  const allPosts = getSortedPostsData();
  const currentIndex = allPosts.findIndex((post) => post.slug === slug);

  const next = currentIndex > 0 ? allPosts[currentIndex - 1].slug : null;
  const previous = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1].slug : null;

  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';

  return {
    slug,
    date,
    contentHtml,
    title: matterResult.data.title as string,
    previous,
    next,
    ...matterResult.data,
  };
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}
