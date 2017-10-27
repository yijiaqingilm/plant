/**
 * Created by Administrator on 2017/4/28.
 *
 *  商品 路由
 */


var loadbyStoreViewName = function (name) {
  /* return require(`src/pages/store/${name}.vue`);*/
  /* return () => {
      return new Promise((resolve, reject) => {
          require.ensure([], () => {
              resolve(require(`src/pages/store/${name}.vue`));

          }, 'store-info')
      });

  }*/
  return () => import(/* webpackChunkName: "store-info" */ `src/pages/store/${name}.vue`)

}

export default [
  {path: '/store/home', component: loadbyStoreViewName('Home')},
  {path: '/store/newHome', component: loadbyStoreViewName('NewHome')},
  {path: '/store/zone', component: loadbyStoreViewName('Zone')},
  {path: '/store/goodsDetail/:goodsId', component: loadbyStoreViewName('GoodsDetail')},
  {path: '/store/comboDetail/:comboId', component: loadbyStoreViewName('Combo')},
  {path: '/store/moreCombo/:type', component: loadbyStoreViewName('MoreCombo')},
  {path: '/store/moreGoods/', component: loadbyStoreViewName('MoreGoods')},
  {path: '/store/cart', component: loadbyStoreViewName('ShoppingCart')},
  {path: '/store/pay', component: loadbyStoreViewName('Pay')},
  {path: '/store/confirm/order', component: loadbyStoreViewName('ConfirmOrder')},
  {path: '/store/changePay', component: loadbyStoreViewName('ChangePay')},
  {path: '/store/orderDetail/:orderId', component: loadbyStoreViewName('OrderDetail')},
  {path: '/store/search', component: loadbyStoreViewName('Search')},
  {path: '/store/search/history', component: loadbyStoreViewName('SearchHistory')}
]
