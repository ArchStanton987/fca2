/* eslint-disable import/prefer-default-export */
export const getRemainingTime = (currTs: number, endTs: number) => {
  const diff = endTs - currTs
  if (diff <= 0) return null
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  if (hours === 0) return `${minutes}min`
  return `${hours}h ${minutes}min`
}
