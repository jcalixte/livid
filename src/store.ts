import Vue from 'vue'
import Vuex from 'vuex'
import Unity from './models/Unity'
import Circle from './engine/Circle'
import Shape from './engine/Shape'

Vue.use(Vuex)

const SET_CONTEXT: string = 'SET_CONTEXT'
const ADD_UNITY: string = 'ADD_UNITY'
const RESET_UNITIES: string = 'RESET_UNITIES'

interface IState {
  context: CanvasRenderingContext2D | null
  unities: Unity[]
}

const store = new Vuex.Store<IState>({
  state: {
    context: null,
    unities: []
  },
  mutations: {
    [SET_CONTEXT]: (state, ctx): void => {
      state.context = ctx
    },
    [ADD_UNITY]: (state, unity: Unity): void => {
      state.unities.push(unity)
    },
    [RESET_UNITIES]: (state): void => {
      state.unities = []
    }
  },
  actions: {
    setContext({ commit }, ctx: CanvasRenderingContext2D): void {
      commit(SET_CONTEXT, ctx)
    },
    addUnity({ commit }, unities: Unity[]): void {
      if (!unities) {
        return
      }
      unities.forEach((unity: Unity) => {
        commit(ADD_UNITY, unity)
      })
    },
    resetUnities({ commit }): void {
      commit(RESET_UNITIES)
    }
  },
  getters: {
    context: (state: IState) => state.context,
    unities: (state: IState) => state.unities,
    shapes: (state: IState): Shape[] =>
      state.unities.map((unity: Unity) => unity.shape),
    fieldOfViews: (state: IState): Circle[] =>
      state.unities.map((unity: Unity) => unity.fieldOfView)
  }
})

export default store

export const context = (): CanvasRenderingContext2D | null =>
  store.getters.context
