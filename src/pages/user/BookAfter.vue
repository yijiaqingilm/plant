<template>
    <f7-page>
        <back title="预约上门"></back>
        <f7-block inner class="bookAfter" no-hairlines>
            <div class="header">
                <p>您已预约<span class='color-theme'>{{info.booking_time}}(9:00-18:00)</span></p>
                <p>上门绿植体检服务</p>
                <p>请保持所填写的联系电话畅通</p>
                <p>稍后工作人员将就预约时间与您进行具体沟通</p>
            </div>
            <div class="submit">
                <span class="my-button" @click="$router.load({url:'/user/myOrder'})">确定</span>
            </div>
            <div class="hint">
                预约时间不方便，我要 <a href="" @click="resetBook">重新预约时间</a>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi} from 'api'
    import {book_type} from 'lib/common'
    import {Cache} from 'lib/utils'
    export default {
        data(){
            return {
                info: {}
            }
        },
        created(){
            this.info = Cache.get("bookInfo");
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            /*book: function () {
                this.$router.load({url: `/user/book/success/${book_type.make}`});
            },*/
            resetBook: function () {
                this.$f7.confirm('重新预约时间，将会延期5个工作日内，<br>是否需要重新预约?', '', () => {
                    userApi.rebooking(this.info.booking_id).then(result => {
                        Cache.set("successInfo", result.data);
                        this.$router.load({url: `/user/book/success/${book_type.remake}`});
                    });
                });
            }
        },
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/bookAfter.scss";
</style>

