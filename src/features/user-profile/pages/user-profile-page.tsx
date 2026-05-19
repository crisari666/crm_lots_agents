import { Box, Typography } from '@mui/material'
import ProfileTabsPanel from '../components/profile-tabs-panel'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'

export default function UserProfilePage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {s.pageTitle}
      </Typography>
      <ProfileTabsPanel />
    </Box>
  )
}
