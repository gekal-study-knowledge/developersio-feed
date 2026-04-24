'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface PostContentProps {
  contentHtml: string;
  savedCounter?: number | null;
  elapsedTime?: string;
}

function splitHtmlAtNthH2(
  html: string,
  n: number,
): { before: string; after: string } | null {
  if (n <= 0) return null;

  const regex = /<h2[^>]*>/gi;
  let count = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    count++;
    if (count === n) {
      // Find the (n+1)-th h2 — everything before it is "read", after is "new"
      const nextMatch = regex.exec(html);
      if (!nextMatch) return null;

      return {
        before: html.slice(0, nextMatch.index),
        after: html.slice(nextMatch.index),
      };
    }
  }

  return null;
}

function WaveUpdateDivider({ elapsedTime }: { elapsedTime?: string }) {
  const wavePath =
    'M0,12 Q25,0 50,12 Q75,24 100,12 Q125,0 150,12 Q175,24 200,12 Q225,0 250,12 Q275,24 300,12 Q325,0 350,12 Q375,24 400,12 Q425,0 450,12 Q475,24 500,12 Q525,0 550,12 Q575,24 600,12 Q625,0 650,12 Q675,24 700,12 Q725,0 750,12 Q775,24 800,12 Q825,0 850,12 Q875,24 900,12 Q925,0 950,12 Q975,24 1000,12 Q1025,0 1050,12 Q1075,24 1100,12 Q1125,0 1150,12 Q1175,24 1200,12';

  return (
    <Box
      sx={{
        position: 'relative',
        my: 5,
        overflow: 'hidden',
      }}
    >
      {/* Top wave */}
      <Box
        component="svg"
        viewBox="0 0 1200 24"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        sx={{ width: '100%', height: '24px', display: 'block' }}
      >
        <Box
          component="path"
          d={wavePath}
          sx={{
            fill: 'none',
            stroke: (theme) => theme.palette.warning.main,
            strokeWidth: '3',
            strokeLinecap: 'round',
          }}
        />
      </Box>

      {/* Center badge */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 1.5,
          px: 2,
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'warning.light' : 'rgba(237,108,2,0.2)',
          borderLeft: (theme) => `3px solid ${theme.palette.warning.main}`,
          borderRight: (theme) => `3px solid ${theme.palette.warning.main}`,
        }}
      >
        <AutoAwesomeIcon
          sx={{
            fontSize: '1rem',
            color: 'warning.main',
          }}
        />
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: 'warning.dark' }}
        >
          ここから新着記事
          {elapsedTime ? `（${elapsedTime}前に更新）` : ''}
        </Typography>
        <AutoAwesomeIcon
          sx={{
            fontSize: '1rem',
            color: 'warning.main',
          }}
        />
      </Box>

      {/* Bottom wave (flipped) */}
      <Box
        component="svg"
        viewBox="0 0 1200 24"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        sx={{
          width: '100%',
          height: '24px',
          display: 'block',
          transform: 'scaleY(-1)',
        }}
      >
        <Box
          component="path"
          d={wavePath}
          sx={{
            fill: 'none',
            stroke: (theme) => theme.palette.warning.main,
            strokeWidth: '3',
            strokeLinecap: 'round',
          }}
        />
      </Box>
    </Box>
  );
}

const contentSx = {
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
    borderBottom: (theme: { palette: { divider: string } }) =>
      `2px solid ${theme.palette.divider}`,
    pb: 1,
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '""',
      width: '8px',
      height: '1.5em',
      bgcolor: 'secondary.main',
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
  '& ul, & ol': {
    mt: 2,
    mb: 2,
    pl: 4,
  },
  '& li': {
    mb: 1,
    lineHeight: 1.8,
  },
  '& b, & strong': {
    fontWeight: 700,
  },
  '& br': {
    display: 'block',
    content: '""',
    mt: 1,
  },
  '& blockquote': {
    m: 0,
    pl: 3,
    py: 1,
    borderLeft: '4px solid',
    borderColor: 'secondary.main',
    bgcolor: (theme: { palette: { mode: string } }) =>
      theme.palette.mode === 'light' ? 'rgba(255, 153, 0, 0.05)' : 'rgba(255, 153, 0, 0.1)',
    fontStyle: 'italic',
  },
  '& code': {
    px: 1,
    py: 0.5,
    borderRadius: '4px',
    bgcolor: (theme: { palette: { mode: string } }) =>
      theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
    fontSize: '0.9em',
    fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
  },
  '& hr': {
    my: 6,
    border: '0',
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  '& a': {
    color: 'primary.main',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
    '&:hover': { textDecoration: 'underline', color: 'primary.dark' },
  },
};

export default function PostContent({ contentHtml, savedCounter, elapsedTime }: PostContentProps) {
  const splitResult =
    savedCounter !== null && savedCounter !== undefined && savedCounter > 0
      ? splitHtmlAtNthH2(contentHtml, savedCounter)
      : null;

  if (splitResult) {
    return (
      <>
        <Box
          className="markdown-body"
          sx={contentSx}
          dangerouslySetInnerHTML={{ __html: splitResult.before }}
        />
        <WaveUpdateDivider elapsedTime={elapsedTime} />
        <Box
          className="markdown-body"
          sx={{ ...contentSx, mt: 0 }}
          dangerouslySetInnerHTML={{ __html: splitResult.after }}
        />
      </>
    );
  }

  return (
    <Box
      className="markdown-body"
      sx={contentSx}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
