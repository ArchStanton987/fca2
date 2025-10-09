import { QueryClient } from "@tanstack/react-query"

import { AdditionalElContextType } from "providers/AdditionalElementsProvider"

import { DbType } from "./shared/db/db.types"

export type UseCasesConfig = {
  db: DbType
  collectiblesData: AdditionalElContextType
  store: QueryClient
}
