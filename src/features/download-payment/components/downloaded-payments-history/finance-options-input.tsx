import { Dispatch, SetStateAction } from 'react';
import EditableSalaryInput from './editable-salary-input';
import UserMultiSelector, { UserChecked } from './user-multi-selector';
import Grid from '@mui/material/Grid';

interface FinanceOptionsInputProps {
  salaryValue: number;
  setSalaryValue: Dispatch<SetStateAction<number>>;
  selectedUsers: UserChecked[];
  onSelectedUsersChange: (users: UserChecked[]) => void;
}

export default function FinanceOptionsInput({ salaryValue, setSalaryValue, selectedUsers, onSelectedUsersChange }: FinanceOptionsInputProps): JSX.Element {
  return (
    <Grid container alignItems="start" spacing={1}> 
      <Grid item>
        <EditableSalaryInput value={salaryValue} onValueChange={setSalaryValue} />
      </Grid>
      <Grid item xs={8}>
        <UserMultiSelector selectedUsers={selectedUsers} onSelectedUsersChange={onSelectedUsersChange} /> 
      </Grid>
    </Grid>
  );
}  