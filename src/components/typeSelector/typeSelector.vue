<template>
    <div class="typeSelector">
        <span class="item min-button" :style="itemStyle" v-for="item in copyItems"
              :class="{'bg-gray': checkedItems.findIndex(checkItem => checkItem[id] == item[id])==-1,'no-bg':disable}"
              @click="changeItem(item)">{{item.name}}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            items: {
                type: Array,
                default: []
            },
            multi: {
                type: Boolean,
                default: false
            },
            // 针对于multi 为true  默认 全选 或全不选
            checkAll: {
                type: Boolean,
                default: false
            },
            // id item的id字段 唯一标识
            id: {
                type: String,
                default: 'id'
            },
            disable: {
                type: Boolean,
                default: false
            },
            // 以groupIndex 分组 ，默认所有的item都属于组 ：1
            groupIndex: {
                type: null,
                default: 1
            },
            itemStyle: {
                type: null
            }
        },
        data(){
            return {
                copyItems: [],
                checkedItems: []
            }
        },
        created(){
            Object.assign(this.copyItems, this.items);
            if (this.disable) {
                this.$emit("changeItem", {checkedItems: this.items, groupIndex: this.groupIndex});
                return;
            }
            if (!this.multi) {
                if (this.copyItems.length > 0) {
                    this.checkedItems.push(this.copyItems[0]);
                }
            } else {
                if (this.checkAll) {
                    this.copyItems.forEach(item => {
                        item.checked && this.checkedItems.push(item);
                    })
                }
            }

            this.setItem();
        },
        methods: {
            changeItem(item){
                if (this.disable) return;
                // 单例模式
                if (!this.multi) {
                    this.checkedItems.splice(0, 1, item);
                } else {
                    let index = this.checkedItems.findIndex(checkItem => checkItem[this.id] == item[this.id]);
                    if (index !== -1) {
                        this.checkedItems.splice(index, 1);
                    } else {
                        this.checkedItems.push(item);
                    }
                }
                this.setItem();

            },
            setItem(){
                this.$emit("changeItem", {checkedItems: this.checkedItems, groupIndex: this.groupIndex});
            },

        },
        computed: {
            isChecked(){

            }
        }

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "typeSelector.scss";
</style>
