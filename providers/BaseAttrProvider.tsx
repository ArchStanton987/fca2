import { createContext, useContext, useMemo } from "react"

import useGetAbilities from "hooks/db/useGetAbilities"
import perksMaps from "models/character/perks/perks"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { SecAttrId } from "models/character/sec-attr/sec-attr-types"
import skillsMap from "models/character/skills/skills"
import { SkillId } from "models/character/skills/skills-types"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"
import traitsMap from "models/character/traits/traits"
import { getModAttribute } from "utils/char-calc"

type BaseAttrContextType = {
  baseSpecial: SpecialValues | null
  baseSecAttr: BaseSecAttrType | null
  baseSkills: BaseSkillsType | null
}

type BaseSecAttrType = {
  [key in SecAttrId]: number
}
type BaseSkillsType = {
  [key in SkillId]: number
}

const secAttrList = Object.values(secAttrMap)
const skillsList = Object.values(skillsMap)

export const BaseAttrContext = createContext<BaseAttrContextType>({} as BaseAttrContextType)

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
  const traitsSymptoms = traits.map(el => traitsMap[el].symptoms)
  const perksSymptoms = perks.map(el => perksMaps[el].symptoms)
  const symptoms = [...traitsSymptoms, ...perksSymptoms].flat()

  const baseSpecial = useMemo(() => {
    if (!baseSPECIAL) return null
    const res = {} as SpecialValues
    specialArray.forEach(el => {
      res[el.id] = baseSPECIAL[el.id] + getModAttribute(symptoms, el.id)
    })
    return res
  }, [baseSPECIAL, symptoms])

  const baseSecAttr = useMemo(() => {
    if (!baseSpecial) return null
    const obj = {} as BaseSecAttrType
    secAttrList.forEach(attr => {
      obj[attr.id] = attr.calc(baseSpecial) + getModAttribute(symptoms, attr.id)
    })
    return obj
  }, [baseSpecial, symptoms])

  const baseSkills = useMemo(() => {
    if (!baseSpecial) return null
    const obj = {} as BaseSkillsType
    skillsList.forEach(skill => {
      obj[skill.id] = skill.calc(baseSpecial) + getModAttribute(symptoms, skill.id)
    })
    return obj
  }, [baseSpecial, symptoms])

  const context = useMemo(
    () => ({ baseSpecial, baseSecAttr, baseSkills }),
    [baseSpecial, baseSecAttr, baseSkills]
  )

  return <BaseAttrContext.Provider value={context}>{children}</BaseAttrContext.Provider>
}
