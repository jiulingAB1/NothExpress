<template>
  <div>
    <a-card :bordered="false" :bodyStyle="tstyle">
      <div class="table-page-search-wrapper" v-if="hasPerm('receiveExpress:page')">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="快递类型">
                <a-select style="width: 100%" v-model="queryParam.expressType" placeholder="请选择快递类型">
                  <a-select-option v-for="(item,index) in expressTypeData" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="收件人">
                <a-input v-model="queryParam.expressPeople" allow-clear placeholder="请输入收件人"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="收手机号">
                <a-input v-model="queryParam.expressTel" allow-clear placeholder="请输入收手机号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="快递单号">
                <a-input v-model="queryParam.expressNumber" allow-clear placeholder="请输入快递单号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="快递状态">
                <a-select style="width: 100%" v-model="queryParam.expressStatus" placeholder="请选择快递状态">
                  <a-select-option v-for="(item,index) in expressStatusData" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="收件时间">
                  <a-date-picker style="width: 100%" placeholder="请选择收件时间" v-model="queryParam.receiveTime" @change="onChangereceiveTime"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="取件人">
                  <a-input v-model="queryParam.consignee" allow-clear placeholder="请输入取件人"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="取手机号">
                  <a-input v-model="queryParam.consigneeNumber" allow-clear placeholder="请输入取手机号"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="取件时间">
                  <a-date-picker style="width: 100%" placeholder="请选择取件时间" v-model="queryParam.takeTime" @change="onChangetakeTime"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="8" :sm="24" >
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)" >查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :scroll="{ x: 1200, y: 800 }"
        :alert="options.alert"
        :rowKey="(record) => record.id"
        :rowSelection="options.rowSelection"
      >
        <template class="table-operator" slot="operator" >
          <!--          <a-button type="primary" v-if="hasPerm('receiveExpress:add')" icon="plus" @click="$refs.addForm.add()">新增收件模块</a-button>-->
          <a-button type="danger" :disabled="selectedRowKeys.length < 1" v-if="hasPerm('receiveExpress:delete')" @click="batchDelete"><a-icon type="delete"/>批量删除</a-button>
          <!--          <x-down
            v-if="hasPerm('receiveExpress:export')"
            ref="batchExport"
            @batchExport="batchExport"
          />-->
        </template>
        <span slot="expressStatusScopedSlots" slot-scope="text">
          {{ '${column.dictTypeCode}' | dictType(text) }}
        </span>
        <span slot="expressTypeScopedSlots" slot-scope="text">
          {{ '${column.dictTypeCode}' | dictType(text) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a
            v-if="hasPerm('receiveExpress:edit') & hasPerm('receiveExpress:editVerification')"
            @click="$refs.editForm.edit(record)">编辑</a>
          <a-divider type="vertical" v-if="hasPerm('receiveExpress:edit') & hasPerm('receiveExpress:delete')"/>
          <a-popconfirm v-if="hasPerm('receiveExpress:delete')" placement="topRight" title="确认删除？" @confirm="() => singleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </s-table>
      <!--      <add-form ref="addForm" @ok="handleOk" />-->
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>
<script>
  import { STable, XDown } from '@/components'
  import moment from 'moment'
  import { receiveExpressPage, receiveExpressDelete, receiveExpressExport } from '@/api/modular/main/receiveexpress/receiveExpressManage'
  import addForm from './addForm.vue'
  import editForm from './editForm.vue'
  export default {
    components: {
      STable,
      addForm,
      editForm,
      XDown
    },
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 快递类型
        expressTypeData: ['全部', '京东', '顺丰', '中通', '申通', '圆通', '邮政', '韵达', '极兔', '菜鸟', '德邦', '其他'],
        // 快递状态
        expressStatusData: ['全部', '未领取', '已领取'],
        // 表头
        columns: [
          {
            title: '快递类型',
            align: 'center',
            dataIndex: 'expressType',
            width: '90px',
            fixed: 'left'
          },
          {
            title: '快递单号',
            align: 'center',
            dataIndex: 'expressNumber',
            width: '150px',
            fixed: 'left'
          },
          {
            title: '收件人',
            align: 'center',
            dataIndex: 'expressPeople',
            width: '90px',
            fixed: 'left'
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
          },
          {
            title: '取件人',
            align: 'center',
            dataIndex: 'consignee'
          },
          {
            title: '取手机号',
            align: 'center',
            dataIndex: 'consigneeNumber'
          },
          {
            title: '取件时间',
            align: 'center',
            dataIndex: 'takeTime'
          },
          {
            title: '备注',
            align: 'center',
            dataIndex: 'remarks'
          }
        ],
        tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return receiveExpressPage(Object.assign(parameter, this.switchingDate())).then((res) => {
            return res.data
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        options: {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
      }
    },
    created () {
      if (this.hasPerm('receiveExpress:edit') || this.hasPerm('receiveExpress:delete')) {
        this.columns.push({
          title: '操作',
          width: '100px',
          align: 'center',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        })
      }
    },
    methods: {
      moment,
      /**
       * 查询参数组装
       */
      switchingDate () {
        /**
         * 原语句
         * const queryParamreceiveTime = this.queryParam.receiveTimeDate
         */
        const queryParamreceiveTime = this.queryParam.receiveTime
        if (queryParamreceiveTime != null) {
            this.queryParam.receiveTime = moment(queryParamreceiveTime).format('YYYY-MM-DD')
            if (queryParamreceiveTime.length < 1) {
                delete this.queryParam.receiveTime
            }
        }
        const queryParamtakeTime = this.queryParam.takeTime
        if (queryParamtakeTime != null) {
            this.queryParam.takeTime = moment(queryParamtakeTime).format('YYYY-MM-DD')
            if (queryParamtakeTime.length < 1) {
                delete this.queryParam.takeTime
            }
        }
        const obj = JSON.parse(JSON.stringify(this.queryParam))
        return obj
      },
      /**
       * 单个删除
       */
      singleDelete (record) {
        const param = [{ 'id': record.id }]
        this.receiveExpressDelete(param)
      },
      /**
       * 批量删除
       */
      batchDelete () {
        const paramIds = this.selectedRowKeys.map((d) => {
            return { 'id': d }
        })
        this.receiveExpressDelete(paramIds)
      },
      receiveExpressDelete (record) {
        receiveExpressDelete(record).then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.$refs.table.clearRefreshSelected()
          } else {
            this.$message.error('删除失败') // + res.message
          }
        })
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      /**
       * 时间选择
       */
      onChangereceiveTime(date, dateString) {
        this.receiveTimeDateString = dateString
      },
      onChangetakeTime(date, dateString) {
        this.takeTimeDateString = dateString
      },
      /**
       * 批量导出
       */
      batchExport () {
        const paramIds = this.selectedRowKeys.map((d) => {
            return { 'id': d }
        })
        receiveExpressExport(paramIds).then((res) => {
            this.$refs.batchExport.downloadfile(res)
        })
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>
<style lang="less">
  .table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }
</style>
