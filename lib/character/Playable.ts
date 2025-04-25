import { ClothingData } from "lib/objects/data/clothings/clothings.types"
import { DbEquipedObjects } from "lib/objects/data/objects.types"
import { Weapon, WeaponData } from "lib/objects/data/weapons/weapons.types"

import { KnowledgeId } from "./abilities/knowledges/knowledge-types"
import { Perk } from "./abilities/perks/perks.types"
import { SecAttrsValues } from "./abilities/sec-attr/sec-attr-types"
import { SkillsValues } from "./abilities/skills/skills.types"
import { Special } from "./abilities/special/special.types"
import { Trait } from "./abilities/traits/traits.types"
import { Effect, EffectData } from "./effects/effects.types"
import { Health } from "./health/health-types"
import { DbCharMeta } from "./meta/meta"
import { Progress } from "./progress/progress.types"
import { DbStatus } from "./status/status.types"

export default interface Playable {
  // meta
  charId: string
  fullname: string
  date: Date
  squadId: string
  meta: DbCharMeta

  // abilities
  special: { base: Special; mod: Special; curr: Special }
  secAttr: { base: SecAttrsValues; mod: SecAttrsValues; curr: SecAttrsValues }
  skills: { base: SkillsValues; up: SkillsValues; mod: SkillsValues; curr: SkillsValues }
  knowledges: { id: KnowledgeId; value: number }[]
  knowledgesRecord: Record<KnowledgeId, number>
  traits: Trait[]
  traitsRecord: Record<string, Trait>
  perks: Perk[]
  perksRecord: Record<string, Perk>

  // status
  status: DbStatus
  health: Health
  progress: Progress

  // effects
  allEffects: Record<string, EffectData> // with created elements
  effects: Effect[]
  effectsRecord: Record<string, Effect>

  // equiped objects
  unarmed: Weapon
  dbEquipedObjects: DbEquipedObjects
  equipedObjects: {
    weapons: { dbKey: string; data: WeaponData; inMagazine?: number }[]
    clothings: { dbKey: string; data: ClothingData }[]
  }
}
