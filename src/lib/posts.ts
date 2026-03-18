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

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

export function getSortedPostsData() {
  const allFiles = getAllFiles(postsDirectory);
  const allPostsData = allFiles
    .filter((filePath) => filePath.endsWith('.md'))
    .map((fullPath) => {
      const fileName = path.basename(fullPath);
      const slug = fileName.replace(/\.md$/, '');
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
  const allFiles = getAllFiles(postsDirectory);
  const fullPath = allFiles.find(file => path.basename(file) === `${slug}.md`);
  
  if (!fullPath) {
    throw new Error(`Post not found: ${slug}`);
  }
  
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
  const allFiles = getAllFiles(postsDirectory);
  return allFiles
    .filter((filePath) => filePath.endsWith('.md'))
    .map((filePath) => {
      return {
        params: {
          slug: path.basename(filePath).replace(/\.md$/, ''),
        },
      };
    });
}
