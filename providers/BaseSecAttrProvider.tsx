import { createContext, useContext, useMemo } from "react"

import secAttrMap from "models/character/sec-attr/sec-attr"
import { SecAttrId } from "models/character/sec-attr/sec-attr-types"
import skillsMap from "models/character/skills/skills"
import { SkillId } from "models/character/skills/skills-types"
import { BaseContext } from "providers/BaseProvider"

type BaseSecAttrType = {
  [key in SecAttrId]: number
}
type BaseSkillsType = {
  [key in SkillId]: number
}
type BaseSecAttrContextType = {
  baseSecAttr: BaseSecAttrType | null
  baseSkills: BaseSkillsType | null
}

export const BaseSecAttrContext = createContext<BaseSecAttrContextType>(
  {} as BaseSecAttrContextType
)

const secAttrList = Object.values(secAttrMap)
const skillsList = Object.values(skillsMap)

export default function BaseSecAttrProvider({ children }: { children: React.ReactNode }) {
  const { baseSpecial } = useContext(BaseContext)

  const baseSecAttr = useMemo(() => {
    if (!baseSpecial) return null
    const obj = {} as BaseSecAttrType
    secAttrList.forEach(attr => {
      obj[attr.id] = attr.calc(baseSpecial)
    })
    return obj
  }, [baseSpecial])

  const baseSkills = useMemo(() => {
    if (!baseSpecial) return null
    const obj = {} as BaseSkillsType
    skillsList.forEach(skill => {
      obj[skill.id] = skill.calc(baseSpecial)
    })
    return obj
  }, [baseSpecial])

  const context = useMemo(() => ({ baseSecAttr, baseSkills }), [baseSecAttr, baseSkills])

  return <BaseSecAttrContext.Provider value={context}>{children}</BaseSecAttrContext.Provider>
}
