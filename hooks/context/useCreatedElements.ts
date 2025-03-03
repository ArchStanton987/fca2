import React from "react"

import { AdditionalElementsContext } from "contexts/AdditionalElementsContext"

export default function useCreatedElements() {
  const createdElements = React.useContext(AdditionalElementsContext)

  if (!createdElements) {
    throw new Error("useCreatedElements must be used within an AdditionalElementsProvider")
  }

  return createdElements
}
