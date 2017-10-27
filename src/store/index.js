/**
 * Created by Administrator on 2017/5/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
/* import * as actions from './actions';*/
/* import * as mutations from './mutations';*/

import address from './modules/address'

Vue.use(Vuex)

export default new Vuex.Store({
  /* actions,*/
  state: {
    showLoading: false,
    loadingMsg: 'Loading...',
    userInfo: {},
    maintenanceInfo: {},
    sellInfo: {},
    sessionkey: '',
    default_address: {},
    user_address: {
      id: '',
      nickname: ''
    },
    userId: '',
  },
  modules: {
    address
  }
})
