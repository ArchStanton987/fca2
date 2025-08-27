import { useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { getSlideWidth } from "components/Slides/slide.utils"

export default function useScrollToSlide() {
  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)

  const scrollTo = (index: number, animated = true) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ x: index * slideWidth, animated })
  }

  return { scrollRef, scrollTo, slideWidth }
}
