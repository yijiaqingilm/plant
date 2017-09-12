/**
 * Created by Administrator on 2017/4/28.
 */
var loadbyUserViewName = function (name) {
    /* return require(`src/pages/user/${name}.vue`);*/
    /*return () => {
        return new Promise((resolve, reject) => {
            require.ensure([], () => {
                resolve(require(`src/pages/user/${name}.vue`));

            }, 'user-info')
        });


    }*/
     return () =>import(/* webpackChunkName: "user-info" */ `src/pages/user/${name}.vue`);
}

export default [
    {path: '/user/book', component: loadbyUserViewName('Book')},
    {path: '/user/book/after', component: loadbyUserViewName('BookAfter')},
    {path: '/user/book/success/:type', component: loadbyUserViewName('BookSuccess')},
    {path: '/user/address/list', component: loadbyUserViewName('AddressList')},
    {path: '/user/address/edit/:type', component: loadbyUserViewName('AddressAdd')},


    {path: '/user/order', component: loadbyUserViewName('Order')},
    {path: '/user/order/before', component: loadbyUserViewName('OrderBefore')},
    {path: '/user/order/after', component: loadbyUserViewName('OrderAfter')},
    {path: '/user/order/list', component: loadbyUserViewName('OrderList')},
    {path: '/user/order/detail/:id/:orderId', component: loadbyUserViewName('OrderDetail')},


    {path: '/user/profile', component: loadbyUserViewName('Profile')},
    {path: '/user/myOrder', component: loadbyUserViewName('MyOrder')},
    {path: '/user/subs/list', component: loadbyUserViewName('SubsList')},
    {path: '/user/invoice', component: loadbyUserViewName('Invoice')},
    {path: '/user/invoice/success', component: loadbyUserViewName('InvoiceSuccess')},
    {path: '/user/invoice/list', component: loadbyUserViewName('InvoiceList')},
    {path: '/user/coupon/list', component: loadbyUserViewName('CouponList')},
    {path: '/user/aboutUs', component: loadbyUserViewName('AboutUs')},
    {path: '/user/agreement', component: loadbyUserViewName('Agreement')}
]
