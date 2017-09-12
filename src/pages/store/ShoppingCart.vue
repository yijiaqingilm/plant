<template>
    <f7-page @page:reinit="reinit" :cached="false">
        <!--购物车 shoppingcart.vue-->
        <back title="购物车">
            <div slot="right" class="cart_del" @click="delCart"></div>
        </back>
        <f7-block inner class="shoppingCart" no-hairlines>
            <div class="content">
                <div class="no-goods" v-if="data_len===0">
                    <div class="hint">
                        <p>您的购物车空空如也</p>
                        <p>赶快去绿植商城挑选您的绿植吧</p>
                    </div>
                    <div class="go-home">
                        <span class="my-button" @click="$router.load({url:'/store/home'})">绿植商城</span>
                    </div>
                    <div class="suggest">
                        <div class="line-10"></div>
                        <div class="title">- 购物车精选推荐 -</div>
                        <div class="goods-list">
                            <div class="item" v-for="(goods,index) in recommandList" v-if="index<4"
                                 @click="goGoodsDetail(goods)">
                                <div class="photo"><img :src="goods.img" alt=""></div>
                                <div class="name">{{goods.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="buyList.length>0">
                    <div class="goods-type">
                        购买
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in buyList">
                            <div class="check">
                                <my-checkbox :id="'buyList_check_'+index" v-model="goods.checked"
                                ></my-checkbox>
                                <label :for="'buyList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="item in attr.items">{{item.name}}</span>
                                    </div>
                                </div>
                                <div class="detail">
                                    <div class="price">￥{{goods.price}}</div>
                                    <div class="count">
                                        <counter v-model="goods.amount" :baseData="goods"
                                                 @changeValue="change"></counter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="leaseList.length>0">
                    <div class="goods-type">租赁</div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in leaseList">
                            <div class="check">
                                <my-checkbox :id="'leaseList_check_'+index" v-model="goods.checked"></my-checkbox>
                                <label :for="'leaseList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="item in attr.items">{{item.name}}</span>
                                    </div>
                                </div>
                                <div class="detail">
                                    <div class="price">￥{{goods.price}}/月</div>
                                    <div class="count">
                                        <counter v-model="goods.amount" :baseData="goods"
                                                 @changeValue="change"></counter>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="footer">
                <div class="checkAll ">
                    <my-checkbox :id="checkAllId" v-model="checkAll"></my-checkbox>
                    <label :for="checkAllId" class="checkAll-label">全选</label></div>
                <div class="amount">
                    <div>￥{{amount}}</div>
                    <div class="mini-text">(不含押金)</div>
                </div>
                <div class="pay" @click="goPay">去支付</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {itemType} from 'lib/common'
    import {Cache} from 'lib/utils'
    import {userApi} from 'api'
    import Counter from 'components/counter/counter.vue'

    export default {
        data() {
            return {
                data_len: -1,
                data: [],
                buyList: [],
                leaseList: [],
                recommandList: [],
                itemType: itemType,
                checkAllId: 'checkALL' + Math.random()
            }
        },
        created: function () {
            this.loadData();
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            reinit() {
                userApi.cartList().then(result => {
                    if (this.buyList.length === result.data.buy.length && this.leaseList.length === result.data.lease.length) {

                    } else {
                        this.setData(result.data);
                    }
                });

            },
            loadData() {
                userApi.cartList().then(result => {
                    this.setData(result.data);

                });
            },
            setData(data) {
                if (data.buy === undefined || data.lease === undefined) {
                    return
                }
                this.buyList = data.buy;
                this.leaseList = data.lease;
                this.recommandList = data.recommend;
                if (this.buyList.length === 0 && this.leaseList.length === 0) {
                    this.data_len = 0;
                    return;
                } else {
                    this.data_len = 1;
                }
                this.buyList.forEach(item => {
                    this.$set(item, 'checked', false);
                });
                this.leaseList.forEach(item => {
                    this.$set(item, 'checked', false);
                });
            },
            goGoodsDetail(goods) {
                if (goods.type == itemType.goods) {
                    this.$router.load({url: `/store/goodsDetail/${goods.recommend_id}`});
                } else if (goods.type == itemType.combo) {
                    this.$router.load({url: `/store/comboDetail/${goods.recommend_id}`});
                }
            },
            change({baseData, value}) {
                userApi.editCartNum({
                    cart_id: baseData.id,
                    num: value
                }).then(result => {
                    console.log('buy', this.buyList)
                    console.log('lease', this.leaseList);
                    let mergeList = [].concat(this.buyList).concat(this.leaseList);
                });
            },
            getIds() {
                let ids = [];
                var checkedData = [].concat(this.buyList).concat(this.leaseList).filter(item => {
                    if (item.checked) {
                        ids.push(item.id);
                        return true;
                    } else {
                        return false
                    }
                });
                return ids;
            },
            delCart: function () {
                let ids = this.getIds();
                if (ids.length <= 0) {
                    this.$f7.alert('选择要删除的目标');
                    return;
                }
                this.$f7.confirm("确定删除选中的目标？", '', () => {
                    // 删除逻辑
                    userApi.delCartItem(ids.join(',')).then(result => {
                        ids.forEach(id => {
                            let index = this.buyList.findIndex(item => item.id === id);
                            if (index === -1) {
                                let index = this.leaseList.findIndex(item => item.id === id);
                                this.leaseList.splice(index, 1);
                            } else {
                                this.buyList.splice(index, 1);
                            }
                        });
                        if (this.buyList.length === 0 && this.leaseList.length === 0) {
                            this.data_len = 0;
                        }

                    });
                });

            },
            goPay: function () {
                let items = [];
                [].concat(this.buyList).concat(this.leaseList).forEach(item => {
                    if (item.checked) {
                        items.push(item.id);
                    }
                });
                console.log('items', items);
                if (items.length <= 0) {
                    this.$f7.alert('请选择要购买的商品');
                    return;
                }
                userApi.addOrder(items.join(',')).then(result => {
                    console.log('result', result);
                    Cache.set('cartList', result.data);
                    this.$router.load({url: '/store/pay'});
                });

            }

        },
        computed: {
            checkAll: {
                get: function () {
                    if (this.buyList.length <= 0 && this.leaseList.length <= 0) {
                        return false;
                    }
                    return [].concat(this.buyList).concat(this.leaseList).every(item => item.checked == true);
                },
                set: function (value) {
                    [].concat(this.buyList).concat(this.leaseList).forEach(item => {
                        item.checked = value;
                    });
                }
            },
            amount: function () {
                let amount = 0;
                this.buyList.forEach(item => {
                    if (item.checked) {
                        amount += item.price * item.amount;
                    }
                });
                this.leaseList.forEach(item => {
                    if (item.checked) {
                        amount += parseFloat(item.price) * item.amount;
                    }
                });
                return amount.toFixed(2);
            }
        },
        watch: {
            buyList: {
                handler(curVal, oldVal) {
                    console.log('curVal', curVal, 'oldVal', oldVal);
                },
                deep: true
            }
        },
        components: {Counter}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/store.scss";
    @import "../../css/store/shoppingCart.scss";
</style>
