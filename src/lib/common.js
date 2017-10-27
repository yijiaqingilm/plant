/**
 * Created by Administrator on 2017/4/24.
 */
import Vue from 'vue'
import { serverUrl, clientVersion, channel } from 'config'
import { app } from 'src/main.js'
import wx from 'wx'
import { Cache } from 'lib/utils'
import md5 from 'js-md5'

var paramsSign = function (params) {
  var str = ''
  var keys = []
  var i = 0
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      keys[i++] = prop
    }

  }
  keys.sort()
  for (i = 0; i < keys.length; i++) {
    str = str + keys[i] + '=' + params[keys[i]]
    if (i < keys.length - 1) {
      str = str + '||'
    }

  }
  return md5.hex(str)
}
var getSign = function (params, method) {
  var map = {'method': method}
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      map[key] = decodeURIComponent(params[key])
    }
  }
  return paramsSign(map)
}
let common = {
  getRequest: function (url, params = {}, {global = true} = {}) {
    Object.assign(params, {
      sessionkey: app.$store.state.sessionkey,
      clientVersion,
      channel,
      // timestamp: new Date().getTime()
    })
    /* // 参数签名
    let sign = getSign(params, url)
    Object.assign(params, {
      sign
    })*/
    return new Promise((resolve, reject) => {
      Vue.http({
        method: 'GET',
        url: serverUrl + url,
        params,
        global: global
      }).then((response) => {
        var data = response.body
        if (data.resultCode === status_code.SUCCESS) {
          resolve(data)
        } else {
          reject(data)
          if (data.resultCode >> 0 === status_err_code.OPERATION_ERR) {
            // ?
          } else {
            app.$f7.alert(data.result)
          }

        }

      }).catch((err) => reject(err))
    })
  },
  postRequest: function (url, params = {}, {global = true, isManager = false} = {}) {
    if (isManager) {
      if (ActionManager[url]) {
        return new Promise((resolve, reject) => {
          reject()
        })
      } else {
        ActionManager[url] = true
      }
    }
    Object.assign(params, {sessionkey: app.$store.state.sessionkey, clientVersion, channel})
    return new Promise((resolve, reject) => {
      Vue.http({
        method: 'POST',
        url: serverUrl + url,
        body: params,
        emulateJSON: true,
        emulateHTTP: true,
        global: global
      }).then((response) => {
        var data = response.body
        if (data.resultCode >> 0 === status_code.SUCCESS) {
          resolve(data)
        } else {
          reject(data)
          if (data.resultCode >> 0 === status_err_code.OPERATION_ERR) {
            // ?
          } else {
            app.$f7.alert(data.result)
          }
        }

        isManager && delete ActionManager[url]
      }).catch((err) => {
        isManager && delete ActionManager[url]
        reject(err)
      })

    })

  },

  postFileRequest: function (url, params = {}, {global = true, isManager = false} = {}) {
    if (isManager) {
      if (ActionManager[url]) {
        return new Promise((resolve, reject) => {
          reject()
        })
      } else {
        ActionManager[url] = true
      }
    }
    Object.assign(params, {sessionkey: app.$store.state.sessionkey, clientVersion, channel})
    let formdata = new FormData()
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        formdata.append(key, params[key])
      }

    }
    return new Promise((resolve, reject) => {
      Vue.http({
        method: 'POST',
        url: serverUrl + url,
        body: formdata,
        global: global
      }).then((response) => {
        var data = response.body
        if (data.resultCode === status_code.SUCCESS) {
          resolve(data)
        } else {
          reject(data)
          app.$f7.alert(data.result)
        }
        isManager && delete ActionManager[url]
      }).catch((err) => {
        isManager && delete ActionManager[url]
        reject(err)
      })
    })

  },
  awaitUserLogin: function (code, state, callBack) {
    try {
      var url = `${serverUrl}/user/wx-login?code=${code}&state=${state}&clientVersion=${clientVersion}&channel=${channel}&url=${encodeURIComponent(location.href.split('#')[0])}`
      let request = new XMLHttpRequest()
      request.open('GET', url, false) // 第三个参数 false 代表设置同步请求
      request.send(null)
      if (request.status === 200) {

        var data = JSON.parse(request.response)
        callBack(data.data)

      }
    } catch (err) {
      // err
    }
  },
  newBlob: (data, datatype) => {
    var out
    try {
      out = new Blob([data], {type: datatype})
    }
    catch (e) {
      window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder

      if (e.name === 'TypeError' && window.BlobBuilder) {
        var bb = new window.BlobBuilder()
        bb.append(data.buffer)
        out = bb.getBlob(datatype)
      }
      else if (e.name === 'InvalidStateError') {
        out = new Blob([data], {type: datatype})
      }
    }
    return out
  },
  base64ToBlob: (type, data) => {
    data = window.atob(data)
    let ia = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i)
    }
    return new common.newBlob(ia, type)
  },
}

let gotoCart = function (that) {
  let isSell = Cache.get('sell') || false
  if (isSell) {
    that.$router.load({url: '/sell/cart'})
  } else {
    that.$router.load({url: '/store/cart'})
  }
}
export { gotoCart }
let hasProxy = function () {
  return Cache.get('sell') || false
}
export { hasProxy }
const status_code = {
  SUCCESS: 0,
}

