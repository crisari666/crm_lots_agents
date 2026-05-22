import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DrawIcon from "@mui/icons-material/Draw"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useCallback, useState } from "react"
import { useAppDispatch } from "../../../app/hooks"
import { markSignedContractThunk } from "../slice/signed-contract.slice"
import type { SignedContractListItem } from "../types/signed-contract.types"
import { isMarkableContractId } from "../utils/is-markable-contract-id"

function formatDateTime(iso: string | null): string {
  if (iso == null || iso === "") {
    return "—"
  }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return "—"
  }
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function SigningLinkCell({ signUrl }: { readonly signUrl: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(signUrl)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setCopied(false)
    }
  }, [signUrl])
  return (
    <TableCell sx={{ maxWidth: 260, py: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title={signUrl}>
          <Typography
            variant="caption"
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {signUrl}
          </Typography>
        </Tooltip>
        <Tooltip title={copied ? "Copiado" : "Copiar enlace"}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                void handleCopy()
              }}
              aria-label="Copiar enlace de firma"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Abrir en nueva pestaña">
          <IconButton
            component={Link}
            href={signUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            color="primary"
            aria-label="Abrir enlace de firma en nueva pestaña"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </TableCell>
  )
}

function MarkSignedCell({
  contractId,
  isSigned,
}: {
  readonly contractId: string
  readonly isSigned: boolean
}) {
  const dispatch = useAppDispatch()
  const [isMarking, setIsMarking] = useState(false)
  const canMark = !isSigned && isMarkableContractId(contractId)
  const handleMarkSigned = useCallback(async () => {
    setIsMarking(true)
    try {
      await dispatch(markSignedContractThunk(contractId)).unwrap()
    } catch {
      // error surfaced via slice if extended later
    } finally {
      setIsMarking(false)
    }
  }, [contractId, dispatch])
  if (isSigned) {
    return (
      <TableCell align="center" padding="checkbox">
        <Typography variant="caption" color="text.secondary">
          —
        </Typography>
      </TableCell>
    )
  }
  if (!canMark) {
    return (
      <TableCell align="center" padding="checkbox">
        <Tooltip title="Desactiva agrupar repetidos para marcar manualmente">
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        </Tooltip>
      </TableCell>
    )
  }
  return (
    <TableCell align="center" padding="checkbox">
      <Tooltip title="Marcar como firmado">
        <span>
          <IconButton
            size="small"
            color="primary"
            disabled={isMarking}
            onClick={() => {
              void handleMarkSigned()
            }}
            aria-label="Marcar contrato como firmado"
            sx={{ p: 0.5 }}
          >
            {isMarking ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DrawIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </TableCell>
  )
}

export default function SignedContractItem({
  item,
  showSendCountColumn,
  showMarkSignedColumn,
}: {
  readonly item: SignedContractListItem
  readonly showSendCountColumn: boolean
  readonly showMarkSignedColumn: boolean
}) {
  return (
    <TableRow hover>
      <TableCell>{item.userEmail}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>
        {item.phone != null && item.phone.trim() !== "" ? item.phone : "—"}
      </TableCell>
      {item.signUrl != null && item.signUrl !== "" ? (
        <SigningLinkCell signUrl={item.signUrl} />
      ) : (
        <TableCell>
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        </TableCell>
      )}
      {showSendCountColumn ? (
        <TableCell align="right">{item.sendCount ?? 1}</TableCell>
      ) : null}
      <TableCell>
        <Typography variant="caption" component="span" noWrap>
          {formatDateTime(item.dateSent)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="caption" component="span" noWrap>
          {formatDateTime(item.dateSigned)}
        </Typography>
      </TableCell>
      <TableCell padding="none" sx={{ pl: 1 }}>
        <Chip
          size="small"
          color={item.signed ? "success" : "warning"}
          variant={item.signed ? "filled" : "outlined"}
          icon={
            item.signed ? (
              <CheckCircleOutlineIcon sx={{ fontSize: "14px !important" }} />
            ) : (
              <HourglassEmptyIcon sx={{ fontSize: "14px !important" }} />
            )
          }
          label={item.signed ? "Firmado" : "Pendiente"}
          sx={{
            height: 22,
            "& .MuiChip-label": { px: 0.75, fontSize: "0.7rem" },
          }}
        />
      </TableCell>
      <TableCell align="center" padding="checkbox">
        {item.signedPdfLink != null && item.signedPdfLink !== "" ? (
          <Tooltip title="Abrir PDF firmado en nueva pestaña">
            <IconButton
              component={Link}
              href={item.signedPdfLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="primary"
              aria-label="Abrir PDF firmado"
              sx={{ p: 0.5 }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          "—"
        )}
      </TableCell>
      {showMarkSignedColumn ? (
        <MarkSignedCell contractId={item.id} isSigned={item.signed} />
      ) : null}
    </TableRow>
  )
}
