import { CircularProgress, Modal } from "@mui/material"

export interface LoadingIndicatorProps {
  open: boolean
  onClose?: () => void
}

export default function LoadingIndicator({
  open,
  onClose,
}: LoadingIndicatorProps) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Modal>
    </>
  )
}