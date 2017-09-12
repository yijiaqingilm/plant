<template>
    <f7-page @page:reinit="reinit">
        <back title="商品详情">
            <div slot="right" class="cart" @click="goCart">
                <span class='cart-count' v-if="cartcount>0">{{cartcount}}</span>
            </div>
        </back>
        <f7-block inner class="goodsDetail" no-hairlines>
            <div class="header">
                <f7-swiper pagination :init="false" class="banners">
                    <f7-swiper-slide v-if="goods.img" v-for="(img,index) in goods.img" :key="index">
                        <img :src="img.img" alt="">
                    </f7-swiper-slide>
                </f7-swiper>
            </div>

            <div class="content">
                <div class="info">
                    <div class="goods-name">{{goods.name}}</div>
                    <div class="goods-detail">{{goods.brief}}</div>
                    <div class="group" v-for="(attr,index) in goods.attrs">
                        <div class="group-label">{{attr.name}}:</div>
                        <div class="group-item">
                            <type-selector :items="attr.items" :itemStyle="{'margin-bottom':'10px'}" :groupIndex="index"
                                           :disable="!attr.status"
                                           @changeItem="changeItem"></type-selector>
                        </div>
                    </div>
                    <div class="group">
                        <div class="group-label">数量:</div>
                        <div class="group-item mb-10">
                            <counter v-model="curGoods.amount"></counter>
                        </div>
                    </div>
                    <div class="group" @click="alertDeposit">
                        <div class="group-label">押金:<span class="icon_issue"></span></div>
                        <div class="group-item">
                            ￥{{totalDeposit}}
                        </div>
                    </div>
                </div>
                <div class="line-10"></div>
                <div class="goods-detail" v-html="goods.detail">
                </div>
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="footer">
                <div class="left" @click="addCart(goodsType.lease)">租赁&nbsp;&nbsp;￥{{leasePrice}}/月</div>
                <div class="right" @click="addCart(goodsType.buy)">购买&nbsp;&nbsp;￥{{buyPrice}}</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {Cache} from 'lib/utils'
    import {userApi} from 'api'
    import {goodsType, wx_share, gotoCart} from 'lib/common'
    import TypeSelector from 'components/typeSelector/typeSelector.vue';
    import Counter from 'components/counter/counter.vue';

    export default {
        data() {
            return {
                curGoods: {
                    amount: 1,
                    attr: {},
                    attrIds: []
                },
                goods: {},
                goodsType: goodsType,
                goodsId: -1,
                cartcount: 0
            }
        },
        created: function () {
            this.goodsId = this.$route.params.goodsId;
            userApi.goodsDetail(this.goodsId).then(result => {
                console.log('data', result);
                this.goods = result.data;
                this.$nextTick(() => {
                    var mySwiper = this.$f7.swiper('.banners', {
                        pagination: '.swiper-pagination',
                        speed: 500,
                        autoplay: 2000
                    });
                })
                window.wx.ready(() => {
                    var that = this;
                    var title = that.goods.name;
                    var desc = that.goods.brief;
                    var imgUrl = "http://images.zhuzhulz.com/share3.jpg";
                    var link = location.protocol + "//" + location.host + "/#" + location.href.split('#')[1];
                    wx_share(title, link, imgUrl, desc);
                });

            });
            userApi.getCartNum().then(result => {
                this.cartcount = result.data;
            });

        },
        methods: {
            goCart() {
                gotoCart(this);
            },
            alertDeposit() {
                this.$f7.alert('租赁期满将进行绿植核查，<br>如无损坏缺失押金将全额退还');
            },
            reinit() {
                userApi.getCartNum().then(result => {
                    this.cartcount = result.data;
                });
                window.wx.ready(() => {
                    var that = this;
                    var title = that.goods.name;
                    var desc = that.goods.brief;
                    var imgUrl = "http://images.zhuzhulz.com/share3.jpg";
                    var link = location.protocol + "//" + location.host + "/#" + location.href.split('#')[1];
                    wx_share(title, link, imgUrl, desc);

                });
            },
            changeItem({checkedItems, groupIndex}) {
                //this.curGoods.attr[groupIndex] = checkedItems[0];
                checkedItems.forEach((item) => {
                    this.$set(this.curGoods.attr, groupIndex, item);
                });
                console.log('当前的curgoods', this.curGoods.attr);

            },
            addCart(type) {
                this.curGoods.attrIds = [];
                for (let key in this.curGoods.attr) {
                    this.curGoods.attrIds.push(this.curGoods.attr[key].id);
                }
                Object.assign(this.curGoods, {
                    type: type,
                    item_id: this.goodsId,
                    attrids: JSON.stringify(this.curGoods.attrIds)
                });
                console.log('curgoods', this.curGoods);
                userApi.addCart(this.curGoods).then(result => {
                    this.cartcount += this.curGoods.amount;
                    let icon_success = require('../../assets/icon-gou.png');
                    var modal = this.$f7.modal({
                        title: '',
                        text: '<div><img src="' + icon_success + '" class="icon_success"></div><div>加入购物车成功</div>',
                    })
                    setTimeout(() => {
                        this.$f7.closeModal(modal);
                    }, 2000);
                })
            }
        },
        computed: {
            /*押金计算*/
            totalDeposit() {
                if (this.curGoods && this.curGoods.attr) {
                    let total = 0;
                    for (let key in this.curGoods.attr) {
                        let obj = this.curGoods.attr[key];
                        total += parseFloat(obj["deposit"] || 0);
                    }
                    return total;
                }
                return 0;
            },
            leasePrice() {
                if (this.curGoods && this.curGoods.attr) {
                    let total = 0;
                    for (let key in this.curGoods.attr) {
                        let obj = this.curGoods.attr[key];
                        total += parseFloat(obj["lease"] || 0);
                    }
                    return total;
                }
                return 0;
            },
            buyPrice() {
                if (this.curGoods && this.curGoods.attr) {
                    let total = 0;
                    for (let key in this.curGoods.attr) {
                        let obj = this.curGoods.attr[key];
                        total += parseFloat(obj["price"] || 0);
                    }
                    return total;
                }
                return 0;
            }

        },
        components: {TypeSelector, Counter}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/store.scss";
    @import "../../css/store/goodsDetail.scss";
</style>

