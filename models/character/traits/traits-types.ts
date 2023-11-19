import { Symptom, SymptomContainer } from "../effects/symptom"

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

export type Trait = SymptomContainer & {
  id: TraitId
  label: string
  symptoms: Symptom[]
  description: string
}
