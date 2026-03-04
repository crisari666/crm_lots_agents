import { Box, Input, Popover } from "@mui/material";
import { useState } from "react";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { dateToInputDate } from "../../utils/date.utils";

export default function AppDateRangeSelector({dateStart, dateEnd, onChange = () =>{}, id = ""}: {
    dateStart: Date, 
    dateEnd: Date, 
    id: string,
    onChange?: ({dateEnd, dateStart} :{dateStart: Date, dateEnd: Date}) => void}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <DateRange
          ranges={[{
            startDate: dateStart,
            endDate: dateEnd,
            key: 'selection'
          }]}
          retainEndDateOnFirstSelection={true}
          onChange={(date) => {
            const {selection} = date
            //console.log({selection});
            
            onChange({
              dateEnd: selection.endDate!,
              dateStart: selection.startDate!,
            })
          }}
        />
      </Popover>
      <Box aria-describedby={id} onClick={handleClick} sx={{width: '100%', display: 'flex'}}>
        <Input size="small" style={{color: 'grey'}}  readOnly placeholder="desde" fullWidth value={dateToInputDate(dateStart.toISOString())} sx={{marginRight: 1}}/>
        <Input size="small" style={{color: 'grey'}}  readOnly placeholder="hasta" fullWidth value={dateToInputDate(dateEnd.toISOString())}/>
      </Box>

    </>
  )
}