const status_err_code = {
  OPERATION_ERR: 1,
  PARAME_ERR: 2,
  CLIENT_FREEZE_ERR: 3,
  SIGN_PARAME_ERR: 4,
  SIGN_ERR: 5,
  ONLY_POST_ERR: 6,
  USER_NO_DATA_ERR: 7,
  UPLOAD_ERR: 8,
  DATABASE_ERR: 10,
  FAILURE: 11
}

// 排序类型
const sortType = {
  scene: 0,
  price: 1,
  customPrice: 2,
  customArea: 5,
  comprehensive: 3,
  area: 4
}
const categoryType = {
  goods: 0,
  composite: 1
}

const couponGiveType = {
  // 送金额
  money: 1,
  // 送养护期限
  service: 2,
  // 送商品
  goods: 3

}
export { couponGiveType }

export { categoryType }

// 预约类型
const book_type = {
  make: 0, // 预约
  remake: 1// 重新预约
}
// (0单品租赁购买，2租赁，3购买) ,
const goodsType = {
  compose: 0,
  lease: 2,
  buy: 3
}
// 商品类型(0商品，1套餐)
const itemType = {
  goods: 0,
  combo: 1
}
export { itemType }
// Y通过，N未通过，A审批中 ,
const userStatus = {
  pass: 'Y',
  notPass: 'N',
  checking: 'A'
}
export { userStatus }
// utype (integer, optional): 用户类型:M养护端,G风水师,S销售人员,I巡视员,默认每个端都有用户功能,

const userType = {
  maintenance: 'M',
  geomaner: 'G',
  sell: 'S',
  inspector: 'I'
}
export { userType }

// 类型：1养护，2租赁，3购买, 4所有商品，5分类，6单品，7套餐
let couponType = {
  maintenance: 1,
  lease: 2,
  buy: 3,
  all: 4,
  product: 6,
  combo: 7
}
export { couponType }

// type (integer, optional): 1月结，2一次性付款 ,
// 结算方式
const payType = {
  monthly: 1,
  onec: 2,
  quarter: 3
}

let payTypeToName = {
  [payType.monthly]: {name: '月结', index: 0},
  [payType.quarter]: {name: '季结', index: 1},
  [payType.onec]: {name: '一次性付款', index: 2},
}
export { payTypeToName }
const weekList = [
  {id: 0, name: '周日', checked: false},
  {id: 1, name: '周一', checked: true},
  {id: 2, name: '周二', checked: true},
  {id: 3, name: '周三', checked: true},
  {id: 4, name: '周四', checked: true},
  {id: 5, name: '周五', checked: true},
  {id: 6, name: '周六', checked: false},
]

// 0 wx支付 ，1 网银  2 现金支付
const payWay = {
  wxPay: 0,
  unionPay: 1,
  cashpay: 2
}
export { payWay }

// 0没有使用， 1已经使用
const couponStatus = {
  use: 0,
  noUse: 1
}
export { couponStatus }
const wx_share = function (title, link, imgUrl, desc) {
  wx.showMenuItems({
    menuList: [
      'menuItem:share:timeline', // 分享到朋友圈
      'menuItem:share:appMessage' // 复制链接
    ],
    success: function (res) {
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      })
    },
    fail: function (res) {
      alert(JSON.stringify(res))
    }
  })
}

export { wx_share }

/* 养护订单状态：0未付款，1已付款，3养护中，7养护到期，8已完成，9已取消;
绿植订单
购买订单状态：0未付款，1已付款，2配送中，8已完成，9已取消;
租赁订单（购买/租赁订单）状态：0未付款，1已付款，2配送中，3养护中，5已到期，6已收回，8已完成，9已取消
17:  人工租赁干涉到期
19: 人工养护干涉到期;
18 待核账
上门服务：8已完成，9已取消，10未上门，11进行中，12信息不真实;
风水师预约：1已付款，13待支付，8已完成，9已取消，16已评价，14已退款，15进行中;*/

let orderStatus = {
  nonPayment: 0,
  paid: 1,
  distribution: 2,
  maintenance: 3,
  expired: 5,
  hasrecyled: 6,
  MExpired: 7,
  completed: 8,
  canceled: 9,
  noVisiting: 10,
  goingByService: 11,
  waitingPayment: 13,
  refunded: 14,
  goingByGeo: 15,
  haveEvaluation: 16,
  unauditedVoucher: 18,
  expiredByL: 17,
  expiredByM: 19
}
export { orderStatus }
// 预售订单状态：已付定金、未付定金、待核定金、待核尾款、（已付全款）待配送、配送中、已完成、（未付定金）已过期、（未付尾款）已失效
let preOrderStatus = {
  downpayment: 1,
  noDownpayment: 2,
  unauditedVoucherByD: 3,
  unauditedVoucherByW: 4,
  waitDistribution: 9,
  distribution: 5,
  completed: 6,
  expiredByD: 7,
  expiredByW: 8
}
export {
  preOrderStatus
}

// 更换状态:0审核中，1更换成功，2更换失败，3申请成功，4申请失败，5已取消 ,
let exchangeStatus = {
  reviewed: 0,
  exSuccess: 1,
  exDefeated: 2,
  apSuccess: 3,
  apDefeated: 4,
  canceled: 5
}
// 时间类型，0 普通的(按月)，1自定义(按天)
const timeType = {
  common: 0,
  custom: 1
}
export { timeType }

let orangeType = {
  family: 1,
  firm: 2,
}
export {
  orangeType
}

let ActionManager = {}
export { ActionManager }
export { exchangeStatus }
export { common, status_code, status_err_code, book_type, goodsType, payType, weekList, sortType }
