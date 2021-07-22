import Vue from 'vue'
import Vuex from 'vuex'
import authModule, {moduleName as authModuleName} from './modules/auth';
import notesModule, {moduleName as notesModuleName} from './modules/notes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    [authModuleName]: authModule,
    [notesModuleName]: notesModule,
  }
})
