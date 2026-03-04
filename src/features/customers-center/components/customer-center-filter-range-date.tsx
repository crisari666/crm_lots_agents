import { Box, Input, Popover } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { DateRange } from "react-date-range";
import { dateToInputDate } from "../../../utils/date.utils";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { changeDateFilterAct } from "../customer-center.slice";


export default function CustomerCenterFilterRangeDate() {
  const dispatch = useAppDispatch()
  const { dateEnd, dateStart } = useAppSelector((state) => state.customerCenter.filter)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const id = 'dateranger'
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
          onChange={(date) => {
            const {selection} = date
            //console.log({selection});
            dispatch(changeDateFilterAct({dateStart: selection.startDate!, dateEnd: selection.endDate!}))
          }}
        />
      </Popover>
      <Box aria-describedby={id} onClick={handleClick} component={'button'} sx={{width: '100%', display: 'flex'}}>
        <Input style={{color: 'grey'}}  readOnly placeholder="desde" fullWidth value={dateToInputDate(dateStart.toISOString())} sx={{marginRight: 1}}/>
        <Input style={{color: 'grey'}}  readOnly placeholder="hasta" fullWidth value={dateToInputDate(dateEnd.toISOString())}/>
      </Box>

    </>
  )
}