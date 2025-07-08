import { ScrollView } from "react-native"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import useScrollToSlide from "hooks/useScrollToSlide"
import ReactionRollSlide from "screens/CombatScreen/slides/DiceRollSlide/ReactionRollSlide"
import PickReactionSlide from "screens/CombatScreen/slides/PickReactionSlide"
import ReactionScoreResultSlide from "screens/CombatScreen/slides/score-result/ReactionScoreResultSlide"

const slides = [
  { id: "pickReaction", renderSlide: (props: SlideProps) => <PickReactionSlide {...props} /> },
  { id: "diceRoll", renderSlide: (props: SlideProps) => <ReactionRollSlide {...props} /> },
  { id: "result", renderSlide: () => <ReactionScoreResultSlide /> }
]

export default function ReactionsScreen() {
  const { scrollRef, scrollTo, slideWidth } = useScrollToSlide()
  return (
    <DrawerPage>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={slideWidth}
        decelerationRate="fast"
        disableIntervalMomentum
        ref={scrollRef}
        bounces={false}
      >
        <List
          data={slides}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            item.renderSlide({
              scrollNext: () => scrollTo(index + 1),
              scrollPrevious: () => scrollTo(index - 1)
            })
          }
        />
      </ScrollView>
    </DrawerPage>
  )
}
