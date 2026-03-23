'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface NavButtonProps {
  href: string | null | undefined;
  direction: 'prev' | 'next';
}

export default function NavButton({ href, direction }: NavButtonProps) {
  if (!href) return null;

  return (
    <Link href={href} passHref style={{ textDecoration: 'none' }}>
      <Button
        component="span"
        startIcon={direction === 'prev' ? <ArrowBackIcon /> : undefined}
        endIcon={direction === 'next' ? <ArrowForwardIcon /> : undefined}
        variant="contained"
        sx={{
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: '8px',
          boxShadow: (theme) =>
            `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.24)'}`,
          '&:hover': {
            boxShadow: (theme) =>
              `0 6px 16px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.28)'}`,
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        {direction === 'prev' ? '前日' : '翌日'}
      </Button>
    </Link>
  );
}
