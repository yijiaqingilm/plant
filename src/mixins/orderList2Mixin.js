import { userApi } from 'api'
import { orderStatus, preOrderStatus } from 'lib/common'
import { Cache } from 'lib/utils'

let orderList2Mixin = {
  data () {
    return {
      // 绿植订单类型（1.购买+租赁，2租赁，3购买） ,
      plantType: {
        compose: 1,
        lease: 2,
        buy: 3
      },
    }
  },
  methods: {
    /* 预约订单 显示评论*/
    showComment: function (status, type) {
      if (parseInt(type, 10) === 1) {
        switch (status >>> 0) {
          case orderStatus.completed:
            return true
          default:
            return false
        }
      } else {
        return false
      }

    },
    /* 预约订单 显示 取消预约*/
    showCancel: function (status) {
      switch (status >>> 0) {
        case orderStatus.noVisiting:
        case orderStatus.goingByService:
        case orderStatus.goingByGeo:
          return true
        default:
          return false
      }
    },
    /* 预约订单 显示 删除订单*/
    showDel: function (status) {
      switch (status >>> 0) {
        case orderStatus.waitingPayment:
        case orderStatus.completed:
        case orderStatus.canceled:
        case orderStatus.refunded:
          return true
        default:
          return false
      }
    },
    /* 预约订单 显示 去支付*/
    showPay: function (status) {
      switch (status >>> 0) {
        case orderStatus.waitingPayment:
          return true
        default:
          return false
      }
    },
    /* 预约订单 显示 确认上门*/
    showOnSite: function (status) {
      switch (status >>> 0) {
        case orderStatus.paid:
          return true
        default:
          return false
      }
    },
    /* 确认上门*/
    onSite: function (item) {
      userApi.bookingOrderConfirmcome(item.booking_id).then((result) => {
        // item.status = 2;
      })
    },
    /* 取消订单*/
    cancelOrder: function (item) {
      this.$f7.modal({
        title: '',
        text: '取消预约，请拨打客服电话<br>客服电话：0755-23619586',
        buttons: [
          {
            text: '取消',
          },
          {
            text: '<a href="tel:0755-23619586" class="external">呼叫</a>',
          },
        ]
      })

    },
    /* 预约订单，删除订单*/
    delOrder: function (item, index) {
      this.$f7.confirm('是否删除订单', '', () => {
        userApi.orderDel(item.id).then((result) => {
          this.bookOrderList.splice(index, 1)
        })
      })
    },
    /* 绿植订单， 删除订单*/
    delPlantOrder: function (item, index) {
      this.$f7.confirm('是否删除订单', '', () => {
        userApi.orderDel(item.id).then((result) => {
          this.plantOrderList.splice(index, 1)
        })
      })
    },
    /* 养护订单 删除订单*/
    delmaintenanceOrder: function (item, index) {
      this.$f7.confirm('是否删除订单', '', () => {
        userApi.orderDel(item.id).then((result) => {
          this.maintenanceList.splice(index, 1)
        })
      })
    },

    /* 绿植订单 显示删除订单*/
    showPlantOrderDel: function ({status, type, isagent = false}) {
      switch (status >>> 0) {
        case orderStatus.completed:
        case orderStatus.expiredByM:
          return true
        case orderStatus.nonPayment:
        case orderStatus.refunded:
        case orderStatus.unauditedVoucher:
        case orderStatus.canceled:
          if (isagent) {
            return false
          } else {
            return true
          }
        default:
          return false
      }
    },
    /* 预售订单 显示删除订单*/
    showPreOrderDel: function ({status, type, isagent = false}) {
      switch (status >>> 0) {
        case preOrderStatus.completed:
        case preOrderStatus.noDownpayment:
        case preOrderStatus.expiredByD:
        case preOrderStatus.expiredByW:
          return true
        default:
          return false
      }
    },
    /* 预售订单 显示付定金*/
    showPreOrderPayByD: function ({status, type}) {
      switch (status >>> 0) {
        case preOrderStatus.noDownpayment:
        case preOrderStatus.unauditedVoucherByD:
          return true
        default:
          return false
      }
    },
    /* 预售订单 显示付尾款*/
    showPreOrderPayByW: function ({status, type}) {
      switch (status >>> 0) {
        case preOrderStatus.downpayment:
        case preOrderStatus.unauditedVoucherByW:
          return true
        default:
          return false
      }
    },
    /* 绿植订单 去支付*/
    goPlantPay: function (item, orderType) {
      Cache.set('orderId', item.id)
      Cache.set('orderType', orderType)
      this.$router.load({url: '/store/changePay'})
    },
    /* 绿植订单 显示 再次购买*/
    // 目前先 隐藏 再次购买
    showBuyAgain: function ({status, type}) {
      return false
      /* if (type === this.plantType.buy) {
       switch (status >>> 0) {
       case 8:
       return true;
       default:
       return false;
       }
       } else if (type === this.plantType.lease) {
       return false;
       } else {
       return false;
       }*/
    },
    /* 绿植订单 显示 续租*/
    // 目前先 隐藏 续租
    showRelet: function ({status, type}) {
      return false
      /* if (type === this.plantType.buy) {
       return false
       } else if (type === this.plantType.lease) {
       switch (status >>> 0) {
       case 3:
       case 5:
       return true;
       default:
       return false;
       }
       } else {
       return false;
       }*/
    },
    /* 绿植订单 显示 取消订单*/
    showCancelPlantOrder: function ({status, type, isagent = false}) {
      switch (status >>> 0) {
        case orderStatus.nonPayment:
        case orderStatus.unauditedVoucher:
          if (isagent) {
            return true
          } else {
            return false
          }
        case orderStatus.paid:
          return true

        default:
          return false
      }
    },
    showPlantOrderPay: function ({status, type}) {
      switch (status >>> 0) {
        case orderStatus.nonPayment:
        case orderStatus.unauditedVoucher:
          return true
        default:
          return false
      }
    },
    /* 绿植订单 显示 回退押金*/
    showReturn: function ({status, type}) {
      if (type === this.plantType.buy) {
        return false
      } else if (type === this.plantType.lease) {
        switch (status >>> 0) {
          case orderStatus.completed:
            return true
          default:
            return false
        }
      } else {
        return false
      }
    },
    /* 绿植订单 再次购买*/
    buyAgain: function (item) {
      // 暂无逻辑
    },
    /* 绿植订单 续租*/
    relet: function (item) {
      // 暂无逻辑
    },
    /* 绿植订单 取消订单*/
    cancelPlantOrder: function (item) {
      this.$f7.modal({
        title: '',
        text: '取消订单，请拨打客服电话<br>客服电话：0755-23619586',
        buttons: [
          {
            text: '取消',
          },
          {
            text: '<a href="tel:0755-23619586" class="external">呼叫</a>',
          },
        ]
      })
    }
  }
}
export { orderList2Mixin }
