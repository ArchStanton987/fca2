import { Symptom } from "../../effects/symptoms.type"

export type TraitId =
  | "heavy"
  | "carnage"
  | "strongHand"
  | "chemReliant"
  | "berserk"
  | "glowingOne"
  | "kamikaze"
  | "hamHands"
  | "bruiser"
  | "mrFast"
  | "jinxed"
  | "nightPeople"
  | "peacefull"
  | "sexAppeal"
  | "sm"
  | "talented"
  | "skilled"
  | "fastMetabolism"
  | "finesse"
  | "smallFrame"
  | "lunatic"

export type Trait = {
  id: TraitId
  description: string
  label: string
  symptoms: Symptom[]
}
