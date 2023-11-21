import { createContext, useContext, useMemo } from "react"

import useGetEffectsSources from "hooks/db/useGetEffectsSources"
import effectsMap from "models/character/effects/effects"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { SecAttrId } from "models/character/sec-attr/sec-attr-types"
import skillsMap from "models/character/skills/skills"
import { SkillId } from "models/character/skills/skills-types"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"
import clothingsMap from "models/objects/clothing/clothings"
import { getModAttribute } from "utils/char-calc"

import { BaseAttrContext } from "./BaseAttrProvider"

type CurrAttrContextType = {
  currSpecial: SpecialValues | null
  currSecAttr: CurrSecAttrType | null
  currSkills: CurrSkillsType | null
}

type CurrSecAttrType = {
  [key in SecAttrId]: number
}
type CurrSkillsType = {
  [key in SkillId]: number
}

const secAttrList = Object.values(secAttrMap)
const skillsList = Object.values(skillsMap)

export const CurrAttrContext = createContext<CurrAttrContextType>({} as CurrAttrContextType)

export default function CurrAttrProvider({
  charId,
  children
}: {
  charId: string
  children: React.ReactNode
}) {
  const { baseSpecial } = useContext(BaseAttrContext)
  const { effects, equipedObj } = useGetEffectsSources(charId)
  const clothings = equipedObj?.clothings || []

  const effectsSymptoms = effects?.map(el => effectsMap[el.id].symptoms) || []
  const clothingsSymptoms = clothings.map(el => clothingsMap[el.id].symptoms) || []
  const symptoms = [...effectsSymptoms, ...clothingsSymptoms].flat()

  const special = useMemo(() => {
    const modSpecial = {} as SpecialValues
    const currSpecial = {} as SpecialValues
    if (!baseSpecial) return { modSpecial, currSpecial }
    specialArray.forEach(el => {
      modSpecial[el.id] = getModAttribute(symptoms, el.id)
      currSpecial[el.id] = baseSpecial[el.id] + modSpecial[el.id]
    })
    return { modSpecial, currSpecial }
  }, [baseSpecial, symptoms])

  const { modSpecial, currSpecial } = special

  const secAttr = useMemo(() => {
    const modSecAttr = {} as CurrSecAttrType
    const currSecAttr = {} as CurrSecAttrType
    if (!currSpecial) return { modSecAttr, currSecAttr }
    secAttrList.forEach(attr => {
      modSecAttr[attr.id] = getModAttribute(symptoms, attr.id)
      currSecAttr[attr.id] = attr.calc(currSpecial) + modSecAttr[attr.id]
    })
    return { modSecAttr, currSecAttr }
  }, [currSpecial, symptoms])

  const { modSecAttr, currSecAttr } = secAttr

  const skills = useMemo(() => {
    const modSkills = {} as CurrSkillsType
    const currSkills = {} as CurrSkillsType
    if (!currSpecial) return { modSkills, currSkills }
    skillsList.forEach(skill => {
      modSkills[skill.id] = getModAttribute(symptoms, skill.id)
      currSkills[skill.id] = skill.calc(currSpecial) + modSkills[skill.id]
    })
    return { modSkills, currSkills }
  }, [currSpecial, symptoms])

  const { modSkills, currSkills } = skills

  const context = useMemo(
    () => ({ modSpecial, currSpecial, modSecAttr, currSecAttr, modSkills, currSkills }),
    [modSpecial, currSpecial, modSecAttr, currSecAttr, modSkills, currSkills]
  )

  return <CurrAttrContext.Provider value={context}>{children}</CurrAttrContext.Provider>
}
