<template>
    <div class="plant-item">
        <div class="plant-img">
            <img :src="imgUrl" alt="">
            <div class="plant-checked">
                <my-checkbox theme-color="theme-red" :value="status" @input="changeChecked" :id='checkId'></my-checkbox>
            </div>
        </div>
        <div class="plant-name">{{name}}</div>
        <div class="plant-price color-warn">￥{{price}}</div>
        <div class="plant-counter">
            <counter theme-style="amount-max" v-model="ctrlValue"
                     @changeValue="changeValue"></counter>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Counter from 'components/counter/counter.vue'
    import {sellApi} from 'api'

    export default {
        props: {
            imgUrl: String,
            name: String,
            amount: {
                type: Number,
                default: 1
            },
            status: {
                type: Boolean,
                default: false
            },
            price: String,
            id: null,
            cart_id: null
        },
        data() {
            return {
                ctrlValue: 1,
                checkId: 'check-' + Math.random()
            }
        },
        created() {
            this.ctrlValue = this.amount;
        },
        methods: {
            changeValue({value}) {
                this.$emit('update:amount', Number(value));
                if (this.status) {
                    sellApi.editPlantToCart(this.cart_id, value).then(result => {

                    });
                }
            },
            changeChecked(value) {
                console.log('changeChecked', value);
                this.$emit('update:status', Boolean(value));
                if (value) {
                    sellApi.addPlantToCart(this.id, this.amount).then(result => {
                        this.$emit("update:cart_id", result.data.id);
                    });
                } else {
                    sellApi.delCartItemById(this.cart_id);
                }
            }
        },
        computed: {},
        components: {Counter}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "plantItem.scss";
</style>
