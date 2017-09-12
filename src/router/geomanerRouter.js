/**
 * Created by Administrator on 2017/5/22.
 */
/**
 * Created by Administrator on 2017/4/28.
 */
var loadbygeomanerViewName = function (name) {
    return require(`src/pages/geomaner/${name}.vue`);
    /*return () => {
        return new Promise((resolve, reject) => {
            require.ensure([], () => {
                resolve(require(`src/pages/geomaner/${name}.vue`));

            },'geo-info')
        });

    }*/

}
export default [
    {path: '/geomaner/list', component: loadbygeomanerViewName('GeoList')},
]