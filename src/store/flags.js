let flagId = 1

/**
* @typedef {import("zustand").SetState} SetState
* @typedef {import("zustand").GetState} GetState
*
* @param set {SetState}
* @param get {GetState}
*/
const flags = (set, get) => ({
  flags: [],
  addFlag: (flagData) => {
    const fId = flagId++
    set(() => ({
      flags: [{ ...flagData, id: fId }, ...get().flags],
    }))
    setTimeout(() => {
      get().removeFlag(fId)
    }, 10_000)
  },
  removeFlag: (flagId) => {
    set(() => ({
      flags: get().flags.filter((f) => f.id !== flagId),
    }))
  },
})

export default flags
