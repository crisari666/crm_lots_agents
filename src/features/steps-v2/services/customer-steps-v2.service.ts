import { customersMsAxios } from "../../../app/customers-ms-http"

export type CustomerStepV2 = {
  id: string
  name: string
  description?: string
  order: number
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateCustomerStepV2Body = {
  name: string
  description?: string
  order?: number
  color?: string
  isActive?: boolean
}

export type UpdateCustomerStepV2Body = Partial<CreateCustomerStepV2Body>

export async function listCustomerStepsV2(): Promise<CustomerStepV2[]> {
  const response = await customersMsAxios.get<CustomerStepV2[]>("customer-steps")
  return response.data
}

export async function createCustomerStepV2(
  body: CreateCustomerStepV2Body
): Promise<CustomerStepV2> {
  const response = await customersMsAxios.post<CustomerStepV2>("customer-steps", body)
  return response.data
}

export async function updateCustomerStepV2(
  stepId: string,
  body: UpdateCustomerStepV2Body
): Promise<CustomerStepV2> {
  const response = await customersMsAxios.patch<CustomerStepV2>(
    `customer-steps/${encodeURIComponent(stepId)}`,
    body
  )
  return response.data
}
