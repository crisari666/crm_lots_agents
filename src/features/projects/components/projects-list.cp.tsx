import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ProjectInterface } from '../../../app/models/project-interface';
import { fetchProjectsThunk } from '../projects.slice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { projectEvents } from './projects-header.cp';

const ProjectsListCP: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useAppSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchProjectsThunk());
  }, [dispatch]);

  const handleEditProject = (project: ProjectInterface) => {
    projectEvents.emit(project);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {project.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.isActive ? 'Active' : 'Inactive'}
                    color={project.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
                <TableCell>{formatDate(project.updatedAt)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleEditProject(project)}
                    disabled={isLoading}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No projects found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProjectsListCP;
