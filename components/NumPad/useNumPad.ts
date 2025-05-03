import { useState } from "react"

export default function useNumPad(initValue: string = "", maxLength: number = 2) {
  const [scoreStr, setScore] = useState(initValue)

  const onPressKeypad = (keyValue: string) => {
    switch (keyValue) {
      case "del":
        if (scoreStr.length > 0) {
          setScore(prev => prev.slice(0, -1))
        }
        break
      case "clear":
        setScore("")
        break
      case keyValue.match(/^\d$/)?.[0]:
        if (scoreStr.length < maxLength) {
          setScore(prev => prev + keyValue)
        }
        break
      default:
        throw new Error("Invalid key value")
    }
  }

  return { scoreStr, onPressKeypad, setScore }
}
