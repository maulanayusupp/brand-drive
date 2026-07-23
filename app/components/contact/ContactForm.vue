<script setup lang="ts">
import { contactService, type ContactFieldErrors } from '~/services/contact.service'
import type { ContactPayload } from '~/types'

const { t } = useI18n()

const form = reactive<ContactPayload>({
  name: '',
  email: '',
  company: '',
  message: '',
})

const errors = ref<ContactFieldErrors>({})
const submitting = ref(false)
const success = ref(false)
const generalError = ref<string | null>(null)

const onSubmit = async () => {
  generalError.value = null
  errors.value = contactService.validate(form)
  if (Object.keys(errors.value).length > 0) return

  submitting.value = true
  const result = await contactService.submit({ ...form })
  submitting.value = false

  if (result.ok) {
    success.value = true
  } else {
    generalError.value = result.error ?? 'contact.errors.invalid'
  }
}
</script>

<template>
  <div class="contact-form">
    <Transition name="swap" mode="out-in">
      <div v-if="success" key="success" class="contact-form__success">
        <span class="contact-form__check"><BaseIcon name="check" :size="28" /></span>
        <h3>{{ t('contact.success.title') }}</h3>
        <p class="muted">{{ t('contact.success.body') }}</p>
      </div>

      <form v-else key="form" class="contact-form__form" novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label class="field__label" for="cf-name">{{ t('contact.form.name') }}</label>
          <input
            id="cf-name"
            v-model="form.name"
            class="field__input"
            type="text"
            :placeholder="t('contact.form.namePlaceholder')"
            :aria-invalid="!!errors.name"
          />
          <p v-if="errors.name" class="field__error">{{ t(errors.name) }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="cf-email">{{ t('contact.form.email') }}</label>
          <input
            id="cf-email"
            v-model="form.email"
            class="field__input"
            type="email"
            :placeholder="t('contact.form.emailPlaceholder')"
            :aria-invalid="!!errors.email"
          />
          <p v-if="errors.email" class="field__error">{{ t(errors.email) }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="cf-company">{{ t('contact.form.company') }}</label>
          <input
            id="cf-company"
            v-model="form.company"
            class="field__input"
            type="text"
            :placeholder="t('contact.form.companyPlaceholder')"
          />
        </div>

        <div class="field">
          <label class="field__label" for="cf-message">{{ t('contact.form.message') }}</label>
          <textarea
            id="cf-message"
            v-model="form.message"
            class="field__input field__input--area"
            rows="5"
            :placeholder="t('contact.form.messagePlaceholder')"
            :aria-invalid="!!errors.message"
          />
          <p v-if="errors.message" class="field__error">{{ t(errors.message) }}</p>
        </div>

        <p v-if="generalError" class="contact-form__general">{{ t(generalError) }}</p>

        <BaseButton type="submit" size="lg" block :disabled="submitting">
          {{ submitting ? t('contact.form.sending') : t('contact.form.submit') }}
        </BaseButton>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.contact-form {
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    padding: 2rem 1rem;
  }

  &__check {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: var(--radius-pill);
    color: var(--color-success);
    background: color-mix(in srgb, var(--color-success) 15%, transparent);
    margin-bottom: 0.5rem;
  }

  &__general {
    color: var(--color-danger);
    font-size: 0.9rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }

  &__input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    transition: border-color var(--dur-fast) var(--ease-out);

    &::placeholder {
      color: var(--color-text-dim);
    }

    &:focus {
      outline: none;
      border-color: var(--color-accent);
    }

    &[aria-invalid='true'] {
      border-color: var(--color-danger);
    }

    &--area {
      resize: vertical;
      min-height: 8rem;
      font-family: inherit;
    }
  }

  &__error {
    font-size: 0.8rem;
    color: var(--color-danger);
  }
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity var(--dur-med) var(--ease-out);
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
</style>
