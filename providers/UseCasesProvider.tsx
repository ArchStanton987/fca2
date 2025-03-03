import { createContext, useContext, useMemo } from "react"

import getUseCases from "lib/get-use-cases"

import useCreatedElements from "hooks/context/useCreatedElements"

export const UseCasesContext = createContext(getUseCases())

export default function UseCasesProvider({ children }: { children: React.ReactNode }) {
  const createdElements = useCreatedElements()
  const useCases = useMemo(() => getUseCases("rtdb", createdElements), [createdElements])

  return <UseCasesContext.Provider value={useCases}>{children}</UseCasesContext.Provider>
}

export function useGetUseCases() {
  const useCases = useContext(UseCasesContext)
  if (!useCases) throw new Error("useGetUseCases must be used within a UseCasesProvider")
  return useCases
}
