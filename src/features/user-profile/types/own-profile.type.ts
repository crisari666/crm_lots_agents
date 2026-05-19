export type OwnProfile = {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
}

export type UsersApiEnvelope<T> = {
  result: T
  error: string | null
  message: string
}
