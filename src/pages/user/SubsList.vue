<template>
    <f7-page>
        <back title="绿植体检预约列表"></back>
        <f7-block inner class="subsList" no-hairlines>
            <user-subs-order-list :itemList="data"></user-subs-order-list>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import UserSubsOrderList from 'section/user/subsOrderList/subsOrderList.vue';
    export default {
        data(){
            return {
                data: [{name: 'xx'}]
            }
        },
        components: {UserSubsOrderList}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
</style>
