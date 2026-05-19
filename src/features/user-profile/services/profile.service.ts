import Api from '../../../app/axios'
import { userProfileStrings as s } from '../../../i18n/locales/user-profile.strings'
import { OwnProfile, UsersApiEnvelope } from '../types/own-profile.type'

const api = new Api()

function parseEnvelopeError(data: UsersApiEnvelope<unknown>): string | null {
  if (data.error != null && String(data.error).length > 0) {
    return String(data.error)
  }
  if (data.message === 'error') {
    return s.apiGenericError
  }
  return null
}

export async function getOwnProfileReq(): Promise<OwnProfile> {
  const data = (await api.get({ path: 'users/me' })) as UsersApiEnvelope<OwnProfile>
  const err = parseEnvelopeError(data)
  if (err != null) {
    throw new Error(err)
  }
  return data.result
}

export async function patchOwnProfileReq(
  payload: Partial<Pick<OwnProfile, 'name' | 'lastName' | 'phone'>>,
): Promise<void> {
  const data = (await api.patch({ path: 'users/me', data: payload })) as UsersApiEnvelope<boolean>
  const err = parseEnvelopeError(data)
  if (err != null) {
    throw new Error(err)
  }
}

export async function requestEmailChangeReq(newEmail: string): Promise<void> {
  const data = (await api.post({
    path: 'users/me/email-change/request',
    data: { newEmail },
  })) as UsersApiEnvelope<boolean>
  const err = parseEnvelopeError(data)
  if (err != null) {
    throw new Error(err)
  }
}

export async function confirmEmailChangeReq(params: {
  newEmail: string
  code: string
}): Promise<void> {
  const data = (await api.post({
    path: 'users/me/email-change/confirm',
    data: params,
  })) as UsersApiEnvelope<boolean>
  const err = parseEnvelopeError(data)
  if (err != null) {
    throw new Error(err)
  }
}

export async function changeOwnPasswordReq(params: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  const data = (await api.patch({
    path: 'users/me/password',
    data: params,
  })) as UsersApiEnvelope<boolean>
  const err = parseEnvelopeError(data)
  if (err != null) {
    throw new Error(err)
  }
}
