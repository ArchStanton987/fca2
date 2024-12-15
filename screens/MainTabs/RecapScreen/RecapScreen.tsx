import { memo } from "react"

import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import EquipedObjSection from "screens/MainTabs/RecapScreen/EquipedObjSection"
import HealthSection from "screens/MainTabs/RecapScreen/HealthSection"
import SkillsSection from "screens/MainTabs/RecapScreen/SkillsSection"
import layout from "styles/layout"

function RecapScreen() {
  return (
    <DrawerPage>
      <HealthSection />
      <Spacer x={layout.globalPadding} />
      <EquipedObjSection />
      <Spacer x={layout.globalPadding} />
      <SkillsSection />
    </DrawerPage>
  )
}

export default memo(RecapScreen)
