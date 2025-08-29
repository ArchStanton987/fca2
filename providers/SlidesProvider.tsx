import { ReactNode, createContext, useCallback, useContext, useMemo, useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useFocusEffect } from "expo-router"

import DrawerPage from "components/DrawerPage"
import { getSlideWidth } from "components/Slides/slide.utils"

let onLeaveIndex = 0

type SlidesContextType = {
  scrollTo: (i: number) => void
}
const SlidesContext = createContext({} as SlidesContextType)

export function SlidesProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)
  const scrollRef = useRef<ScrollView>(null)
  const scrollIndex = useRef(0)

  useFocusEffect(
    useCallback(() => {
      if (onLeaveIndex !== 0 && scrollRef.current) {
        scrollRef.current.scrollTo({ x: onLeaveIndex * slideWidth, animated: true })
      }
      return () => {
        onLeaveIndex = scrollIndex.current
      }
    }, [slideWidth])
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
