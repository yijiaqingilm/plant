<template>
    <div class="gaInfo">
        <div class="avatar">
            <img :src="info.avatarsmall" alt="">
        </div>
        <div class="content">
            <div class="nick">姓名：{{info.realname}}</div>
            <div class="number">编号：{{info.id}}</div>
            <slot></slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { gardenerApi, userApi } from 'api'
  import { commonly } from 'lib/utils'
  import { userType } from 'lib/common'

  export default {
    props: {
      utype: {
        type: String,
        default: 'M',

      }
    },
    data () {
      return {
        info: {}
      }
    },
    created () {
      /* switch (this.utype) {
          case userType.maintenance:
              if (commonly.isEmptyObject(this.$store.state.maintenanceInfo)) {
                  gardenerApi.getMaintenance().then(response => {
                      this.$store.state.maintenanceInfo = response.data;
                     // this.$emit('info', this.$store.state.maintenanceInfo);
                      this.info=this.$store.state.maintenanceInfo;
                  });
              }
              break;
          case userType.sell:
              if (commonly.isEmptyObject(this.$store.state.sellInfo)) {
                  userApi.getInfo().then(response => {
                      this.$store.state.sellInfo = response.data;
                      this.info=this.$store.state.sellInfo;
                  });
              }
              break;
      }*/
      this.loadData()

    },
    methods: {
      reInit () {
        this.loadData()
      },
      loadData () {
        userApi.getInfo().then((response) => {
          this.info = response.data
          if (this.utype === 'S') {
            this.info.id = response.data.seller_id
          }
          this.$emit('info', this.info)
        })
      }
    },
    computed: {},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "gaInfo.scss";
</style>
