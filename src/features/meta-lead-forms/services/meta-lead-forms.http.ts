import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateMetaLeadFormBody,
  MetaLeadFormItem,
  MetaLeadFormSettings,
  UpdateMetaLeadFormBody,
} from "../types/meta-lead-forms.types"

const BASE_PATH = "admin/customer/meta-lead-forms"
const auth = () => ({ headers: customersMsAuthHeaders() })

export async function listMetaLeadForms(): Promise<MetaLeadFormItem[]> {
  const response = await customersMsAxios.get<MetaLeadFormItem[]>(BASE_PATH, auth())
  return response.data
}

export async function createMetaLeadForm(
  body: CreateMetaLeadFormBody,
): Promise<MetaLeadFormItem> {
  const response = await customersMsAxios.post<MetaLeadFormItem>(BASE_PATH, body, auth())
  return response.data
}

export async function updateMetaLeadForm(
  id: string,
  body: UpdateMetaLeadFormBody,
): Promise<MetaLeadFormItem> {
  const response = await customersMsAxios.patch<MetaLeadFormItem>(
    `${BASE_PATH}/${id}`,
    body,
    auth(),
  )
  return response.data
}

export async function deleteMetaLeadForm(id: string): Promise<void> {
  await customersMsAxios.delete(`${BASE_PATH}/${id}`, auth())
}

export async function getMetaLeadFormSettings(): Promise<MetaLeadFormSettings> {
  const response = await customersMsAxios.get<MetaLeadFormSettings>(
    `${BASE_PATH}/settings`,
    auth(),
  )
  return response.data
}

export async function updateMetaLeadFormSettings(
  outboundDelayMinutes: number,
): Promise<MetaLeadFormSettings> {
  const response = await customersMsAxios.patch<MetaLeadFormSettings>(
    `${BASE_PATH}/settings`,
    { outboundDelayMinutes },
    auth(),
  )
  return response.data
}
