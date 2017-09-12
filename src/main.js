// Import Vue
import "babel-polyfill";
import Vue from 'vue'
import store from './store'
import './lib/flexible.js'


import FastClick from 'fastclick'

FastClick.attach(document.body)

// Import F7
//import Framework7 from 'Framework7'
// Import F7 Vue Plugin
import Framework7Vue from 'lib/framework7-vue'
import "velocity-animate"
import "animate.css"


// Import F7 iOS Theme Styles
// import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
// import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme:
 import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
 import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
 */


// Import Routes
import Routes from './router'

// Import App Component
import App from './main.vue'

// Import vue
import VueResource from 'vue-resource'

import './directives/commonDirective.js'
import './filters/commonFilter'


import './lib/vueExends'

Vue.use(VueResource);


// Init F7 Vue Plugin
Vue.use(Framework7Vue)


import back from 'components/back/back.vue'
import mask from 'components/masking/masking.vue'
import myRadio from 'components/myRadio/myRadio.vue'
import myCheckbox from 'components/myCheckbox/myCheckbox.vue';

Vue.component("back", back);
Vue.component('masking', mask);
Vue.component("myRadio", myRadio);
Vue.component("myCheckbox", myCheckbox);

import {commonApi} from 'api'
import {Cache, commonly, isWeiXin} from 'lib/utils'
import {status_err_code, userType, userStatus} from 'lib/common'
import wx from 'wx'

window.wx = wx;
const wx_hide_menu = function () {
    wx.ready(() => {
        wx.hideMenuItems({
            menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
    })
}
window.wx_hide_menu = wx_hide_menu;
let setUserInfo = function (data) {
    store.state.userInfo = data;
    Cache.set('userInfo', data);
    console.log(data, 'data');
    store.state.sessionkey = data.sessionkey;
    store.state.default_address = data.address || {};
    let wxConfig = JSON.parse(data.wx_config);
    // 微信配置
    wx.config({...wxConfig});
    console.log(wx);
}
let userInfo = Cache.get('userInfo');
if (commonly.isEmptyObject(userInfo)) {
    commonApi.wxLogin(function (data) {
        setUserInfo(data);
    });
} else {
    setUserInfo(userInfo);
}


wx.error(function (res) {
    console.log('wxconfig 错误信息', res);
});
wx.ready(() => {
    wx.hideMenuItems({
        menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
})
let changeRouter = function (userInfo, view) {
    switch (userInfo.maintenance.isuse) {
        case userStatus.checking:
            view.router.load({url: '/gardener/applyAfter'});
            break;
        case userStatus.notPass:
            view.router.load({url: '/gardener/applyErr'});
            break
        case  userStatus.pass:
            view.router.load({url: '/gardener/center'});
            break;
    }
}
// Init App
var app = new Vue({
    template: '<app/>',
    // Init Framework7 by passing parameters here
    framework7: {
        root: '#app',
        /* Uncomment to enable Material theme: */
        // material: true,
        routes: Routes,
        pushState: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        pushStateSeparator: '#',
        swipeBackPage: false,
        modalTitle: '',
        pushStatePreventOnLoad: false,
        pushStateNoAnimation: true,
        cache: true,
        preroute: function (view, options) {
            var configUrl = {
                applyBefore: "/gardener/applyBefore",
                sellApplyBefore: "/sell/applyBefore",
                init: '#'
            };
            let userInfo = store.state.userInfo;
            switch (options.url) {
                case configUrl.applyBefore:
                    if (userInfo.utype != '' && userInfo.utype == userType.maintenance) {
                        switch (userInfo.maintenance.isuse) {
                            case userStatus.checking:
                                view.router.load({url: '/gardener/applyAfter'});
                                return false;
                                break;
                            case userStatus.notPass:
                                view.router.load({url: '/gardener/applyErr'});
                                return false;
                                break
                            case  userStatus.pass:
                                view.router.load({url: '/gardener/center'});
                                return false;
                                break;
                        }

                    }
                    break;
                case configUrl.sellApplyBefore:
                    if (userInfo.utype != '' && userInfo.utype == userType.sell) {
                        switch (userInfo.seller.isuse) {
                            case userStatus.checking:
                                view.router.load({url: '/sell/applyAfter'});
                                return false;
                                break;
                            case userStatus.notPass:
                                view.router.load({url: '/sell/applyErr'});
                                return false;
                                break
                            case  userStatus.pass:
                                view.router.load({url: '/sell/center'});
                                return false;
                                break;
                        }

                    }
                    break;
                /*case configUrl.init:
                 console.log(location.href, 'location.href');
                 // location.href = location.href;
                 break;*/
            }

            return true;
        },
        /*preprocess: function (context, url, next) {

         }*/
    },
    // Register App Component
    components: {
        app: App
    },
    created() {
    },
    store
}).$mount('#app')
/**
 * 添加 ajax 全局拦截器
 */
Vue.http.interceptors.push(function (request, next) {
    if (request.global) app.$store.state.showLoading = true;
    next((response) => {
        if (request.global) app.$store.state.showLoading = false;
        // 统一的错误 处理机制 ==> 未添加
        var resultCode = response.data && response.data.resultCode;
        if (resultCode === status_err_code.FAILURE) {
            // window.f7.alert(response.data.result);
            return;
        }
        return response
    });
});

window.addEventListener('popstate', function () {
    app.$f7.closeModal();

});
if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    });
}
export {app}
