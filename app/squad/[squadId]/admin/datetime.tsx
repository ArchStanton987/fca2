import PlayablesProvider from "lib/character/playables-provider"
import { useSquad } from "lib/squad/use-cases/sub-squad"

import DatetimeSelectionScreen from "screens/AdminTabs/DatetimeSelectionScreen/DatetimeSelectionScreen"

export default function DatetimeSelection() {
  const { members, npcs } = useSquad()
  const ids = Object.keys({ ...members, ...npcs })
  return (
    <PlayablesProvider ids={ids}>
      <DatetimeSelectionScreen />
    </PlayablesProvider>
  )
}
