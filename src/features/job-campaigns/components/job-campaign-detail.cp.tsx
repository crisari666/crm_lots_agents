import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type {
  JobCampaignAdminItem,
  JobCampaignCandidateItem,
  JobCampaignInterviewItem,
} from "../types/job-campaign.types"
import { JobCampaignCandidateProfileCp } from "./job-campaign-candidate-profile.cp"
import { JobCandidateScoreChipCp } from "./job-candidate-score-chip.cp"
import { JobCandidateSortToggleCp } from "./job-candidate-sort-toggle.cp"

type Props = {
  readonly campaign: JobCampaignAdminItem
  readonly tab: number
  readonly onTabChange: (tab: number) => void
  readonly candidates: readonly JobCampaignCandidateItem[]
  readonly selectedCandidate: JobCampaignCandidateItem | null
  readonly onSelectCandidate: (id: string) => void
  readonly onAddCandidate: (input: {
    readonly name: string
    readonly phone: string
    readonly email: string
  }) => void
  readonly onEditCandidate: (input: {
    readonly name: string
    readonly phone: string
    readonly email: string
  }) => void
  readonly onPromote: () => void
  readonly onReject: () => void
  readonly onRetryVoice: () => void
  readonly onStartWhatsapp: () => void
  readonly onAssignInterview: () => void
  readonly interviews: readonly JobCampaignInterviewItem[]
  readonly onCreateInterview: (input: {
    readonly scheduledAt: string
    readonly title: string
  }) => void
  readonly onCancelInterview: (id: string) => void
}

