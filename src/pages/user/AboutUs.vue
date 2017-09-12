<template>
    <!-- 添加地址页面 AddressAdd.vue-->
    <f7-page class="AboutUs">
        <back title="株株绿植账号"></back>
        <!--<div class="my-title" @click="expandPayType(true)">微信支付</div>
            <div class='context' v-if="showWxPay">
                <div class="left">微信账号：株株绿植</div>
                <div class="right">
                    <div><img class="two-code" src="../../assets/icon_erweima_wx.jpg" alt=""></div>
                    <div class="two-code-label">微信二维码</div>
                </div>
            </div>
        <div class="my-title" @click="expandPayType(false)">支付宝支付</div>
            <div class='context'>
                <div class="left">支付宝账号：zhuzhulvzhi@qq.com</div>
                <div class="right">
                    <div><img class="two-code" src="../../assets/icon_erweima_alipay.jpg" alt=""></div>
                    <div class="two-code-label">支付宝二维码</div>
                </div>
            </div>-->
        <!--<f7-accordion>
            <f7-accordion-item class="wx-item">
                <f7-accordion-toggle class="my-title">微信支付</f7-accordion-toggle>
                <f7-accordion-content >
                    <div class='context'>
                        <div class="left">微信账号：株株绿植</div>
                        <div class="right">
                            <div><img class="two-code" src="../../assets/icon_erweima_wx.jpg" alt=""></div>
                            <div class="two-code-label">微信二维码</div>
                        </div>
                    </div>
                </f7-accordion-content>
            </f7-accordion-item>
            <f7-accordion-item>
                <f7-accordion-toggle class="my-title">支付宝支付</f7-accordion-toggle>
                <f7-accordion-content>
                    <div class='context'>
                        <div class="left">支付宝账号：zhuzhulvzhi@qq.com</div>
                        <div class="right">
                            <div><img class="two-code" src="../../assets/icon_erweima_alipay.jpg" alt=""></div>
                            <div class="two-code-label">支付宝二维码</div>
                        </div>
                    </div>
                </f7-accordion-content>
            </f7-accordion-item>
        </f7-accordion>-->
        <f7-list accordion>
            <f7-list-item accordion-item class=" wx-item" title="微信支付">
                <f7-accordion-content>
                    <div class='context'>
                        <div class="left">
                            <div><img class="two-code" src="../../assets/icon_erweima_wx.jpg" alt=""></div>
                            <div class="two-code-label">株株绿植微信账号</div>
                        </div>
                    </div>
                </f7-accordion-content>
            </f7-list-item>
            <f7-list-item accordion-item  class="" title="支付宝支付">
                <f7-accordion-content>
                    <div class='context'>
                        <div class="left">
                            <div><img class="two-code" src="../../assets/icon_erweima_alipay.jpg" alt=""></div>
                            <div class="two-code-label">支付宝账号：zhuzhulvzhi@qq.com</div>
                        </div>
                    </div>
                </f7-accordion-content>
            </f7-list-item>
        </f7-list>
        <div class="my-title">银行对公账号信息</div>
        <div class='context line-vertical'>
            <div>公司名：深圳市咔希亚互联网科技有限公司</div>
            <div>银行信息：交通银行深圳香洲支行</div>
            <div>银行账号：443066065011705230102</div>
        </div>
    </f7-page>

</template>

<script type="text/ecmascript-6">

    export default {
        data(){
            return {
                showWxPay: true
            }
        },
        created: function () {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        mounted(){
            this.$nextTick(() => {
                let wx_dom = document.querySelector('.wx-item');
                this.$f7.accordionOpen(wx_dom);
            });
        },
        methods: {}, components: {}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/aboutUs.scss";
</style>
