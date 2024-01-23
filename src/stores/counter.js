import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    count: 10,
  }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  },
  getters: {
    oddOrEven: (state) => {
      return state.count % 2 === 0 ? 'even' : 'odd'
    }
  }
})
