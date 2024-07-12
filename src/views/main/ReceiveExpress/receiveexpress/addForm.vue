<template>
  <div>
    <a-card
      :bordered="false"
      :confirmLoading="confirmLoading"
      title="收件模块">
      <a-spin :spinning="confirmLoading" style="text-align: center">
        <a-form :form="form">
          <a-form-item
            label="快递类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select style="width: 100%" placeholder="请选择快递类型" v-model="options" v-decorator="['expressType', {rules: [{ required: true, message: '请选择快递类型！' }]}]">
              <a-select-option v-for="(item,index) in expressTypeData" :key="index" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="快递单号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
          >
            <a-input ref="inputExpressNumber" placeholder="请输入快递单号" v-decorator="['expressNumber', {rules: [{required: true, message: '请输入快递单号！'}]}]" @pressEnter="inputExpressFocus('inputExpressPeople')"/>
          </a-form-item>
          <a-form-item
            label="收件人"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
          >
            <a-input ref="inputExpressPeople" placeholder="请输入收件人" v-decorator="['expressPeople', {rules: [{required: true, message: '请输入收件人！'}]}]" @pressEnter="inputExpressFocus('inputExpressTel')"/>
          </a-form-item>
          <a-form-item
            label="收手机号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            has-feedback
          >
            <a-input ref="inputExpressTel" placeholder="请输入收手机号" v-decorator="['expressTel', {rules: [{required: true, message: '请输入收手机号！'}]}]" @pressEnter="handleSubmit()" />
          </a-form-item>
        </a-form>
        <span class="table-page-search-submitButtons">
          <a-button
            type="primary"
            @click="handleSubmit()"
            v-if="hasPerm('receiveExpress:addVerification') & hasPerm('receiveExpress:add') & hasPerm('receiveExpress:addSuccessSelect')"
          >提交</a-button>
          <a-button style="margin-left: 8px" @click="handleCancel">重置</a-button>
        <!--                <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? '收起' : '展开' }}
          <a-icon :type="advanced ? 'up' : 'down'"/>
        </a>-->
        </span>
      </a-spin>
    </a-card>
    <a-card :bordered="false">
      <a-table
        ref="table"
        :columns="columns"
        :data-source="this.shuju"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
import {
  receiveExpressAddVerification,
  receiveExpressAdd,
  receiveExpressAddSuccessSelect
} from '@/api/modular/main/receiveexpress/receiveExpressManage'
  export default {
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
        // 表头
        columns: [
          {
            title: '快递类型',
            align: 'center',
            dataIndex: 'expressType'
          },
          {
            title: '快递单号',
            align: 'center',
            dataIndex: 'expressNumber'
          },
          {
            title: '收件人',
            align: 'center',
            dataIndex: 'expressPeople'
          },
          {
            title: '收手机号',
            align: 'center',
            dataIndex: 'expressTel'
          },
          {
            title: '收件时间',
            align: 'center',
            dataIndex: 'receiveTime'
          },
          {
            title: '快递状态',
            align: 'center',
            dataIndex: 'expressStatus'
          }
        ],
        shuju: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        // 快递类型
        expressTypeData: ['京东', '顺丰', '中通', '申通', '圆通', '邮政', '韵达', '极兔', '菜鸟', '德邦', '其他'],
        options: '',
        visible: true
      }
    },
    mounted() {
      // this.$refs.inputExpressNumber.focus()
    },
    methods: {
      // 初始化方法
      add () {
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
              receiveExpressAddVerification(values).then((res) => {
                if (res.data.length === 0) {
                  receiveExpressAdd(values).then((res1) => {
                    if (res1.success) {
                      this.$message.success('收件成功')
                      receiveExpressAddSuccessSelect(values).then((res) => {
                        this.shuju = res.data
                      })
                      this.confirmLoading = false
                      this.$emit('ok', values)
                      this.handleCancel()
                    } else {
                      this.$message.error('收件失败')// + res.message
                    }
                  }).finally((res1) => {
                    this.confirmLoading = false
                  })
                } else {
                  this.$message.error('该快递已存在！！')// + res.message
                  this.confirmLoading = false
                }
              })
            } else {
              this.confirmLoading = false
            }
          })
      },
      handleCancel () {
        this.form.getFieldDecorator('expressType', { initialValue: this.options })
        this.form.resetFields()
        this.visible = false
        this.$refs.inputExpressNumber.focus()
      },
      inputExpressFocus (data) {
        if (data === 'inputExpressNumber') {
          this.$refs.inputExpressNumber.focus()
        }
        if (data === 'inputExpressPeople') {
          this.$refs.inputExpressPeople.focus()
        }
        if (data === 'inputExpressTel') {
          this.$refs.inputExpressTel.focus()
        }
      }
    }
  }
</script>
