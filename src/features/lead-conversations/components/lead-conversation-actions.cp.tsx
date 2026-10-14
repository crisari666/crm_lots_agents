import React, { useState } from "react"
import { Button, Stack } from "@mui/material"
import { DeleteOutline, RestartAlt } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import { deleteLeadConversationThunk, restartLeadConversationThunk } from "../slice/lead-conversations.slice"
import LeadConversationConfirmDialogCP from "./lead-conversation-confirm-dialog.cp"

type PendingAction = "restart" | "delete" | null

/** Restart / delete buttons of the drawer footer, each behind a confirmation dialog. */
export default function LeadConversationActionsCP({ sessionId }: { sessionId: string }): React.ReactElement {
  const dispatch = useAppDispatch()
  const isRunning = useAppSelector((state) => state.leadConversations.isActionRunning)
  const actionError = useAppSelector((state) => state.leadConversations.actionError)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const runPendingAction = async () => {
    const result =
      pendingAction === "delete"
        ? await dispatch(deleteLeadConversationThunk(sessionId))
        : await dispatch(restartLeadConversationThunk(sessionId))
    if (result.meta.requestStatus === "fulfilled") setPendingAction(null)
  }
  const isDelete = pendingAction === "delete"
  return (
    <>
      <Stack direction="row" spacing={1.5} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<RestartAlt />}
          onClick={() => setPendingAction("restart")}
          disabled={isRunning}
        >
          {s.restartAction}
        </Button>
        <Button
          color="error"
          startIcon={<DeleteOutline />}
          onClick={() => setPendingAction("delete")}
          disabled={isRunning}
        >
          {s.deleteAction}
        </Button>
      </Stack>
      <LeadConversationConfirmDialogCP
        open={pendingAction !== null}
        title={isDelete ? s.deleteTitle : s.restartTitle}
        body={isDelete ? s.deleteBody : s.restartBody}
        confirmLabel={isDelete ? s.deleteConfirm : s.restartConfirm}
        isDestructive={isDelete}
        isRunning={isRunning}
        errorText={actionError}
        onClose={() => setPendingAction(null)}
        onConfirm={() => void runPendingAction()}
      />
    </>
  )
}
