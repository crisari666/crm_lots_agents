import Api from "../../../app/axios"

export async function sendVoiceCoachNote(params: {
  callSid: string
  agentUserId: string
  message: string
  supervisorName?: string
}): Promise<void> {
  const api = Api.getInstance()
  await api.post({
    path: "voice-coaching/notes",
    data: params,
  })
}
