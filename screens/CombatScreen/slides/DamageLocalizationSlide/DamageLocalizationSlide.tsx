import { ReactNode } from "react"
import { View } from "react-native"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionTargetId } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import layout from "styles/layout"

import AwaitTargetSlide from "../wait-slides/AwaitTargetSlide"
import DamageLoc from "./DamageLocalization"
import styles from "./DamageLocalization.styles"

type DamageLocalizationSlideProps = SlideProps & {}

function AwaitTargetWrapper({ children }: { children: ReactNode }) {
  const targetId = useActionTargetId() ?? ""
  if (!targetId || targetId === "") return <AwaitTargetSlide />
  return children
}

export default function DamageLocalizationSlide({ slideIndex }: DamageLocalizationSlideProps) {
  const { scrollTo } = useScrollTo()

  return (
    <AwaitTargetWrapper>
      <DrawerSlide>
        <Section
          title="localisation des dégâts"
          contentContainerStyle={{ flex: 1, height: "100%" }}
        >
          <DamageLoc.DamageLocNumPad />
        </Section>

        <Spacer x={layout.globalPadding} />

        <Section
          title="JET DE DÉ"
          style={{ flex: 1 }}
          contentContainerStyle={styles.scoreContainer}
        >
          <DamageLoc.Score />
        </Section>

        <Spacer x={layout.globalPadding} />

        <View style={{ flex: 1, minWidth: 100 }}>
          <Section
            title="résultat"
            style={{ flex: 1 }}
            contentContainerStyle={styles.scoreContainer}
          >
            <DamageLoc.LimbResult />
          </Section>
          <Spacer y={layout.globalPadding} />

          <DamageLoc.NextSection>
            <DamageLoc.Submit onSuccess={() => scrollTo(slideIndex + 1)} />
          </DamageLoc.NextSection>
        </View>
      </DrawerSlide>
    </AwaitTargetWrapper>
  )
}
