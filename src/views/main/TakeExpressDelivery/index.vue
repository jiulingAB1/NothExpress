<template>
  <div>
    <a-card :bordered="false" :bodyStyle="tstyle">
      <div class="table-page-search-wrapper" v-if="hasPerm('receiveExpress:pickUpList')">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="快递单号">
                <a-input ref="inputTakeExpressNumber" v-model="queryParam.expressNumber" allow-clear placeholder="请输入快递单号" @pressEnter="selectData"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="selectData" >查询</a-button>
                <a-button style="margin-left: 8px" @click="ChongZhi">重置</a-button>
                <!--                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>-->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <a-button
        type="primary"
        :disabled="selectedRowKeys.length < 1"
        v-if="hasPerm('takeExpressDelivery:add') & hasPerm('takeExpressDelivery:takeExpressPeopleData')"
        icon="plus"
        @click="$refs.addForm.add(selectedRowKeys, receiveExpressData)"><a-icon type="add"/>取件</a-button>
      <span style="margin-left: 8px">
        <template v-if="selectedRowKeys.length > 0">
          {{ `已选择${selectedRowKeys.length}条信息` }}
        </template>
      </span>
      <a-table
        ref="table"
        :columns="columns"
        :data-source="this.shuju"
        :scroll="{ y: 800 }"
        :rowKey="(record) => record.id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <!--        <template class="table-operator" slot="operator" v-if="hasPerm('takeExpressDelivery:add')" >-->
        <!--          <a-button type="primary" v-if="hasPerm('takeExpressDelivery:edit')" icon="plus" @click="$refs.addForm.add()">新增取件模块</a-button>-->
        <!--          <x-down
            v-if="hasPerm('takeExpressDelivery:export')"
            ref="batchExport"
            @batchExport="batchExport"
          />-->
        <!--        </template>-->
        <!--        <span slot="action" slot-scope="text, record">
          <a v-if="hasPerm('takeExpressDelivery:edit')" @click="$refs.editForm.edit(record)">编辑</a>
          <a-divider type="vertical" v-if="hasPerm('takeExpressDelivery:edit') & hasPerm('takeExpressDelivery:delete')"/>
          <a-popconfirm v-if="hasPerm('takeExpressDelivery:delete')" placement="topRight" title="确认删除？" @confirm="() => singleDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>-->
      </a-table>
      <add-form ref="addForm" @ok="ChongZhi" @cancel="ChongZhi" />
      <!--      <edit-form ref="editForm" @ok="handleOk" />-->
    </a-card>
  </div>
</template>
<script>
  import { XDown } from '@/components'
  import moment from 'moment'
  // import { takeExpressDeliveryDelete, takeExpressDeliveryExport } from '@/api/modular/main/takeexpressdelivery/takeExpressDeliveryManage'
  import addForm from './addForm.vue'
  import editForm from './editForm.vue'
  import { receiveExpressPickUpList } from '@/api/modular/main/receiveexpress/receiveExpressManage'

  export default {
    name: 'TakeExpressDeliveryIndex',
    components: {
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
        expressTypeData: ['全部', '京东', '顺丰', '中通', '申通', '圆通', '邮政', '极兔', '菜鸟', '德邦', '其他'],
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
        tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
        idList: [],
        shuju: [],
        receiveExpressData: [],
        yanzhengData: 'null',
        // 加载数据方法 必须为 Promise 对象
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
      /* if (this.hasPerm('takeExpressDelivery:edit') || this.hasPerm('takeExpressDelivery:delete')) {
        this.columns.push({
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        })
      } */
    },
    mounted() {
      this.$refs.inputTakeExpressNumber.focus()
    },
    methods: {
      moment,
      /**
       * 查询参数组装
       */
      switchingDate () {
        // const queryParamtakeTime = this.queryParam.takeTimeDate
        // if (queryParamtakeTime != null) {
        //     this.queryParam.takeTime = moment(queryParamtakeTime).format('YYYY-MM-DD')
        //     if (queryParamtakeTime.length < 1) {
        //         delete this.queryParam.takeTime
        //     }
        // }
        const obj = JSON.parse(JSON.stringify(this.queryParam))
        return obj
      },
      /**
       * 单个删除
       */
      singleDelete (record) {
        const param = [{ 'id': record.id }]
        this.takeExpressDeliveryDelete(param)
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      /**
       * 批量导出
       * batchExport () {
       *         const paramIds = this.selectedRowKeys.map((d) => {
       *             return { 'id': d }
       *         })
       *         takeExpressDeliveryExport(paramIds).then((res) => {
       *             this.$refs.batchExport.downloadfile(res)
       *         })
       *       },
       */
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      selectData() {
        if (this.shuju.length === 0) {
          receiveExpressPickUpList(this.switchingDate()).then((res) => {
            if (res.data.length === 0) {
              this.$message.error('快递单号为空或该快递已领取！！')// + res.message
            } else {
              for (let i = 0; i < res.data.length; i++) {
                this.shuju.push(res.data[i])
              }
              this.receiveExpressData = res.data[0]
            }
          })
        }
        if (this.shuju.length > 0) {
          let a = 0
          for (let i = 0; i < this.shuju.length; i++) {
            if (this.shuju[i].expressNumber === this.queryParam.expressNumber) {
              a = a + 1
            }
          }
          if (a === 0) {
            receiveExpressPickUpList(this.switchingDate()).then((res) => {
              if (res.data.length === 0) {
                this.$message.error('快递单号为空或该快递已领取！！')// + res.message
              } else {
                for (let i = 0; i < res.data.length; i++) {
                  this.shuju.push(res.data[i])
                }
              }
            })
          } else {
            this.$message.error('快递单号重复！！')// + res.message
          }
        }
        this.queryParam = {}
      },
      ChongZhi () {
        receiveExpressPickUpList(this.switchingDate()).then((res) => {
          this.shuju = []
          this.queryParam = {}
          this.selectedRowKeys = []
          this.idList = []
        })
        this.$refs.inputTakeExpressNumber.focus()
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
