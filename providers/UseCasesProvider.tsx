import { ReactNode, createContext, useContext, useMemo } from "react"

import { useQueryClient } from "@tanstack/react-query"
import getUseCases from "lib/get-use-cases"

import useCreatedElements from "hooks/context/useCreatedElements"

export const UseCasesContext = createContext({} as ReturnType<typeof getUseCases>)

export default function UseCasesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const createdElements = useCreatedElements()
  const useCases = useMemo(
    () => getUseCases({ dbType: "rtdb", createdElements, store: queryClient }),
    [createdElements, queryClient]
  )

  return <UseCasesContext.Provider value={useCases}>{children}</UseCasesContext.Provider>
}

export function useGetUseCases() {
  const useCases = useContext(UseCasesContext)
  if (!useCases) throw new Error("useGetUseCases must be used within a UseCasesProvider")
  return useCases
}
