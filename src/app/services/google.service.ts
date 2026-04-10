import Api from "../axios"

const api = new Api()

export type GenerateContractPayload = {
  userId: string
  fullName: string
  documentNumber: string
  city: string
  email: string
  phone: string
}

export async function generateContractReq(
  payload: GenerateContractPayload
): Promise<unknown> {
  const res = await api.post({
    path: "google/contract",
    data: payload,
  })
  if (res == null) {
    throw new Error("Could not generate contract")
  }
  const body = res as { message?: string; error?: string }
  if (body.error != null && body.error !== "") {
    throw new Error(typeof body.error === "string" ? body.error : "Error")
  }
  return res
}
