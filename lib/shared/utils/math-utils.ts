/* eslint-disable import/prefer-default-export */
export function getRandomWeightedIndex<T>(arr: T[]): number {
  const weights = arr.map((_, index) => 1 / (index + 1))

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  const randomValue = Math.random() * totalWeight

  let cumulativeWeight = 0
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeight += weights[i]
    if (randomValue <= cumulativeWeight) {
      return i
    }
  }

  return arr.length - 1
}
