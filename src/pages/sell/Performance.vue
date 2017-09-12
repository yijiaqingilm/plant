<template>
    <f7-page>
        <back title="绩效系统">
        </back>
        <f7-block inner class="performance" no-hairlines>
            <div class="title">

                <div class="date">
                    <input type="text" class="" id="date-ctrl">
                    <span class='prominent'>{{date.year}}年</span>
                    <span class='prominent time'>{{date.month}}月<span class="triangle"></span></span>
                </div>
                <div><span>总客户数</span><span class='prominent'>{{totalclient}}</span></div>
                <div><span>代下单总额</span><span class='prominent'>￥{{agenttotal}}</span></div>
            </div>
            <div class="performance-table-two">
                <div class="table-body">
                    <div class="tr">
                        <div class="td">日期</div>
                        <div class="td">客户数</div>
                        <div class="td">代下养护金额</div>
                        <div class="td">代下绿植金额</div>
                        <!--<div class="td"></div>-->
                    </div>
                    <!--@click="gotoDetail(item)"-->
                    <div class="tr" v-for="item in items">
                        <div class="td">{{item.date}}</div>
                        <div class="td">{{item.newclient}}</div>
                        <div class="td">{{item.agentmaintenance}}</div>
                        <div class="td">{{item.agentamount}}</div>
                        <!-- <div class="td"><span class="gt"></span></div>-->
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {sellApi} from 'api'
    import GaInfo from 'components/gaInfo/gaInfo.vue'
    import {getTimer} from 'lib/utils'

    export default {
        data() {
            return {
                items: [],
                date: {
                    year: 2017,
                    month: 1
                },
                totalclient: 0,
                agenttotal: 0
            }
        },
        created() {
            let fullYear = new Date().getFullYear();
            let month = new Date().getMonth() + 1;
            this.date.year = fullYear;
            this.date.month = month;
            this.loadData();
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })

        },
        mounted() {
            this.$nextTick(() => {
                var that = this;
                let year = [];
                let month = [];
                let fullYear = new Date().getFullYear();
                for (let y = fullYear - 10; y <= fullYear; y++) {
                    year.push(y);
                }
                for (let m = 1; m <= 12; m++) {
                    month.push(m);
                }
                var pickerDevice = this.$f7.picker({
                    input: '#date-ctrl',
                    value: [that.date.year, that.date.month],
                    cols: [
                        {
                            textAlign: 'center',
                            width: '200px',
                            values: year
                        },
                        {
                            textAlign: 'center',
                            width: '200px',
                            values: month
                        }
                    ],
                    toolbarCloseText: '确定',
                    scrollToInput: false,
                    /*onChange(p, values, displayValues){
                     console.log('p', p, 'values', values, 'display', displayValues);
                     },*/
                    onClose({value}) {
                        that.date.year = value[0];
                        that.date.month = value[1];
                        that.page = 1;
                        that.loadData();

                    },
                });
            })
        },
        methods: {
            getTimer: function (time) {
                return getTimer(time);
            },
            loadData() {
                sellApi.performanceList(this.date.year + '-' + this.date.month).then(result => {
                    var data = result.data;
                    this.items = data.items;
                    this.totalclient = data.totalclient;
                    this.agenttotal = data.agenttotal;
                });
            },
            gotoDetail({id}) {
                this.$router.load({url: `/gardener/performance/detail/${id}`});
            }
        },
        components: {GaInfo}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/gardener.scss";
    @import "../../css/gardener/performance.scss";
    @import "../../css/sell/performance.scss";
</style>
