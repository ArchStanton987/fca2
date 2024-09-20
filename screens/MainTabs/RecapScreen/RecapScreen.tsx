import { CharBottomTabScreenProps } from "nav/nav.types"

import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import EquipedObjSection from "screens/MainTabs/RecapScreen/EquipedObjSection"
import HealthSection from "screens/MainTabs/RecapScreen/HealthSection"
import SkillsSection from "screens/MainTabs/RecapScreen/SkillsSection"

export default function RecapScreen({ navigation, route }: CharBottomTabScreenProps<"Résumé">) {
  return (
    <DrawerPage>
      <HealthSection navigation={navigation} route={route} />
      <Spacer x={10} />
      <EquipedObjSection />
      <Spacer x={10} />
      <SkillsSection />
    </DrawerPage>
  )
}
