import { useEffect, useMemo, type SetStateAction } from "react"
import {
  Alert,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material"
import CustomerFilterTogglesCP from "../../customer-v2/components/customer-filter-toggles.cp"
import CustomerListFiltersCP from "../../customer-v2/components/customer-list-filters.cp"
import CustomerAutocompleteAsyncCP from "../../customer-v2/components/customer-autocomplete-async.cp"
import CustomerStepMultiAutocompleteCP from "../../customer-v2/components/customer-step-multi-autocomplete.cp"
import type { FilterFormState } from "../../customer-v2/types/filter-form.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import type { WhatsappMarketingAudienceMode } from "../services/customers-ms-whatsapp-marketing.types"
import {
  clearWhatsappMarketingNewFieldErrorAct,
  patchWhatsappMarketingNewCampaignFormAct,
  previewWhatsappMarketingAudienceThunk,
} from "../slice/whatsapp-marketing.slice"
import {
  selectWhatsappMarketingAudiencePreviewBody,
  selectWhatsappMarketingAudiencePreviewKey,
  selectWhatsappMarketingNewCampaignAudienceFields,
} from "../slice/whatsapp-marketing-new.selectors"
import {
  selectWhatsappMarketingAudiencePreviewLoading,
} from "../slice/whatsapp-marketing.selectors"

const AUDIENCE_PREVIEW_DEBOUNCE_MS = 400

export default function WhatsappMarketingNewAudienceCP() {
  const dispatch = useAppDispatch()
  const previewBody = useAppSelector(selectWhatsappMarketingAudiencePreviewBody)
  const previewKey = useAppSelector(selectWhatsappMarketingAudiencePreviewKey)
  const previewLoading = useAppSelector(selectWhatsappMarketingAudiencePreviewLoading)
  const {
    audienceMode,
    draft,
    selectedStepIds,
    manualPicks,
    picker,
    steps,
    fieldErrors,
  } = useAppSelector(selectWhatsappMarketingNewCampaignAudienceFields)
  const users = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users,
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  const creatorUsers = useMemo(() => {
    const selectedId = draft.createdBy.trim()
    return users.filter(
      (u) =>
        u._id &&
        ((u.level ?? 99) <= 4 || (selectedId !== "" && u._id === selectedId)),
    )
  }, [users, draft.createdBy])

  useEffect(() => {
    if (!gotUsers) void dispatch(fetchUsersThunk({ enable: true }))
  }, [dispatch, gotUsers])

  useEffect(() => {
    const body = previewBody
    const timer = window.setTimeout(() => {
      void dispatch(previewWhatsappMarketingAudienceThunk(body))
    }, AUDIENCE_PREVIEW_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [dispatch, previewKey])

  const clearFieldError = (key: "audience" | "preview") => {
    dispatch(clearWhatsappMarketingNewFieldErrorAct(key))
  }

  const handleDraftChange = (value: SetStateAction<FilterFormState>) => {
    const nextDraft = typeof value === "function" ? value(draft) : value
    dispatch(patchWhatsappMarketingNewCampaignFormAct({ draft: nextDraft }))
  }

  const handleFilterToggleChange = (
    patch: Partial<
      Pick<
        FilterFormState,
        "excludeFecha" | "unassignedOnly" | "enabledOnly" | "referralOnly"
      >
    >,
  ) => {
    dispatch(
      patchWhatsappMarketingNewCampaignFormAct({
        draft: {
          ...draft,
          ...patch,
          ...(patch.unassignedOnly === true ? { assignedTo: "" } : {}),
        },
      }),
    )
    clearFieldError("preview")
  }

  const handleAddManual = () => {
    if (picker == null) return
    if (manualPicks.some((p) => p.id === picker.id)) return
    dispatch(
      patchWhatsappMarketingNewCampaignFormAct({
        manualPicks: [...manualPicks, picker],
        picker: null,
      }),
    )
    clearFieldError("audience")
    clearFieldError("preview")
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Audiencia
      </Typography>
      <FormControl>
        <RadioGroup
          row
          value={audienceMode}
          onChange={(e) => {
            dispatch(
              patchWhatsappMarketingNewCampaignFormAct({
                audienceMode: e.target.value as WhatsappMarketingAudienceMode,
              }),
            )
            clearFieldError("audience")
            clearFieldError("preview")
          }}
        >
          <FormControlLabel value="filter" control={<Radio />} label="Segmento" />
          <FormControlLabel value="manual" control={<Radio />} label="Búsqueda manual" />
          <FormControlLabel value="combined" control={<Radio />} label="Ambos" />
        </RadioGroup>
      </FormControl>
      {audienceMode !== "manual" ? (
        <Stack spacing={2} sx={{ mt: 1 }}>
          <CustomerFilterTogglesCP
            filterDraft={{
              excludeFecha: draft.excludeFecha,
              unassignedOnly: draft.unassignedOnly,
              enabledOnly: draft.enabledOnly,
              referralOnly: draft.referralOnly,
            }}
            onFilterDraftChange={handleFilterToggleChange}
          />
          <CustomerListFiltersCP
            draft={draft}
            setDraft={handleDraftChange}
            loading={previewLoading}
            onSearch={() => dispatch(patchWhatsappMarketingNewCampaignFormAct({ applied: { ...draft } }))}
            users={users}
            creatorUsers={creatorUsers}
            steps={steps}
          />
          <CustomerStepMultiAutocompleteCP
            steps={steps}
            value={selectedStepIds}
            onChange={(stepIds) =>
              dispatch(patchWhatsappMarketingNewCampaignFormAct({ selectedStepIds: stepIds }))
            }
            label="Steps (buscar y seleccionar)"
            emptyHint="Todos los steps — escribe para filtrar"
          />
        </Stack>
      ) : null}
      {fieldErrors.audience !== undefined ? (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {fieldErrors.audience}
        </Alert>
      ) : null}
      {audienceMode !== "filter" ? (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CustomerAutocompleteAsyncCP
              value={picker}
              onChange={(value) =>
                dispatch(patchWhatsappMarketingNewCampaignFormAct({ picker: value }))
              }
              label="Buscar cliente"
            />
            <Button
              variant="outlined"
              onClick={handleAddManual}
              disabled={picker == null}
              sx={{ cursor: "pointer" }}
            >
              Agregar
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {manualPicks.map((pick) => (
              <Chip
                key={pick.id}
                label={`${pick.name ?? ""} ${pick.lastName ?? ""}`.trim() || pick.phone}
                onDelete={() =>
                  dispatch(
                    patchWhatsappMarketingNewCampaignFormAct({
                      manualPicks: manualPicks.filter((p) => p.id !== pick.id),
                    }),
                  )
                }
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Paper>
  )
}
