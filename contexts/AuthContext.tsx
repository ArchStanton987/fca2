import React from "react"

export type AuthContextType = {
  userId: string | null
}

const defaultAuthContext: AuthContextType = {
  userId: null
}

const AuthContext = React.createContext(defaultAuthContext)

export default AuthContext
