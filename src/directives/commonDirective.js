/**
 * Created by Administrator on 2017/4/25.
 */
import Vue from 'vue'

Vue.directive('focus', {
    inserted: function (el) {
        console.log(el);
        console.log('inserted')
        el.focus();
    },
    update: function (el) {
        console.log('update')
    }
});

Vue.directive("check-all", {
    bind (el, binding) {
        var checkData = JSON.parse(el.dataset.checkData) ;
        if (checkData.every((item) => item.checked)) {
            el.dataset.checkAll=true;
        } else {
            el.dataset.checkAll=false;
        }

    },
    update: function (checkAll) {
    }
})


