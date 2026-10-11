import React from "react"
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import Add from "@mui/icons-material/Add"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import { ProjectFormState, ProjectLotOption } from "../types/project.types"
import { ProjectFormSectionToggleProps } from "../types/project-form-section.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectFormSectionCP from "./project-form-section.cp"
import { formatSectionSummary } from "../utils/format-section-summary.util"

type ProjectFormSalesSectionCPProps = ProjectFormSectionToggleProps & {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  disabled?: boolean
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
})

function toNonNegative(value: string): number {
  return Math.max(0, Number(value) || 0)
}

export default function ProjectFormSalesSectionCP({
  form,
  onChange,
  disabled = false,
  isExpanded,
  onToggle
}: ProjectFormSalesSectionCPProps) {
  const commissionValueCop =
    form.priceSell && form.commissionPercentage
      ? (form.priceSell * form.commissionPercentage) / 100
      : 0
  const lotOptions = form.lotOptions ?? []
  const summaryParts = [
    form.priceSell > 0 ? copFormatter.format(form.priceSell) : "",
    lotOptions.length > 0 ? formatSectionSummary(s.formSummaryLotOptions, lotOptions.length) : ""
  ].filter(Boolean)

  const updateLotRow = (index: number, patch: Partial<ProjectLotOption>) => {
    onChange({ lotOptions: lotOptions.map((row, i) => (i === index ? { ...row, ...patch } : row)) })
  }

  const removeLotRow = (index: number) => {
    onChange({ lotOptions: lotOptions.filter((_, i) => i !== index) })
  }

  const addLotRow = () => {
    onChange({ lotOptions: [...lotOptions, { area: 0, price: 0, priceUsd: 0 }] })
  }

  return (
    <ProjectFormSectionCP
      id="sales"
      title={s.formSectionSellInfo}
      summary={summaryParts.join(" · ") || s.formSummaryEmpty}
      expanded={isExpanded("sales")}
      onToggle={onToggle}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldSellPriceCop}
          value={form.priceSell || ""}
          onChange={(e) => onChange({ priceSell: Number(e.target.value) || 0 })}
          disabled={disabled}
          InputProps={{ startAdornment: <InputAdornment position="start">COP</InputAdornment> }}
          inputProps={{ min: 0, step: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldSellPriceUsd}
          value={form.priceSellUsd || ""}
          onChange={(e) => onChange({ priceSellUsd: Number(e.target.value) || 0 })}
          disabled={disabled}
          InputProps={{ startAdornment: <InputAdornment position="start">US$</InputAdornment> }}
          inputProps={{ min: 0, step: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldCommissionPercent}
          value={form.commissionPercentage ?? ""}
          onChange={(e) => onChange({ commissionPercentage: Number(e.target.value) || 0 })}
          disabled={disabled}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label={s.formFieldCommissionCop}
          value={commissionValueCop}
          disabled
          InputProps={{ startAdornment: <InputAdornment position="start">COP</InputAdornment> }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldSeparation}
          value={form.separation ?? ""}
          onChange={(e) => onChange({ separation: toNonNegative(e.target.value) })}
          disabled={disabled}
          helperText={s.formFieldSeparationHelper}
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {s.formLotOptionsTitle}
        </Typography>
        {lotOptions.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {s.formLotOptionsEmptyHint}
          </Typography>
        )}
        <Stack spacing={1.5}>
          {lotOptions.map((row, index) => (
            <Grid container spacing={1} alignItems="flex-start" key={`lot-${index}`}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label={s.formLotOptionsArea}
                  value={row.area || ""}
                  onChange={(e) => updateLotRow(index, { area: toNonNegative(e.target.value) })}
                  disabled={disabled}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label={s.formLotOptionsPriceCop}
                  value={row.price || ""}
                  onChange={(e) => updateLotRow(index, { price: toNonNegative(e.target.value) })}
                  disabled={disabled}
                  InputProps={{ startAdornment: <InputAdornment position="start">COP</InputAdornment> }}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  label={s.formLotOptionsPriceUsd}
                  value={row.priceUsd ?? ""}
                  onChange={(e) => updateLotRow(index, { priceUsd: toNonNegative(e.target.value) })}
                  disabled={disabled}
                  InputProps={{ startAdornment: <InputAdornment position="start">US$</InputAdornment> }}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label={s.formLotOptionsRemove}
                  onClick={() => removeLotRow(index)}
                  disabled={disabled}
                  color="error"
                  edge="end"
                >
                  <DeleteOutline />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Stack>
        <Button
          type="button"
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={addLotRow}
          disabled={disabled}
          sx={{ mt: 1.5 }}
        >
          {s.formLotOptionsAdd}
        </Button>
      </Grid>
    </ProjectFormSectionCP>
  )
}
