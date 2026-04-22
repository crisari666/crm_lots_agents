import { Stack, Typography } from "@mui/material"
import { useAppSelector } from "../app/hooks"
import CeoOperationsSummaryCP from "../features/ceo-operations-summary/components/ceo-operations-summary.cp"
// import StepsGraph from "../features/statistics/components/step-graph"

export default function DashboardContent() {
  const { currentUser } = useAppSelector((state) => state.login)
  const showCeoSummary = currentUser !== undefined && (currentUser.level === 0 || currentUser.level === 1)
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        Dashboard
      </Typography>
      {showCeoSummary && <CeoOperationsSummaryCP />}
      {/* {currentUser?.level === 0 && <StepsGraph />} */}
    </Stack>
  )
}
