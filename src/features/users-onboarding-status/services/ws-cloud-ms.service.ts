import { WsCloudMsHttp } from "../../../app/ws-cloud-ms-http"

const PATH_GREETING = "whatsapp-cloud/messages/template/greeting"
const PATH_PROPOSAL = "whatsapp-cloud/messages/template/proposal"

export type SendGreetingTemplatePayload = {
  to: string
  userId: string
  name: string
}

export type SendProposalTemplatePayload = {
  to: string
  code: string
  name: string
}

export async function sendGreetingTemplateReq(
  payload: SendGreetingTemplatePayload
): Promise<unknown> {
  try {
    const http = WsCloudMsHttp.getInstance()
    return await http.post(PATH_GREETING, payload)
  } catch (error) {
    console.error("ERROR ON sendGreetingTemplateReq", error)
    throw error
  }
}

export async function sendProposalTemplateReq(
  payload: SendProposalTemplatePayload
): Promise<unknown> {
  try {
    const http = WsCloudMsHttp.getInstance()
    return await http.post(PATH_PROPOSAL, payload)
  } catch (error) {
    console.error("ERROR ON sendProposalTemplateReq", error)
    throw error
  }
}
