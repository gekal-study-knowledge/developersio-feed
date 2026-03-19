import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getSortedPostsData } from '@/lib/posts';
import PostList from '@/components/organisms/PostList';
import ThemeSwitcher from '@/components/atoms/ThemeSwitcher';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevelopersIO Feed Archive',
};

// サーバーコンポーネントでMUIコンポーネントにLinkコンポーネントを渡すとシリアライズエラーになるため、
// 常時<a>タグとしてレンダリングされるように設定。Next.js Linkの機能（prefetch等）は
// クライアントサイドナビゲーションとして動作する。
export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ThemeSwitcher />
        </Box>
        <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
          DevelopersIO Feed Archive
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          クラスメソッドの技術ブログ「DevelopersIO」の最新記事を日別でまとめています。
        </Typography>

        <PostList posts={allPostsData} />
      </Box>
    </Container>
  );
}
