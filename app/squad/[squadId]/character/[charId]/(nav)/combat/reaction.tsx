import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import { SlidesProvider } from "providers/SlidesProvider"
import ReactionRollSlide from "screens/CombatScreen/slides/DiceRollSlide/ReactionRollSlide"
import PickReactionSlide from "screens/CombatScreen/slides/PickReactionSlide"
import ReactionScoreResultSlide from "screens/CombatScreen/slides/score-result/ReactionScoreResultSlide"

const slides = [
  { id: "pickReaction", renderSlide: (props: SlideProps) => <PickReactionSlide {...props} /> },
  { id: "diceRoll", renderSlide: (props: SlideProps) => <ReactionRollSlide {...props} /> },
  { id: "result", renderSlide: () => <ReactionScoreResultSlide /> }
]

function SlideList() {
  return (
    <List
      data={slides}
      horizontal
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => item.renderSlide({ slideIndex: index })}
    />
  )
}

export default function ReactionsScreen() {
  return (
    <SlidesProvider sliderId="reactionSlider">
      <SlideList />
    </SlidesProvider>
  )
}
