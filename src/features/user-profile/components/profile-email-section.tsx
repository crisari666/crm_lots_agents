import { FormEvent, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { pushAlertAction } from '../../dashboard/dashboard.slice'
import { mergeCurrentUserProfileAct } from '../../signin/signin.slice'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'
import {
  confirmEmailChangeThunk,
  fetchOwnProfileThunk,
  requestEmailChangeThunk,
} from '../slice/user-profile.slice'

const OTP_LENGTH = 6

export default function ProfileEmailSection() {
  const dispatch = useAppDispatch()
  const { profile, requestingEmailCode, confirmingEmail } = useAppSelector(
    (state: RootState) => state.userProfile,
  )
  const [newEmail, setNewEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailStepIdle, setEmailStepIdle] = useState(true)
  const onRequestCode = async (): Promise<void> => {
    const trimmed = newEmail.trim()
    if (trimmed.length < 3) {
      dispatch(
        pushAlertAction({ title: s.errorTitle, message: s.emailInvalid }),
      )
      return
    }
    try {
      await dispatch(requestEmailChangeThunk(trimmed)).unwrap()
      setEmailStepIdle(false)
      setEmailCode('')
      dispatch(pushAlertAction({ title: s.successTitle, message: s.codeSent }))
    } catch (err) {
      dispatch(
        pushAlertAction({
          title: s.errorTitle,
          message: err instanceof Error ? err.message : s.apiVerificationSendFailed,
        }),
      )
    }
  }
  const onConfirmEmail = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmed = newEmail.trim()
    if (emailCode.trim().length !== OTP_LENGTH) {
      dispatch(
        pushAlertAction({ title: s.errorTitle, message: s.codeLengthError }),
      )
      return
    }
    try {
      await dispatch(
        confirmEmailChangeThunk({ newEmail: trimmed, code: emailCode.trim() }),
      ).unwrap()
      dispatch(mergeCurrentUserProfileAct({ email: trimmed }))
      await dispatch(fetchOwnProfileThunk()).unwrap()
      setNewEmail('')
      setEmailCode('')
      setEmailStepIdle(true)
      dispatch(pushAlertAction({ title: s.successTitle, message: s.emailUpdated }))
    } catch (err) {
      dispatch(
        pushAlertAction({
          title: s.errorTitle,
          message: err instanceof Error ? err.message : s.apiEmailConfirmFailed,
        }),
      )
    }
  }
  return (
    <Box
      component="form"
      onSubmit={(e) => void onConfirmEmail(e)}
      sx={{ maxWidth: 480 }}
    >
      <Typography variant="h6" gutterBottom>
        {s.emailSectionTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {s.emailSectionSubtitle}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {s.currentEmail}
      </Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
        {profile?.email ?? '—'}
      </Typography>
      <TextField
        fullWidth
        type="email"
        label={s.newEmail}
        placeholder={s.newEmailPlaceholder}
        margin="normal"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        autoComplete="email"
      />
      <Button
        type="button"
        variant="outlined"
        disabled={requestingEmailCode || newEmail.trim().length < 3}
        onClick={() => void onRequestCode()}
        sx={{ mt: 1, mr: 1, cursor: 'pointer' }}
      >
        {requestingEmailCode ? s.sending : s.sendVerificationCode}
      </Button>
      {!emailStepIdle && (
        <>
          <TextField
            fullWidth
            label={s.emailCodeLabel}
            margin="normal"
            inputProps={{ maxLength: OTP_LENGTH, inputMode: 'numeric' }}
            value={emailCode}
            onChange={(e) =>
              setEmailCode(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))
            }
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={confirmingEmail || emailCode.length !== OTP_LENGTH}
              sx={{ cursor: 'pointer' }}
            >
              {confirmingEmail ? s.saving : s.confirmEmail}
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => {
                setEmailStepIdle(true)
                setEmailCode('')
              }}
              sx={{ cursor: 'pointer' }}
            >
              {s.cancel}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
