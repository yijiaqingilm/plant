<template>
    <div class="list">
        <div class="item" v-for="item in itemList" @click="gotoDetail(item)">
            <div class="photo"><img :src="item.img" alt=""></div>
            <div class="info">
                <div class="name">{{item.name}}</div>
                <div class="context">
                    <div class="brief">{{item.brief}}</div>
                    <div v-if="item.type==goodsType.buy || item.type==goodsType.lease">
                        适用面积：{{item.area}}平方
                    </div>
                </div>
                <div class="detail">
                    <div class="price">
                        <div v-if="item.type==goodsType.compose">
                            购买：<span class="buy">￥{{item.saleprice}}</span>
                        </div>
                        <div v-if="item.type==goodsType.compose">
                            租赁：<span class="lease">￥{{item.leaseprice}}/月</span>
                        </div>
                        <div v-if="item.type==goodsType.buy || item.type==goodsType.lease">
                            <span class="color-warn">￥{{item.price}}</span>
                            <span class="line-through">￥{{item.orig_price}}</span>
                        </div>
                    </div>
                    <div class="show-detail">查看详情</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {goodsType} from 'lib/common'
    export default {
        props: {
            itemList: Array,
        },
        data(){
            return {
                goodsType: goodsType
            }
        },
        created(){
            console.log(goodsType.compose, goodsType.buy, goodsType.lease)
        },
        methods: {
            gotoDetail: function (item) {
                if (item.type == goodsType.lease || item.type == goodsType.buy) {
                    this.$router.load({url: `/store/comboDetail/${item.id}`});
                } else if (item.type == goodsType.compose) {
                    this.$router.load({url: `/store/goodsDetail/${item.id}`});
                } else {

                }

            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "goodsList.scss";
</style>
