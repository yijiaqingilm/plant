<template>
    <f7-page>
        <!-- 风水师列表页面 GeoList.vue-->
        <back title="风水师列表"></back>
        <f7-block inner class="geoList" no-hairlines>
            <div class="geo-list">
                <div class="geo-item">
                    <div class="geo-photo"><img src="../../assets/icon_scan.png" alt=""></div>
                    <div class="geo-info">
                        <div class="name">姓名：黄大师</div>
                        <div class="age">年龄：56岁</div>
                        <div class="sex">性别：男</div>
                        <div class="about">基本介绍：看相，紫日</div>
                        <div class="price">$99/次</div>
                    </div>
                    <div class="detail">
                        <div class="comment">评论：10252条</div>
                        <div class="success-order">成功交易200单</div>
                        <div class="show-detail">查看详情</div>
                    </div>
                </div>
                <div class="line-10"></div>
            </div>
            <div class="geo-list">
                <div class="geo-item">
                    <div class="geo-photo"><img src="../../assets/icon_scan.png" alt=""></div>
                    <div class="geo-info">
                        <div class="name">姓名：黄大师</div>
                        <div class="age">年龄：56岁</div>
                        <div class="sex">性别：男</div>
                        <div class="about">基本介绍：看相，紫日</div>
                        <div class="price">$99/次</div>
                    </div>
                    <div class="detail">
                        <div class="comment">评论：10252条</div>
                        <div class="success-order">成功交易200单</div>
                        <div class="show-detail">查看详情</div>
                    </div>
                </div>
                <div class="line-10"></div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {commonApi} from 'api'
    export default {
        data(){
            return {}
        },
        created(){
        },
        methods: {},
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/geomaner/geomaner.scss";
</style>

