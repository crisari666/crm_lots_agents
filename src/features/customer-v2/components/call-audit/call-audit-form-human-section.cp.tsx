import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditConfigResponse } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditFormHumanSectionCPProps = {
  config: CallAuditConfigResponse | null
  humanChecks: Record<string, boolean>
  onHumanCheckChange: (key: string, passed: boolean) => void
  interestScore: number
  onInterestScoreChange: (score: number) => void
  reviewerNotes: string
  onReviewerNotesChange: (notes: string) => void
  scoreOptions: number[]
  readOnly?: boolean
}

export default function CallAuditFormHumanSectionCP({
  config,
  humanChecks,
  onHumanCheckChange,
  interestScore,
  onInterestScoreChange,
  reviewerNotes,
  onReviewerNotesChange,
  scoreOptions,
  readOnly = false,
}: CallAuditFormHumanSectionCPProps) {
  const indicators = config?.indicators ?? []
  return (
    <Box sx={readOnly ? { bgcolor: "action.disabledBackground", borderRadius: 1, p: 1 } : undefined}>
      <Typography variant="subtitle2" gutterBottom>
        {s.humanSection}
      </Typography>
      <FormGroup>
        {indicators.map((ind) => (
          <FormControlLabel
            key={ind.key}
            control={
              <Checkbox
                checked={humanChecks[ind.key] === true}
                disabled={readOnly}
                onChange={(e) => onHumanCheckChange(ind.key, e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="body2">{ind.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {ind.description}
                </Typography>
              </Box>
            }
          />
        ))}
      </FormGroup>
      <FormControl fullWidth size="small" sx={{ mt: 2 }} disabled={readOnly}>
        <InputLabel id="call-audit-interest">{s.interestScore}</InputLabel>
        <Select
          labelId="call-audit-interest"
          label={s.interestScore}
          value={interestScore}
          onChange={(e) => onInterestScoreChange(Number(e.target.value))}
        >
          {scoreOptions.map((score) => (
            <MenuItem key={score} value={score}>
              {score}
              {config?.interestScore.labels[score] ? ` — ${config.interestScore.labels[score]}` : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={s.notes}
        multiline
        minRows={3}
        fullWidth
        size="small"
        sx={{ mt: 2 }}
        value={reviewerNotes}
        disabled={readOnly}
        onChange={(e) => onReviewerNotesChange(e.target.value)}
      />
    </Box>
  )
}
