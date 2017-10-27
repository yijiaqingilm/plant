<template>
    <f7-navbar>
        <f7-nav-left :back-link="backLink" sliding></f7-nav-left>
        <f7-nav-center>{{title}}</f7-nav-center>
        <f7-nav-right>
            <slot name="right"></slot>
        </f7-nav-right>
    </f7-navbar>
    <!--<div class="my-navbar">
        <div class="left"><a href="#" @click="back" class=""><i class="icon icon-back"></i></a></div>
        <div class="center">{{title}}</div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>-->
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: String,
      fixed: {
        type: Boolean,
        default: true
      },
      backLink: {
        type: null,
        default: ' '
      }

    },
    data () {
      return {}
    },
    methods: {
      back: function () {
        history.back()
      }
    },
    components: {},
    computed: {}

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "back.scss";
</style>
