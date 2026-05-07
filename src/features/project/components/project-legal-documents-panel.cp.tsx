import React from "react"
import { Box, Link, Stack, Typography } from "@mui/material"
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import { buildRagIngestAssetUrl } from "../utils/project-uploads.util"
import type { ProjectType } from "../types/project.types"

type Props = {
  uploadsBaseUrl: string
  project: Pick<
    ProjectType,
    | "legalRut"
    | "legalBusinessRegistration"
    | "legalBankCertificate"
    | "legalLibertarianCertificate"
  >
}

export default function ProjectLegalDocumentsPanelCP({ uploadsBaseUrl, project }: Props) {
  const rows: { label: string; fileName: string | undefined }[] = [
    { label: s.legalDocRut, fileName: project.legalRut },
    { label: s.legalDocBusinessRegistration, fileName: project.legalBusinessRegistration },
    { label: s.legalDocBankCertificate, fileName: project.legalBankCertificate },
    { label: s.legalDocLibertarianCertificate, fileName: project.legalLibertarianCertificate }
  ]
  const any = rows.some((r) => (r.fileName ?? "").trim().length > 0)
  if (!uploadsBaseUrl || !any) {
    return null
  }

  return (
    <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "divider" }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {s.formSectionLegalDocuments}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.legalDocumentsSectionHint}
      </Typography>
      <Stack spacing={1}>
        {rows.map(({ label, fileName }) => {
          const name = (fileName ?? "").trim()
          if (!name) return null
          const href = buildRagIngestAssetUrl(uploadsBaseUrl, name)
          if (!href) return null
          return (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="body2" component="span" sx={{ minWidth: 160 }}>
                {label}
              </Typography>
              <Link href={href} target="_blank" rel="noopener noreferrer" variant="body2">
                {s.legalDocOpenFile} <OpenInNewIcon sx={{ fontSize: 14, verticalAlign: "middle", ml: 0.25 }} />
              </Link>
              <Typography variant="caption" color="text.secondary" sx={{ width: "100%" }}>
                {name}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
