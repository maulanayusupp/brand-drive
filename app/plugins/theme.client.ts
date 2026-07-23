// Applies the persisted color theme as early as possible on the client.
export default defineNuxtPlugin(() => {
  useTheme().initFromStorage()
})
