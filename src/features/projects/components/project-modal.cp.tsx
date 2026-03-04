import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ProjectInterface, CreateProjectPayload, UpdateProjectPayload } from '../../../app/models/project-interface';
import { createProjectThunk, updateProjectThunk } from '../projects.slice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';

interface ProjectModalRef {
  open: (project?: ProjectInterface) => void;
}

const ProjectModalCP = forwardRef<ProjectModalRef>((props, ref) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.projects);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectInterface | null>(null);

  const handleOpen = (project?: ProjectInterface) => {
    setEditingProject(project || null);
    setName(project?.name || '');
    setLocalError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
    setName('');
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setLocalError('Project name is required');
      return;
    }

    try {
      setLocalError('');

      if (editingProject) {
        await dispatch(updateProjectThunk({
          id: editingProject._id,
          project: { name: name.trim() }
        })).unwrap();
      } else {
        await dispatch(createProjectThunk({ name: name.trim() })).unwrap();
      }

      handleClose();
    } catch (err) {
      setLocalError(editingProject ? 'Failed to update project' : 'Failed to create project');
      console.error('Error saving project:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const displayError = localError || error;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingProject ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <DialogContent>
        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!displayError}
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !name.trim()}
          startIcon={<AddIcon />}
        >
          {editingProject ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ProjectModalCP.displayName = 'ProjectModalCP';

export default ProjectModalCP;
