import { Special } from "lib/character/abilities/special/special.types"

/* eslint-disable import/prefer-default-export */
export const CRIT_FAILURE_THRESHOLD = 97

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCritFailureThreshold = (s: Special) => CRIT_FAILURE_THRESHOLD
// export const getCritFailureThreshold = (s: Special) => 100 - 11 - s.luck
