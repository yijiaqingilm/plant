/**
 * Created by Administrator on 2017/6/9.
 */
import Vue from 'vue'
import moment from 'lib/moment'
import "lib/moment/locale/zh-cn"
moment.locale('zh-cn');
Vue.filter('uppercase', function (value) {
    if (!value) {
        return ''
    }
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('toFixed', function (value, num = 2) {
    if (!value) {
        return value
    }
    return Number(value).toFixed(num);
});

Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
    if (!Number(value)) {
        return value;
    }
    return moment(value).format(format);
});



