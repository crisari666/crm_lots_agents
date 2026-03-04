import React, { useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ProjectInterface } from '../../../app/models/project-interface';
import ProjectModalCP from './project-modal.cp';

// Simple event system for component communication
const projectEvents = {
  listeners: new Set<(project?: ProjectInterface) => void>(),
  emit(project?: ProjectInterface) {
    this.listeners.forEach(listener => listener(project));
  },
  subscribe(listener: (project?: ProjectInterface) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

// Export for use in other components
export { projectEvents };

const ProjectsHeaderCP: React.FC = () => {
  const modalRef = useRef<{ open: (project?: ProjectInterface) => void }>(null);

  useEffect(() => {
    const unsubscribe = projectEvents.subscribe((project) => {
      modalRef.current?.open(project);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddProject = () => {
    modalRef.current?.open();
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProject}
        >
          Add Project
        </Button>
      </Box>
      
      <ProjectModalCP ref={modalRef} />
    </>
  );
};

export default ProjectsHeaderCP;
