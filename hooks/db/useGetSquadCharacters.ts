import { useEffect, useState } from "react"

import database from "config/firebase-env"
import dbKeys from "db/db-keys"
import { onValue, ref } from "firebase/database"
import Character from "lib/character/Character"

export default function useGetSquadCharacters(squadMembersIds: string[], date: Date) {
  const [characters, setCharacters] = useState<Record<string, Character>>({})

  useEffect(() => {
    const dbRefs = squadMembersIds.map(charId => ({
      charId,
      charDbRef: ref(database, dbKeys.char(charId).index)
    }))
    const unsubscribes = dbRefs.map(({ charDbRef, charId }) =>
      onValue(charDbRef, snapshot => {
        const charData = snapshot.val()
        if (charData) {
          setCharacters(prev => {
            const char = new Character(charData, date, charId)
            return { ...prev, [charId]: char }
          })
        }
      })
    )
    return () => unsubscribes.forEach(unsub => unsub())
  }, [date, squadMembersIds])

  // If the characters are not loaded yet, return null
  const hasNotLoaded = squadMembersIds.some(charId => !characters[charId])

  if (hasNotLoaded) return null

  return characters
}
