/** WhatsApp templates expect digits only (e.g. 573108834323) */
export function phoneToWhatsAppTo(phone: string): string {
  return phone.replace(/\D/g, "")
}

/** Voice agent expects E.164 (e.g. +573108834323) */
export function phoneToE164(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 0) return ""
  return `+${digits}`
}
