/* eslint-disable import/prefer-default-export */
import combatModsMap from "../../combat/combat-mods"
import knowledgesMap from "../abilities/knowledges/knowledges"
import secAttrMap from "../abilities/sec-attr/sec-attr"
import skillsMap from "../abilities/skills/skills"
import specialMap from "../abilities/special/special"
import healthMap from "../health/healthMap"
import { ChangeableAttribute } from "./symptoms.type"

export const changeableAttributesMap: Record<ChangeableAttribute, Record<"short", string>> = {
  ...specialMap,
  ...secAttrMap,
  ...skillsMap,
  ...combatModsMap,
  ...knowledgesMap,
  ...healthMap
}
