import { FormEvent, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { pushAlertAction } from '../../dashboard/dashboard.slice'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'
import { changeOwnPasswordThunk } from '../slice/user-profile.slice'

export default function ProfilePasswordForm() {
  const dispatch = useAppDispatch()
  const { savingPassword } = useAppSelector((state: RootState) => state.userProfile)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (newPassword.length < 8) {
      dispatch(
        pushAlertAction({ title: s.errorTitle, message: s.passwordMinError }),
      )
      return
    }
    if (newPassword !== confirmPassword) {
      dispatch(
        pushAlertAction({ title: s.errorTitle, message: s.passwordMismatch }),
      )
      return
    }
    try {
      await dispatch(
        changeOwnPasswordThunk({ currentPassword, newPassword }),
      ).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      dispatch(
        pushAlertAction({ title: s.successTitle, message: s.passwordUpdated }),
      )
    } catch (err) {
      dispatch(
        pushAlertAction({
          title: s.errorTitle,
          message: err instanceof Error ? err.message : s.apiPasswordUpdateFailed,
        }),
      )
    }
  }
  return (
    <Box
      component="form"
      onSubmit={(e) => void onSubmit(e)}
      sx={{ maxWidth: 480 }}
    >
      <Typography variant="h6" gutterBottom>
        {s.passwordSectionTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.passwordSectionSubtitle}
      </Typography>
      <TextField
        fullWidth
        required
        type={showCurrent ? 'text' : 'password'}
        label={s.currentPassword}
        margin="normal"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowCurrent((v) => !v)} edge="end">
                {showCurrent ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        required
        type={showNew ? 'text' : 'password'}
        label={s.newPassword}
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowNew((v) => !v)} edge="end">
                {showNew ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        required
        type={showConfirm ? 'text' : 'password'}
        label={s.confirmPassword}
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={savingPassword}
        sx={{ mt: 2, cursor: 'pointer' }}
      >
        {savingPassword ? s.saving : s.changePassword}
      </Button>
    </Box>
  )
}
