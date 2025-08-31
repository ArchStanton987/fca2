import { useEffect, useState } from "react"

import database from "config/firebase-env"
import dbKeys from "db/db-keys"
import { DataSnapshot, onValue, ref } from "firebase/database"
import Character from "lib/character/Character"
import Squad from "lib/character/Squad"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

export default function useGetSquadCharacters(
  membersIds: string[],
  squad: Squad,
  newElements: CreatedElements = defaultCreatedElements
) {
  const [characters, setCharacters] = useState<Record<string, Character>>({})

  useEffect(() => {
    const unsubscribeFunctions: Record<string, () => void> = {}

    membersIds.forEach(memberId => {
      // Subscribe to Firebase Realtime Database for each memberId
      const charType = memberId in squad.membersRecord ? "characters" : "npcs"
      const databaseRef = ref(database, dbKeys.char(charType, memberId).index)
      const handleSnapshot = (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          // Create Character instance for each snapshot
          const characterData = snapshot.val()
          const characterInstance = new Character(memberId, characterData, squad, newElements)

          // Update characters state
          setCharacters(prev => ({ ...prev, [memberId]: characterInstance }))
        }
      }

      const unsub = onValue(databaseRef, handleSnapshot)

      // Store unsubscribe function for cleanup
      unsubscribeFunctions[memberId] = () => unsub()
    })

    return () => {
      // Unsubscribe from Firebase when component unmounts
      Object.values(unsubscribeFunctions).forEach(unsubscribe => unsubscribe())
    }
    // TODO: Fix exhaustive-deps warning
    // even memoised values seems to trigger infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return characters
}
