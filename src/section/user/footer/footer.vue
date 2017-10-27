<template>
    <div class="footer">
        <slot name="left"></slot>
        <slot name="right"></slot>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      itemList: Array
    },
    data () {
      return {}
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "footer.scss";
</style>
