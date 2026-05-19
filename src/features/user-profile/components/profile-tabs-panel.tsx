import { ReactNode, SyntheticEvent, useEffect, useState } from 'react'
import { Box, CircularProgress, Paper, Tab, Tabs, Typography } from '@mui/material'
import { Person, Email, Lock } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'
import { fetchOwnProfileThunk } from '../slice/user-profile.slice'
import ProfileAccountForm from './profile-account-form'
import ProfileEmailSection from './profile-email-section'
import ProfilePasswordForm from './profile-password-form'

type ProfileTabPanelProps = {
  children: ReactNode
  index: number
  value: number
}

function ProfileTabPanel({ children, index, value }: ProfileTabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: { xs: 2, md: 0 }, px: { xs: 0, md: 1 } }}>{children}</Box>
      )}
    </div>
  )
}


export default function ProfileTabsPanel() {
  const dispatch = useAppDispatch()
  const { loading, profile } = useAppSelector((state: RootState) => state.userProfile)
  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    void dispatch(fetchOwnProfileThunk())
  }, [dispatch])
  const handleTabChange = (_event: SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue)
  }
  if (loading && profile == null) {
    return (
      <Box display="flex" alignItems="center" gap={1.5} py={4} justifyContent="center">
        <CircularProgress size={24} />
        <Typography color="text.secondary">{s.loading}</Typography>
      </Box>
    )
  }
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: 360,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={activeTab}
        onChange={handleTabChange}
        aria-label={s.tabsAriaLabel}
        sx={{
          borderRight: { md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: 'divider',
          bgcolor: 'grey.50',
          minWidth: { xs: '100%', md: 220 },
          flexShrink: 0,
          '& .MuiTab-root': {
            alignItems: 'flex-start',
            textAlign: 'left',
            minHeight: 48,
            textTransform: 'none',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
          },
          '& .Mui-selected': {
            bgcolor: 'background.paper',
          },
        }}
      >
        <Tab
          id="profile-tab-0"
          icon={<Person fontSize="small" />}
          iconPosition="start"
          label={s.tabPersonalData}
          sx={{ cursor: 'pointer' }}
        />
        <Tab
          id="profile-tab-1"
          icon={<Email fontSize="small" />}
          iconPosition="start"
          label={s.tabEmail}
          sx={{ cursor: 'pointer' }}
        />
        <Tab
          id="profile-tab-2"
          icon={<Lock fontSize="small" />}
          iconPosition="start"
          label={s.tabPassword}
          sx={{ cursor: 'pointer' }}
        />
      </Tabs>
      <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, minWidth: 0, bgcolor: 'background.paper' }}>
        <ProfileTabPanel value={activeTab} index={0}>
          <ProfileAccountForm />
        </ProfileTabPanel>
        <ProfileTabPanel value={activeTab} index={1}>
          <ProfileEmailSection />
        </ProfileTabPanel>
        <ProfileTabPanel value={activeTab} index={2}>
          <ProfilePasswordForm />
        </ProfileTabPanel>
      </Box>
    </Paper>
  )
}
