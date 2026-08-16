'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface PostContentProps {
  contentHtml: string;
  savedCounter?: number | null;
  elapsedTime?: string;
  confirmedThroughCount?: number | null;
}

const createNewBadge = (doc: Document): HTMLSpanElement => {
  const badge = doc.createElement('span');
  badge.className = 'new-entry-badge';
  badge.textContent = 'NEW';
  Object.assign(badge.style, {
    display: 'inline-block',
    background: '#ff9900',
    color: '#232f3e',
    fontSize: '0.6em',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '10px',
    verticalAlign: 'middle',
    letterSpacing: '0.05em',
  });
  return badge;
};

// 前回訪問時点で既に表示されていた記事用の「確認済み」マーカー（緑のチェックマークアイコン）
const createConfirmedBadge = (doc: Document): HTMLSpanElement => {
  const badge = doc.createElement('span');
  badge.className = 'confirmed-entry-badge';
  badge.setAttribute('title', '確認済み');
  badge.setAttribute('aria-label', '確認済み');
  badge.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
  Object.assign(badge.style, {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#2e7d32',
    marginLeft: '10px',
    verticalAlign: 'middle',
  });
  return badge;
};

// 記事（h2）ごとに、先頭から confirmedThroughCount 件目までを確認済み、
// それ以降を NEW としてバッジを埋め込んだ HTML 文字列を返す。
// DOM を直接書き換えるのではなく文字列（＝ React が管理する props）を
// 作り直すことで、再レンダーのたびに同じ結果が確定的に再構築される。
const annotateArticleBadges = (html: string, confirmedThroughCount?: number | null): string => {
  if (confirmedThroughCount === null || confirmedThroughCount === undefined) return html;
  if (typeof window === 'undefined') return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const h2s = Array.from(doc.querySelectorAll('h2'));

  h2s.forEach((h2, index) => {
    h2.appendChild(index < confirmedThroughCount ? createConfirmedBadge(doc) : createNewBadge(doc));
  });

  return doc.body.innerHTML;
};

function splitHtmlAtNthH2(html: string, n: number): { before: string; after: string } | null {
  if (n <= 0) return null;

  const regex = /<h2[^>]*>/gi;
  let count = 0;

  while (regex.exec(html) !== null) {
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
      id="new-content-divider"
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
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
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
    borderBottom: (theme: { palette: { divider: string } }) => `2px solid ${theme.palette.divider}`,
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

export default function PostContent({
  contentHtml,
  savedCounter,
  elapsedTime,
  confirmedThroughCount,
}: PostContentProps) {
  const annotatedHtml = React.useMemo(
    () => annotateArticleBadges(contentHtml, confirmedThroughCount),
    [contentHtml, confirmedThroughCount],
  );

  const splitResult =
    savedCounter !== null && savedCounter !== undefined && savedCounter > 0
      ? splitHtmlAtNthH2(annotatedHtml, savedCounter)
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
      dangerouslySetInnerHTML={{ __html: annotatedHtml }}
    />
  );
}
