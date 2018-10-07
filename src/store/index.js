import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

const createStore = () => {
  return new Vuex.Store({
    state: {
      users: [],
    },
    mutations: {
      ...firebaseMutations
    },
    actions: {
      setUsersRef: firebaseAction(({ bindFirebaseRef }, ref) => {
        bindFirebaseRef('users', ref)
      })
    },
    getters: {
      getUsers: (state) => {
        return state.users
      },
    },
  })
}

export default createStore
