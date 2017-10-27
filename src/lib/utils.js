/**
 * Created by Administrator on 2017/5/26.
 */
import curry from 'lodash/curry'
import flowRight from 'lodash/flowRight'
import Vue from 'vue'
import AMap from 'AMap'
// Cache processor
const Cache = {
  get: (key) => {
    if (!window.sessionStorage) {return false}
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => Boolean(window.sessionStorage && window.sessionStorage.hasOwnProperty(key)),
  clear: () => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.clear()
  },
  del: (key) => {
    if (!window.sessionStorage) {return false}
    window.sessionStorage.removeItem(key)
  }
}
const LocalCache = {
  get: (key) => {
    if (!window.localStorage) {return false}
    return JSON.parse(window.localStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.localStorage) {return false}
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => Boolean(window.localStorage && window.localStorage.hasOwnProperty(key)),
  clear: () => {
    if (!window.localStorage) {return false}
    window.localStorage.clear()
  },
  del: (key) => {
    if (!window.localStorage) {return false}
    window.localStorage.removeItem(key)
  }
}

const getSessionKey = () => LocalCache.get('sessionkey')

/**
 *
 * 常用工具类
 *
 */

const commonly = {
  match: curry(function (what, str) {
    return str.match(what)
  }),
  filter: curry(function (f, arr) {
    return arr.filter(f)
  }),
  map: curry(function (f, arr) {
    return arr.map(f)
  }),
  replace: curry(function (what, replacement, str) {
    return str.replace(what, replacement)
  }),
  split: curry(function (what, str) {
    return str.split(what)
  }),
  find: curry(function (f, arr) {
    return arr.find(f)
  }),
  prop: curry(function (p, obj) {
    return obj[p]
  }),
  /**
   *  组合函数  从右到左 (左倾)
   * @param f
   * @param g
   * @returns {Function}
   */
  compose: flowRight,
  /**
   * 辅助函数  用于组合debug
   */
  trace: curry(function (tag, x) {
    console.log(tag, x)
    return x
  }),
  isEmptyObject (obj) {
    for (let o in obj) {
      return false
    }
    return true
  }

}

/**
 *  高德工具
 * @type {{regeocoder: amapUtil.regeocoder}}
 */

const amapUtils = {
  /**
   * 高德地图 逆地理编码
   * @param lnglatXY
   * @returns {Promise}
   */
  regeocoder: function (lnglatXY) {
    let promise = new Promise((resolve, reject) => {
      AMap.service('AMap.Geocoder', function () { // 回调函数
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        })
        geocoder.getAddress(lnglatXY, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result)
          } else {
            reject(`状态码:${status} ,err 参数:${result}`)
          }
        })
      })

    })
    return promise
  }
}

let getQuery = function (para) {
  var reg = new RegExp('(^|&)' + para + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
let isWeiXin = function isWeiXin () {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
  // 使用这里的
}

let getTimer = function (time) {
  time = time >> 0
  if (time <= 60 && time > 0) {
    return '1分钟'
  }
  /*let hour = Math.floor(time / 60 / 60);
  let minute = Math.floor(time / 60 % 60);
  let second = time % 60 % 60;
  if (hour < 10) {
      hour = "0" + hour;
  }
  if (minute < 10) {
      minute = "0" + minute;
  }
  if (second < 10) {
      second = "0" + second;
  }*/

  return Math.round(time / 60) + '分钟'
}
export {
  getTimer
}

/** * 用于把用utf16编码的字符转换成实体字符，以供后台存储 * @param {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 * @return {string} 转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 */
let utf16toEntities = function utf16toEntities (str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
  str = str.replace(patt, function (char) {
    var H, L, code
    if (char.length === 2) {
      H = char.charCodeAt(0) // 取出高位
      L = char.charCodeAt(1) // 取出低位
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00 // 转换算法
      return '&#' + code + ';'
    } else {
      return char
    }
  })
  return str
}

let fiiterEmoji = function (str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g // 检测utf16字符正则
  str = str.replace(patt, '')
  return str
}

let getScrollParent = function getScrollParent (elm) {
  if (elm.tagName == 'BODY') {
    return window
  } else if (['scroll', 'auto'].indexOf(window.getComputedStyle(elm).overflowY) > -1) {
    return elm
  }
  return getScrollParent(elm.parentNode)
}

let getCurrentDistance = function getCurrentDistance (elm, dir) {
  let distance
  const scrollTop = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop
  if (dir === 'top') {
    distance = scrollTop
  } else {
    const scrollElmHeight = elm === window ? window.innerHeight : elm.getBoundingClientRect().height

    distance = this.$el.offsetTop - scrollTop - scrollElmHeight - (elm.offsetTop || 0)
  }
  return distance
}

export {
  Cache,
  LocalCache,
  commonly,
  amapUtils,
  getSessionKey,
  getQuery,
  isWeiXin,
  utf16toEntities,
  fiiterEmoji,
  getScrollParent,
  getCurrentDistance
}