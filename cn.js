/**
 * Lightweight className combiner. Filters falsy values and joins with a space.
 * Avoids pulling in clsx/tailwind-merge as extra dependencies.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
