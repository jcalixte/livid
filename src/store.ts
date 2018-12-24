import Vue from 'vue'
import Vuex from 'vuex'
import Shape from './engine/Shape'

Vue.use(Vuex)

const SET_CONTEXT: string = 'SET_CONTEXT'
const ADD_SHAPE: string = 'ADD_SHAPE'

interface IState {
  context: CanvasRenderingContext2D | null
  shapes: Shape[]
}

const store = new Vuex.Store<IState>({
  state: {
    context: null,
    shapes: []
  },
  mutations: {
    [SET_CONTEXT]: (state, ctx): void => {
      state.context = ctx
    },
    [ADD_SHAPE]: (state, shape: Shape): void => {
      state.shapes.push(shape)
    }
  },
  actions: {
    setContext({ commit }, ctx: CanvasRenderingContext2D): void {
      commit(SET_CONTEXT, ctx)
    },
    addShape({ commit }, shapes: Shape[]): void {
      if (shapes) {
        shapes.forEach((shape: Shape) => commit(ADD_SHAPE, shape))
      }
    }
  },
  getters: {
    context: (state: IState) => state.context,
    shapes: (state: IState) => state.shapes
  }
})

export default store

export const context = (): CanvasRenderingContext2D | null =>
  store.getters.context
