import { FormEvent, useEffect, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { pushAlertAction } from '../../dashboard/dashboard.slice'
import { mergeCurrentUserProfileAct } from '../../signin/signin.slice'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'
import { patchOwnProfileThunk } from '../slice/user-profile.slice'

export default function ProfileAccountForm() {
  const dispatch = useAppDispatch()
  const { profile, savingProfile } = useAppSelector(
    (state: RootState) => state.userProfile,
  )
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  useEffect(() => {
    if (profile == null) {
      return
    }
    setName(profile.name)
    setLastName(profile.lastName)
    setPhone(profile.phone)
  }, [profile])
  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      await dispatch(
        patchOwnProfileThunk({ name: name.trim(), lastName: lastName.trim(), phone: phone.trim() }),
      ).unwrap()
      dispatch(
        mergeCurrentUserProfileAct({
          name: name.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
        }),
      )
      dispatch(
        pushAlertAction({ title: s.successTitle, message: s.profileUpdated }),
      )
    } catch (err) {
      dispatch(
        pushAlertAction({
          title: s.errorTitle,
          message: err instanceof Error ? err.message : s.apiProfileSaveFailed,
        }),
      )
    }
  }
  return (
    <Box component="form" onSubmit={(e) => void onSubmit(e)} sx={{ maxWidth: 480 }}>
      <Typography variant="h6" gutterBottom>
        {s.accountSectionTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.accountSectionSubtitle}
      </Typography>
      <TextField
        fullWidth
        required
        label={s.fieldName}
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
      />
      <TextField
        fullWidth
        required
        label={s.fieldLastName}
        margin="normal"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        autoComplete="family-name"
      />
      <TextField
        fullWidth
        label={s.fieldPhone}
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={savingProfile}
        sx={{ mt: 2, cursor: 'pointer' }}
      >
        {savingProfile ? s.saving : s.saveProfile}
      </Button>
    </Box>
  )
}
