<template>
    <f7-page>
        <back title="优惠券"></back>
        <f7-block inner class="" no-hairlines>
            <div class="form no-border">
                <div class="user-group">
                    <div class="group ">
                        <div class="form-label">用户编号：</div>
                        <div class="form-input"><input v-model="userNumber" placeholder="请输入用户编号" type="text">
                        </div>
                    </div>
                    <div><span class="middle-button" @click="getUser">确定</span></div>
                </div>
                <div class="group">
                    <div class="form-label">用户名：</div>
                    <div class="form-input"><input :value="orderInfo.company" placeholder="" type="text">
                    </div>
                </div>
                <div class="group between" @click="openPicker">
                    <div class="form-label">优惠券类型：</div>
                    <div class="form-input text-right color-theme">
                        <span v-if="coupon && coupon.id !=''">{{coupon.name}}</span>
                        <span v-else>请选择优惠券</span><span class="gt"></span>
                    </div>
                </div>
                <input type="hidden" class="coupon">
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border" @click="send">
            <div class="c-footer" @click="send">
                派发
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {sellApi} from 'api'

    export default {
        data() {
            return {
                userNumber: '',
                orderInfo: {
                    userId: '',
                    company: ''
                },
                couponList: [],
                coupon: {
                    id: '',
                    discount: 0,
                    name: ''
                },
                couponPicker: null
            }
        },
        created() {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        mounted() {
            this.$nextTick(() => {
                let that = this;
                sellApi.couponList().then(result => {
                    let coupon_input = document.querySelectorAll('.coupon');
                    let couponValues = [];
                    let couponDisplayValues = [];
                    this.couponList = result.data;
                    this.couponList.forEach((item) => {
                        couponValues.push(item.id);
                        couponDisplayValues.push(item.name);
                    });
                    this.couponPicker = this.$f7.picker({
                        closeByOutsideClick: false,
                        input: coupon_input[coupon_input.length - 1],
                        values: [that.coupon.id],
                        toolbarTemplate: `<div class="toolbar">
                                          <div class="toolbar-inner">
                                            <div class="left"></div>
                                            <div class="center">优惠券选择</div>
                                            <div class="right">
                                              <a href="#" class="link close-picker">确定</a>
                                            </div>
                                          </div>
                                       </div> `,
                        cols: [
                            {
                                textAlign: 'center',
                                values: couponValues,
                                displayValues: couponDisplayValues
                            }
                        ], onClose({value}) {
                            console.log('关闭', value);
                            that.coupon = that.couponList.find(item => item.id == value[0]);
                        }
                    });
                });


            });
        },
        methods: {
            openPicker() {
                this.couponPicker.open();
            },
            send() {
                if (this.orderInfo.company == '') {
                    this.$f7.alert('请输入有效的用户编号并点击确定', '');
                    return;
                }
                if (this.coupon.id == '') {
                    this.$f7.alert('请选择派发的优惠券', '');
                    return;
                }
                let {userId} = this.orderInfo;
                sellApi.couponAssign(userId, this.coupon.id).then(result => {
                    // 成功之后的回调
                    this.$f7.alert('优惠券派发成功，<br>用户可到\"用户中心-优惠券\"中查看', '', () => {

                    });
                });

            },
            getUser() {
                sellApi.getUserById(this.userNumber,1).then(result => {
                    this.orderInfo.company = result.data.nickname;
                    this.orderInfo.userId = this.userNumber;
                });
            }
        },
        computed: {}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/sell/coupon.scss";
</style>
