import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { fetchProjectsThunk } from "../../project/slice/projects.slice"
import type { ProjectType } from "../../project/types/project.types"
import {
  closeAdPanelAct,
  patchAdDraftAct,
  saveMetaLeadAdCampaignThunk,
} from "../slice/meta-lead-forms.slice"

export default function MetaLeadAdEditorPanelCP() {
  const dispatch = useAppDispatch()
  const panelOpen = useAppSelector((state) => state.metaLeadForms.adPanelOpen)
  const editingId = useAppSelector((state) => state.metaLeadForms.adEditingId)
  const draft = useAppSelector((state) => state.metaLeadForms.adDraft)
  const saving = useAppSelector((state) => state.metaLeadForms.adSaving)
  const projects = useAppSelector((state) => state.projects.projects)
  const projectsLoaded = projects.length > 0

  useEffect(() => {
    if (panelOpen && !projectsLoaded) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, panelOpen, projectsLoaded])

  const enabledProjects = useMemo(
    () => projects.filter((project) => project.enabled !== false && project.deleted !== true),
    [projects],
  )

  const selectedProject =
    enabledProjects.find((project) => project._id === draft.projectId) ?? null

  const canSave =
    draft.campaignId.trim().length > 0 &&
    draft.campaignName.trim().length > 0 &&
    draft.projectId.trim().length > 0

  return (
    <Drawer
      anchor="right"
      open={panelOpen}
      onClose={() => dispatch(closeAdPanelAct())}
      PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, p: 3 } }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {editingId != null ? s.editAd : s.addAd}
      </Typography>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField
          label={s.adCampaignName}
          value={draft.campaignName}
          onChange={(event) => dispatch(patchAdDraftAct({ campaignName: event.target.value }))}
          fullWidth
          required
        />
        <TextField
          label={s.adCampaignId}
          helperText={s.adCampaignIdHint}
          value={draft.campaignId}
          onChange={(event) => dispatch(patchAdDraftAct({ campaignId: event.target.value }))}
          fullWidth
          required
          inputProps={{
            style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
          }}
        />
        <Autocomplete
          options={enabledProjects}
          value={selectedProject}
          onChange={(_, value: ProjectType | null) =>
            dispatch(
              patchAdDraftAct({
                projectId: value?._id ?? "",
                projectTitle: value?.title ?? "",
              }),
            )
          }
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(a, b) => a._id === b._id}
          renderInput={(params) => (
            <TextField {...params} label={s.adProject} helperText={s.adProjectHint} required />
          )}
        />
        {draft.previewAds.length > 0 ? (
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {s.adsUnderCampaign}
            </Typography>
            <Stack spacing={0.75} sx={{ mt: 1, pl: 1.5, borderLeft: 2, borderColor: "divider" }}>
              {draft.previewAds.map((ad) => (
                <Box key={ad.adId}>
                  <Typography variant="body2" noWrap>
                    {ad.adName.length > 0 ? ad.adName : ad.adId}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                  >
                    {ad.adId}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}
        <TextField
          label={s.adName}
          value={draft.adName}
          onChange={(event) => dispatch(patchAdDraftAct({ adName: event.target.value }))}
          fullWidth
        />
        <TextField
          label={s.adId}
          helperText={s.adIdHint}
          value={draft.adId}
          onChange={(event) => dispatch(patchAdDraftAct({ adId: event.target.value }))}
          fullWidth
          inputProps={{
            style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.enabled}
              onChange={(_, checked) => dispatch(patchAdDraftAct({ enabled: checked }))}
            />
          }
          label={s.enabled}
        />
        <TextField
          label={s.notes}
          value={draft.notes}
          onChange={(event) => dispatch(patchAdDraftAct({ notes: event.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button onClick={() => dispatch(closeAdPanelAct())}>{s.cancel}</Button>
          <Button
            variant="contained"
            disabled={!canSave || saving}
            onClick={() => {
              void dispatch(saveMetaLeadAdCampaignThunk())
            }}
          >
            {s.save}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
