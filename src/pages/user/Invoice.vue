<template>
    <f7-page>
        <back title="请填写发票信息">
            <div slot="right" class="invocie-list" @click="$router.load({url:'/user/invoice/list'})">发票历史</div>
        </back>
        <f7-block inner class="invoice" no-hairlines>
            <div class="my-title-used">可申请发票金额：<span class="total-money">{{info.invoice}}元</span></div>
            <div class="my-title-used color-gray">(可累计订单金额;发票金额最低{{min_invoice}}元免邮)</div>
            <div class="form">
                <div class="group first-group invoice-type">
                    <div class="form-label">发票类型：</div>
                    <div class="form-input">
                        <my-radio v-model="type" id="type1" val="1" name="type"></my-radio>
                        <label for="type1">公司</label>
                        <my-radio v-model="type" id="type0" val="0" name="type"></my-radio>
                        <label for="type0">个人</label>
                    </div>
                </div>
                <div class="group " v-show="showTaxnumber">
                    <div class="form-label">纳税人识别号：</div>
                    <div class="form-input"><input v-model="info.taxnumber" placeholder="请输入税号" type="text">
                    </div>
                </div>
                <div class="group ">
                    <div class="form-label">发票抬头：</div>
                    <div class="form-input"><input v-model="info.header" placeholder="请输入发票抬头" type="text">
                    </div>
                </div>

                <div class="address" @click="$router.load({url:'/user/address/list',query:{isChange:true}})">
                    <span class="gt"></span>
                    <div class="address-group">
                        <div class="group">
                            <div class="form-label">公司名称：</div>
                            <div class="form-input"><input :value="getAddress.company" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">联系人：</div>
                            <div class="form-input"><input :value="getAddress.contact" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">联系电话：</div>
                            <div class="form-input"><input :value="getAddress.mobile" placeholder="" type="text">
                            </div>
                        </div>

                        <div class="group">
                            <div class="form-label">地址：</div>
                            <div class="form-input"><input :value="getAddress.address" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">详细地址：</div>
                            <div class="form-input"><input :value="getAddress.addressdetail" placeholder=""
                                                           type="text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submit">
                <span class="my-button" @click="submit">提交申请</span>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi} from 'api'
    export default {
        data(){
            return {
                error: null,
                validator: null,
                info: {header: '', invoice: 0, taxnumber: ''},
                min_invoice: '',
                type: 1,// 1 公司 0  个人,
                showTaxnumber: true
            }
        },
        created(){
            userApi.invoiceInfo().then(result => {
                this.info.invoice = result.data.invoice;
                this.min_invoice = result.data.min_invoice;
            });
            window.wx.ready(() => {
                wx.hideMenuItems({
                 menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            submit: function () {
                console.log("提交表单信息");
                if (this.info.invoice <= 0) {
                    this.$f7.alert('申请发票金额需大于0');
                    return;
                }
                if (this.info.header.length <= 0) {
                    this.$f7.alert('请填写发票抬头');
                    return;
                }
                if (this.info.taxnumber <= 0 && this.type==1) {
                    this.$f7.alert('请填写纳税人识别号');
                    return;
                }
                if (!this.getAddress.mobile || this.getAddress.mobile.length <= 0) {
                    this.$f7.alert('请填写地址信息');
                    return;
                }
                if (this.info.invoice < this.min_invoice) {
                    this.$f7.alert(`您的发票金额不足${this.min_invoice}元<br>`, '', () => {
                        // this.byInvice();
                    });
                } else {
                    this.byInvice();
                }

            },
            byInvice: function () {
                // 成功回调内容 ==>
                this.$f7.confirm('确定申请发票', '', () => {
                    userApi.invoiceApply({
                        ...this.info, ...this.getAddress,
                        address_id: this.getAddress.id,
                        type:this.type
                    }).then(result => {
                        console.log('result', result)
                        this.$router.load({url: '/user/invoice/success'});
                    });

                });

            }
        },
        computed: {
            getAddress: function () {
                return this.$store.state.default_address;
            }
        },
        watch: {
            type(value){
                value == 0 ? this.showTaxnumber = false : this.showTaxnumber = true;
            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/invoice.scss";
</style>

