import React, { PropsWithChildren, useMemo, useState } from "react"

import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"

import AuthContext from "contexts/AuthContext"
import LoadingScreen from "screens/LoadingScreen"

export default function AuthProvider({ children }: PropsWithChildren) {
  const [userId, setUserId] = useState<string | null>(null)

  const auth = getAuth()
  signInAnonymously(auth)

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setUserId(user.uid)

      // ...
    } else {
      // User is signed out
      // ...
    }
  })

  const context = useMemo(() => ({ userId }), [userId])

  if (!userId) {
    return <LoadingScreen />
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
