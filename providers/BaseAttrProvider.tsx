import { createContext, useContext, useMemo } from "react"

import perksMap from "lib/character/abilities/perks/perks"
import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"
import { SecAttrsValues } from "lib/character/abilities/sec-attr/sec-attr-types"
import skillsMap from "lib/character/abilities/skills/skills"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import { specialArray } from "lib/character/abilities/special/special"
import { Special } from "lib/character/abilities/special/special.types"
import traitsMap from "lib/character/abilities/traits/traits"
import { getModAttribute } from "lib/common/utils/char-calc"

import useGetAbilities from "hooks/db/useGetAbilities"

type BaseAttrType = {
  baseSpecial: Special
  baseSecAttr: SecAttrsValues
  baseSkills: SkillsValues
  upSkills: SkillsValues
}

export type ReadyType<T> = T & { isReady: true }
export type NotReadyType<T> = { [key in keyof T]: null } & { isReady: false }

type BaseAttrContextType = ReadyType<BaseAttrType> | NotReadyType<BaseAttrType>

const secAttrList = Object.values(secAttrMap)
const skillsList = Object.values(skillsMap)

const init: BaseAttrContextType = {
  baseSpecial: null,
  baseSecAttr: null,
  baseSkills: null,
  upSkills: null,
  isReady: false
}

export const BaseAttrContext = createContext<BaseAttrContextType>(init)

export const useBaseAttr = () => {
  const baseAttr = useContext(BaseAttrContext)
  if (!baseAttr) throw new Error("useBaseAttr must be used within a BaseAttrProvider")
  return baseAttr
}

export default function BaseAttrProvider({
  charId,
  children
}: {
  charId: string
  children: React.ReactNode
}) {
  const abilities = useGetAbilities(charId)
  const traits = abilities?.traits || []
  const perks = abilities?.perks || []
  const baseSPECIAL = abilities?.baseSPECIAL || null
  const upSkills = abilities?.upSkills || null
  const traitsSymptoms = traits.map(el => traitsMap[el].symptoms)
  const perksSymptoms = perks.map(el => perksMap[el].symptoms)
  const symptoms = [...traitsSymptoms, ...perksSymptoms].flat()

  const baseSpecial = useMemo((): Special | null => {
    if (!baseSPECIAL) return null
    const res = {} as Special
    specialArray.forEach(el => {
      res[el.id] = baseSPECIAL[el.id] + getModAttribute(symptoms, el.id)
    })
    return res
  }, [baseSPECIAL, symptoms])

  const baseSecAttr = useMemo((): SecAttrsValues | null => {
    if (!baseSpecial) return null
    const obj = {} as SecAttrsValues
    secAttrList.forEach(attr => {
      obj[attr.id] = attr.calc(baseSpecial) + getModAttribute(symptoms, attr.id)
    })
    return obj
  }, [baseSpecial, symptoms])

  const baseSkills = useMemo((): SkillsValues | null => {
    if (!baseSpecial) return null
    const obj = {} as SkillsValues
    skillsList.forEach(skill => {
      obj[skill.id] = skill.calc(baseSpecial) + getModAttribute(symptoms, skill.id)
    })
    return obj
  }, [baseSpecial, symptoms])

  const isReady = !!baseSpecial && !!baseSecAttr && !!baseSkills && !!upSkills

  const context = useMemo(() => {
    if (!isReady) return init
    return {
      baseSpecial,
      baseSecAttr,
      baseSkills,
      upSkills,
      isReady
    }
  }, [baseSpecial, baseSecAttr, baseSkills, upSkills, isReady])

  return <BaseAttrContext.Provider value={context}>{children}</BaseAttrContext.Provider>
}
