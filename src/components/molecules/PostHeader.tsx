'use client';

import * as React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateIcon from '@mui/icons-material/Update';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface PostHeaderProps {
  title: string;
  date: string;
  lastUpdated?: string;
  savedCounter?: number | null;
  newsCounter?: number;
  elapsedTime?: string;
}

export default function PostHeader({
  title,
  date,
  lastUpdated,
  savedCounter,
  newsCounter,
  elapsedTime,
}: PostHeaderProps) {
  const newCount =
    savedCounter !== null &&
    savedCounter !== undefined &&
    savedCounter >= 0 &&
    newsCounter !== undefined &&
    newsCounter > savedCounter
      ? newsCounter - savedCounter
      : 0;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: '16px',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
          {lastUpdated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UpdateIcon fontSize="small" sx={{ opacity: 0.8 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 400, opacity: 0.8 }}>
                最終更新: {lastUpdated}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {newCount > 0 && (
        <Box
          role="button"
          tabIndex={0}
          onClick={() =>
            document
              .getElementById('new-content-divider')
              ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ')
              document
                .getElementById('new-content-divider')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          sx={{
            mb: 3,
            px: 2.5,
            py: 1.5,
            borderRadius: '12px',
            border: '1.5px solid',
            borderColor: 'warning.main',
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? 'warning.light' : 'rgba(237,108,2,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            userSelect: 'none',
            transition: 'filter 0.15s',
            '&:hover': { filter: 'brightness(0.95)' },
            '&:active': { filter: 'brightness(0.88)' },
          }}
        >
          <FiberNewIcon sx={{ color: 'warning.main', fontSize: '1.4rem', flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={700} color="warning.dark" lineHeight={1.3}>
              新着 {newCount} 件の記事があります
            </Typography>
            {elapsedTime && (
              <Typography variant="caption" color="text.secondary">
                {elapsedTime}前に更新
              </Typography>
            )}
          </Box>
          <KeyboardArrowDownIcon sx={{ color: 'warning.main', flexShrink: 0 }} />
        </Box>
      )}
    </>
  );
}
