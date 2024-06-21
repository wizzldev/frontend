export const getDistance = (distanceX: number, direction: boolean): number => {
  if (!direction) return getDistanceLeft(distanceX)
  return getDistanceRight(distanceX)
}

const getDistanceLeft = (distanceX: number): number => {
  if (distanceX < 0) return Math.abs(distanceX)
  return 0
}

const getDistanceRight = (distanceX: number): number => {
  if (distanceX > 0) return Math.abs(distanceX)
  return 0
}
