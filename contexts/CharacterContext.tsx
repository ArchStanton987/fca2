import { createContext, useContext } from "react"

import Character from "lib/character/Character"

export const CharacterContext = createContext<Character | null>(null)
export const useCharacter = () => {
  const character = useContext(CharacterContext)
  if (!character) throw new Error("useCharacter must be used inside a CharacterContext.Provider")
  return character
}
