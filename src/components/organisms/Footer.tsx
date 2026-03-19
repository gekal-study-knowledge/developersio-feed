import * as React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          このサイトはクラスメソッド株式会社の「DevelopersIO」のRSSフィードを元に作成されています。
        </Typography>
      </Container>
    </Box>
  );
}
