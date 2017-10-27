/**
 * Created by Administrator on 2017/10/20.
 *  年桔 路由器
 */
var loadbyOrangeViewName = function (name) {
  return () => import(/* webpackChunkName: "orange-info" */ `src/pages/orange/${name}.vue`)
}

export default [
  {path: '/orange/index', component: loadbyOrangeViewName('Index')},
  {path: '/orange/home', component: loadbyOrangeViewName('Home')},
  {path: '/orange/goodsDetail/:goodsId', component: loadbyOrangeViewName('GoodsDetail')},
  {path: '/orange/comboDetail/:comboId', component: loadbyOrangeViewName('Combo')},
]
