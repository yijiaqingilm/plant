<template>
    <f7-page>
        <back title="申请更换"></back>
        <f7-block inner class="applyReplace" no-hairlines>
            <div class="header">
                <p>说明：如您养护的绿植出现死亡状况，请申请提交更换</p>
                <p>仅支持从株株绿植租赁的绿植，如为自有绿植被养护死亡，请与客服沟通</p>
            </div>
            <div class="line-10"></div>
            <div class="content">
                <div class="top">
                    <div v-show="showCode" class="two-code" @click="getCode">
                        <div class="scan"></div>
                        <div class="scan-msg">点击扫描需更换绿植的专属二维码</div>
                    </div>
                    <div v-show="!showCode" class="plant one-px-dotted">
                        <div class='wrap'>
                            <div class="plant-photo"><img :src="plantInfo.img" alt=""></div>
                            <div class="plant-info">
                                <div class="name">名称：{{plantInfo.name}}</div>
                                <div class="number">编号：{{plantInfo.shopper_item_detail_id}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="photo one-px-dotted" @click="chooseImage" v-if="!isPhoto">
                    <div><img class="photo_detail" src="../../assets/icon_photo.png" alt=""></div>
                    <div class="photo-msg">
                        点击拍照上传需更换绿植的状况图
                    </div>
                </div>
                <div class="photo" v-if="isPhoto" @click="chooseImage">
                    <img :src="localIds" class="file_image" alt="" @load="imageLoad">
                </div>

                <div class="apply"><span class="my-button" @click="applyReplace">申请更换</span></div>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
    import wx from 'wx';
    import {gardenerApi} from 'api'
    import {common} from 'lib/common'

    export default {
        data() {
            return {
                showCode: true,
                plantInfo: {},
                isPhoto: false,
                localIds: '',
                serverId: ''
            }
        },
        created() {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            imageLoad() {

            },
            chooseImage() {
                let that = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        that.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        that.isPhoto = true;
                        setTimeout(() => {
                            wx.uploadImage({
                                localId: res.localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    that.serverId = res.serverId; // 返回图片的服务器端ID
                                    console.log(res, 'serverId');
                                }, fail: function (res) {
                                    that.$f7.alert(JSON.stringify(res));
                                }

                            });
                        }, 100);

                    }
                });
            },
            applyReplace() {
                if (this.plantInfo.shopper_item_detail_id === void(0) || this.plantInfo.shopper_item_detail_id == '') {
                    this.$f7.alert('扫一扫获取需要更换的绿植');
                    return;
                }
                if (this.serverId == '') {
                    this.$f7.alert('点击拍照上传需更换绿植的状况图');
                    return;
                }
                gardenerApi.replacePlant(this.serverId, this.plantInfo.shopper_item_detail_id).then(result => {
                    this.$f7.alert('您已提交申请更换绿植<br>请等待后台审核批准', '', () => {
                        this.showCode = true;
                        this.plantInfo = {};
                        this.isPhoto = false;
                        this.localIds = '';
                        this.serverId = '';
                        this.$router.back();
                    });

                });
            },
            /**
             * 扫一扫 获得二维码
             */
            getCode() {
                var that = this;
                //扫一扫功能
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        //扫完 回调 得到二维码
                        gardenerApi.getPlantInfo(result.split('#')[1]).then(result => {
                            if (result.data.length <= 0) {
                                that.$f7.alert('扫码错误');
                            } else {
                                that.plantInfo = result.data;
                                that.showCode = false;

                            }
                        });
                    }
                });

            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/applyReplace.scss";
</style>

