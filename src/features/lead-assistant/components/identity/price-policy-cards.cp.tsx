import { Box, Radio, RadioGroup, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { patchDraftAct } from "../../slice/lead-assistant-settings.slice"
import type { LeadPricePolicy } from "../../types/lead-assistant.types"

const POLICIES: readonly LeadPricePolicy[] = [
  "entry_ticket_first",
  "full_price",
  "defer_to_advisor",
]

/** Three selectable policies, each with the exact sample reply the assistant would give. */
export default function PricePolicyCardsCP() {
  const dispatch = useAppDispatch()
  const value = useAppSelector((state) => state.leadAssistant.settings.draft?.pricePolicy)
  return (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
      <Typography component="legend" variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
        {s.pricePolicyTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {s.pricePolicyHelper}
      </Typography>
      <RadioGroup
        value={value ?? ""}
        onChange={(event) =>
          dispatch(patchDraftAct({ pricePolicy: event.target.value as LeadPricePolicy }))
        }
      >
        <Stack spacing={1.25}>
          {POLICIES.map((policy) => {
            const isSelected = value === policy
            return (
              <Box
                key={policy}
                component="label"
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  p: 1.5,
                  cursor: "pointer",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: isSelected ? "primary.main" : "divider",
                  bgcolor: isSelected ? "action.selected" : "transparent",
                  transition: "background-color 150ms ease, border-color 150ms ease",
                  "&:hover": { bgcolor: "action.hover" },
                  "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                }}
              >
                <Radio value={policy} size="small" sx={{ p: 0.5, mt: -0.25 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {s.pricePolicies[policy].title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {s.pricePolicies[policy].description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      pl: 1.25,
                      borderLeft: "3px solid",
                      borderColor: "divider",
                      fontStyle: "italic",
                    }}
                  >
                    {s.pricePolicies[policy].sample}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>
      </RadioGroup>
    </Box>
  )
}
