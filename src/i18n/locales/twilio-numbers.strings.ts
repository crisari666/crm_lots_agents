export const twilioNumbersStrings = {
  deleteTooltip: "Delete Twilio number",
  deleteConfirmTitle: "Delete Twilio number",
  deleteConfirmBody: (params: {
    pnid: string
    number: string
    friendlyNumber: string
    userEmail: string | null
  }): string => {
    const lines = [
      `This will permanently remove PNID ${params.pnid} (${params.number}).`,
    ]
    if (params.friendlyNumber.trim().length > 0) {
      lines.push(`Friendly name: ${params.friendlyNumber}.`)
    }
    if (params.userEmail != null && params.userEmail.length > 0) {
      lines.push(`The assigned user (${params.userEmail}) will be unlinked.`)
    }
    lines.push("This does not release the number from your Twilio account.")
    return lines.join(" ")
  },
  deleteCancel: "Cancel",
  deleteConfirmAction: "Delete",
  deleting: "Deleting…",
}
