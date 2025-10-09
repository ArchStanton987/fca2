import { ReactNode, createContext, useContext, useMemo } from "react"

import { useQueryClient } from "@tanstack/react-query"
import getUseCases from "lib/get-use-cases"

import { useCollectiblesData } from "./AdditionalElementsProvider"

export const UseCasesContext = createContext({} as ReturnType<typeof getUseCases>)

export default function UseCasesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const collectiblesData = useCollectiblesData()
  const useCases = useMemo(
    () => getUseCases({ db: "rtdb", collectiblesData, store: queryClient }),
    [collectiblesData, queryClient]
  )

  return <UseCasesContext.Provider value={useCases}>{children}</UseCasesContext.Provider>
}

export function useGetUseCases() {
  const useCases = useContext(UseCasesContext)
  if (!useCases) throw new Error("useGetUseCases must be used within a UseCasesProvider")
  return useCases
}
