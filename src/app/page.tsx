import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import VisitedIcon from '@/components/VisitedIcon';
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
        <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
          DevelopersIO Feed Archive
        </Typography>
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          クラスメソッドの技術ブログ「DevelopersIO」の最新記事を日別でまとめています。
        </Typography>

        <Grid container spacing={3}>
          {allPostsData.map(({ slug, date, year, month, day, title }) => (
            <Grid key={`${year}-${month}-${day}-${slug}`} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Link
                  href={`/posts/${year}/${month}/${day}/${slug}`}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CardActionArea component="span" sx={{ flexGrow: 1 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" color="primary">
                        {title}
                        <VisitedIcon year={year} month={month} day={day} slug={slug} />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {date}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
