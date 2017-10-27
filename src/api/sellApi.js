import Vue from 'vue'
import { common } from 'lib/common'
import { Cache, getSessionKey } from 'lib/utils'

var sellApi = {
  /**
   * 销售申请接口
   * @param user
   * @return {*}
   */
  apply (user) {
    return common.postFileRequest('/seller/apply', user, {isManager: true})
  },
  /**
   * 预约列表接口
   * @return {*}
   */
  booking (page) {
    return common.postRequest('/seller/booking', {page}, {global: false})
  },
  /**
   * 确定延期养护
   * @param id
   * @param day
   * @returns {*}
   */
  delay: function (id, day) {
    return common.postRequest('/seller/booking/delay', {
      id,
      day
    })
  },
  /**
   * 完成预约接口
   * @param id
   * @return {*}
   */
  bookingComplete (id) {
    return common.postRequest('/seller/booking/complete', {
      id
    })
  },
  /**
   * 完成预约列表接口
   * @return {*}
   */
  completeList (page) {
    return common.postRequest('/seller/booking/complete-list', {page}, {global: false})
  },
  /**
   * 添加客户接口
   * @param client
   * @return {*}
   */
  addClient (client) {
    return common.postRequest('/seller/client/add', client, {isManager: true})
  },
  /**
   * 编辑拜访客户接口
   * @param client
   * @return {*}
   */
  editClient ({remark, id, customer_id, company, address, addressdetail, contact, mobile, album, lng, lat}) {
    return common.postRequest('/seller/client/edit', {
      id,
      customer_id,
      company,
      address,
      addressdetail,
      contact,
      mobile,
      album,
      lng,
      lat,
      remark
    }, {isManager: true})
  },
  /**
   * 删除拜访客户接口
   * @param id
   * @param reason
   * @return {*}
   */
  delClientById (id, reason) {
    return common.postRequest('/seller/client/del', {
      id,
      reason
    })
  },
  /**
   * 添加备注接口
   * @param id
   * @param remark
   * @return {*}
   */
  addClientToRemark (id, remark) {
    return common.postRequest('/seller/client/add-remark', {
      id, remark
    })
  },

  /**
   * 客户详情接口
   * @param id
   * @return {*}
   */
  getClientById (id) {
    return common.postRequest('/seller/client/info', {id})
  },

  /**
   * 客户管理列表接口
   * @return {*}
   */
  clientList (page, date = '') {
    return common.postRequest('/seller/client', {page, date})
  },
  /**
   * 养护绿植列表数据
   * @param page
   * @param key
   * @return {*}
   */
  plantList (page, key = '') {
    return common.postRequest('/seller/item', {
      page,
      key
    })
  },
  /**
   * 购物车列表
   * @return {*}
   */
  cartList () {
    return common.postRequest('/seller/cart')
  },
  /**
   * 养护项目添加接口
   * @param item_id
   * @param amount
   * @return {*}
   */
  addPlantToCart (item_id, amount) {
    return common.postRequest('/seller/cart/add', {
      item_id,
      amount
    })
  },
  /**
   * 养护项目修改数量接口
   * @param id
   * @param num
   * @return {*}
   */
  editPlantToCart (id, num) {
    return common.postRequest('/seller/cart/edit-num', {
      id,
      num
    })
  },
  /**
   * 删除养护项目接口
   * @param id
   * @return {*}
   */
  delCartItemById (id) {
    return common.postRequest('/seller/cart/del', {
      id
    })
  },
  /**
   * 删除多个养护项目接口
   * @param id
   * @return {*}
   */
  delCartItemByIds (cartids) {
    return common.postRequest('/seller/cart/del-all', {
      cartids
    })
  },

  /**
   * 获取用户信息
   * @param id
   * @return {*}
   */
  getUserById (id, type = 0) {
    return common.getRequest('/seller/seller/get-user', {
      id,
      type
    })
  },
  /**
   * 养护代下单及绿植代下单接口
   * @param order
   * @param agent_id
   */
  payment (order, agent_id) {
    return common.postRequest('/seller/order/payment', {...order, agent_id}, {isManager: true})
  },
  /**
   * 更新销售员信息
   * @param sell
   * @return {*}
   */
  updateSellInfo ({avatar, lng, lat, addressdetail, address, mobile}) {
    return common.postFileRequest('/seller/seller/update', {
      avatar, lng, lat, addressdetail, address, mobile
    }, {isManager: true})
  },
  /**
   * 养护项目确认接口
   * @param info
   * @return {*}
   */
  cartConfirm (info) {
    return common.postRequest('/seller/cart/confirm', info, {isManager: true})
  },
  /**
   * 优惠券接口
   * @param type
   * @param cartids
   * @return {*}
   */
  couponList (type = '', cartids = '', paytype = '', paymethod = '') {
    return common.getRequest('/seller/coupon', {
      type,
      cartids,
      paytype,
      paymethod
    })
  },
  /**
   * 订单列表接口
   * @param type
   * @return {*}
   */
  orderList (type, page) {
    return common.getRequest('/seller/order', {
      type,
      page
    })
  },
  /**
   * 绿植订单详情(查看订单时)接口
   * @param order_id
   * @returns {*}
   */
  orderDetail (order_id) {
    return common.getRequest('/seller/order/detail', {
      order_id
    })
  },
  /**
   * 派送优惠券接口
   * @param customer_id 用户id
   * @param id  优惠券id
   * @return {*}
   */
  couponAssign (customer_id, id) {
    return common.postRequest('/seller/coupon/assign', {
      customer_id,
      id
    })
  },
  /**
   * 我的绩效
   * @param date :2017-05
   * @return {*}
   */
  performanceList (date) {
    return common.getRequest('/seller/performance', {
      date
    })
  }

}

export { sellApi }

