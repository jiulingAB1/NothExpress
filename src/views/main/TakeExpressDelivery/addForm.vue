<template>
  <a-modal
    title="取件模块"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="取件人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入取件人" v-decorator="['consignee', {rules: [{required: true, message: '请输入取件人！'}]}]" />
        </a-form-item>
        <a-form-item
          label="取手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入取手机号" v-decorator="['consigneeNumber']" />
        </a-form-item>
        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input placeholder="请输入备注" v-decorator="['remarks']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  takeExpressDeliveryAdd,
  takeExpressDeliveryTakeExpressPeopleData
} from '@/api/modular/main/takeexpressdelivery/takeExpressDeliveryManage'
  export default {
    components: { },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        },
        takeTimeDateString: '',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        idList: []
      }
    },
    methods: {
      // 初始化方法
      add (record, receiveExpressData) {
        this.visible = true
        this.idList = record
        takeExpressDeliveryTakeExpressPeopleData(receiveExpressData).then((res) => {
          if (res.data.length === 0) {
            this.form.setFieldsValue(
              {
                consignee: receiveExpressData.expressPeople,
                consigneeNumber: receiveExpressData.expressTel
              }
            )
          } else {
            this.form.setFieldsValue(
              {
                consignee: res.data[0].consignee,
                consigneeNumber: res.data[0].consigneeNumber,
                remarks: res.data[0].remarks
              }
            )
          }
        })
      },
      /**
       * 提交表单
       */
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
            values.idList = this.idList
            takeExpressDeliveryAdd(values).then((res) => {
              if (res.success) {
                this.$message.success(this.idList.length + '件已领取')
                this.confirmLoading = false
                this.$emit('ok', values)
                this.handleCancel()
              } else {
                this.$message.error('取件失败')// + res.message
              }
            }).finally((res) => {
              this.confirmLoading = false
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      takeTimeOnChange(date, dateString) {
        this.takeTimeDateString = dateString
      },
      handleCancel () {
        this.takeTimeDateString = ''
        this.form.resetFields()
        this.visible = false
      }
    }
  }
</script>
