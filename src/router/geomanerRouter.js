/**
 * Created by Administrator on 2017/5/22.
 */
/**
 * Created by Administrator on 2017/4/28.
 */
var loadbygeomanerViewName = function (name) {
  return () => import(/* webpackChunkName: "geomaner-info" */ `src/pages/geomaner/${name}.vue`)
}
export default [
  {path: '/geomaner/list', component: loadbygeomanerViewName('GeoList')}
]
