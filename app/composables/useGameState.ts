// =============================================================================
// Shared, SSR-safe reactive telemetry bridge between the 3D engine and the UI.
// The engine writes to it every frame; HUD/overlays read from it.
// =============================================================================
import type { GameTelemetry } from '~/types'

export const useGameState = () =>
  useState<GameTelemetry>('game-telemetry', () => ({
    loading: true,
    ready: false,
    started: false,
    speedKmh: 0,
    score: 0,
    activeSectionId: null,
  }))
