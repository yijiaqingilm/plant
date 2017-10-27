<template>
    <div class="amount" :class="[themeStyle]">
        <span class="minus-button" @click="changeCount(value-1)">－</span>
        <span class="number-button">
           <!-- {{value}}-->
            &nbsp;
            <input type="number" :id="input_id" class="number-input" @blur="blur" @focus="focus" :value="value"
                   @change="changeCount($event.target.value)">
        </span>
        <span class="adder-button" @click="changeCount(value+1)">＋</span>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {
        type: Number,
        default: 1
      },
      baseData: {
        type: null,
      },
      maxValue: {
        type: Number,
        default: Number.MAX_VALUE
      },
      minValue: {
        type: Number,
        default: 1
      },
      delay: {
        type: Boolean,
        default: true
      },
      /* 目前 支持 amount-max*/
      themeStyle: {
        type: null,
        default: ''
      }
    },
    data () {
      return {
        interval: null,
        input_id: 'input_' + Math.random()
      }
    },
    methods: {
      changeCount: function (changeValue) {
        let step = 500
        if (parseInt(changeValue, 10).toString() === 'NaN') {
          this.$emit('input', Number(this.value))
          document.getElementById(this.input_id).value = this.value
          return
        }
        let curValue = changeValue
        if (curValue <= 0) {
          curValue = this.minValue
        }
        if (curValue >= this.maxValue) {
          curValue = this.maxValue
        }
        this.$emit('input', Number(curValue))
        if (this.interval !== null) {
          clearTimeout(this.interval)
          this.interval = null
        }
        this.interval = setTimeout(() => {
          this.$emit('changeValue', {baseData: this.baseData, value: curValue})
        }, this.delay ? step : 0)
      },
      blur () {
        this.$emit('blur', {})
      },
      focus () {
        this.$emit('focus', {})
      }
    },
    components: {},
    computed: {},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "counter.scss";
</style>
