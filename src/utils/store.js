import create from "zustand"

export const useStore = create(set => ({

  osc: [
    {freq: 523, amp: -60},
    {freq: 622, amp: -60},
    {freq: 392, amp: -60},
    {freq: 466, amp: -60},
  ],
  setFreq: (id, freq)=>
    set((state)=>({
      ...state.osc[id].freq = freq
    })),

  setAmp: (id, amp)=>
    set((state)=>({
      ...state.osc[id].amp = amp
    })),

  freqX: 440.0,
  setFreqX: (inp) => 
    set((state)=>({
      ...state,
      freqX: inp,
    }))
}))










  // setX: (i) => set({x: i}),
  // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 })


// const useStore = create(
//   (set, get) => ({
//     advance: (type, key, callback) => {
//       set(state => {
//         const newValue = callback(state)
//         return {
//           ...state,
//           [type]: {
//             ...state[type],
//             [key]: newValue,
//           },
//         }
//       })
//       return get()[type][key]
//     },
//     setInitialState: (type, initialState) => {
//       set(state => {
//         return {
//           ...state,
//           [type]: initialState,
//         }
//       })
//     },
//   })
// )

// const { subscribe, getState, setState } = useStore;

// export { useStore, subscribe, getState, setState }