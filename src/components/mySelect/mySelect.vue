<template>
    <div class="my-select">
        <div @click="showOptions=!showOptions" class="select">
            {{value[optionValue]}}
        </div>
        <ul v-show="showOptions" class="options">
            <li v-for="option in options" @click="changeOption(option)" v-show="!option.hideOption">
                {{option[optionValue]}}
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      options: {
        type: Array,
      },
      optionKey: {
        type: String,
        default: 'id'
      },
      optionValue: {
        type: String,
        default: 'value'
      },
      value: null,
    },
    data () {
      return {
        showOptions: false
      }
    },
    methods: {
      changeOption (option) {
        this.showOptions = false
        this.$emit('input', option)
      },
    },
    computed: {}

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "mySelect.scss";
</style>
