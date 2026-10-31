import { useCallback } from 'react'
import { collectionTint, type CollectionName } from '../constants/collections'
import { useTheme } from './theme'

/**
 * Resolves a world's accent for the theme in play. The poster colours are
 * sampled off black artwork, so the light theme uses the deeper variant that
 * still reads as text on paper.
 */
export function useTint() {
  const { theme } = useTheme()
  return useCallback((name: CollectionName) => collectionTint(name, theme), [theme])
}
