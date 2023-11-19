import { createContext, useMemo } from "react"

import useGetAbilities from "hooks/db/useGetAbilities"
import { specialArray } from "models/character/special/special"
import { SpecialValues } from "models/character/special/special-types"

type BaseContextType = {
  isLoading: boolean
  baseSpecial: SpecialValues | null
}

export const BaseContext = createContext<BaseContextType>({ isLoading: true, baseSpecial: null })

export default function BaseProvider({
  charId,
  children
}: {
  charId: string
  children: React.ReactNode
}) {
  const abilities = useGetAbilities(charId)

  const baseSpecial = useMemo((): SpecialValues | null => {
    if (!abilities?.baseSPECIAL) return null
    const res = {} as SpecialValues
    specialArray.forEach(el => {
      res[el.id] = el.getBase(abilities, el.id) + abilities.baseSPECIAL[el.id]
    })
    return res
  }, [abilities])

  const context = useMemo(
    () => ({
      isLoading: abilities === null,
      baseSpecial
    }),
    [abilities, baseSpecial]
  )

  return <BaseContext.Provider value={context}>{children}</BaseContext.Provider>
}
