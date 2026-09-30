import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { JobCampaignDetailCp } from "../components/job-campaign-detail.cp"
import { JobCampaignSetupDialogCp } from "../components/job-campaign-setup-dialog.cp"
import { JobCampaignsListCp } from "../components/job-campaigns-list.cp"
import {
  activateJobCampaignThunk,
  assignJobCampaignInterviewThunk,
  cancelJobCampaignInterviewThunk,
  createJobCampaignInterviewThunk,
  createJobCampaignCandidateThunk,
  createJobCampaignThunk,
  updateJobCampaignCandidateThunk,
  fetchJobCampaignCandidateThunk,
  fetchJobCampaignCandidatesThunk,
  fetchJobCampaignDetailThunk,
  fetchJobCampaignInterviewsThunk,
  fetchJobCampaignsThunk,
  promoteJobCampaignCandidateThunk,
  rejectJobCampaignCandidateThunk,
  retryJobCampaignVoiceThunk,
  startJobCampaignWhatsappThunk,
  selectJobCampaignAct,
  selectJobCampaignState,
  setJobCampaignDetailTabAct,
  updateJobCampaignThunk,
} from "../slice/job-campaign.slice"

export default function JobCampaignsPage() {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectJobCampaignState)
  const [setupOpen, setSetupOpen] = useState(false)
  const [setupMode, setSetupMode] = useState<"create" | "edit">("create")

  useEffect(() => {
    void dispatch(fetchJobCampaignsThunk())
  }, [dispatch])

  useEffect(() => {
    if (state.selectedCampaignId == null) return
    void dispatch(fetchJobCampaignDetailThunk(state.selectedCampaignId))
    void dispatch(
      fetchJobCampaignCandidatesThunk({
        campaignId: state.selectedCampaignId,
      }),
    )
    void dispatch(fetchJobCampaignInterviewsThunk(state.selectedCampaignId))
  }, [dispatch, state.selectedCampaignId])

  const selectedForEdit =
    setupMode === "edit"
      ? state.items.find((c) => c.id === state.selectedCampaignId) ??
        state.selectedCampaign
      : null

  return (
    <Box>
      <JobCampaignsListCp
        items={state.items}
        loading={state.itemsLoading}
        selectedId={state.selectedCampaignId}
        onSelect={(id) => dispatch(selectJobCampaignAct(id))}
        onCreate={() => {
          setSetupMode("create")
          setSetupOpen(true)
        }}
        onActivate={(id) => {
          void dispatch(activateJobCampaignThunk(id))
        }}
        onEditSetup={(id) => {
          dispatch(selectJobCampaignAct(id))
          setSetupMode("edit")
          setSetupOpen(true)
        }}
      />
      {state.selectedCampaign != null ? (
        <JobCampaignDetailCp
          campaign={state.selectedCampaign}
          tab={state.detailTab}
          onTabChange={(tab) => dispatch(setJobCampaignDetailTabAct(tab))}
          candidates={state.candidates}
          selectedCandidate={state.selectedCandidate}
          onSelectCandidate={(candidateId) => {
            if (state.selectedCampaignId == null) return
            void dispatch(
              fetchJobCampaignCandidateThunk({
                campaignId: state.selectedCampaignId,
                candidateId,
              }),
            )
          }}
          onAddCandidate={(input) => {
            if (state.selectedCampaignId == null) return
            void dispatch(
              createJobCampaignCandidateThunk({
                campaignId: state.selectedCampaignId,
                body: {
                  name: input.name,
                  phone: input.phone,
                  email: input.email.length > 0 ? input.email : undefined,
                  startVoice: true,
                },
              }),
            )
          }}
          onEditCandidate={(input) => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              updateJobCampaignCandidateThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
                body: {
                  name: input.name,
                  phone: input.phone,
                  email: input.email,
                },
              }),
            )
          }}
          onPromote={() => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              promoteJobCampaignCandidateThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
              }),
            )
          }}
          onRetryVoice={() => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              retryJobCampaignVoiceThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
              }),
            )
          }}
          onStartWhatsapp={() => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              startJobCampaignWhatsappThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
              }),
            )
          }}
          onReject={() => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              rejectJobCampaignCandidateThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
              }),
            )
          }}
          onAssignInterview={() => {
            if (
              state.selectedCampaignId == null ||
              state.selectedCandidate == null
            )
              return
            void dispatch(
              assignJobCampaignInterviewThunk({
                campaignId: state.selectedCampaignId,
                candidateId: state.selectedCandidate.id,
              }),
            )
          }}
          interviews={state.interviews}
          onCreateInterview={(input) => {
            if (state.selectedCampaignId == null) return
            void dispatch(
              createJobCampaignInterviewThunk({
                campaignId: state.selectedCampaignId,
                body: {
                  scheduledAt: input.scheduledAt,
                  title: input.title.length > 0 ? input.title : undefined,
                },
              }),
            )
          }}
          onCancelInterview={(id) => {
            void dispatch(cancelJobCampaignInterviewThunk(id))
          }}
        />
      ) : null}
      <JobCampaignSetupDialogCp
        open={setupOpen}
        mode={setupMode}
        campaign={selectedForEdit}
        lastCampaign={state.items[0] ?? null}
        saving={state.createStatus === "loading"}
        onClose={() => setSetupOpen(false)}
        onSubmitCreate={(input) => {
          void dispatch(
            createJobCampaignThunk({
              name: input.name,
              description: input.description,
              voiceAgentPrompt: input.voiceAgentPrompt,
              whatsappAgentPrompt: input.whatsappAgentPrompt,
              captureFields: [...input.captureFields],
              whatsappTemplateName: input.whatsappTemplateName,
              whatsappTemplateLanguage: input.whatsappTemplateLanguage,
              requirements: input.requirements,
              cvRequestMessage: input.cvRequestMessage,
              videoRequestMessage: input.videoRequestMessage,
              videoReceivedMessage: input.videoReceivedMessage,
              activate: input.activate,
            }),
          ).then(() => setSetupOpen(false))
        }}
        onSubmitUpdate={(input) => {
          if (state.selectedCampaignId == null) return
          void dispatch(
            updateJobCampaignThunk({
              id: state.selectedCampaignId,
              body: {
                name: input.name,
                description: input.description,
                voiceAgentPrompt: input.voiceAgentPrompt,
                whatsappAgentPrompt: input.whatsappAgentPrompt,
                captureFields: [...input.captureFields],
                whatsappTemplateName: input.whatsappTemplateName,
                whatsappTemplateLanguage: input.whatsappTemplateLanguage,
                requirements: input.requirements,
                cvRequestMessage: input.cvRequestMessage,
                videoRequestMessage: input.videoRequestMessage,
                videoReceivedMessage: input.videoReceivedMessage,
              },
            }),
          ).then(() => setSetupOpen(false))
        }}
      />
    </Box>
  )
}
