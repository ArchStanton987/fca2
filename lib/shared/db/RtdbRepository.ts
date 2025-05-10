import database from "config/firebase-env"
import { child, push, ref, update } from "firebase/database"

import { BaseParams, DbEntity, Repository } from "./Repository"
import rtdb from "./api-rtdb"
import { RtdbReturnTypes } from "./api-rtdb.types"
import getSub from "./get-sub"
import updateValue from "./update-value"

type Collectible = { id?: string | number }
type Child<T> = { childKey: T }
type CollectibleChild<T> = Collectible & Child<T>

export default abstract class RtdbRepository<Db extends DbEntity, BP extends BaseParams>
  implements Repository<Db, BP>
{
  rtdb = rtdb
  abstract getPath(params: BP & { childKey?: keyof Db }): RtdbReturnTypes

  subGetValue = null

  get = (params: BP & Collectible) => getSub<Db>(this.getPath(params)).getSnapshot()

  sub = (params: BP & Collectible) => getSub<Db>(this.getPath(params))

  set = (params: BP & Collectible, data: Db) => updateValue(this.getPath(params), data)

  patch = (params: BP & Collectible, data: Partial<Db>) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    Object.entries(data).forEach(([key, value]) => {
      updatesObj[this.getPath({ ...params, childKey: key })] = value
    })
    return update(ref(database), updatesObj)
  }

  delete = (params: BP & Collectible) => updateValue(this.getPath(params), null)

  add = (params: BP & { id?: string | number }, data: Db) => {
    if (!params.id) return push(child(ref(database), this.getPath(params)), data)
    return updateValue(this.getPath(params), data)
  }

  getAll = (params: BP) => getSub<Record<string, Db>>(this.getPath(params)).getSnapshot()

  subAll = (params: BP) => getSub<Record<string, Db>>(this.getPath(params))

  setAll = (params: BP, data: Record<string, Db>) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    Object.entries(data).forEach(([id, value]) => {
      updatesObj[this.getPath({ ...params, id })] = value
    })
    return update(ref(database), updatesObj)
  }

  deleteAll = (params: BP) => updateValue(this.getPath(params), null)

  getChild = <K extends keyof Db>(params: BP & CollectibleChild<K>) =>
    getSub<Db[K]>(this.getPath(params)).getSnapshot()

  subChild = <K extends keyof Db>(params: BP & CollectibleChild<K>) =>
    getSub<Db[K]>(this.getPath(params))

  setChild = <K extends keyof Db>(params: BP & CollectibleChild<K>, data: Db[K]) =>
    updateValue(this.getPath(params), data)

  patchChild = <K extends keyof Db>(params: BP & CollectibleChild<K>, data: Partial<Db[K]>) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    Object.entries(data).forEach(([key, value]) => {
      updatesObj[this.getPath(params).concat(`/${key}`)] = value
    })
    return update(ref(database), updatesObj)
  }

  deleteChild = <K extends keyof Db>(params: BP & CollectibleChild<K>) =>
    updateValue(this.getPath(params), null)

  addChild = <K extends keyof Db>(
    params: BP & CollectibleChild<K> & { childId?: string | number },
    data: Db[K]
  ) => {
    if (!params.childId) return push(child(ref(database), this.getPath(params)), data)
    return updateValue(this.getPath(params), data)
  }

  deleteChildren = <K extends keyof Db>(
    params: BP & { id: string } & { childKey: K },
    keys: Db[K][]
  ) => {
    const updatesObj: Record<RtdbReturnTypes, any> = {}
    keys.forEach(key => {
      updatesObj[this.getPath({ ...params, childKey: key })] = null
    })
    return update(ref(database), updatesObj)
  }
}
