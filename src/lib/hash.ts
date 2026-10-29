/** Deterministic string -> non-negative integer, used to pick a stable gradient per seed. */
export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function hashToIndex(value: string, length: number): number {
  return hashString(value) % length
}
