<template>
    <div class="infinite-loading-container">
        <div v-show="isLoading">
            <slot name="spinner">
                <i :class="spinnerType"></i>
            </slot>
        </div>
        <div class="infinite-status-prompt" v-show="!isLoading && isComplete && isFirstLoad">
            <slot name="no-results">No results :(</slot>
        </div>
        <div class="infinite-status-prompt" v-show="!isLoading && isComplete && !isFirstLoad">
            <slot name="no-more">No more data :)</slot>
        </div>
    </div>
</template>
<script>
  const spinnerMapping = {
    bubbles: 'loading-bubbles',
    circles: 'loading-circles',
    default: 'loading-default',
    spiral: 'loading-spiral',
    waveDots: 'loading-wave-dots',
  }

  /**
   * get the first scroll parent of an element
   * @param  {DOM} elm    the element which find scorll parent
   * @return {DOM}        the first scroll parent
   */
  function getScrollParent (elm) {
    if (elm.tagName === 'BODY') {
      return window
    } else if (['scroll', 'auto'].indexOf(getComputedStyle(elm).overflowY) > -1) {
      return elm
    }
    return getScrollParent(elm.parentNode)
  }

  /**
   * get current distance from footer
   * @param  {DOM} elm    scroll element
   * @param  {String} dir   calculate direction
   * @return {Number}     distance
   */
  function getCurrentDistance (elm, dir) {
    let distance
    const scrollTop = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop
    if (dir === 'top') {
      distance = scrollTop
    } else {
      const scrollElmHeight = elm === window ? window.innerHeight : elm.getBoundingClientRect().height

      distance = this.$el.offsetTop - scrollTop - scrollElmHeight - (elm.offsetTop || 0)
    }
    return distance
  }

  export default {
    data () {
      return {
        scrollParent: null,
        scrollHandler: null,
        isLoading: false,
        isComplete: false,
        isFirstLoad: true, // save the current loading whether it is the first loading
      }
    },
    computed: {
      spinnerType () {
        return spinnerMapping[this.spinner] || spinnerMapping['default']
      },
    },
    props: {
      distance: {
        type: Number,
        default: 100,
      },
      onInfinite: Function,
      spinner: String,
      direction: {
        type: String,
        default: 'bottom',
      },
      isInit: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      this.scrollParent = getScrollParent(this.$el)
      this.scrollHandler = function scrollHandlerOriginal () {
        console.log('触发滚动事件')
        if (!this.isLoading) {
          this.attemptLoad()
        }
      }.bind(this)

      setTimeout(this.scrollHandler, 1)
      this.scrollParent.addEventListener('scroll', this.scrollHandler)
      this.$on('$InfiniteLoading:loaded', () => {
        this.isFirstLoad = false
        if (this.isLoading) {
          this.$nextTick(this.attemptLoad)
        }
      })
      this.$on('$InfiniteLoading:complete', () => {
        this.isLoading = false
        this.isComplete = true
        console.log('谁被移除了', this.scrollParent)
        this.scrollParent.removeEventListener('scroll', this.scrollHandler)
      })
      this.$on('$InfiniteLoading:reset', () => {
        this.isLoading = false
        this.isComplete = false
        this.isFirstLoad = true
        this.scrollParent.addEventListener('scroll', this.scrollHandler)
        setTimeout(this.scrollHandler, 1)
      })
      // 针对 iscroll 扩展无线滚动
      this.$on('$InfiniteLoading:infinite', () => {
        if (!this.isComplete) {
          this.isLoading = true
          this.onInfinite.call()
        }

      })
    },
    /**
     * To adapt to keep-alive feature, but only work on Vue 2.2.0 and above, see: http://vuejs.org/v2/api/#keep-alive
     */
    deactivated () {
      this.isLoading = false
    },
    methods: {
      attemptLoad () {
        const currentDistance = getCurrentDistance.bind(this)(this.scrollParent, this.direction)
        if (!this.isComplete && this.isInit && currentDistance <= this.distance) {
          this.isLoading = true
          this.onInfinite.call()
        } else {
          this.isLoading = false
        }
      },
    },
    destroyed () {
      if (!this.isComplete) {
        this.scrollParent.removeEventListener('scroll', this.scrollHandler)
      }
    },
    watch: {
      isInit: function () {
        this.attemptLoad()
      }
    }
  }
</script>
<style lang="less" scoped>
    @import '../styles/spinner';

    .infinite-loading-container {
        clear: both;
        text-align: center;

    *[class^=loading-] {
    @size: 28 px;
        display: inline-block;
        margin: 15px 0; /*no*/
        width: @size; /*no*/
        height: @size; /*no*/
        font-size: @size; /*no*/
        line-height: @size; /*no*/
        border-radius: 50%;
    }

    }

    .infinite-status-prompt {
        color: #666;
        font-size: 14px; /*no*/
        text-align: center;
        padding: 10px 0; /*no*/
    }
</style>
