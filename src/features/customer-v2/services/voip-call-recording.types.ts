export type CallRecordingResult = {
  callSid: string
  recordingSid: string
  contentType: "audio/wav"
  audioBase64: string
  durationSeconds?: number
}

export type CallRecordingApiResponse = {
  message: string
  result: CallRecordingResult
}
