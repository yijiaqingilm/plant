<template>
    <f7-popup class="popupMap">
        <iframe id='myFrame'  :src="src" class='myFrame'
        ></iframe>
    </f7-popup>
</template>

<script type="text/ecmascript-6">
    import AMap from 'AMap'
    import {amapUtils, commonly} from 'lib/utils'

    export default {
        props: {
            location: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                src: '',
            }
        },
        created: function () {
            console.log('location', this.location);
        },
        mounted() {
            this.$nextTick(() => {
                //7ec805b35f785e2718b5c6be42869b58
                var url = "https://m.amap.com/picker/?keywords=写字楼,小区,学校&key=f9c719281e11c1b009601907809f0e19";
                //https://m.amap.com/picker/?center=116.3972,39.9696&key=608d75903d29ad471362f8c58c550daf
                var iframes = document.querySelectorAll(".myFrame");
                var iframe=iframes[iframes.length-1];
                if (this.location && this.location != '') {
                    url += "&center=" + this.location;
                }
                this.src = url;
                iframe.onload = () => {
                    iframe.contentWindow.postMessage('hello', 'https://m.amap.com/picker/');
                    window.addEventListener("message", (e) => {
                        console.log('message')
                        let cutting = commonly.split(',');
                        commonly.compose(amapUtils.regeocoder, cutting)(e.data.location).then(result => {
                            console.log(result);
                            let addressComponent = result.regeocode.addressComponent;
                            this.$emit("getAddressInfo", Object.assign({
                                location: e.data.location,
                                name: e.data.name,
                                street: e.data.street,
                                streetNumber: e.data.streetNumber,
                                district: e.data.district
                            }, addressComponent));
                        }).catch(err => {
                            console.log(err);
                        });

                    }, false);
                };
            });
        },
        methods: {
            showFrameMap() {
                this.$f7.popup('.popupMap');
            },
            hideFrameMap() {
                this.$f7.closeModal('.popupMap');
            }
        },
        components: {},
        computed: {},
        watch: {
            location: {
                handler(curVal, oldVal) {
                    if (curVal && curVal != '') {
                        this.src += "&center=" + curVal;
                    }
                },
            },

        }

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myFrameMap.scss";
</style>
