import { TableCell, Input, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { numberToCurrency } from "../../../../utils/numbers.utils";

export default function EditableTd({value, onChange, officeId, attr, align = 'left'}: {officeId: string, value: any, attr: string, onChange: (value: any, officeId: string, key: string) => void, align?: 'left' | 'center' | 'right'}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [cellWidth, setCellWidth] = useState(0)
  const cellRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    if (cellRef.current) {
      setCellWidth(cellRef.current.offsetWidth)
    }
  }, [])

  return (
    <TableCell ref={cellRef} sx={{ padding: '4px', width: 'auto', maxWidth: '200px', textAlign: align }}>
      {isEditing ? (
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Input 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log({editValue, officeId, attr});
                
                onChange(editValue, officeId, attr)
                setIsEditing(false)
              } else if (e.key === 'Escape') {
                setEditValue(value)
                setIsEditing(false)
              }
            }}
            onBlur={() => {
              onChange(editValue, officeId, attr)
              setIsEditing(false)
            }}
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
          />
        </div>
      ) : (
        <Typography onClick={() => setIsEditing(true)} sx={{ cursor: 'pointer' }} fontSize={'0.875rem'}>
          {typeof value === 'number' ? numberToCurrency(value, 0) : value}
          </Typography>
      )}
    </TableCell>
  )
}