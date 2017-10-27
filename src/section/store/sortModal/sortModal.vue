<template>
    <div class="sortModal">
        <div class="wrap">
            <div class="sortlist">
                <div class="sort" v-for="sort in sortList" :class="{active:modalType==sort.id}"
                     @click="showModal(sort.id)">{{sort.name}}
                </div>
            </div>
            <!--<div class="sortModal" v-show="modalType==0">
                我的天
            </div>-->
            <div class="sortModal" v-show="modalType==1 && showSortModal">
                <div class="menu-list">
                    <div v-for="item in sceneList">
                    <span class="scene min-button bg-gray"
                          @click="changeItem(item)">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="sortModal" v-show="modalType==2 && showSortModal">
                <div class="title">价格选择</div>
                <div class="menu-list">
                    <div v-for="item in priceList">
                        <span class=" min-button bg-gray" @click="changeItem(item)">{{item.name}}</span>
                    </div>

                </div>
                <div class="zone-title">价格区间</div>
                <div class="price-zone">
                    <input type="text" v-model="min_price" class="time-input">
                    <div class="line"></div>
                    <input type="text" v-model="max_price" class="time-input">
                    <span class="order-list-button" @click="customTime">确定</span>
                </div>
            </div>
            <div class="sortModal" v-show="modalType==3 && showSortModal">
                <div class="menu-list">
                    <div v-for="item in areaList">
                        <span class="price min-button bg-gray" @click="changeItem(item)">{{item.name}}</span>
                    </div>

                </div>
                <div class="zone-title">面积区间</div>
                <div class="price-zone">
                    <input type="text" v-model="min_area" class="time-input">
                    <div class="line"></div>
                    <input type="text" v-model="max_area" class="time-input">
                    <span class="order-list-button" @click="customArea">确定</span>
                </div>
            </div>
        </div>
        <masking :showMask="modalType!=-1 && modalType!=0 && showSortModal" @click="closeModal"
                 class="sort-mask"></masking>
    </div>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { sortType } from 'lib/common'

  export default {
    props: {
      sortIndexs: {
        type: Array,
        default: function () {
          /* eslint no-magic-numbers: 0 */
          return [0, 1, 2]
        }
      }
    },
    data () {
      return {
        modalType: 0,
        sortList: [
          {id: 0, name: '综合排序'},
          {id: 1, name: '适用场景'},
          {id: 2, name: '价格区间'},
          {id: 3, name: '适用面积'}
        ],
        sceneList: [
          {id: 1, name: '室内场景', type: sortType.scene},
          {id: 2, name: '室外场景', type: sortType.scene},
          {id: 3, name: '室内靠窗场景', type: sortType.scene}
        ],
        areaList: [],
        priceList: [],
        min_price: 100,
        max_price: 200,
        min_area: 100,
        max_area: 200,
        showSortModal: true
      }
    },
    created () {
      this.sortList = this.sortList.filter((item) => this.sortIndexs.indexOf(item.id) !== -1)
      userApi.areaList().then((result) => {
        this.areaList = result.data
        this.areaList.forEach((item) => {
          this.$set(item, 'type', sortType.area)
        })
      })
      userApi.priceList().then((result) => {
        this.priceList = result.data
        this.priceList.forEach((item) => {
          this.$set(item, 'type', sortType.price)
        })
      })
    },
    methods: {
      closeModal () {
        this.modalType = -1
      },
      showModal (type) {
        this.modalType = type
        this.showSortModal = true
        // 综合排序直接返回数据
        if (type === 0) {
          this.$emit('changeItem', {type: sortType.comprehensive})
          this.modalType = 0
        }
      },
      changeItem (item) {
        this.$emit('changeItem', item)
        this.showSortModal = false
      },
      customTime () {
        let item = {min_price: this.min_price, max_price: this.max_price, type: sortType.customPrice}
        this.$emit('changeItem', item)
        this.showSortModal = false
      },
      customArea () {
        let item = {min_area: this.min_area, max_area: this.max_area, type: sortType.customArea}
        this.$emit('changeItem', item)
        this.showSortModal = false
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "sortModal.scss";
</style>
