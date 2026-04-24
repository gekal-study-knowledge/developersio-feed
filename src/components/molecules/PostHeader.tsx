'use client';

import * as React from 'react';
import { Box, Typography, Paper, Alert, AlertTitle } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateIcon from '@mui/icons-material/Update';
import FiberNewIcon from '@mui/icons-material/FiberNew';

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
        <Alert
          severity="warning"
          icon={<FiberNewIcon fontSize="inherit" />}
          sx={{
            mb: 3,
            borderRadius: '12px',
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? 'warning.light' : 'rgba(237,108,2,0.2)',
            color: 'warning.dark',
            '& .MuiAlert-icon': { color: 'warning.main' },
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>
            新しい更新があります（{newCount}件）
          </AlertTitle>
          {elapsedTime && (
            <>
              前回の閲覧から <strong>{elapsedTime}</strong> に{' '}
              <strong>{newCount}件</strong> の新着記事が追加されました。
            </>
          )}
          {!elapsedTime && (
            <>
              前回の閲覧以降に <strong>{newCount}件</strong> の新着記事が追加されました。
            </>
          )}
        </Alert>
      )}
    </>
  );
}
