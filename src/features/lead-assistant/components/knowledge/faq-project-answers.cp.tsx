import { Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import { patchProjectAnswerAct } from "../../slice/lead-assistant-faq.slice"

/** One answer field per project; empty means "use the general answer". */
export default function FaqProjectAnswersCP() {
  const dispatch = useAppDispatch()
  const projects = useLeadAssistantProjects()
  const answers = useAppSelector((state) => state.leadAssistant.faq.draft.projectAnswers)
  if (projects.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.coverageNoProjects}
      </Typography>
    )
  }
  return (
    <Stack spacing={1.5}>
      {projects.map((project) => (
        <TextField
          key={project.id}
          id={`lead-assistant-faq-project-${project.id}`}
          label={s.faqProjectAnswerLabel(project.title)}
          helperText={s.faqProjectAnswerHelper}
          value={answers[project.id] ?? ""}
          onChange={(event) =>
            dispatch(patchProjectAnswerAct({ projectId: project.id, answer: event.target.value }))
          }
          multiline
          minRows={2}
          fullWidth
        />
      ))}
    </Stack>
  )
}
