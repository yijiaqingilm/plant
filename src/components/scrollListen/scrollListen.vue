<template>
    <div class="scroll">
    </div>
</template>

<script type="text/ecmascript-6">
  function getScrollParent (elm) {
    if (elm.tagName === 'BODY') {
      return window
    } else if (['scroll', 'auto'].indexOf(window.getComputedStyle(elm).overflowY) > -1) {
      return elm
    }
    return getScrollParent(elm.parentNode)
  }

  export default {
    props: {},
    data () {
      return {
        scrollParent: null,
        scrollHandler: null,
        scrolldelay: null,
        scrollTop: 0,
        isScroll: null,
      }
    },
    methods: {
      backTop () {
        this.scrollParent.scrollTop = 0
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.scrollParent = getScrollParent(this.$el)
        this.scrollHandler = () => {
          this.scrollTop = this.scrollParent.scrollTop
          // this.$emit("scroll", false);

          if (this.isScroll != null) {
            clearTimeout(this.isScroll)
            this.isScroll = null

          }
          this.isScroll = setTimeout(() => {
            if (this.scrollTop > 100) {
              this.$emit('scroll', true)
            }
          }, 1000)

        }
        this.scrollParent.addEventListener('scroll', this.scrollHandler)
      })

    },
    components: {},

  }
</script>
<style lang="scss" scoped type="text/css">
    .scroll {
        position: absolute;
    }
</style>
