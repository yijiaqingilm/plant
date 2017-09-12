<template>
    <f7-page class="apply" @page:init="init">
        <back title="个人信息"></back>
        <f7-list>
            <ul class="ul-form">
                <li>
                    <div class="item-content">
                        <div class="item-inner no-border">
                            <div class="item-title label">头像</div>
                            <div class="item-input avatar">
                                <my-image-upload :default-src="user.avatarsmall" id="file-upload"
                                                 @getBlob="getBlob"></my-image-upload>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner no-border">
                            <div class="item-title label">姓名</div>
                            <div class="item-input">
                                {{user.realname}}
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">性别</div>
                            <div class="item-input no-border">
                                {{sex[user.sex]}}
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">身份证号</div>
                            <div class="item-input">
                                {{user.identity}}
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
            <div class="my-button" @click="submit()">修改</div>
        </div>


        <my-frame-map v-if="load" ref="myMap" :location="user.location"
                      @getAddressInfo="getAddressInfo"></my-frame-map>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import MyImageUpload from 'components/myImageUpload/myImageUpload.vue'
    import MyFrameMap from 'components/myFrameMap/myFrameMap.vue'
    import {sellApi, userApi} from 'api'
    import {Validator} from 'lib/custom_validator';

    export default {
        data() {
            return {
                sex: {
                    1: '男',
                    2: '女'
                },
                user: {
                    realname: '',
                    // 性别1男，2女 ,
                    sex: '1',
                    mobile: '',
                    address: '',
                    addressdetail: '',
                    avatar: '',
                    location: '',
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
                addressdetail: 'required'
            });
            this.$set(this, 'errors', this.validator.errorBag);
            userApi.getInfo().then(result => {
                console.log('result', result);
                this.user = result.data;
                if (this.user.lng !== void(0) && this.user.lat !== void(0) && (this.user.lng != '' || this.user.lat != '')) {
                    this.user.location = this.user.lng + ',' + this.user.lat;
                }
            });
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            showMap() {
                this.$refs.myMap.showFrameMap();
            },
            init() {
                /*延迟加载地图资源 */
                setTimeout(() => {
                    this.load = true;
                }, 500);

            },
            submit() {
                this.validator.validateAll({
                    realname: this.user.realname,
                    identity: this.user.identity,
                    mobile: this.user.mobile,
                    address: this.user.address,
                    addressdetail: this.user.addressdetail
                })
                console.log(this.errors);

                //  校验信息
                if (this.errors.errors.length > 0) {
                    this.$f7.alert(this.errors.errors[0].msg);
                    return;
                }
                console.log(this.user, 'user');
                sellApi.updateSellInfo(this.user).then(data => {
                    console.log(data, 'data');
                    this.$f7.alert(data.result, '', () => {
                    })

                }).catch(err => {
                    console.log(err)
                });
            },
            getAddressInfo(address) {
                console.log(address);
                this.$refs.myMap.hideFrameMap();
                let address_info = address.district + address.street + address.name;
                this.user.address = address_info;
                this.user.location = address.location;
                this.user.lng = address.location.split(',')[0];
                this.user.lat = address.location.split(',')[1];
            },
            getBlob(blob) {
                this.user.avatar = blob;
            }
        },
        components: {MyImageUpload, MyFrameMap}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/apply.scss";
</style>

