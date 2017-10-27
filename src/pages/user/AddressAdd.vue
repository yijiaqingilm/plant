<template>
    <!-- 添加地址页面 AddressAdd.vue-->
    <f7-page class="addressAdd">
        <back title="地址管理"></back>
        <address-form :address="address" @getAddressInfo="getAddressInfo"></address-form>
        <div class="submit">
            <span class="my-button" @click="addAddress">{{typeList[type]}}</span>
        </div>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { Validator } from 'lib/custom_validator'
  import AddressForm from 'components/addressForm/addressForm.vue'
  import { Cache } from 'lib/utils'

  export default {
    data () {
      return {
        address: {
          id: '1',
          contact: '',
          company: '',
          mobile: '',
          address: '',
          detail: '',
          default: false,
          city: '',
          province: '',
          district: ''
        },
        validator: null,
        errors: null,
        type: 0,
        typeList: {
          0: '确认修改',
          1: '确认提交'
        }
      }
    },
    created: function () {
      console.log(this.$route)
      this.type = this.$route.params.type
      var query = this.$route.options.query
      if (query && query.address !== undefined) {
        Object.assign(this.address, query.address)
      }
      this.validator = new Validator({
        contact: 'required',
        /* mobile: 'required|mobile',*/
        address: 'required',
        addressdetail: 'required'
      })
      this.$set(this, 'errors', this.validator.errorBag)
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      addAddress: function () {
        var that = this
        this.validator.validateAll({
          contact: this.address.contact,
          /* mobile: this.address.mobile,*/
          address: this.address.address,
          addressdetail: this.address.addressdetail
        })
        console.log(this.errors)
        //  校验信息
        if (this.errors.errors.length > 0) {
          this.$f7.alert(this.errors.errors[0].msg)
          return
        }
        if (this.address.city !== '深圳市') {
          this.$f7.alert('您所填写的地址不在服务范围，<br>目前暂未开通深圳以外地区的绿植业务')
          return
        }
        let customer_id = Cache.get('customer_id') || ''
        // 修改地址
        if (this.type >>> 0 === 0) {
          this.$store.dispatch('editAddressAsync', {
            address: this.address,
            customer_id: customer_id,
            callBack: function () {
              that.$router.back()
            }
          })
        } else if (this.type >>> 0 === 1) {
          // 新增地址
          console.log(this.address, 'this is address')
          this.$store.dispatch('addAddressListAsync', {
            address: this.address,
            customer_id: customer_id,
            callBack: function () {
              that.$router.back()
            }
          })
        }

      },
      getAddressInfo: function (address) {
        Object.assign(this.address, address)
        this.address.address = address.district + address.street + address.name
        this.address.state = address.province
        this.address.lng = address.location.split(',')[0]
        this.address.lat = address.location.split(',')[1]
      }
    }, components: {AddressForm}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/address.scss";
</style>
