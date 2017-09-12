/**
 * Created by Administrator on 2017/5/25.
 */

import {gardenerApi} from './gardenerApi';
import {userApi} from  './userApi'
import {sellApi} from './sellApi'
import {getQuery, commonly} from 'lib/utils'
import {app} from 'src/main.js'
import {wechat} from 'config'
import {common} from 'lib/common'
let commonApi = {
    wxLogin: (callBack) => {
        var code = getQuery('code');
        var state = getQuery('state');
        /*if (code == null || state == null) {
            console.log('拼接的url', `https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&scope=snsapi_base&state=base&appid=${wechat.appId}&redirect_uri=${encodeURIComponent(location.href)}#wechat_redirect`)
            location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code&scope=snsapi_base&state=base&appid=${wechat.appId}&redirect_uri=${encodeURIComponent(location.href)}#wechat_redirect`;
            return false;
        } else {
            console.log("wx登陆开始")
            common.awaitUserLogin(code, state, callBack);
            console.log("wx登陆结束")
            return true;
        }*/
        //123450
        //6543210
        common.awaitUserLogin('e', '1234560',callBack);
    }
}
export {
    gardenerApi,
    userApi,
    commonApi,
    sellApi
}

