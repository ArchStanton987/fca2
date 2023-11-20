import { createContext, useContext, useMemo } from "react"

import useGetEffectsSources from "hooks/db/useGetEffectsSources"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"
import { BaseContext } from "providers/BaseProvider"

type BaseContextType = {
  isLoading: boolean
  modSpecial: SpecialValues | null
  currSpecial: SpecialValues | null
}

export const CurrContext = createContext<BaseContextType>({
  isLoading: true,
  modSpecial: null,
  currSpecial: null
})

export default function BaseProvider({
  charId,
  children
}: {
  charId: string
  children: React.ReactNode
}) {
  // const abilities = useGetAbilities(charId)
  // const { effects, equipedObj } = useGetEffectsSources(charId)
  // const baseContext = useContext(BaseContext)
  // const { baseSpecial } = baseContext

  // const getSymptoms = ()

  // const currSpecial = useMemo((): SpecialValues | null => {
  //   if (!abilities?.baseSPECIAL) return null
  //   const res = {} as SpecialValues
  //   specialArray.forEach(el => {
  //     res[el.id] = el.getBase(abilities, el.id) + abilities.baseSPECIAL[el.id]
  //   })
  //   return res
  // }, [abilities])

  // const context = useMemo(
  //   () => ({
  //     isLoading: effects === null || equipedObj === null,
  //     baseSpecial
  //   }),
  //   [abilities, baseSpecial]
  // )

  return <BaseContext.Provider value={context}>{children}</BaseContext.Provider>
}
