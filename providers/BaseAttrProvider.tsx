import { createContext, useContext, useMemo } from "react"

import useGetAbilities from "hooks/db/useGetAbilities"
import perksMaps from "models/character/perks/perks"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { SecAttrsValues } from "models/character/sec-attr/sec-attr-types"
import skillsMap from "models/character/skills/skills"
import { SkillsValues } from "models/character/skills/skills-types"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"
import traitsMap from "models/character/traits/traits"
import { getModAttribute } from "utils/char-calc"

type BaseAttrType = {
  baseSpecial: SpecialValues
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
  const perksSymptoms = perks.map(el => perksMaps[el].symptoms)
  const symptoms = [...traitsSymptoms, ...perksSymptoms].flat()

  const baseSpecial = useMemo((): SpecialValues | null => {
    if (!baseSPECIAL) return null
    const res = {} as SpecialValues
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
