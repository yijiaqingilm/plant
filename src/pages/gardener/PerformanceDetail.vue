<template>
    <f7-page>
        <back title="绩效详情"></back>
        <f7-block inner class="performanceDetail" no-hairlines>
            <div class="performance-detail-table">
                <div class="table-thead">
                    <div class="td flex"><span class="icon_time"></span>2017-0505</div>
                    <div class="td">养护情况</div>
                    <div class="td">绩效总分：<span class="total">401分</span></div>
                </div>
                <div class="table-body">
                    <div class="tr">
                        <div class="td">判定指标</div>
                        <div class="td">详细数据</div>
                        <div class="td">绩效分</div>
                    </div>
                    <div class="tr">
                        <div class="td">订单总数</div>
                        <div class="td">12单</div>
                        <div class="td"><span class="total">120</span></div>
                    </div>
                    <div class="tr">
                        <div class="td">订单总数</div>
                        <div class="td">12单</div>
                        <div class="td"><span class="total">120</span></div>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {gardenerApi} from 'api'
    export default {
        data(){
            return {}
        },
        created(){
            console.log(this.$route);
            /*let id = this.$route.query.params.id;
             gardenerApi.accomplishMaintenanceDetail(this.$store.state.sessionkey, id).then(result => {

             });*/
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/performanceDetail.scss";

</style>
