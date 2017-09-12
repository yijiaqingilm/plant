<template>
    <f7-page>
        <back title="绩效系统">
            <!--<div slot="right" class="rule" @click="$router.load({url:'/gardener/performance/rule'})">
                绩效规则
            </div>-->
        </back>
        <f7-block inner class="performance" no-hairlines>
            <div class="title">

                <div class="date">
                    <input type="text" class="" id="date-ctrl">
                    <span class='prominent'>{{date.year}}年</span>
                    <span class='prominent time'>{{date.month}}月<span class="triangle"></span></span>
                </div>
                <div><span>完成订单数</span><span class='prominent'>{{totalOrderCount}}单</span></div>
                <div><span>总时长</span><span class='prominent'>{{getTimer(totalTime)}}</span></div>
            </div>
            <div class="performance-table">
                <div class="table-body">
                    <div class="tr">
                        <div class="td">日期</div>
                        <div class="td">完成订单数</div>
                        <div class="td">完成总养护时长</div>
                        <!--<div class="td"></div>-->
                    </div>
                    <!--@click="gotoDetail(item)"-->
                    <div class="tr" v-for="item in items">
                        <div class="td">{{item.day}}</div>
                        <div class="td">{{item.orderamount}}</div>
                        <div class="td">{{getTimer(item.daymaintenancetime)}}</div>
                        <!-- <div class="td"><span class="gt"></span></div>-->
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {gardenerApi} from 'api'
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
                totalTime: 0,
                totalOrderCount: 0
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
                gardenerApi.performanceList(this.date.year + '-' + this.date.month).then(result => {
                    var data = result.data;
                    this.items = data.items;
                    this.totalTime = data.monthmaintenancetime;
                    this.totalOrderCount = data.orderamount;
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
</style>
