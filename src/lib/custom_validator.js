/**
 * Created by Administrator on 2017/5/26.
 */
/*http://vee-validate.logaretm.com/*/
import {Validator} from 'vee-validate';
/* 自义定表单校验规则可参考文档：http://vee-validate.logaretm.com/rules.html#custom-messages */
const dictionary = {
    my: {
        messages: {
            email: () => '您输入的邮件有误',
        },
        custom: {
            email: {
                required: '邮件必填'
            },
            contact: {
                required: '联系人必填'
            },
            name: {
                required: '名字必填'
            },
            nickName: {
                required: '昵称必填'
            },
            realname: {
                required: '真实姓名必填'
            },
            mobile: {
                required: '联系电话必填',
                mobile: '手机号码格式不正确'
            },
            address: {
                required: '地址信息必填'
            },
            addressdetail: {
                required: '详细地址必填'
            },
            identity: {
                required: '身份证号必填'
            },
            company: {
                required: '公司名称必填'
            }
        }
    }
};

/**
 *  自定义规则
 */

Validator.extend('mobile', {
    getMessage: field => '手机值正确',
    validate: value => /^1[34578]\d{9}$/.test(value)
})

Validator.updateDictionary(dictionary);
Validator.setLocale("my");
export {Validator};