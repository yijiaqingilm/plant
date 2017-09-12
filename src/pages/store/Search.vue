<template>
    <f7-page @page:reinit="reinit">
        <back title="搜索" :fixed=true></back>
        <!-- Search bar -->
        <form class="searchbar searchbar-init hybrid-background" action="javascript:return true;">
            <div class="searchbar-input">
                <input type="search" class="input-search" v-model="query.key" placeholder="搜索"
                       @keyup.enter="search">
                <a href="#" class="searchbar-clear"></a>
            </div>
            <a href="#" class="searchbar-cancel">关闭</a>
        </form>

        <!-- Search bar overlay-->
        <div class="searchbar-overlay"></div>
        <!-- Search-through list -->

        <goods-list :itemList="dataList" id="search-list" class="searchbar-found">
        </goods-list>
        <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
            <div slot="no-more">没有更多数据</div>
            <div slot="no-results" class="no-result">{{noData}}</div>
        </infinite-loading>

    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi} from 'api'
    import infiniteLoading from 'vue-infinite-loading'
    import GoodsList from "section/store/goodsList/goodsList.vue"

    export default {
        data() {
            return {
                dataList: [],
                query: {
                    key: '',
                    page: 1
                },
                noData: '',

            }
        },
        created() {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        mounted() {
            /*document.addEventListener('touchstart', () => {
                console.log('touchstart');
                let inputSearch = document.querySelectorAll(".input-search");
                inputSearch[inputSearch.length - 1].focus();
            });*/
        },
        methods: {
            reinit: function () {
            },
            search: function (e) {
                this.query.page = 1;
                this.dataList = [];
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                this.noData = "无搜索结果";
            },
            loadData: function () {
                if (this.query.key.length <= 0) {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return;
                }
                userApi.goodsSearch({...this.query}).then(result => {
                    console.log(result);
                    if (result.data.length > 0) {
                        this.dataList = [].concat(this.dataList).concat(result.data);
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        this.query.page++;
                    } else {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    }
                });
            }
        },
        components: {GoodsList, infiniteLoading}
    }
</script>
<style lang="scss" scoped type="text/css">
</style>
