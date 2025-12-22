import { ReactNode, createContext, useCallback, useContext, useMemo, useRef } from "react"
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions
} from "react-native"

import { create } from "zustand"

import DrawerPage from "components/DrawerPage"
import { getSlideWidth } from "components/Slides/slide.utils"

type SliderId = "actionSlider" | "reactionSlider" | "gmActionSlider"

type SlidesStoreType = {
  actionSlider: number
  gmActionSlider: number
  reactionSlider: number
  actions: {
    setSlideIndex: (id: SliderId, index: number) => void
  }
}

const useSlidersStore = create<SlidesStoreType>(set => ({
  actionSlider: 0,
  gmActionSlider: 0,
  reactionSlider: 0,
  actions: {
    setSlideIndex: (id: SliderId, index: number) => set(state => ({ ...state, [id]: index }))
  }
}))
export const useSliderIndex = (id: SliderId) => useSlidersStore(state => state[id])
export const useSetSliderIndex = () => useSlidersStore(state => state.actions.setSlideIndex)

type SlidesContextType = { scrollTo: (i: number) => void; resetSlider: () => void }
const SlidesContext = createContext({} as SlidesContextType)

export function SlidesProvider({
  children,
  sliderId
}: {
  children: ReactNode
  sliderId: SliderId
}) {
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)
  const scrollRef = useRef<ScrollView>(null)
  const scrollIndex = useRef(0)
  const setSlideIndex = useSetSliderIndex()

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const res = Math.round(e.nativeEvent.contentOffset.x / slideWidth)
      scrollIndex.current = res
      setSlideIndex(sliderId, res)
    },
    [slideWidth, setSlideIndex, sliderId]
  )

  const slidesApi = useMemo(
    () => ({
      scrollTo: (i: number, animated = true) => {
        scrollRef?.current?.scrollTo({ x: i * slideWidth, animated })
      },
      resetSlider: () => {
        scrollRef?.current?.scrollTo({ x: 0 })
      }
    }),
    [slideWidth]
  )

  return (
    <SlidesContext.Provider value={slidesApi}>
      <DrawerPage>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={slideWidth}
          decelerationRate="fast"
          disableIntervalMomentum
          ref={scrollRef}
          bounces={false}
          scrollEventThrottle={1000}
          onScroll={onScroll}
        >
          {children}
        </ScrollView>
      </DrawerPage>
    </SlidesContext.Provider>
  )
}

export function useScrollTo() {
  const context = useContext(SlidesContext)
  if (!context) throw new Error("SlidesContext not found")
  return context
}
