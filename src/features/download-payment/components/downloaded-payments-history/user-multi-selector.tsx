import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import AppAutoComplete, { AppAutocompleteOption } from '../../../../app/components/app-autocomplete';

export interface UserChecked extends AppAutocompleteOption {
  checked: boolean;
  email?: string;
  office?: string;
  amount?: number;
}

interface UserMultiSelectorProps {
  selectedUsers: UserChecked[];
  onSelectedUsersChange: (users: UserChecked[]) => void;
}

function getUniqueUsersFromPaymentsLogs(paymentsLogs: any[]): UserChecked[] {


  
  const userMap: Record<string, UserChecked> = {};


  paymentsLogs.forEach((p) => {
    if (!userMap[p.worker.user._id]) {
      userMap[p.worker.user._id] = {
        _id: p.worker.user._id,
        name: p.worker.user.email || p.worker.user.name || p.worker.user._id,
        email: p.worker.user.email,
        office: p.worker.user.office,
        checked: false,
        amount: 0,
      };
    }
    userMap[p.worker.user._id].amount += p.worker.value;
  });
  return Object.values(userMap);
}

export default function UserMultiSelector({ selectedUsers, onSelectedUsersChange }: UserMultiSelectorProps): JSX.Element {
  const { paymentsLogs } = useAppSelector((state) => state.downloadPaysHistory);
  const allUsers = useMemo(() => getUniqueUsersFromPaymentsLogs(paymentsLogs), [paymentsLogs]);
  const [localSelected, setLocalSelected] = useState<UserChecked[]>(selectedUsers);

  useEffect(() => {
    setLocalSelected(selectedUsers);
  }, [selectedUsers]);

  const handleChange = ({ val }: { name: string; val: AppAutocompleteOption[] }) => {
    const updated = allUsers.map((user) => ({
      ...user,
      checked: val.some((v) => v._id === user._id),
    }));
    setLocalSelected(updated.filter((u) => u.checked));
    onSelectedUsersChange(updated.filter((u) => u.checked));
  };

  return (
    <AppAutoComplete
      multiple
      name="userMultiSelector"
      options={allUsers}
      value={localSelected}
      label="Seleccionar usuarios"
      onChange={handleChange}
    />
  );
} 