import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { getPostData, getAllPostSlugs } from '@/lib/posts';

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const fileNames = fs.readdirSync(path.join(process.cwd(), '_posts'));
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

import fs from 'fs';
import path from 'path';

export const dynamicParams = false;

export default async function Post({ params }: PostProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            component="a"
            href="/"
            startIcon={<HomeIcon />}
            variant="outlined"
          >
            Home
          </Button>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom color="primary">
          {postData.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          {postData.date} {postData.last_updated && `(最終更新: ${postData.last_updated})`}
        </Typography>

        <Box
          sx={{
            mt: 4,
            mb: 6,
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px' },
            '& h2': { mt: 4, mb: 2, color: 'primary.main', borderBottom: '1px solid #eee', pb: 1 },
            '& hr': { my: 4, border: '0', borderTop: '1px solid #eee' },
            '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
          }}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          {postData.previous ? (
            <Button
              component="a"
              href={`/posts/${postData.previous}`}
              startIcon={<ArrowBackIcon />}
              variant="contained"
            >
              前日
            </Button>
          ) : (
            <Box />
          )}
          {postData.next ? (
            <Button
              component="a"
              href={`/posts/${postData.next}`}
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
  );
}
