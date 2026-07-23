// =============================================================================
// Contact service. Encapsulates lead submission so the form component stays
// dumb. Today it simulates a call; wire it to a real API/route later without
// touching the UI. Includes lightweight, framework-agnostic validation.
// =============================================================================
import type { ContactPayload, ServiceResult } from '~/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactFieldErrors {
  name?: string
  email?: string
  message?: string
}

export const contactService = {
  /** Returns per-field error KEYS (i18n) — empty object means valid. */
  validate(payload: ContactPayload): ContactFieldErrors {
    const errors: ContactFieldErrors = {}
    if (!payload.name?.trim()) errors.name = 'contact.errors.nameRequired'
    if (!payload.email?.trim()) errors.email = 'contact.errors.emailRequired'
    else if (!EMAIL_RE.test(payload.email)) errors.email = 'contact.errors.emailInvalid'
    if (!payload.message?.trim() || payload.message.trim().length < 10)
      errors.message = 'contact.errors.messageShort'
    return errors
  },

  async submit(payload: ContactPayload): Promise<ServiceResult> {
    const errors = this.validate(payload)
    if (Object.keys(errors).length > 0) {
      return { ok: false, error: 'contact.errors.invalid' }
    }
    // Placeholder for a real network call ($fetch('/api/contact', ...)).
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { ok: true }
  },
}
