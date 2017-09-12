<template>
    <div>
        <div class="form">
            <input type="hidden" v-model="address.location">
            <div class="group ">
                <div class="form-label">公司名称：</div>
                <div class="form-input"><input v-model="address.company" placeholder="" type="text"></div>
            </div>
            <div class="group">
                <div class="form-label">联系人：</div>
                <div class="form-input"><input v-model="address.contact" placeholder="" type="text"></div>
            </div>
            <div class="group">
                <div class="form-label">联系电话：</div>
                <div class="form-input"><input v-model="address.mobile" placeholder="" type="text"></div>
            </div>
            <div class="group">
                <div class="form-label">地址：</div>
                <div class="form-input" @click="show">{{address.address}}
                </div>
                <div @click="show"><img src="../../assets/icon_address2.png" class="icon_address" alt=""></div>
            </div>
            <div class="group">
                <div class="form-label">详细地址：</div>
                <div class="form-input"><input v-model="address.addressdetail" placeholder="" type="text"></div>
            </div>
        </div>
        <my-frame-map v-if="loadMap" ref="myMap" :showMap="showMap" @getAddressInfo="getInfo"></my-frame-map>
    </div>
</template>

<script type="text/ecmascript-6">
    import MyFrameMap from 'components/myFrameMap/myFrameMap.vue'

    export default {
        props: {
            address: Object
        },
        data() {
            return {
                showMap: false,
                loadMap: false
            }
        },
        created: function () {
            setTimeout(() => {
                this.loadMap = true;
            }, 800);
        },

        methods: {
            show: function () {
                //alert('show' + this.showMap);
                //this.showMap = true;
                this.$refs.myMap.showFrameMap();
            },
            getInfo: function (address) {
                this.showMap = false;
                this.$refs.myMap.hideFrameMap();
                console.log(address);
                this.$emit('getAddressInfo', address);
            }
        },
        components: {MyFrameMap},
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "addressForm.scss";
</style>
