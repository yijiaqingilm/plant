<template>
    <f7-page>
        <f7-navbar title="order" back-link="Back" sliding></f7-navbar>
        <f7-block inner>
            <div class='test'>园丁 订单页面</div>
            <div class='test2'>测试rem</div>
            <div @click="showAlert">测试 alert</div>
            <div><img data-src="http://lorempixel.com/500/500/nature/3" width="100%" class="img_lazy lazy lazy-fadeIn">
            </div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-input">
                                    <input type="text" placeholder="Your car" readonly id="picker-dependent">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    console.log(window.$f7);
    console.log('ceshi')
    export default {
        created: function () {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        mounted: function () {
            var carVendors = {
                Japanese: ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
                German: ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
                American: ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
            };
            var pickerDevice = this.$f7.picker({
                input: '#picker-dependent',
                cols: [
                    {
                        textAlign: 'center',
                        values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
                    }
                ]
            });
        },
        data(){
            return {}
        },
        methods: {
            showAlert: function () {
                this.$f7.alert("测试");
                console.log(this.$f7)

            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">

</style>
