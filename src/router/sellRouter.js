/**
 * Created by Administrator on 2017/4/28.
 */
var loadbySellViewName = function (name) {
  return () => import(/* webpackChunkName: "user-info" */ `src/pages/sell/${name}.vue`)
}
export default [
  {path: '/sell/profile', component: loadbySellViewName('Profile')},
  {path: '/sell/apply', component: loadbySellViewName('Apply')},
  {path: '/sell/applyAfter', component: loadbySellViewName('ApplyAfter')},
  {path: '/sell/applyBefore', component: loadbySellViewName('ApplyBefore')},
  {path: '/sell/applyErr', component: loadbySellViewName('ApplyErr')},
  {path: '/sell/home', component: loadbySellViewName('Home')},
  {path: '/sell/center', component: loadbySellViewName('Center')},
  {path: '/sell/crm', component: loadbySellViewName('Crm')},
  {path: '/sell/editCrm/:clientId', component: loadbySellViewName('EditCrm')},
  {path: '/sell/bookOrderList', component: loadbySellViewName('BookOrderList')},
  {path: '/sell/completedList', component: loadbySellViewName('CompletedList')},
  {path: '/sell/proxyOrder', component: loadbySellViewName('ProxyOrder')},
  {path: '/sell/proxyOrder/detail', component: loadbySellViewName('ProxyOrderDetail')},
  {path: '/sell/addPlant', component: loadbySellViewName('AddPlant')},
  {path: '/sell/search/history', component: loadbySellViewName('SearchHistory')},
  {path: '/sell/search', component: loadbySellViewName('Search')},
  {path: '/sell/cart', component: loadbySellViewName('ShoppingCart')},
  {path: '/sell/pay', component: loadbySellViewName('Pay')},
  {path: '/sell/myOrder', component: loadbySellViewName('MyOrder')},
  {path: '/sell/orderDetail/:goodsId', component: loadbySellViewName('OrderDetail')},
  {path: '/sell/coupon', component: loadbySellViewName('Coupon')},
  {path: '/sell/client/list', component: loadbySellViewName('ClientList')},
  {path: '/sell/performance', component: loadbySellViewName('Performance')},
  {path: '/sell/navi', component: loadbySellViewName('Navi')},
  {path: '/sell/confirm/order', component: loadbySellViewName('ConfirmOrder')},
]
