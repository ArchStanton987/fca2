import { createContext, useContext } from "react"

import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"

export const CharacterContext = createContext<Character | NonHuman | null>(null)
export const useCharacter = () => {
  const character = useContext(CharacterContext)
  if (!character) throw new Error("useCharacter must be used inside a CharacterContext.Provider")
  return character
}
