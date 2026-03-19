'use client';

import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  Slide,
  Toolbar,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateIcon from '@mui/icons-material/Update';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
          <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/" passHref>
              <IconButton
                component="span"
                size="medium"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                <HomeIcon fontSize="medium" />
              </IconButton>
            </Link>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {date}
            </Typography>
            <Box sx={{ width: 40 }} /> {/* balance center title */}
          </Toolbar>
        </AppBar>
      </Slide>

      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 2 }}>
          {/* Home Button */}
          <Link href="/" passHref>
            <Button
              component="span"
              startIcon={<HomeIcon sx={{ fontSize: '1.5rem !important' }} />}
              variant="text"
              size="large"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Back to Archive
            </Button>
          </Link>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: '16px',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || '#0d4d4d'} 100%)`,
            color: 'common.white',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
            },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon fontSize="small" sx={{ opacity: 0.8 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                {date}
              </Typography>
            </Box>
            {last_updated && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UpdateIcon fontSize="small" sx={{ opacity: 0.8 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 400, opacity: 0.8 }}>
                  最終更新: {last_updated}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Decorative Divider */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 6,
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              flex: 1,
              height: '1px',
              background: (theme) =>
                `linear-gradient(to ${theme.direction === 'rtl' ? 'left' : 'right'}, transparent, ${theme.palette.primary.light}, transparent)`,
            },
          }}
        >
          <AutoAwesomeIcon
            sx={{
              mx: 3,
              color: 'primary.light',
              opacity: 0.5,
              fontSize: '1.5rem',
              transform: 'rotate(-10deg)',
            }}
          />
        </Box>

        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              mt: 4,
              mb: 8,
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                mb: 3,
              },
              '& h2': {
                mt: 6,
                mb: 3,
                color: 'primary.main',
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                fontWeight: 700,
                borderBottom: (theme) => `2px solid ${theme.palette.primary.light || '#eee'}`,
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  width: '8px',
                  height: '1.5em',
                  bgcolor: 'primary.main',
                  mr: 2,
                  borderRadius: '4px',
                },
              },
              '& h3': {
                mt: 4,
                mb: 2,
                fontWeight: 600,
              },
              '& p': {
                mb: 2,
                lineHeight: 1.8,
              },
              '& hr': { my: 6, border: '0', borderTop: '1px solid #eee' },
              '& a': {
                color: 'primary.main',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { textDecoration: 'underline', color: 'primary.dark' },
              },
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Bottom Navigation Buttons (Normal Flow) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 4,
              pt: 2,
              borderTop: '1px solid #eee',
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              {previous ? (
                <Link href={previous} passHref>
                  <Button component="span" startIcon={<ArrowBackIcon />} variant="contained">
                    前日
                  </Button>
                </Link>
              ) : (
                <Box />
              )}
            </Box>

            <Box sx={{ flex: '0 0 auto' }}>
              <Link href="/" passHref>
                <Button
                  component="span"
                  startIcon={<HomeIcon />}
                  variant="outlined"
                  size="large"
                  sx={{ mx: 1, fontWeight: 600 }}
                >
                  Archive
                </Button>
              </Link>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
