<template>
    <div>
        <div class="map" id="map" v-show="showMap"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import AMap from 'AMap'
    import {amapUtils} from 'lib/utils'

    export default {
        props: {
            showMap: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                map: '',
                geolocation: '',
                mapData: ''
            }
        },
        created: function () {

        },
        mounted() {
            //加载地图，调用浏览器定位服务
            this.map = new AMap.Map('map', {
                resizeEnable: true
            });
            this.map.plugin('AMap.Geolocation', () => {
                this.geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                });
                this.map.addControl(this.geolocation);
                /*this.getCurrentPosition().then(result => {
                    this.$emit("getCurrentPosition",result);
                    console.log('success');
                    console.log(result);
                });*/
            });

        },
        methods: {
            hasGeolocation() {
                return this.geolocation;
            },
            getCurrentPosition: function () {
                this.$store.state.showLoading = true;
                this.$store.state.loadingMsg = "定位中";
                return new Promise((resolve, reject) => {
                    //  阻塞线程等待gelocation初始化完成
                    while (this.geolocation == "") {

                    }
                    this.geolocation.getCurrentPosition((status, result) => {
                        if (status === 'complete') {
                            this.$emit("getCurrentPosition", result);
                            resolve(result);
                        } else {
                            reject(result);
                        }
                        this.$store.state.showLoading = false;
                        this.$store.state.loadingMsg = "Loading...";
                    });
                });
            },
        },
        components: {},
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myMap.scss";
</style>
