import { createContext, useContext, useMemo } from "react"

import useGetEffectsSources from "hooks/db/useGetEffectsSources"
import effectsMap from "models/character/effects/effects"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { SecAttrsValues } from "models/character/sec-attr/sec-attr-types"
import skillsMap from "models/character/skills/skills"
import { SkillsValues } from "models/character/skills/skills-types"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"
import clothingsMap from "models/objects/clothing/clothings"
import { getModAttribute } from "utils/char-calc"

import { BaseAttrContext, NotReadyType, ReadyType } from "./BaseAttrProvider"

type LiveAttrType = {
  modSpecial: SpecialValues
  modSecAttr: SecAttrsValues
  modSkills: SkillsValues
  currSpecial: SpecialValues
  currSecAttr: SecAttrsValues
  currSkills: SkillsValues
}

type LiveAttrContextType = ReadyType<LiveAttrType> | NotReadyType<LiveAttrType>

const secAttrList = Object.values(secAttrMap)
const skillsList = Object.values(skillsMap)

const init: LiveAttrContextType = {
  modSpecial: null,
  modSecAttr: null,
  modSkills: null,
  currSpecial: null,
  currSecAttr: null,
  currSkills: null,
  isReady: false
}

export const CurrAttrContext = createContext<LiveAttrContextType>(init)

export const useCurrAttr = () => {
  const context = useContext(CurrAttrContext)
  if (!context) throw new Error("useCurrAttr must be used within a CurrAttrProvider")
  return context
}

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
    if (!baseSpecial) return { modSpecial: null, currSpecial: null }
    specialArray.forEach(el => {
      modSpecial[el.id] = getModAttribute(symptoms, el.id)
      currSpecial[el.id] = baseSpecial[el.id] + modSpecial[el.id]
    })
    return { modSpecial, currSpecial }
  }, [baseSpecial, symptoms])

  const { modSpecial, currSpecial } = special

  const secAttr = useMemo(() => {
    const modSecAttr = {} as SecAttrsValues
    const currSecAttr = {} as SecAttrsValues
    if (!currSpecial) return { modSecAttr: null, currSecAttr: null }
    secAttrList.forEach(attr => {
      modSecAttr[attr.id] = getModAttribute(symptoms, attr.id)
      currSecAttr[attr.id] = attr.calc(currSpecial) + modSecAttr[attr.id]
    })
    return { modSecAttr, currSecAttr }
  }, [currSpecial, symptoms])

  const { modSecAttr, currSecAttr } = secAttr

  const skills = useMemo(() => {
    const modSkills = {} as SkillsValues
    const currSkills = {} as SkillsValues
    if (!currSpecial) return { modSkills: null, currSkills: null }
    skillsList.forEach(skill => {
      modSkills[skill.id] = getModAttribute(symptoms, skill.id)
      currSkills[skill.id] = skill.calc(currSpecial) + modSkills[skill.id]
    })
    return { modSkills, currSkills }
  }, [currSpecial, symptoms])

  const { modSkills, currSkills } = skills

  const isReady =
    !!modSpecial && !!currSpecial && !!modSecAttr && !!currSecAttr && !!modSkills && !!currSkills

  const context = useMemo(() => {
    if (!isReady) return init
    return {
      modSpecial,
      modSecAttr,
      modSkills,
      currSpecial,
      currSecAttr,
      currSkills,
      isReady: isReady as true
    }
  }, [modSpecial, modSecAttr, modSkills, currSpecial, currSecAttr, currSkills, isReady])

  return <CurrAttrContext.Provider value={context}>{children}</CurrAttrContext.Provider>
}
