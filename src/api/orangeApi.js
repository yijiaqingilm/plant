import { common } from 'lib/common'

var orangeApi = {

  /**
   * 添加购物车
   * @param presale_id
   * @param amount
   * @return {*}
   */
  addCart (presale_id, amount) {
    return common.getRequest('/presale/cart/add', {
      presale_id,
      amount
    })
  },
  /**
   * 预售接口
   * @return {*}
   */
  presaleList (page, type) {
    return common.getRequest('/presale/index', {
      page,
      type
    })
  },
  /**
   * 预售商品详情接口
   * @param id
   * @return {*}
   */
  presaleItemDetail (id) {
    return common.getRequest('/presale/item-detail', {
      id
    })
  },
  /**
   * 预售套餐详情接口
   * @param id
   * @return {*}
   */
  presaleCompositeDetail (id) {
    return common.getRequest('/presale/composite-detail', {
      id
    })
  },
  /**
   * 预售订单列表接口
   * @param page
   * @return {*}
   */
  preOrderList (page) {
    return common.getRequest('/presale/order', {
      page
    })
  },
  /**
   * 预售订单数量接口,判断是否有预售订单
   * @return {*}
   */
  orderNum () {
    return common.getRequest('/presale/order/num')
  }

}
export { orangeApi }

