<template>
  <a-modal
    title="编辑模块"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="快递类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select style="width: 100%" placeholder="请选择快递类型" v-decorator="['expressType', {rules: [{ required: true, message: '请选择快递类型！' }]}]">
            <a-select-option v-for="(item,index) in expressTypeData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="快递单号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入快递单号" v-decorator="['expressNumber', {rules: [{required: true, message: '请输入快递单号！'}]}]" />
        </a-form-item>
        <a-form-item
          label="收件人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入收件人" v-decorator="['expressPeople']" />
        </a-form-item>
        <a-form-item
          label="收手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入收手机号" v-decorator="['expressTel']" />
        </a-form-item>
        <a-form-item
          label="快递状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select style="width: 100%" placeholder="请选择快递状态" v-decorator="['expressStatus', {rules: [{ required: true, message: '请选择快递状态(未取件，已取件)！' }]}]">
            <a-select-option v-for="(item,index) in expressStatusData" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="取件人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入取件人" v-decorator="['consignee']" :disabled="componentDisabled(false)"/>
        </a-form-item>
        <a-form-item
          label="取手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入取手机号" v-decorator="['consigneeNumber']" :disabled="componentDisabled(false)"/>
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入备注" v-decorator="['remarks']" :disabled="componentDisabled(false)"/>
        </a-form-item>
        <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  receiveExpressEdit,
  receiveExpressEditVerification
} from '@/api/modular/main/receiveexpress/receiveExpressManage'
  export default {
    data () {
      return {
        // 快递类型
        expressTypeData: ['京东', '顺丰', '中通', '申通', '圆通', '邮政', '韵达', '极兔', '菜鸟', '德邦', '其他'],
        // 快递状态
        expressStatusData: ['未领取', '已领取'],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        initExpressNumber: ''
      }
    },
    methods: {
      // 初始化方法
      edit (record) {
        console.log(record)
        this.visible = true
        this.initExpressNumber = record.expressNumber
          setTimeout(() => {
          this.form.setFieldsValue(
            {
              expressNumber: record.expressNumber,
              expressPeople: record.expressPeople,
              expressStatus: record.expressStatus,
              expressTel: record.expressTel,
              expressType: record.expressType,
              id: record.id,
              consignee: record.consignee,
              consigneeNumber: record.consigneeNumber,
              remarks: record.remarks
            }
          )
        }, 100)
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            for (const key in values) {
              if (typeof (values[key]) === 'object' && values[key] != null) {
                values[key] = JSON.stringify(values[key])
              }
            }
            if (this.initExpressNumber === values.expressNumber) {
              receiveExpressEdit(values).then((res) => {
                if (res.success) {
                  this.$message.success('编辑成功')
                  this.confirmLoading = false
                  this.$emit('ok', values)
                  this.handleCancel()
                } else {
                  this.$message.error('编辑失败')//  + res.message
                }
              }).finally((res) => {
                this.confirmLoading = false
              })
            } else {
              receiveExpressEditVerification(values).then((res) => {
                if (res.data.length === 0) {
                  receiveExpressEdit(values).then((res1) => {
                    if (res1.success) {
                      this.$message.success('编辑成功')
                      this.confirmLoading = false
                      this.$emit('ok', values)
                      this.handleCancel()
                    } else {
                      this.$message.error('编辑失败')//  + res.message
                    }
                  }).finally((res1) => {
                    this.confirmLoading = false
                  })
                } else {
                  this.$message.error('快递单号已存在!')//  + res.message
                  this.confirmLoading = false
                }
              })
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      componentDisabled (zhuangtai) {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors && values.expressStatus === '未领取') {
            zhuangtai = true
          } else {
            zhuangtai = false
          }
        })
        return zhuangtai
      },
      handleCancel () {
        this.initExpressNumber = ''
        this.form.resetFields()
        this.visible = false
      }
    }
  }
</script>
