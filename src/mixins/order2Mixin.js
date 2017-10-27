import { payType, timeType, itemType, payTypeToName, weekList } from '../lib/common'
import { commonly } from '../lib/utils'

let order2Mixin = {
  data () {
    return {
      itemType: itemType,
      /* 购买显示的最大条数*/
      maxBuysLen: 2,
      maxLeaseLen: 2,
      baseLen: 2,
      isCollapsed: true,
      isCollapsedByLease: true,
      showMask: false,
      showWeek: false,
      payType: payType,
      payTypeToName: payTypeToName,
      timeType: timeType,
      weekList: weekList,
      payTypes: [
        {type: payType.monthly, name: '月结'},
        {type: payType.quarter, name: '季结'},
        {type: payType.onec, name: '一次性'}
      ],
      // 租赁总押金
      depositAll: 0,
      checkedWeekListName: [],
      zone: {
        amStartTime: '8:00',
        amEndTime: '12:00',
        pmStartTime: '13:00',
        pmEndTime: '18:00'
      },
    }
  },
  methods: {
    hideModal () {
      this.showMask = false
    },
    alertDeposit () {
      this.$f7.alert('租赁期满将进行绿植核查，<br>如无损坏缺失押金将全额退还')
    },
    alertShipfee () {
      this.$f7.alert(`租赁：月租金满${this.orderInfo.maxleaseshipfee}元免运费<br>购买：运费最低${this.orderInfo.minshipfee}元<br>人工费用暂不免除`)
    },
    backPay: function () {
      // back pay
    },
    changeShowBuysLen: function (maxLen) {
      this.maxBuysLen = maxLen
    },
    changeShowLeaseLen: function (maxLen) {
      this.maxLeaseLen = maxLen
    },
    showModal: function () {
      this.showMask = true
    },
    closeModal: function () {
      if (payType.monthly === parseInt(this.payInfo.payType, 10)) {
        this.$f7.confirm(`您选择了月结支付方式，<br>本次付款金额为月结金额+押金<br> \
                        下月月结金额需进行线下支付，<br>将会有工作人员与您提前联系<br>下月月结金额为${this.monthlyByMoney}`, '', () => this.showMask = false)
      } else if (payType.quarter === parseInt(this.payInfo.payType, 10)) {
        this.$f7.confirm(`您选择了季结支付方式，<br>本次付款金额为季结金额+押金<br> \
          下季季结金额需进行线下支付，<br>将会有工作人员与您提前联系<br>下季季结金额为${this.monthlyByQuarter}`, '', () => {this.showMask = false})
      } else {
        this.showMask = false
      }

    },
    showWeekModal: function () {
      this.showWeek = true
    },
    colorWeekModal: function () {
      this.showWeek = false
    },
    changePaymethods: function (newVal, oldVal) {
      this.payInfo.paymethods = [].concat(this.orderInfo.custom).concat(this.orderInfo.paymethods).find((item) => parseInt(item.id, 10) === parseInt(newVal, 10))
      if (parseInt(newVal, 10) === parseInt(this.orderInfo.custom.id, 10)) {
        this.payInfo.payType = this.payType.onec
      }
    },
    getWeekList: function ({checkedItems}) {
      this.payInfo.week = checkedItems.map((item) => item.id).join(',')
      this.checkedWeekListName = checkedItems.map((item) => item.name).join(',')
    },
    ensure: function () {
      // ensure
    },
  },
  computed: {
    /* 总运费*/
    shipfeeTotal () {
      let {buylong, give} = this.payInfo.paymethods
      if (!this.orderInfo) {
        return 0
      }
      let leaseShipfeeTotal = buylong * parseFloat(this.orderInfo.leaseshipfee)
      if (leaseShipfeeTotal >= parseFloat(this.orderInfo.maxleaseshipfee)) {
        leaseShipfeeTotal = 0
      } else if (leaseShipfeeTotal <= parseFloat(this.orderInfo.minshipfee) && leaseShipfeeTotal > 0) {
        leaseShipfeeTotal = this.orderInfo.minshipfee
      }
      return Math.round(parseFloat(this.orderInfo.saleshipfee) + parseFloat(leaseShipfeeTotal) + parseFloat(this.orderInfo.saledelivery) + parseFloat(this.orderInfo.leasedelivery))

    },
    addressInfo () {
      return commonly.isEmptyObject(this.$store.state.default_address) ? null : this.$store.state.default_address
    },
    /**
     * 每月的租赁价格
     * @returns {number}
     */
    monthlyByMoney () {
      if (this.orderInfo.leases) {
        return this.orderInfo.leases.items.map((item) => item.leaseprice * item.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
      } else {
        return 0
      }

    },
    /**
     * 每季度的租赁价格
     * @returns {number}
     */
    monthlyByQuarter () {
      let {buylong} = this.payInfo.paymethods
      let quarterNum = 3
      if (this.orderInfo.leases) {
        return this.orderInfo.leases.items.map((item) => item.leaseprice * item.amount).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) * quarterNum
      } else {
        return 0
      }

    },
    /**
     * 一次性付款价格
     * @returns {number}
     */
    onecByMoney () {
      let {buylong, give, type} = this.payInfo.paymethods
      if (this.orderInfo.leases) {
        return this.orderInfo.leases.items.map((item) => {
          if (parseInt(type, 10) === timeType.common) {
            return item.leaseprice * item.amount
          } else if (parseInt(type, 10) === timeType.custom) {
            return item.leaseprice_day * item.amount
          } else {
            return 0
          }

        }).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) * ((buylong >>> 0) - (give >>> 0))
      } else {
        return 0
      }

    },
    /**
     * 第一次 租赁付款总额 （按月只计算 当前月）
     * @returns {*}
     */
    leaseTotal () {
      // let {buylong}=this.payInfo.paymethods;
      let payType = this.payInfo.payType >>> 0
      if (payType === parseInt(this.payType.monthly, 10)) {
        return this.monthlyByMoney
      } else if (payType === parseInt(this.payType.onec, 10)) {
        return this.onecByMoney
      } else if (payType === parseInt(this.payType.quarter, 10)) {
        return this.monthlyByQuarter
      } else {
        return 0
      }
    },
    /**
     * 租赁付款总额 (包含押金)
     * @returns {number}
     */
    leaseTotalIncludeDeposit () {
      return this.leaseTotal + this.depositAll
    },
    /**
     * 购买总额
     * @return{number}
     *
     */
    buyTotal () {
      if (!this.orderInfo) {
        return 0
      }
      return this.orderInfo.buys.items.map((item) => item.amount * item.price).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
    },
    /**
     * 付款总额(包含 购买，租赁，配送费，优惠金额)
     * @returns {*}
     */
    totalAll () {
      if (!this.orderInfo) {
        return 0
      }
      let totalAll = this.buyTotal + this.leaseTotalIncludeDeposit + this.shipfeeTotal
      return totalAll <= 0 ? 0 : totalAll
    }
  }
}
export {
  order2Mixin
}
