<template>
    <f7-page>
        <back title="地图导航"></back>
        <f7-block inner no-hairlines>
            <my-map ref="myMap"></my-map>
            <iframe :src="src" class='myFrame'></iframe>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import MyMap from 'components/myMap/myMap.vue'
    import {Cache} from 'lib/utils'

    export default {
        data() {
            return {
                src: '',
                dest: '',
                destName: ''
            }
        },
        created() {

        },
        mounted() {
            this.$nextTick(() => {
                let {dest, destName} = Cache.get('navi') || {};
                // location.href = `//m.amap.com/navi/?start=116.403124,39.940693&dest=116.481488,39.990464&destName=阜通西&naviBy=car&key=f9c719281e11c1b009601907809f0e19`;
                this.$refs.myMap.getCurrentPosition().then(({position}) => {
                    let start = position.getLng() + "," + position.getLat();
                    this.src = `//m.amap.com/navi/?start=${start}&dest=${dest}&destName=${destName}&naviBy=car&key=f9c719281e11c1b009601907809f0e19`;
                });

            });
        },
        components: {MyMap}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/sell/navi.scss";

    .content-block-inner, .content-block {
        height: 100%;
    }
</style>
