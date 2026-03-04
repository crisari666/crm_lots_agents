import React from 'react';
import { Box } from '@mui/material';
import ProjectsHeaderCP from '../features/projects/components/projects-header.cp';
import ProjectsListCP from '../features/projects/components/projects-list.cp';

export default function ProjectsView() {
  return (
    <Box sx={{ p: 3 }}>
      <ProjectsHeaderCP />
      <ProjectsListCP />
    </Box>
  );
}
