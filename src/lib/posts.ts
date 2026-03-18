import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface PostData {
  slug: string;
  year: string;
  month: string;
  day: string;
  title: string;
  date: string;
  last_updated?: string;
  contentHtml: string;
  previous?: string | null;
  next?: string | null;
}
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
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
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*)\.md$/);
      const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '';
      const year = dateMatch ? dateMatch[1] : '';
      const month = dateMatch ? dateMatch[2] : '';
      const day = dateMatch ? dateMatch[3] : '';
      const rawSlug = dateMatch ? dateMatch[4] : fileName.replace(/\.md$/, '');
      const slug = encodeURIComponent(rawSlug);

      return {
        slug,
        date,
        year,
        month,
        day,
        title: matterResult.data.title as string,
        ...matterResult.data,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(
  year: string,
  month: string,
  day: string,
  slug: string,
): Promise<PostData> {
  const allFiles = getAllFiles(postsDirectory);
  const decodedSlug = decodeURIComponent(slug);
  const targetFileName = `${year}-${month}-${day}-${decodedSlug}.md`;
  const fullPath = allFiles.find((file) => path.basename(file) === targetFileName);

  if (!fullPath) {
    throw new Error(`Post not found: ${year}/${month}/${day}/${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  const allPosts = getSortedPostsData();
  const currentIndex = allPosts.findIndex(
    (post) => post.year === year && post.month === month && post.day === day && post.slug === slug,
  );

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const next = nextPost
    ? `/posts/${nextPost.year}/${nextPost.month}/${nextPost.day}/${nextPost.slug}`
    : null;
  const previous = previousPost
    ? `/posts/${previousPost.year}/${previousPost.month}/${previousPost.day}/${previousPost.slug}`
    : null;

  const date = `${year}-${month}-${day}`;

  return {
    slug,
    date,
    year,
    month,
    day,
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
      const fileName = path.basename(filePath);
      const dateMatch = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.*)\.md$/);
      const year = dateMatch ? dateMatch[1] : '';
      const month = dateMatch ? dateMatch[2] : '';
      const day = dateMatch ? dateMatch[3] : '';
      const rawSlug = dateMatch ? dateMatch[4] : fileName.replace(/\.md$/, '');
      const slug = encodeURIComponent(rawSlug);

      return {
        params: {
          year,
          month,
          day,
          slug,
        },
      };
    });
}
