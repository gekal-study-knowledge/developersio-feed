'use client';

import * as React from 'react';
import { AppBar, Box, Button, Container, Fab, Slide, Toolbar, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

interface PostLayoutProps {
  title: string;
  date: string;
  last_updated?: string;
  contentHtml: string;
  previous?: string | null;
  next?: string | null;
  year: string;
  month: string;
  day: string;
  slug: string;
}

export default function PostLayout({
  title,
  date,
  last_updated,
  contentHtml,
  previous,
  next,
  year,
  month,
  day,
  slug,
}: PostLayoutProps) {
  const [isBottom, setIsBottom] = React.useState(false);
  const [showSticky, setShowSticky] = React.useState(false);

  React.useEffect(() => {
    // 訪問済みとして保存
    const visitedKey = 'visited_posts';
    const visitedPosts = JSON.parse(localStorage.getItem(visitedKey) || '[]');
    const currentPostId = `${year}/${month}/${day}/${slug}`;
    if (!visitedPosts.includes(currentPostId)) {
      visitedPosts.push(currentPostId);
      localStorage.setItem(visitedKey, JSON.stringify(visitedPosts));
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // ヘッダー表示の判定 (少しスクロールしたら表示)
      setShowSticky(scrollY > 200);

      // 最下部判定 (遊びを持たせる)
      const atBottom = scrollY + windowHeight >= documentHeight - 50;
      setIsBottom(atBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期状態のチェック
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <Slide appear={false} direction="down" in={showSticky && !isBottom}>
        <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
          <Toolbar variant="dense" sx={{ justifyContent: 'center' }}>
            <Typography variant="h6" color="primary">
              {date}
            </Typography>
          </Toolbar>
        </AppBar>
      </Slide>

      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {/* Home Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Link href="/" passHref>
              <Button component="span" startIcon={<HomeIcon />} variant="outlined">
                Home
              </Button>
            </Link>
          </Box>

          <Typography variant="h3" component="h1" gutterBottom color="primary">
            {title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            {date} {last_updated && `(最終更新: ${last_updated})`}
          </Typography>

          <Box
            sx={{
              mt: 4,
              mb: 6,
              '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px' },
              '& h2': {
                mt: 4,
                mb: 2,
                color: 'primary.main',
                borderBottom: '1px solid #eee',
                pb: 1,
              },
              '& hr': { my: 4, border: '0', borderTop: '1px solid #eee' },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              },
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Bottom Navigation Buttons (Normal Flow) */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              pt: 2,
              borderTop: '1px solid #eee',
            }}
          >
            {previous ? (
              <Link href={previous} passHref>
                <Button component="span" startIcon={<ArrowBackIcon />} variant="contained">
                  前日
                </Button>
              </Link>
            ) : (
              <Box />
            )}
            {next ? (
              <Link href={next} passHref>
                <Button component="span" endIcon={<ArrowForwardIcon />} variant="contained">
                  翌日
                </Button>
              </Link>
            ) : (
              <Box />
            )}
          </Box>
        </Box>
      </Container>

      {/* Floating Action Buttons */}
      {!isBottom && (
        <>
          {previous && (
            <Link href={previous} passHref>
              <Fab
                component="span"
                color="primary"
                aria-label="previous"
                sx={{ position: 'fixed', bottom: 16, left: 16 }}
              >
                <ArrowBackIcon />
              </Fab>
            </Link>
          )}
          {next && (
            <Link href={next} passHref>
              <Fab
                component="span"
                color="primary"
                aria-label="next"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
              >
                <ArrowForwardIcon />
              </Fab>
            </Link>
          )}
        </>
      )}
    </>
  );
}
