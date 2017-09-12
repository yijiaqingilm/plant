<template>
    <f7-page class="apply" @page:init="init">
        <back title="提交申请"></back>
        <f7-list>
            <ul class="ul-form">
                <li>
                    <div class="item-content">
                        <div class="item-inner no-border">
                            <div class="item-title label">头像</div>
                            <div class="item-input avatar">
                                <my-image-upload id="file-upload" @getBlob="getBlob"></my-image-upload>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner no-border">
                            <div class="item-title label">姓名</div>
                            <div class="item-input">
                                <input type="text" v-model="user.realname" name="name" placeholder="输入姓名">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">性别</div>
                            <div class="item-input no-border">
                                <my-radio v-model="user.sex" :checked="true" name="sex" :val="1"
                                          id="man"></my-radio>
                                <label for="man">男</label>
                                <my-radio v-model="user.sex" name="sex" :val="2" id="woman"></my-radio>
                                <label for="woman">女</label>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">身份证号</div>
                            <div class="item-input">
                                <input type="text" v-model="user.identity" placeholder="输入身份证号码">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">联系电话</div>
                            <div class="item-input">
                                <input type="text" v-model="user.mobile" name="mobile" placeholder="输入手机号码">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label col-25">住址</div>
                            <div class="item-input">
                                <input type="text" v-model="user.address" readonly @click="showMap"
                                       name="address" placeholder="地图自动定位">
                            </div>
                            <div class="icon_map"></div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">详细地址</div>
                            <div class="item-input">
                                <input type="text" v-model="user.addressdetail" placeholder="输入详细地址">
                            </div>
                        </div>
                    </div>
                </li>

            </ul>
        </f7-list>
        <div class="submit">
            <div class="my-button" @click="submit()">提交申请</div>
        </div>
        <my-frame-map v-if="load"  ref="myMap" :location="user.location" @getAddressInfo="getAddressInfo"></my-frame-map>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import MyImageUpload from 'components/myImageUpload/myImageUpload.vue'
    import MyFrameMap from 'components/myFrameMap/myFrameMap.vue'
    import {gardenerApi} from 'api'
    import {Validator} from 'lib/custom_validator';
    export default {
        data(){
            return {
                user: {
                    realname: '',
                    // 性别1男，2女 ,
                    sex: '1',
                    mobile: '',
                    address: '',
                    state: '',
                    city: '',
                    district: '',
                    addressdetail: '',
                    avatar: '',
                    location: '',
                    lng: '',
                    lat: '',
                    street: '',
                    identity: ''
                },
                errors: null,
                validator: null,
                load: false
            }
        },
        created: function () {
            this.validator = new Validator({
                realname: 'required',
                identity: 'required',
                mobile: 'required|mobile',
                address: 'required',
            });
            this.$set(this, 'errors', this.validator.errorBag);
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            init() {
                /*延迟加载地图资源 */
                setTimeout(() => {
                    this.load = true;
                }, 500);

            },
            showMap() {
                this.$refs.myMap.showFrameMap();
            },
            submit () {
                this.validator.validateAll({
                    realname: this.user.realname,
                    identity: this.user.identity,
                    mobile: this.user.mobile,
                    address: this.user.address,
                })
                console.log(this.errors);

                //  校验信息
                if (this.errors.errors.length > 0) {
                    this.$f7.alert(this.errors.errors[0].msg);
                    return;
                }

                gardenerApi.apply(this.user).then(data => {
                    console.log(data);
                    this.$router.load({url: '/gardener/applyAfter'})
                }).catch(err => {
                    console.log(err)
                });
            },
            getAddressInfo(address) {
                console.log(address);
                this.$refs.myMap.hideFrameMap();
                this.user.city = address.city;
                this.user.state = address.province;
                this.user.district = address.district;
                this.user.location = address.location;
                this.user.lng = address.location.split(',')[0];
                this.user.lat = address.location.split(',')[1];
                this.user.address = address.name;

            },
            getBlob(blob){
                this.user.avatar = blob;
            }
        }, components: {MyImageUpload, MyFrameMap}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/apply.scss";
</style>

