import { ReactNode, createContext, useCallback, useContext, useMemo, useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useFocusEffect } from "expo-router"

import { create } from "zustand"

import DrawerPage from "components/DrawerPage"
import { getSlideWidth } from "components/Slides/slide.utils"

type SliderId = "actionSlider" | "reactionSlider"

type SlidesStoreType = {
  actionSlider: number
  reactionSlider: number
  actions: {
    setSlideIndex: (id: SliderId, index: number) => void
  }
}

const useSlidersStore = create<SlidesStoreType>(set => ({
  actionSlider: 0,
  reactionSlider: 0,
  actions: {
    setSlideIndex: (id: SliderId, index: number) => set(state => ({ ...state, [id]: index }))
  }
}))
export const useSliderIndex = (id: SliderId) => useSlidersStore(state => state[id])
export const useSetSliderIndex = () => useSlidersStore(state => state.actions.setSlideIndex)

type SlidesContextType = { scrollTo: (i: number) => void }
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
  const lastIndex = useSliderIndex(sliderId)

  useFocusEffect(
    useCallback(() => {
      if (lastIndex) {
        scrollRef?.current?.scrollTo({ x: lastIndex * slideWidth, animated: true })
      }
      return () => {
        setSlideIndex(sliderId, scrollIndex.current)
      }
    }, [sliderId, setSlideIndex, slideWidth, lastIndex])
  )

  const slidesApi = useMemo(
    () => ({
      scrollTo: (i: number, animated = true) => {
        scrollRef?.current?.scrollTo({ x: i * slideWidth, animated })
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
          onScroll={e => {
            const res = Math.round(e.nativeEvent.contentOffset.x / slideWidth)
            scrollIndex.current = res
          }}
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
