/* eslint-disable import/prefer-default-export */
type Ts = Date | string | number
export const getRemainingTime = (currTs: Ts, endTs: Ts) => {
  const currDate = new Date(currTs)
  const endDate = new Date(endTs)
  const diff = endDate.getTime() - currDate.getTime()
  if (diff <= 0) return null
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  if (hours === 0) return `${minutes}m`
  return `${hours}h${minutes}m`
}