export function JobCampaignDetailCp(props: Props) {
  const [interviewOpen, setInterviewOpen] = useState(false)
  const [scheduledAt, setScheduledAt] = useState("")
  const [title, setTitle] = useState("")
  const [candidateOpen, setCandidateOpen] = useState(false)
  const [editCandidateOpen, setEditCandidateOpen] = useState(false)
  const [candidateName, setCandidateName] = useState("")
  const [candidatePhone, setCandidatePhone] = useState("")
  const [candidateEmail, setCandidateEmail] = useState("")
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editEmail, setEditEmail] = useState("")

  const conversation = useMemo(
    () => props.selectedCandidate?.conversationLog ?? [],
    [props.selectedCandidate],
  )

  const canSubmitCandidate =
    candidateName.trim().length > 0 && candidatePhone.trim().length > 0
  const canSubmitEdit =
    editName.trim().length > 0 && editPhone.trim().length > 0

  const resetCandidateForm = (): void => {
    setCandidateName("")
    setCandidatePhone("")
    setCandidateEmail("")
  }

  const openEditCandidate = (): void => {
    const selected = props.selectedCandidate
    if (selected == null) return
    const fullName = `${selected.name} ${selected.lastName}`.trim()
    setEditName(fullName)
    setEditPhone(selected.phone)
    setEditEmail(selected.email)
    setEditCandidateOpen(true)
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" mb={1}>
        {props.campaign.name}
        {props.campaign.isActive ? (
          <Chip
            size="small"
            color="success"
            label={s.activeBadge}
            sx={{ ml: 1 }}
          />
        ) : null}
      </Typography>
      <Tabs
        value={props.tab}
        onChange={(_, v: number) => props.onTabChange(v)}
        sx={{ mb: 2 }}
      >
        <Tab label={s.tabLeads} />
        <Tab label={s.tabConversation} />
        <Tab label={s.tabInterviews} />
      </Tabs>

      {props.tab === 0 ? (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="flex-start"
        >
        <Stack
          spacing={1}
          sx={{
            width: { xs: "100%", md: 380 },
            flexShrink: 0,
            maxHeight: { md: "70vh" },
            overflowY: { md: "auto" },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
          >
            <Button variant="outlined" onClick={() => setCandidateOpen(true)}>
              {s.addCandidate}
            </Button>
            <JobCandidateSortToggleCp />
          </Stack>
          {props.candidates.length === 0 ? (
            <Typography color="text.secondary">{s.candidatesEmpty}</Typography>
          ) : (
            props.candidates.map((c) => (
              <Box
                key={c.id}
                onClick={() => props.onSelectCandidate(c.id)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor:
                    props.selectedCandidate?.id === c.id
                      ? "primary.main"
                      : "divider",
                  cursor: "pointer",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {c.name} {c.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.phone} · {c.email}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <JobCandidateScoreChipCp candidate={c} />
                    <Chip size="small" label={c.status} />
                  </Stack>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          {props.selectedCandidate == null ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              {s.selectCandidateHint}
            </Typography>
          ) : null}
          {props.selectedCandidate != null ? (
            <Box mb={1}>
              <Typography variant="h6" fontWeight={700}>
                {props.selectedCandidate.name} {props.selectedCandidate.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {props.selectedCandidate.phone} · {props.selectedCandidate.email}
              </Typography>
            </Box>
          ) : null}
          {props.selectedCandidate != null ? (
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
              <Button variant="outlined" onClick={openEditCandidate}>
                {s.editCandidate}
              </Button>
              <Button variant="contained" onClick={props.onRetryVoice}>
                {s.retryVoice}
              </Button>
              <Button variant="outlined" onClick={props.onStartWhatsapp}>
                {s.startWhatsapp}
              </Button>
              <Button variant="outlined" onClick={props.onPromote}>
                {s.promote}
              </Button>
              <Button color="warning" onClick={props.onReject}>
                {s.reject}
              </Button>
              <Button onClick={props.onAssignInterview}>
                {s.assignInterview}
              </Button>
            </Stack>
          ) : null}
          {props.selectedCandidate != null ? (
            <JobCampaignCandidateProfileCp candidate={props.selectedCandidate} />
          ) : null}
        </Box>
        </Stack>
      ) : null}

      {props.tab === 1 ? (
        <Stack spacing={1} sx={{ maxHeight: 420, overflow: "auto" }}>
          {conversation.length === 0 ? (
            <Typography color="text.secondary">{s.conversationEmpty}</Typography>
          ) : (
            conversation.map((turn, idx) => (
              <Box
                key={`${turn.at}-${idx}`}
                sx={{
                  alignSelf:
                    turn.role === "user" ? "flex-start" : "flex-end",
                  bgcolor: turn.role === "user" ? "grey.100" : "primary.50",
                  p: 1.25,
                  borderRadius: 1,
                  maxWidth: "85%",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {turn.role} · {new Date(turn.at).toLocaleString()}
                </Typography>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {turn.text}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      ) : null}

      {props.tab === 2 ? (
        <Stack spacing={1}>
          <Button
            variant="outlined"
            onClick={() => setInterviewOpen(true)}
            sx={{ alignSelf: "flex-start" }}
          >
            {s.newInterview}
          </Button>
          {props.interviews.length === 0 ? (
            <Typography color="text.secondary">{s.interviewsEmpty}</Typography>
          ) : (
            props.interviews.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {item.title || "Entrevista"}
                      {item.isNext ? (
                        <Chip
                          size="small"
                          color="info"
                          label={s.nextInterview}
                          sx={{ ml: 1 }}
                        />
                      ) : null}
                    </Typography>
                    <Typography variant="body2">
                      {s.scheduledAt}:{" "}
                      {new Date(item.scheduledAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      {s.status}: {item.status}
                    </Typography>
                    {item.googleMeetUrl.length > 0 ? (
                      <Typography variant="body2">
                        {s.meetLink}:{" "}
                        <a
                          href={item.googleMeetUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.googleMeetUrl}
                        </a>
                      </Typography>
                    ) : null}
                  </Box>
                  {item.status === "available" ? (
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => props.onCancelInterview(item.id)}
                    >
                      {s.cancelInterview}
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      ) : null}

      <Dialog
        open={interviewOpen}
        onClose={() => setInterviewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{s.newInterview}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={s.scheduledAt}
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label={s.interviewTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterviewOpen(false)}>{s.cancel}</Button>
          <Button
            variant="contained"
            disabled={scheduledAt.trim().length === 0}
            onClick={() => {
              props.onCreateInterview({
                scheduledAt: new Date(scheduledAt).toISOString(),
                title: title.trim(),
              })
              setInterviewOpen(false)
              setScheduledAt("")
              setTitle("")
            }}
          >
            {s.create}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={candidateOpen}
        onClose={() => {
          setCandidateOpen(false)
          resetCandidateForm()
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{s.addCandidateTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={s.fieldCandidateName}
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label={s.fieldCandidatePhone}
              value={candidatePhone}
              onChange={(e) => setCandidatePhone(e.target.value)}
              fullWidth
              required
              placeholder="57300…"
            />
            <TextField
              label={s.fieldCandidateEmail}
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCandidateOpen(false)
              resetCandidateForm()
            }}
          >
            {s.cancel}
          </Button>
          <Button
            variant="contained"
            disabled={!canSubmitCandidate}
            onClick={() => {
              props.onAddCandidate({
                name: candidateName.trim(),
                phone: candidatePhone.trim(),
                email: candidateEmail.trim(),
              })
              setCandidateOpen(false)
              resetCandidateForm()
            }}
          >
            {s.create}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editCandidateOpen}
        onClose={() => setEditCandidateOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{s.editCandidateTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={s.fieldCandidateName}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label={s.fieldCandidatePhone}
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              fullWidth
              required
              placeholder="57300…"
            />
            <TextField
              label={s.fieldCandidateEmail}
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCandidateOpen(false)}>{s.cancel}</Button>
          <Button
            variant="contained"
            disabled={!canSubmitEdit}
            onClick={() => {
              props.onEditCandidate({
                name: editName.trim(),
                phone: editPhone.trim(),
                email: editEmail.trim(),
              })
              setEditCandidateOpen(false)
            }}
          >
            {s.save}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
