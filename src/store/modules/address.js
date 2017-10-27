/**
 * Created by Administrator on 2017/5/27.
 */
import Vue from 'vue'
import { compose } from 'lib/utils'
import { userApi } from 'api'

const state = {
  addressList: [],
}

const getters = {
  getAddressList: (state) => state.addressList
}
const actions = {
  /*
   * 执行 异步操作 等待 api 接口调试
   * */
  setAddressListAsync ({commit}, p) {
    userApi.addressList(p.customer_id).then((result) => {
      commit('setAddressList', result.data)
    })

  },
  addAddressListAsync: ({commit}, info) => {
    userApi.addAddress(info.address, info.customer_id).then((result) => {
      info.address = result.data
      commit('addAddressList', info)
    })

  },
  removeAddressByIdAsync: ({commit}, info) => {
    userApi.delAddress(info.address.id, info.customer_id).then((result) => {
      commit('removeAddressById', info)
    })
  },
  editAddressAsync: ({commit}, info) => {
    userApi.editAddress(info.address, info.customer_id).then((result) => {
      commit('editAddress', info)
    })

  },
  setDefaultAddressAsync: ({commit}, {address}) => {
    userApi.setDefaultAddress(address.id).then((result) => {
      commit('setDefaultAddress', address)
    })
  }
}

const mutations = {
  addAddressList: (state, {address, callBack}) => {
    state.addressList.unshift(address)
    callBack && callBack()
  },
  editAddress: ({addressList}, {address, callBack}) => {
    addressList.find((item, index) => {
      if (item.id === address.id) {
        addressList.splice(index, 1, address)
      }
    })
    // record = address;
    callBack && callBack()

  },
  removeAddressById: ({addressList}, {address, callBack}) => {
    let index = addressList.indexOf(address)
    if (index !== -1) {
      addressList.splice(index, 1)
      callBack()
      return 1
    }
    return -1
  },
  setAddressList: (state, list) => {
    state.addressList = list
  },
  setDefaultAddress: ({addressList}, address) => {
    addressList.forEach((item) => {
      if (item.id === address.id) {
        item.isuse = true
      } else {
        item.isuse = false
      }
    })
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
