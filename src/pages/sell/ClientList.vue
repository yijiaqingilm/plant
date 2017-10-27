<template>
    <f7-page @page:reinit="reinit" :cached="false">
        <back title="客户列表">
        </back>
        <f7-block inner class="shoppingCart" no-hairlines>
            <div class="content">
                <div class="goods-wrap">
                    <input type="hidden" v-model="day" class="day_input">
                    <div class="goods-type">
                        <div @click="showDate">{{date.year}}年<span class="color-theme">{{date.month}}月<span
                                class="triangle"></span></span></div>
                        <div>共{{total}}家</div>
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(client,index) in clientList">
                            <div class="info">
                                <div class="create-time">
                                    <div>{{client.created_at}}</div>
                                    <div>
                                        <span @click.stop="removeClientById(client,index)"><span
                                                class="icon_del"></span>删除</span>
                                        <span @click.stop="remarkClientById(client,index)"><span
                                                class="icon_remark"></span>备注</span>
                                        <span @click.stop="editClientById(client,index)"><span
                                                class="icon_edit"></span>编辑</span>
                                    </div>
                                </div>
                                <div v-if="client.customer_id != '' || client.customer_id != 0">
                                    用户编号:{{client.customer_id}}
                                </div>
                                <div class="name">
                                    {{client.company}}
                                </div>
                                <div>{{client.address}}{{client.addressdetail}}</div>
                                <div class="detail">
                                    <div>{{client.contact}}</div>
                                    <div>{{client.mobile}}</div>
                                </div>
                                <div class="remake-list">
                                    <div class="remake" v-for="(remark,index) in client.remarks" v-if="index===0">
                                        <div class="header">
                                            <div class="title">备注：</div>
                                            <div class="time">{{remark.created_at}}</div>
                                        </div>
                                        <div class='context'>
                                            {{remark.remark}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                            <div slot="no-more">没有更多数据</div>
                            <div slot="no-results">没有数据</div>
                        </infinite-loading>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading'
  import { Cache } from 'lib/utils'
  import { sellApi } from 'api'

  export default {
    data () {
      return {
        clientList: [],
        page: 1,
        day: '',
        date: {
          year: '1',
          month: '1'
        },
        pickerDevice: null,
        total: 0
      }
    },
    created: function () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })

      let fullYear = new Date().getFullYear()
      let fullMonth = new Date().getMonth()
      this.date.year = fullYear
      this.date.month = fullMonth + 1
    },
    mounted () {
      this.$nextTick(() => {
        var that = this
        let year = []
        let month = []
        let fullYear = new Date().getFullYear()
        let minYear = 10
        let minMonth = 12
        for (let y = fullYear - minYear; y <= fullYear; y++) {
          year.push(y)
        }
        for (let m = 1; m <= minMonth; m++) {
          month.push(m)
        }
        let day_input = document.querySelectorAll('.day')
        this.pickerDevice = this.$f7.picker({
          closeByOutsideClick: false,
          input: day_input[day_input.length - 1],
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
          onClose: ({value}) => {
            this.date.year = value[0]
            this.date.month = value[1]
            this.clientList = []
            this.page = 1
            let step = 100
            setTimeout(() => {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
            }, step)

          },
        })
      })
    },
    methods: {
      removeClientById (client, index) {
        this.$f7.modal({
          title: '',
          text: '<p style=\'text-align: left\'>是否删除该客户信息？请填写删除原因</p> \
                           <div class=\'m-context\'><textarea class=\'m-txt\' placeholder=\'如：公司已解散\'></textarea></div>\
                           <div class=\'color-warn text-left m-msg\' style=\'display: none\' >*删除原因必填</div> \
                           ',

          buttons: [
            {
              text: '取消'
            },
            {
              text: '确定',
              close: false,
              onClick: () => {
                let reason = document.querySelectorAll('.m-txt')[0]
                if (reason.value.length > 0) {
                  sellApi.delClientById(client.id, reason.value).then((result) => {
                    this.clientList.splice(index, 1)
                    this.$f7.closeModal()
                  })
                } else {
                  document.querySelectorAll('.m-msg')[0].style.display = 'block'
                }

              }
            }
          ]
        })
      },
      editClientById (client) {
        this.$router.load({url: `/sell/editCrm/${client.id}`})
      },
      remarkClientById (client) {
        this.$f7.modal({
          title: '',
          text: '<div class=\'m-context\'><textarea class=\'m-txt\' placeholder=\'请填写备注\'></textarea></div> \
                            <div class=\'color-warn text-left m-msg\' style=\'display: none\' >*请填写备注</div>',
          buttons: [
            {
              text: '取消'
            },
            {
              text: '确定',
              close: false,
              onClick: () => {
                let remark = document.querySelectorAll('.m-txt')[0]
                if (remark.value.length > 0) {
                  sellApi.addClientToRemark(client.id, remark.value).then((result) => {
                    client.remarks.unshift(result.data)
                    this.$f7.closeModal()
                  })
                } else {
                  document.querySelectorAll('.m-msg')[0].style.display = 'block'
                }
              }
            }
          ]
        })
      },
      reinit () {
        let refresh = Cache.get('refresh') || false
        if (refresh) {
          this.page = 1
          this.clientList = []
          let step = 100
          setTimeout(() => {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          }, step)

          Cache.del('refresh')
        }

      },
      showDate () {
        this.pickerDevice.open()
      },
      goEditClient (client) {
        this.$router.load({url: `/sell/editCrm/${client.id}`})
      },
      loadData () {
        sellApi.clientList(this.page, `${this.date.year}-${this.date.month}`).then((result) => {
          this.total = result.data.total
          if (result.data.items.length > 0) {
            this.clientList = [].concat(this.clientList).concat(result.data.items)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      getIds () {
        let ids = []
        var checkedData = this.clientList.filter((item) => {
          if (item.checked) {
            ids.push(item.id)
            return true
          } else {
            return false
          }
        })
        return ids
      },
      delCart: function () {
        let ids = this.getIds()
        if (ids.length <= 0) {
          this.$f7.alert('选择要删除的目标')
          return
        }
        this.$f7.confirm('确定删除选中的目标？', '', () => {
          // 删除逻辑
          sellApi.delCartItem(ids.join(',')).then((result) => {
            ids.forEach((id) => {
              let index = this.buyList.findIndex((item) => item.id === id)
              if (index === -1) {
                let index = this.leaseList.findIndex((item) => item.id === id)
                this.leaseList.splice(index, 1)
              } else {
                this.buyList.splice(index, 1)
              }
            })
            if (this.buyList.length === 0 && this.leaseList.length === 0) {
              this.data_len = 0
            }

          })
        })

      },

    },
    computed: {},
    components: {InfiniteLoading}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/shoppingCart.scss";
    @import "../../css/sell/clientList.scss";

</style>
