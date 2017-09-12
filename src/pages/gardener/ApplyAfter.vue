<template>
    <f7-page>
        <back title="审核中" back-link=""></back>
        <f7-block inner class="apply" no-hairlines>
            <div class="wrap">
                <div class="apply-msg">
                    <div class="header">
                        <p>您已申请成为养护人员</p>
                        <p>请等待后台审核通过</p>
                    </div>
                    <div>
                        <div class="my-button" @click="goService">联系客服</div>
                    </div>
                    <!--<div class="footer">养护后台使用攻略</div>-->
                </div>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
    import  {userType, maintenanceStatus} from 'lib/common'
    export default {
        data(){
            return {}
        },
        created(){
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            goService: function () {
                this.$router.load({url: '/gardener/service'})
            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/apply.scss";
</style>

