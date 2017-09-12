<template>
    <f7-page @page:init="init">
        <back title="客户管理系统">
            <div slot='right' @click="$router.load({url:'/sell/client/list'})">客户列表</div>
        </back>
        <f7-block inner no-hairlines class="crm">
            <div class="form">
                <input type="hidden" v-model="crmInfo.location">
                <div class="group ">
                    <div class="form-label">客户编号：</div>
                    <div class="form-input"><input v-model="crmInfo.customer_id" placeholder="" type="text"></div>
                </div>
                <div class="group ">
                    <div class="form-label"><span class="color-warn">*</span>公司名称：</div>
                    <div class="form-input"><input v-model="crmInfo.company" placeholder="" type="text"></div>
                </div>
                <div class="group">
                    <div class="form-label"><span class="color-warn">*</span>公司地址：</div>
                    <div class="form-input" @click="show">{{crmInfo.address}}
                    </div>
                    <div @click="show"><img src="../../assets/icon_address2.png" class="icon_address" alt=""></div>
                </div>
                <div class="group">
                    <div class="form-label"><span class="color-warn">*</span>详细地址：</div>
                    <div class="form-input"><input v-model="crmInfo.addressdetail" placeholder="" type="text"></div>
                </div>
                <div class="group">
                    <div class="form-label">联系人：</div>
                    <div class="form-input"><input v-model="crmInfo.contact" placeholder="" type="text"></div>
                </div>
                <div class="group">
                    <div class="form-label">联系电话：</div>
                    <div class="form-input"><input v-model="crmInfo.mobile" placeholder="" type="text"></div>
                </div>
            </div>
            <div class="default-row no-border">
                <div>上传公司照片<span class="mini-text">(选填)</span>:</div>
            </div>
            <div class="clearBoth">
                <div class="image-file" @click="chooseImage">
                    <img :src="default_img" alt="">
                    <!--<my-image-upload :default-src="default_img" :img-style="{borderRadius:0}" id="upload-firm-logo"
                                     @getBlob="getFirmLogo"></my-image-upload>-->
                </div>
            </div>

            <div class="default-pd">备注：</div>
            <div class="default-pd content">
                <textarea v-model="crmInfo.remark" maxlength="200" placeholder='请输入备注'></textarea>
            </div>


            <my-frame-map v-if="loadMap" ref="myMap" @getAddressInfo="getInfo"></my-frame-map>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="c-footer" @click="submit">
                保存
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {Validator} from 'lib/custom_validator';
    import MyFrameMap from 'components/myFrameMap/myFrameMap.vue'
    import MyImageUpload from 'components/myImageUpload/myImageUpload.vue'
    import {sellApi} from "api"

    export default {
        data() {
            return {
                default_img: require('../../assets/icon_firm.png'),
                crmInfo: {
                    address: '',
                    state: '',
                    lng: '',
                    lat: '',
                    addressdetail: '',
                    album: '',
                    remark: '',
                    contact: '',
                    mobile: '',
                    customer_id: '',
                },
                loadMap: false,
                errors: null,
                validator: null,
                localIds: '',
                serverId: ''
            }
        },
        created() {
            this.validator = new Validator({
                company: 'required',
                address: 'required',
                addressdetail: 'required'

            });
            this.$set(this, 'errors', this.validator.errorBag);
        },
        methods: {
            init() {
                /*延迟加载地图资源 */
                setTimeout(() => {
                    this.loadMap = true;
                }, 500);
            },
            chooseImage() {
                let that = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        that.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        that.default_img = res.localIds[0];
                        setTimeout(() => {
                            wx.uploadImage({
                                localId: res.localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    that.serverId = res.serverId; // 返回图片的服务器端ID
                                    that.crmInfo.album = res.serverId;
                                }, fail: function (res) {
                                    that.$f7.alert(JSON.stringify(res));
                                }

                            });
                        }, 100);

                    }
                });
            },
            submit() {
                this.validator.validateAll({
                    company: this.crmInfo.company,
                    address: this.crmInfo.address,
                    addressdetail: this.crmInfo.addressdetail,
                })

                //  校验信息
                if (this.errors.errors.length > 0) {
                    this.$f7.alert(this.errors.errors[0].msg);
                    return;
                }
                sellApi.addClient(this.crmInfo).then(data => {
                    console.log(data, 'data');
                    this.$f7.alert(data.result, '', () => {
                        // this.$router.load({url: '/sell/client/list'});
                        this.crmInfo = {
                            address: '',
                            state: '',
                            lng: '',
                            lat: '',
                            addressdetail: '',
                            album: '',
                            remark: '',
                            contact: '',
                            mobile: '',
                            customer_id: ''
                        };
                        this.default_img = require('../../assets/icon_firm.png');
                    })

                }).catch(err => {
                    console.log(err)
                });
            },
            show: function () {
                //alert('show' + this.showMap);
                //this.showMap = true;
                this.$refs.myMap.showFrameMap();
            },
            getInfo: function (address) {
                this.$refs.myMap.hideFrameMap();
                console.log(address);
                Object.assign(this.crmInfo, address);
                this.crmInfo.address = address.district + address.street + address.name;
                this.crmInfo.state = address.province;
                this.crmInfo.lng = address.location.split(',')[0];
                this.crmInfo.lat = address.location.split(',')[1];
            }
        },
        computed: {},
        components: {MyFrameMap, MyImageUpload}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/sell/crm.scss";
</style>
