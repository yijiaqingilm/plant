<template>
    <!--暂时不做实现-->
    <div id="wrapper">
        <slot></slot>
        <div class="pull-load-status-prompt" v-show="!isLoading && isComplete && isFirstLoad">
            <slot name="no-results">No results :(</slot>
        </div>
        <div class="pull-load-status-prompt" v-show="!isLoading && isComplete && !isFirstLoad">
            <slot name="no-more">No more data :)</slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import IScorll from 'lib/iscroll'

  export default {
    data () {
      return {
        isComplete: false,
        isLoading: false,
        isFirstLoad: true
      }
    },
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "pullLoad.scss";
</style>
