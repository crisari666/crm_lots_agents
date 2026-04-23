import React, { useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import {
  fetchConversationChatsThunk,
  fetchConversationMessagesThunk,
  setSelectedConversationChatAct,
} from "../../redux/customer-conversations.slice"

function formatChatName(name: string, chatId: string): string {
  const normalized = name.trim()
  if (normalized !== "") {
    return normalized
  }
  return chatId
}

export default function CustomerConversationsTabCP() {
  const dispatch = useAppDispatch()
  const detailForm = useAppSelector((s) => s.customerV2.detailForm)
  const {
    chats,
    chatsLoading,
    chatsError,
    selectedChatId,
    messagesByChatId,
    messagesLoadingByChatId,
    messagesErrorByChatId,
  } = useAppSelector((s) => s.customerConversations)

  useEffect(() => {
    if (!detailForm?.id) {
      return
    }
    void dispatch(fetchConversationChatsThunk({ skip: 0 }))
  }, [detailForm?.id, dispatch])

  useEffect(() => {
    if (!selectedChatId) {
      return
    }
    if (messagesByChatId[selectedChatId] !== undefined) {
      return
    }
    void dispatch(fetchConversationMessagesThunk({ chatId: selectedChatId, params: { skip: 0 } }))
  }, [dispatch, messagesByChatId, selectedChatId])

  const selectedMessages = useMemo(() => {
    if (!selectedChatId) {
      return []
    }
    return messagesByChatId[selectedChatId] ?? []
  }, [messagesByChatId, selectedChatId])

  const selectedChatLoading = selectedChatId ? messagesLoadingByChatId[selectedChatId] === true : false
  const selectedChatError = selectedChatId ? messagesErrorByChatId[selectedChatId] : null

  if (!detailForm?.id) {
    return (
      <Typography variant="body2" color="text.secondary">
        Selecciona un cliente para ver conversaciones.
      </Typography>
    )
  }

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <Paper variant="outlined" sx={{ width: { xs: "100%", md: 320 }, minHeight: 280 }}>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Chats
          </Typography>
        </Box>
        {chatsLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={26} />
          </Box>
        )}
        {!chatsLoading && chatsError && (
          <Alert severity="error" sx={{ m: 1.5 }}>
            {chatsError}
          </Alert>
        )}
        {!chatsLoading && !chatsError && chats.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Sin chats registrados para este cliente.
          </Typography>
        )}
        {!chatsLoading && !chatsError && chats.length > 0 && (
          <List disablePadding>
            {chats.map((chat) => {
              const when = moment.unix(chat.lastMessageTimestamp)
              const isSelected = selectedChatId === chat.chatId
              return (
                <ListItemButton
                  key={`${chat.sessionId}-${chat.chatId}`}
                  selected={isSelected}
                  onClick={() => dispatch(setSelectedConversationChatAct(chat.chatId))}
                  sx={{ cursor: "pointer", alignItems: "flex-start" }}
                >
                  <ListItemText
                    primary={formatChatName(chat.name, chat.chatId)}
                    secondary={when.isValid() ? when.format("DD/MM/YYYY HH:mm") : "Sin fecha"}
                    primaryTypographyProps={{ variant: "body2", fontWeight: isSelected ? 600 : 500 }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ flex: 1, minHeight: 280 }}>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Mensajes
          </Typography>
        </Box>
        {!selectedChatId && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Selecciona un chat para ver el detalle.
          </Typography>
        )}
        {selectedChatId && selectedChatLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={26} />
          </Box>
        )}
        {selectedChatId && !selectedChatLoading && selectedChatError && (
          <Alert severity="error" sx={{ m: 1.5 }}>
            {selectedChatError}
          </Alert>
        )}
        {selectedChatId && !selectedChatLoading && !selectedChatError && selectedMessages.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Este chat no tiene mensajes.
          </Typography>
        )}
        {selectedChatId && !selectedChatLoading && !selectedChatError && selectedMessages.length > 0 && (
          <List sx={{ py: 0 }}>
            {selectedMessages.map((message) => {
              const isMine = message.fromMe
              const when = moment.unix(message.timestamp)
              return (
                <Box
                  key={message.messageId}
                  sx={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    px: 1.5,
                    py: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "80%",
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 1.5,
                      bgcolor: isMine ? "primary.main" : "grey.100",
                      color: isMine ? "primary.contrastText" : "text.primary",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {message.body?.trim() || "Mensaje sin texto"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.85,
                        textAlign: isMine ? "right" : "left",
                      }}
                    >
                      {when.isValid() ? when.format("DD/MM/YYYY HH:mm") : "Sin fecha"}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </List>
        )}
      </Paper>
    </Stack>
  )
}
