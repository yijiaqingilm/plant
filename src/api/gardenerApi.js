/**
 * Created by Administrator on 2017/5/25.
 */
import Vue from 'vue';
import {common} from 'lib/common'
import {Cache, getSessionKey} from 'lib/utils';


var gardenerApi = {
    /**
     * 测试 接口
     * @returns {Promise.<T>}
     */
    apply_list() {
        if (Cache.has("typeList")) {
            return Promise.resolve(Cache.get("typeList"));
        } else {
            return Vue.http.post('/mobile/type-list').then(response => {
                console.log(response);
                var data = response.body.data;
                Cache.set("typeList", data);
                return data
            }).catch(err => err);
        }

    },

    /* return new Promise((resolve, reject) => {
     Vue.http.post('/maintenance/main/apply', user).then(response => {
     var data = response.body.data;
     resolve(data);
     }).catch(err => reject(err));
     })*/

    /**
     * 养护员申请接口
     * @param user
     * @returns {*}
     */
    apply(user) {
        return common.postFileRequest('/maintenance/main/apply', user);
    },
    /**
     * 获取养护用户信息
     * @returns {*}
     */
    getMaintenance() {
        return common.getRequest('/maintenance/main/get-maintenance');
    },
    /**
     * 获取商家养护项目列表
     * @param sessionkey
     * @returns {*}
     */
    maintenanceList({act, lng, lat, hour} = {}) {
        return common.getRequest('/maintenance/main/maintenance-list', {
            act,
            lng,
            lat,
            hour
        });
    },
    /**
     * 获取商家养护详情
     * @param sessionkey
     * @param shopper_id
     * @returns {*}
     */
    maintenanceDetail(shopper_id, order_id, history) {
        return common.postRequest('/maintenance/main/maintenance-detail', {
            shopper_id,
            order_id,
            history
        }, {global: false});
    },
    /**
     * 开始打卡
     * @param sessionkey
     * @param lat
     * @param lng
     * @param id
     * @returns {*}
     */
    clock: function (id, lng, lat) {
        return common.postRequest('/maintenance/main/customer-by-clock-maintenance', {
            lat,
            lng,
            id
        }, {global: false})
    },
    /**
     * 完成养护
     * @param info
     *  @info = >
     *   @param sessionkey
     *   @param shopper_id
     *   @param m_info_main_id
     *   @param random_item_id
     *   @param lat
     *   @param lng
     *   @param clock
     * @returns {*}
     */
    accomplish: function (info) {
        return common.postRequest('/maintenance/main/item-accomplish', info);
    },

    /**
     * 确定延期养护
     * @param order_id
     * @param day
     * @returns {*}
     */
    delay: function (order_id, day) {
        return common.postRequest('/maintenance/main/delay-maintenance', {
            order_id,
            day
        })
    },
    /**
     * 获取更换的绿植信息
     * @param sessionkey
     * @param qrcode
     * @returns {*}
     */
    getPlantInfo: function (qrcode) {
        return common.postRequest('/maintenance/main/get-renewal-item-info', {
            qrcode
        });
    },
    /**
     * 更换绿植接口
     * @param ablum 绿植图片
     * @param shopper_item_detail_id 绿植id
     * @returns {*}
     */
    replacePlant: function (ablum, shopper_item_detail_id) {
        return common.postRequest('/maintenance/main/renewal-item', {
            ablum,
            shopper_item_detail_id
        })
    },
    /**
     * 养护人员更换历史
     * @param page
     * @returns {*}
     */
    replacePlantHistory: function (page) {
        return common.postRequest('/maintenance/main/maintenance-renewal-history', {
            page
        })
    },
    /**
     * 取消更换绿植接口
     * @param sessionkey
     * @param id
     * @returns {*}
     */
    renewalCancel: function (sessionkey, id) {
        return common.postRequest('/maintenance/main/renewal-cancel', {
            sessionkey,
            id
        })
    },
    /**
     * 已完成养护订单接口
     * @param sessionkey
     * @returns {*}
     */
    accomplishMaintenanceList: function (sessionkey) {
        return common.postRequest('/maintenance/main/accomplish-maintenance', {
            sessionkey
        });
    },
    /**
     * 已完成养护订单详情
     * @param sessionkey
     * @param id
     * @returns {*}
     */
    accomplishMaintenanceDetail: function (sessionkey, id) {
        return common.postRequest('/maintenance/main/maintenance-condition', {
            sessionkey,
            id
        });
    },
    /**
     * 养护历史列表数据
     * @param page
     * @return {*}
     */
    historyList: function (page) {
        return common.getRequest('/maintenance/main/maintenance-history', {
            page
        });
    },
    /**
     * 更新养护员信息
     * @param mobile
     * @param address
     * @param address_detail
     * @param lng
     * @param lat
     * @return {*}
     */
    updateProfile({mobile, address, addressdetail, lng, lat, avatar}) {
        return common.postFileRequest('/maintenance/main/maintenance-info', {
            mobile,
            address,
            addressdetail,
            lng,
            lat,
            avatar

        });
    },
    /**
     * 更新养护身份证信息
     * @param identitybg
     * @param status
     * @return {*}
     */
    updateIdCard(identitybg, type) {
        return common.postFileRequest('/maintenance/main/update-identitybg', {
            identitybg,
            type
        });
    },
    updateIdCard(identitybg, type) {
        return common.postFileRequest('/maintenance/main/update-identitybg', {
            identitybg,
            type
        });
    },
    /**
     * 养护人员养护商家项目接口
     * @param qrcode
     * @param m_info_main_id
     * @return {*}
     */
    maintain(qrcode, m_info_main_id) {
        return common.postRequest('/maintenance/main/customer-by-maintenance-item', {
            qrcode,
            m_info_main_id
        });
    },
    /**
     * 我的绩效
     * @param date
     * @return {*}
     */
    performanceList(date) {
        return common.getRequest('/maintenance/main/performance-list', {
            date
        });
    },
    /**
     * 收工
     * @return {*}
     */
    knockOff() {
        return common.getRequest('/maintenance/main/maintenance-callback');
    },
    /**
     * 判断我是否有未完成的养护项目
     * @param order_id
     * @return {*}
     */
    hasUnfinishedOrder(order_id) {
        return common.getRequest('/maintenance/main/last-maintenance-status', {
            order_id
        });
    }


}


export {gardenerApi};

