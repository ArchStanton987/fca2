import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"

export default function NotFound() {
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }} title="Choisissez une câtégorie">
        <Spacer style={{ flex: 1 }} />
      </Section>
    </DrawerPage>
  )
}
