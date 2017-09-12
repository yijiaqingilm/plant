<template>
    <f7-page :cached="true">
        <!--用户中心 prifile.vue-->
        <back title="用户中心" back-link=""></back>
        <f7-block inner class="profile" no-hairlines>
            <div class="user">
                <div class="avatar">
                    <img :src="userInfo.avatarsmall" alt="">
                </div>
                <div class="content">
                    <div class="nick">{{userInfo.name}}</div>
                    <div class="uid">用户编号：{{userInfo.id}}</div>
                    <!--<div class="score">积分:<span class="amount">500分</span></div>-->
                </div>
                <!--<div class="two-code">
                    <div><img src="" alt=""></div>
                    <div>专属二维码</div>
                </div>-->
            </div>
            <div class="line-10"></div>
            <div class="menu row no-gutter">
                <!--<div class="col-33" @click="$router.load({url:'/user/myOrder'})">
                    <div class="icon icon_order2"></div>
                    <div class="text">我的订单</div>
                </div>-->
                <div class="col-33" @click="$router.load({url:'/store/cart'})">
                    <div class="icon icon_cart"></div>
                    <div class="text">购物车</div>
                </div>
                <div class="col-33" @click="$router.load({url:'/user/address/list',query:{canChange:false}})">
                    <div class="icon icon_address"></div>
                    <div class="text">地址管理</div>
                </div>
                <div class="col-33" @click="$router.load({url:'/user/coupon/list'})">
                    <div class="icon icon_ticket"></div>
                    <div class="text">优惠券</div>
                </div>
                <div class="col-33" @click="$router.load({url:'/user/invoice'})">
                    <div class="icon icon_invoice"></div>
                    <div class="text">发票申请</div>
                </div>
                <div class="col-33" @click="$router.load({url:'/gardener/replaceList'})">
                    <div class="icon icon_exchange"></div>
                    <div class="text">绿植更换</div>
                </div>
                <div class="col-33" @click="$router.load({url:'/user/aboutUs'})">
                    <div class="icon icon_zhanghao"></div>
                    <div class="text">支付账号</div>
                </div>
                <!--<div class="col-33">
                    <div class="icon icon_score2"></div>
                    <div class="text">积分兑换</div>
                </div>-->
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {commonApi} from 'api'
    export default {
        data(){
            return {}
        },
        created(){
            console.log('profile 创建')
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        computed:{
            userInfo(){
                return this.$store.state.userInfo;
            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/profile.scss";
</style>
