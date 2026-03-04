import { useState, KeyboardEvent } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { Edit, Check, Close } from '@mui/icons-material';

interface EditableSalaryInputProps {
  value: number;
  onValueChange: (value: number) => void;
}

export default function EditableSalaryInput({ value, onValueChange }: EditableSalaryInputProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<number>(value);

  const handleEditClick = (): void => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleAcceptClick = (): void => {
    onValueChange(editValue);
    setIsEditing(false);
  };

  const handleCancelClick = (): void => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      handleCancelClick();
    } else if (event.key === 'Enter') {
      handleAcceptClick();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = Number(event.target.value);
    setEditValue(newValue);
  };

  return (
    <Grid container spacing={2} alignItems="center" style={{ marginBottom: 16 }}>
      <Grid item>
        {isEditing ? (
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={handleAcceptClick}
              >
                <Check />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelClick}
              >
                <Close />
              </Button>
            </Grid>
            <Grid item>

              <TextField
                type="number"
                value={editValue}
                label="Salary value"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                size="small"
                style={{ width: 120 }}
                inputProps={{ min: 0 }}
                autoFocus
              />
            </Grid>
            
          </Grid>
        ) : (
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleEditClick}
              > 
                <Edit />
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ minWidth: 120, padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }}>
                {value}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
} 