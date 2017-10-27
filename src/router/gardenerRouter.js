/**
 * Created by Administrator on 2017/4/28.
 *  养护人员 路由器
 */
var loadbyGardenerViewName = function (name) {
  /* return  require(`src/pages/gardener/${name}.vue`)*/
  /* return () => {
      return new Promise((resolve, reject) => {
          require.ensure([], () => {
              resolve(require(`src/pages/gardener/${name}.vue`));
          }, 'gardener-info')
      });

  }*/
  return () => import(/* webpackChunkName: "gardener-info" */ `src/pages/gardener/${name}.vue`)
}

export default [
  {path: '/gardener/applyBefore', component: loadbyGardenerViewName('ApplyBefore')},
  {path: '/gardener/apply', component: loadbyGardenerViewName('Apply')},
  {path: '/gardener/applyAfter', component: loadbyGardenerViewName('ApplyAfter')},
  {path: '/gardener/applyErr', component: loadbyGardenerViewName('ApplyErr')},
  {path: '/gardener/center', component: loadbyGardenerViewName('Center')},
  {path: '/gardener/orderList', component: loadbyGardenerViewName('OrderList')},
  {path: '/gardener/detail/:shopperId/:order_id', component: loadbyGardenerViewName('Detail')},
  {path: '/gardener/historyDetail/:shopperId/:order_id', component: loadbyGardenerViewName('HistoryDetail')},
  {path: '/gardener/clockIn/:shopperId/:shopper_period_id/:order_id', component: loadbyGardenerViewName('ClockIn')},
  {path: '/gardener/service', component: loadbyGardenerViewName('Service')},
  {path: '/gardener/advice', component: loadbyGardenerViewName('Advice')},
  {path: '/gardener/replaceList', component: loadbyGardenerViewName('ReplaceList')},
  {path: '/gardener/applyReplace', component: loadbyGardenerViewName('ApplyReplace')},
  {path: '/gardener/performance', component: loadbyGardenerViewName('Performance')},
  {path: '/gardener/performance/rule', component: loadbyGardenerViewName('PerformanceRule')},
  {path: '/gardener/performance/detail/:id', component: loadbyGardenerViewName('PerformanceDetail')},
  {path: '/gardener/history/list', component: loadbyGardenerViewName('HistoryList')},
  {path: '/gardener/profile', component: loadbyGardenerViewName('Profile')},
]
