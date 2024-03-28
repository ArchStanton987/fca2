import database from "config/firebase"
import { child, push, ref, remove, update } from "firebase/database"

export const addCollectible = (containerUrl: string, data: any) => {
  const newKey = push(child(ref(database), containerUrl)).key
  const updates: Record<string, any> = {}
  updates[`${containerUrl}/${newKey}`] = data
  return update(ref(database), updates)
}

export const groupAddCollectible = (array: { containerUrl: string; data: any }[]) => {
  const updates: Record<string, any> = {}
  array.forEach(({ containerUrl, data }) => {
    const newKey = push(child(ref(database), containerUrl)).key
    updates[`${containerUrl}/${newKey}`] = data
  })
  return update(ref(database), updates)
}

export const removeCollectible = (url: string) => remove(ref(database, url))

export const groupRemoveCollectible = (urls: string[]) => {
  const updates: Record<string, any> = {}
  urls.forEach(url => {
    updates[url] = null
  })
  return update(ref(database), updates)
}

export const updateValue = (url: string, data: any) => {
  const updates: Record<string, any> = {}
  updates[url] = data
  return update(ref(database), updates)
}

export const groupUpdateValue = (array: { url: string; data: any }[]) => {
  const updates: Record<string, any> = {}
  array.forEach(({ url, data }) => {
    updates[url] = data
  })
  return update(ref(database), updates)
}
