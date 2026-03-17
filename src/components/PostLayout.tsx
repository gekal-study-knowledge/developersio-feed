'use client';

import * as React from 'react';
import { AppBar, Box, Button, Container, Fab, Slide, Toolbar, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

interface PostLayoutProps {
  title: string;
  date: string;
  last_updated?: string;
  contentHtml: string;
  previous?: string | null;
  next?: string | null;
}

export default function PostLayout({
  title,
  date,
  last_updated,
  contentHtml,
  previous,
  next,
}: PostLayoutProps) {
  const [isBottom, setIsBottom] = React.useState(false);
  const [showSticky, setShowSticky] = React.useState(false);

  React.useEffect(() => {
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
            <Button component="a" href="/" startIcon={<HomeIcon />} variant="outlined">
              Home
            </Button>
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
              <Button
                component="a"
                href={`/posts/${previous}`}
                startIcon={<ArrowBackIcon />}
                variant="contained"
              >
                前日
              </Button>
            ) : (
              <Box />
            )}
            {next ? (
              <Button
                component="a"
                href={`/posts/${next}`}
                endIcon={<ArrowForwardIcon />}
                variant="contained"
              >
                翌日
              </Button>
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
            <Fab
              component="a"
              href={`/posts/${previous}`}
              color="primary"
              aria-label="previous"
              sx={{ position: 'fixed', bottom: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </Fab>
          )}
          {next && (
            <Fab
              component="a"
              href={`/posts/${next}`}
              color="primary"
              aria-label="next"
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
              <ArrowForwardIcon />
            </Fab>
          )}
        </>
      )}
    </>
  );
}
