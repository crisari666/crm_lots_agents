import ReplyOutlined from "@mui/icons-material/ReplyOutlined"
import { Box, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import type { ReactNode } from "react"

type Props = {
  readonly sender: "assistant" | "lead"
  readonly text?: string
  readonly caption?: string
  readonly mediaIcon?: ReactNode
  readonly mediaLabel?: string
  readonly footer?: string
  readonly buttons?: readonly string[]
}

const MAX_BUBBLE_WIDTH = "86%"

/** One WhatsApp-style message bubble (assistant on the left, lead on the right). */
export default function WhatsAppBubbleCP(props: Props) {
  const isAssistant = props.sender === "assistant"
  const buttons = props.buttons ?? []
  return (
    <Box
      sx={{
        alignSelf: isAssistant ? "flex-start" : "flex-end",
        maxWidth: MAX_BUBBLE_WIDTH,
      }}
    >
      {props.caption != null ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, px: 0.5 }}>
          {props.caption}
        </Typography>
      ) : null}
      <Box
        sx={(theme) => ({
          bgcolor: isAssistant
            ? theme.palette.background.paper
            : alpha(theme.palette.success.main, 0.18),
          borderRadius: isAssistant ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
          boxShadow: 1,
          overflow: "hidden",
        })}
      >
        <Stack spacing={1} sx={{ p: 1.5 }}>
          {props.mediaLabel != null ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: "action.hover",
                color: "text.secondary",
              }}
            >
              {props.mediaIcon}
              <Typography variant="body2">{props.mediaLabel}</Typography>
            </Stack>
          ) : null}
          {props.text != null && props.text.length > 0 ? (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {props.text}
            </Typography>
          ) : null}
          {props.footer != null ? (
            <Typography variant="caption" color="text.secondary">
              {props.footer}
            </Typography>
          ) : null}
        </Stack>
        {buttons.map((label) => (
          <Stack
            key={label}
            direction="row"
            spacing={0.75}
            justifyContent="center"
            alignItems="center"
            sx={{
              py: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              color: "info.main",
            }}
          >
            <ReplyOutlined sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={600}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  )
}
