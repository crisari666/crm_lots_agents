import { TableCell, Input, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { numberToCurrency } from "../../../../utils/numbers.utils";

interface EditableRentTdProps {
  value: number;
  officeId: string;
  onRentChange: (rent: number, officeId: string) => void;
  align?: 'left' | 'center' | 'right';
}

export default function EditableRentTd({ value, officeId, onRentChange, align = 'right' }: EditableRentTdProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [cellWidth, setCellWidth] = useState(0);
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (cellRef.current) {
      setCellWidth(cellRef.current.offsetWidth);
    }
  }, []);

  const handleSave = () => {
    const numericValue = parseFloat(editValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onRentChange(numericValue, officeId);
      setIsEditing(false);
    } else {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  return (
    <TableCell ref={cellRef} sx={{ padding: '4px', width: 'auto', maxWidth: '150px', textAlign: align }}>
      {isEditing ? (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Input 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onBlur={handleSave}
            sx={{
              width: '100%',
              textAlign: align,
              minWidth: '80px',
              maxWidth: `${cellWidth - 2}px`,
              padding: '2px 4px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              '& .MuiInput-input': {
                padding: '2px 4px',
                width: '100%',
                boxSizing: 'border-box',
              },
              '&:hover': {
                border: '1px solid #999',
              },
              '&.Mui-focused': {
                border: '1px solid #1976d2',
              }
            }}
            size="small"
            autoFocus
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
          />
        </div>
      ) : (
        <Typography 
          onClick={() => setIsEditing(true)} 
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }} 
          fontSize={'0.875rem'}
        >
          {numberToCurrency(value, 0)}
        </Typography>
      )}
    </TableCell>
  );
} 