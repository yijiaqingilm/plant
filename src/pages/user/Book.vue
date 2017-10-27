<template>
    <f7-page @page:reinit="reinit">
        <back title="预约上门" back-link=""></back>
        <f7-block inner class="book" no-hairlines>
            <div class="header"><img src="../../assets/book_header.jpg" alt=""></div>
            <div class="content">

                <div class="title">请选择预约服务类型&nbsp;<span class="mini-text">(可多选，工作人员将上门为您完成)</span></div>
                <div class="type-list">
                    <div v-for="item in typeList">
                        <div class="item apply-button " :class="{passive:!item.active}"
                             @click="changeType(item)">{{item.name}}
                        </div>
                    </div>
                </div>
                <div class="line-10"></div>
                <div class="title">请填写预约上门服务信息</div>
                <div class="form">
                    <div class="address" @click="$router.load({url:'/user/address/list',query:{isChange:true}})">
                        <span class="gt"></span>
                        <div class="address-group ">
                            <div class="group first-group">
                                <div class="form-label">公司名称：</div>
                                <div class="form-input"><input :value="getAddress.company" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">联系人：</div>
                                <div class="form-input"><input :value="getAddress.contact" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">联系电话：</div>
                                <div class="form-input"><input :value="getAddress.mobile" placeholder="" type="text">
                                </div>
                            </div>

                            <div class="group">
                                <div class="form-label">地址：</div>
                                <div class="form-input"><input :value="getAddress.address" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">详细地址：</div>
                                <div class="form-input"><input :value="getAddress.addressdetail" placeholder=""
                                                               type="text">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="footer margin-center" @click="submit">
                确定预约
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi, commonApi } from 'api'
  import findIndex from 'lodash/findIndex'
  import map from 'lodash/map'
  import { common, wx_share } from 'lib/common'
  import { Cache } from 'lib/utils'
  import wx from 'wx'

  let share = function () {
    var title = '免费预约绿植服务'
    var desc = '20年园林经验，专业绿植养护团队，点击免费预约专人上门服务'
    var imgUrl = 'http://images.zhuzhulz.com/share4.jpg'
    var link = location.protocol + '//' + location.host + '/#' + location.href.split('#')[1]
    wx.showMenuItems({
      menuList: [
        'menuItem:share:timeline', // 分享到朋友圈
        'menuItem:share:appMessage'
      ],
      success: function (res) {
        wx_share(title, link, imgUrl, desc)
      },
      fail: function (res) {
        alert(JSON.stringify(res))
      }
    })
  }
  export default {
    data () {
      return {
        validator: null,
        typeList: [],
        info: {}
      }
    },
    created: function () {
      userApi.getBookingInfo().then((result) => {
        this.typeList = result.data
        this.typeList.forEach((item) => {
          this.$set(item, 'active', false)
        })
      })
      let step = 500
      setTimeout(() => {
        wx.ready(() => {
          share()
        })
      }, step)

    },
    methods: {
      reinit () {
        wx.ready(() => {
          share()
        })
      },
      submit: function () {
        if (findIndex(this.typeList, (item) => item.active) === -1) {
          this.$f7.alert('请选择预约服务类型')
          return
        }
        if (!this.getAddress.mobile || this.getAddress.mobile.length <= 0) {
          this.$f7.alert('请填写预约信息')
          return
        }
        this.info.btype = map(this.typeList.filter((item) => item.active), 'id').join(',')
        Object.assign(this.info, this.getAddress)
        this.$f7.confirm('确定预约？', '', () => {
          userApi.booking(this.info).then((result) => {
            Cache.set('bookInfo', result.data)
            this.$router.load({url: '/user/book/after'})
          })
        })

      },
      changeType: function (item) {
        item.active = !item.active
      }
    },
    computed: {
      getAddress: function () {
        return this.$store.state.default_address
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/book.scss";

    .footer {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 44px; /*no*/
    }
</style>

