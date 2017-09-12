import Vue from 'vue';
import {serverUrl, wechat} from 'config/index';
import {common, hasProxy} from 'lib/common'
import {Cache, getSessionKey, utf16toEntities,fiiterEmoji} from 'lib/utils';

var userApi = {
    //微信登录接口
    login(code, state) {
        return common.getRequest('/user/wx-login', {code: code, state: state});
    },
    /**
     * 获取用户信息
     * @return {*}
     */
    getInfo() {
        return common.getRequest('/user/get-info');
    },

    /**
     * 预约类型接口
     * @returns {*}
     */
    getBookingInfo() {
        return common.getRequest('/customer/main/get-booking-info');
    },

    /**
     * 提交预约上门服务信息
     * @param user
     * @returns {*}
     */
    booking(user) {
        return common.postRequest('/customer/main/booking', user);
    },
    /**
     * 重新预约时间
     * @returns {*}
     */
    rebooking(booking_id) {
        return common.getRequest('/customer/main/rebooking', {
            booking_id
        });
    },
    /**
     * 地址管理接口
     * @returns {*}
     */
    addressList(customer_id = "") {
        return common.getRequest('/customer/main/address-list', {
            isagent: hasProxy(),
            customer_id
        });
    },
    /**
     * 修改地址接口
     * @param address
     * @returns {*}
     */
    editAddress(address, customer_id = "") {
        return common.postRequest('/customer/main/edit-address', {
            ...address,
            isagent: hasProxy(),
            customer_id
        });
    },
    /**
     * 设为默认地址接口
     * @param address_id
     * @returns {*}
     */
    setDefaultAddress(id) {
        return common.postRequest('/customer/main/set-default-address', {
            id,
            isagent: hasProxy(),
        });
    },
    /**
     * 删除地址接口
     * @param address_id
     * @returns {*}
     */
    delAddress(id, customer_id = "") {
        return common.postRequest('/customer/main/del-address', {
            id,
            customer_id,
            isagent: hasProxy(),
        });
    },
    /**
     * 添加新地址接口
     * @param address
     * @returns {*}
     */
    addAddress(address, customer_id = "") {
        return common.postRequest('/customer/main/add-address', {
            ...address,
            isagent: hasProxy(),
            customer_id
        });
    },
    /**
     * 风水师列表接口
     * @returns {*}
     */
    geomancerList() {
        return common.getRequest('/customer/main/geomancer-list');
    },
    /**
     * 风水师详情接口
     * @param geomancer_id
     * @returns {*}
     */
    geomancerDetail(geomancer_id) {
        return common.postRequest('/customer/main/geomancer-detail', {
            geomancer_id
        });
    },
    /**
     * 风水师预约接口
     * @param geomancer
     * @returns {*}
     */
    geomancerBooking(geomancer) {
        return common.postRequest('/customer/main/geomancer-booking', geomancer);
    },
    /**
     * 风水师重预约接口
     * @param geomancer_id
     * @returns {*}
     */
    geomancerRebooking(geomancer_id) {
        return common.postRequest('/customer/main/geomancer-rebooking', {
            geomancer_id
        });
    },
    /**
     * 订单列表接口
     * @returns {*}
     */

    maintenanceOrderList() {
        return common.getRequest('/customer/main/maintenance-order-list');
    },
    /**
     * 订单详情接口
     * @param order_id
     * @returns {*}
     */
    maintenanceOrder(order_id) {
        return common.getRequest('/customer/main/maintenance-order', {
            order_id
        });
    },
    /**
     * 养护订单删除接口
     * @param booking_id
     * @returns {*}
     */
    orderDel(order_id) {
        return common.postRequest('/customer/main/order-del', {
            order_id
        });
    },
    /**
     * 养护订单确认上门接口
     * @param booking_id
     * @returns {*}
     */
    bookingOrderConfirmcome(booking_id) {
        return common.postRequest('/customer/main/booking-order-confirmcome', {
            booking_id
        });
    },
    /**
     * 预约订单列表接口
     * @param page
     * @returns {*}
     */
    bookingOrderList(page) {
        return common.getRequest('/customer/main/booking-order-list', {
            page
        }, {global: false});
    },

    /**
     * 绿植订单列表接口
     * @param page
     * @returns {*}
     */
    saleOrderList(page) {
        return common.getRequest('/customer/main/sale-order-list', {
            page
        }, {global: false});
    },
    /**
     * 养护订单列表接口
     * @param page
     * @returns {*}
     */
    maintenanceOrderList(page) {
        return common.getRequest('/customer/main/maintenance-order-list', {
            page
        }, {global: false});
    },


    /**
     * 商家返馈养护订单错误接口
     * @param order
     * @returns {*}
     */
    orderCheck(order) {
        return common.postRequest('/customer/main/order-check', order);
    },
    /**
     * 商城接口
     * @returns {*}
     */
    mallList(page) {
        return common.getRequest('/customer/main/mall-list', {
            page
        }, {global: false});
    },
    /**
     * 商城搜索接口
     * @param key
     * @returns {*}
     */
    goodsSearch({key, page}) {
        return common.getRequest('/customer/main/search', {
            key,
            page
        }, {global: false});
    },
    /**
     * 商品详情接口
     * @param item_id
     * @returns {*}
     */
    goodsDetail(item_id) {
        return common.postRequest('/customer/main/item-detail', {
            item_id
        })
    },
    /**
     * 添加购物车接口
     * @param goods
     * @returns {*}
     */
    addCart(goods) {
        return common.postRequest('/customer/main/add-cart', {...goods, isagent: hasProxy()});
    },
    /**
     * 购物车接口
     * @returns {*}
     */
    cartList() {
        return common.postRequest('/customer/main/cart', {isagent: hasProxy()});
    },
    /**
     * 删除购车内商品接口
     * @param cartids
     * @returns {*}
     */
    delCartItem(cartids) {
        return common.postRequest('/customer/main/del-cart', {
            cartids,
            isagent: hasProxy()
        })
    },
    /**
     * 去支付时订单详情接口
     * @param cartids
     * @returns {*}
     */
    addOrder(cartids) {
        return common.postRequest('/customer/main/add-order', {
            cartids,
            isagent: hasProxy()
        })
    },
    /**
     * 绿植订单详情(查看订单时)接口
     * @param order_id
     * @returns {*}
     */
    orderDetail(order_id) {
        return common.getRequest('/customer/main/order-detail', {
            order_id
        })
    },
    /**
     * 订单信息提交支付接口
     * @param order
     */
    payment(order) {
        return common.postRequest('/customer/main/payment', order);
    },
    /**
     * 更多套餐接口
     * @param type
     * @param area
     * @param comprehensive
     * @param price
     * @param min_area
     * @param max_area
     * @param min_price
     * @param max_price
     * @param page
     * @return {*}
     */
    moreCombo({type, area, comprehensive, price, min_area, max_area, min_price, max_price, page}) {
        return common.getRequest('/customer/main/more-composite-list', {
            type, area, comprehensive, price, min_area, max_area, min_price, max_price, page
        }, {global: false});
    },
    /**
     * 更多商品接口
     * @param comprehensive
     * @param scene
     * @param price
     * @param min_price
     * @param max_price
     * @param page
     * @return {*}
     */
    moreGoods({comprehensive, scene, price, min_price, max_price, page}) {
        return common.getRequest('/customer/main/more-items', {
            comprehensive,
            scene,
            price,
            min_price,
            max_price,
            page
        }, {global: false});
    },
    /**
     * 商品套餐详情接口
     * @param composite_id
     * @return {*}
     */
    comboDetail(composite_id) {
        return common.postRequest('/customer/main/composite-detail', {
            composite_id
        });
    },
    /**
     * 商家查看养护记录接口
     * @return {*}
     */
    maintenanceHistory(page) {
        return common.getRequest('/customer/main/maintenance-history', {
            page
        });
    },
    /**
     * 商家查看养护记录接口
     * @param id
     * @return {*}
     */
    maintenanceHistoryDetail(id, day_at) {
        return common.getRequest('/customer/main/maintenance-history-detail', {
            day_at,
            id
        });
    },

    /**
     * 修改购物车商品数量接口
     * @param cart_id
     * @param num
     * @return {*}
     */
    editCartNum({cart_id, num}) {
        return common.postRequest('/customer/main/edit-cart-num', {
            cart_id,
            num,
            isagent: hasProxy()
        }, {global: false});
    },
    /**
     * 发票申请
     * @param header
     * @param contact
     * @param mobile
     * @param address_id
     * @return {*}
     */
    invoiceApply({header, contact, mobile, address_id, taxnumber, type}) {
        return common.postRequest('/customer/main/invoice-apply', {
            header, contact, mobile, address_id, taxnumber, type
        });
    },
    /**
     * 发票信息接口
     * @return {*}
     */
    invoiceInfo() {
        return common.postRequest('/customer/main/invoice-info');
    },
    /**
     * 开票历史
     * @return {*}
     */
    invoiceHistory(page) {
        return common.postRequest('/customer/main/invoice-history', {
            page
        });
    },
    /**
     * 优惠券
     * @param cartids
     * @return {*}
     */
    couponList(cartids) {
        return common.getRequest('/customer/main/coupon', {
            cartids
        });
    },
    /**
     * 面积过滤接口
     * @return {*}
     */
    areaList() {
        return common.getRequest('/customer/main/area-list', {}, {global: false});
    },
    /**
     * 价格过滤接口
     * @return {*}
     */
    priceList() {
        return common.getRequest('/customer/main/price-list', {}, {global: false});
    },
    /**
     * 微信预支付接口
     * @param id
     * @return {*}
     */
    wxPrepay(id) {
        return common.getRequest('/customer/main/wx-prepay', {
            id
        }, {global: false});
    },
    /**
     * 预支付接口
     * @param id
     * @param paymenthod
     */
    prepay({id, paymenthod}) {
        return common.getRequest('/customer/main/prepay', {
            id, paymenthod
        });
    },
    /**
     * 投诉建议接口
     * @param sessionkey
     * @param suggestion
     * @param mobile
     * @returns {*}
     */
    advice: function (suggestion, mobile, suggestion_id = 1) {
        return common.postRequest('/customer/main/complaint-suggestion', {
            suggestion,
            mobile,
            suggestion_id
        });
    },
    /**
     * 获取客服接口
     * @param sessionkey
     * @returns {*}
     */
    getServer: function (sessionkey) {
        return common.postRequest('/maintenance/main/get-server', {
            sessionkey
        });
    },
    /**
     * 我的建议接口
     * @param sessionkey
     * @returns {*}
     */
    myAdvice: function (sessionkey) {
        return common.postRequest('/maintenance/main/my-suggestion', {
            sessionkey
        });
    },
    /**
     * 获取购物车数量
     * @return {*}
     */
    getCartNum() {
        return common.getRequest('/customer/main/cart-num', {isagent: hasProxy()}, {global: false});
    },


}
export {
    userApi
}