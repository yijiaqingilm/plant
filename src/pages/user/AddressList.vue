<template>
    <!-- 添加地址页面 AddressAdd.vue-->
    <f7-page @page:reinit="reinit">
        <back title="地址管理"></back>
        <f7-block inner class="addressList" no-hairlines>
            <div class="address-add" @click="$router.load({url:'/user/address/edit/1'})">
                <span class="my-button">创建新的地址</span>
            </div>
            <div class="line-10"></div>
            <div class="address-list">
                <div class="address-item" v-for="(address,index) in addressList" @click="saveAddress(address)">
                    <div class="info">
                        <div class="company" v-if="address.company&&address.company.length>0">{{address.company}}</div>
                        <div class="name">{{address.contact}}</div>
                        <div class="phone">{{address.mobile}}</div>
                    </div>
                    <div class="detail">
                        {{address.address}}{{address.addressdetail}}
                    </div>
                    <div class="set">
                        <div class="set-default" @click.stop="setDefault(address)">
                            <div v-if="!hasProxy">
                                <my-radio v-model="address.isuse" :disabled=true name="default" :val="1"
                                          :id="'radio'+index"></my-radio>
                                设为默认地址
                            </div>
                        </div>
                        <div v-if="address.ismodify" class="edit" @click.stop="toEditAddress(address)"><span
                                class="icon_edit"></span>编辑
                        </div>
                        <div v-if="address.ismodify" class="del" @click.stop="delAddress(address)"><span
                                class="icon_del"></span>删除
                        </div>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { LocalCache, Cache } from 'lib/utils'
  import { mapGetters } from 'vuex'
  import { hasProxy } from 'lib/common'

  export default {
    data () {
      return {
        sex: null,
        hasProxy: hasProxy()
      }
    },
    created: function () {
      let customer_id = Cache.get('customer_id') || ''

      this.$store.dispatch('setAddressListAsync', {
        customer_id: customer_id
      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      reinit () {
        if (this.addressList.length === 1) {
          if (hasProxy()) {
            this.$store.state.user_address = this.addressList[0]
          } else {
            this.$store.state.default_address = this.addressList[0]

          }

        }
      },
      saveAddress: function (address) {
        var query = this.$route.options.query
        if (query && query.canChange === false) {
          return
        }
        Object.assign(address, {addressDetail: address.addressdetail})

        if (hasProxy()) {
          this.$store.state.user_address = address
        } else {
          this.$store.state.default_address = address
        }
        this.$router.back()
      },
      toEditAddress: function (address) {
        this.$router.load({url: '/user/address/edit/0', query: {address: address}})
      },
      delAddress: function (address) {
        let that = this
        this.$f7.confirm('', '确定删除？', () => {
          let customer_id = Cache.get('customer_id') || ''
          this.$store.dispatch('removeAddressByIdAsync', {
            address: address,
            customer_id,
            callBack: function () {
              if (parseInt(that.$store.state.default_address.id, 10) === parseInt(address.id, 10)) {
                that.$store.state.default_address = {}
              }
              if (hasProxy() && parseInt(that.$store.state.user_address.id, 10) === parseInt(address.id, 10)) {
                that.$store.state.user_address = {}
              }
            }
          })
        })
      },
      setDefault: function (address) {
        this.$store.dispatch('setDefaultAddressAsync', {
          address: address
        })

      }
    },
    computed: {
      ...mapGetters({
        addressList: 'getAddressList'
      })
    }

  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/addressList.scss";
</style>
