<template>
    <!-- App -->
    <div id="app" class="">
        <Loading></Loading>
        <!-- Statusbar -->
        <f7-statusbar></f7-statusbar>

        <!-- Main Views -->
        <f7-views>
            <f7-view id="main-view" navbar-through :dynamic-navbar="true" main :domCache="true">
                <!-- Navbar -->
                <f7-navbar title="" :back-link="false" sliding></f7-navbar>
                <!-- Pages -->
                <f7-pages>
                        <f7-page >
                        </f7-page>
                </f7-pages>
            </f7-view>
        </f7-views>
    </div>
</template>

<script>
    import Back from 'components/back/back.vue'
    import {commonApi} from 'api'
    import Loading from 'components/loading/loading.vue';

    import {commonly, LocalCache} from 'lib/utils'

    export default {
        created: function () {
            window.f7 = this.$f7;

        },
        methods: {
            reinit(){

                //window.history.back();
            }
        },
        mounted(){
        },
        components: {Loading, Back}
    }
</script>
<style lang="scss" type="text/css">
    @import "css/global.scss";
</style>
