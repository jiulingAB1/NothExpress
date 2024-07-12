<template style="display: flex;position: fixed" v-if="hasPerm('receiveExpress:countData')">
  <a-spin :spinning="confirmLoading" style="align-items: center;justify-content: center;">
    <div class="boxStyle" :style="{height: windowHeight + 'px'}">
      <!--  上面部分  -->
      <div class="PopUpName" style="position:absolute;display: flex;top: 2%;width: 85%;height: 35%;left: 3%;">
        <div class="bg" style="width: 98.4%;height: 96%;">
          <!-- 横图     -->
          <table border="2" style="width: 96%;height: 90%;text-align: center;font-size: large;">
            <tr>
              <th>快递类型</th>
              <th v-for="(item,index) in this.expressMCList" :key="index" :value="item">{{ item }}</th>
            </tr>
            <tr>
              <th>剩余件数</th>
              <td v-for="(item,index) in this.surplusDataList" :key="index" :value="item">{{ item }}</td>
            </tr>
            <tr>
              <th>今日来件</th>
              <td v-for="(item,index) in this.nowDataList" :key="index" :value="item">{{ item }}</td>
            </tr>
          </table>
        </div>
        <div class="blob"></div>
        <div class="blob2"></div>
      </div>

      <a-button style="position: absolute;top: 2%;left: 90%;" type="primary" @click="clearLog" v-if="hasPerm('receiveExpress:deleteExpressLog')" >清理日志</a-button>
      <!--  下面左边部分  -->
      <div class="PopUpName" style="position: absolute;display:flex;top: 42%;width: 56%;height: 53%;left: 3%;">
        <div class="bg" style="width: 98.4%;height: 97%;">
          <!-- 柱状图 -->
          <div ref="histogramEcharts" style="position:relative;width: 100%;height: 100%;"></div>
        </div>
        <div class="blob"></div>
        <div class="blob2"></div>
      </div>

      <!--  下右边部分  -->
      <div class="PopUpName" style="position: absolute;display: flex;top: 42%;width: 36%;height: 53%;left: 61%;">
        <div class="bg" style="width: 97%;height: 97.5%;">
          <!-- 饼图 -->
          <div ref="pieEcharts" style="position:relative;width: 100%;height: 100%;"></div>
        </div>
        <div class="blob"></div>
        <div class="blob2"></div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import { STable, XDown } from '@/components'
import { receiveExpressDeleteExpressLog, receiveExpressCountData } from '@/api/modular/main/receiveexpress/receiveExpressManage'
import * as echarts from 'echarts'
export default {
  name: 'Eanalysis',
  components: {
    STable,
    XDown
  },
  data () {
    return {
      loading: true,
      expressMCList: [],
      nowDataList: [],
      surplusDataList: [],
      histogramList: [],
      pieChartList: [],
      pieNameList: [],
      windowHeight: 0,
      myChart: null,
      myChartPie: null,
      confirmLoading: false
      /*,
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      } */
    }
  },
  created() {
    // setTimeout(() => {
    // 加载数据方法 必须为 Promise 对象
    this.initVoid()
    // }, 90)
  },
  // 初始化
  mounted() {
    this.updateWindowHeight()
    window.addEventListener('resize', this.updateWindowHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWindowHeight)
  },
  methods: {
    initVoid () {
      this.confirmLoading = true
      receiveExpressCountData().then((res) => {
        this.expressMCList = res.data.expressMC
        this.nowDataList = res.data.nowData
        this.surplusDataList = res.data.surplusData
        this.histogramList = res.data.histogramData
        this.pieChartList = res.data.pieChartData
        this.pieNameList = res.data.pieName
        // 柱状图
        this.histogramCharts(this.histogramList, this.expressMCList)
        // 饼图
        this.pieCharts(this.pieChartList, this.pieNameList)
      })
      setTimeout(() => {
        this.confirmLoading = false
      }, 3400)
    },
    clearLog () {
      receiveExpressDeleteExpressLog().then((res) => {
        this.confirmLoading = true
        if (res.success) {
          setTimeout(() => {
            this.$message.success('日志清理成功!!')
          }, 200)
        } else {
          setTimeout(() => {
            this.$message.error('日志清理失败!!') // + res.message
          }, 200)
        }
        setTimeout(() => {
          this.confirmLoading = false
        }, 170)
      })
    },
    /**
     * 查询参数组装
     */
    switchingDate () {
      /* const queryParamreceiveTime = this.queryParam.receiveTimeDate
      if (queryParamreceiveTime != null) {
        this.queryParam.receiveTime = moment(queryParamreceiveTime).format('YYYY-MM-DD')
        if (queryParamreceiveTime.length < 1) {
          delete this.queryParam.receiveTime
        }
      }
      const obj = JSON.parse(JSON.stringify(this.queryParam))
      return obj */
    },
    pieCharts(data, name) {
      this.myChartPie = echarts.init(this.$refs.pieEcharts)
      var pieData = [ // 饼图数据
        { value: data[0], name: name[0] },
        { value: data[1], name: name[1] }
      ]
      var option = {
        title: {
          text: '日志数量统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          orient: 'vertical',
          left: 'left'
        },
        textStyle: {
          color: '#fafafa'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }
        ]
      }
      this.myChartPie.setOption(option)
    },
    histogramCharts(data, name) {
      this.myChart = echarts.init(this.$refs.histogramEcharts)
      const xAxisData = name
      const data1 = data
      var option
      option = {
        title: {
          text: '昨日收件数量统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: data1
          }
        ]
      }
      this.myChart.setOption(option)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    updateWindowHeight() {
      this.windowHeight = window.innerHeight
    }
  }
}
</script>
<style lang="less">
/*.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}*/

/*背景颜色*/
.PopUpName {
  /*background-color: rgba(255, 255, 255, 0.5);*/
  z-index: 1;
  background-color: rgb( 64, 224, 208, 255);
  //border-radius: 10px;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.boxStyle {
  //border-radius: 10px;
  background-color: rgb(25, 25, 112, 255);
  //background-color: aliceblue;
  position:relative;
  display: flex;
  width: 100%;
}
/*流水线边框开始*/
.bg{
  z-index: 3;
  //border-radius: 10px;
  background-color: #fafafa;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.blob{
  z-index: 2;
  width: 85%;
  height: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  background-color: rgb( 0, 255, 255, 255);
  transform-origin: left top;
  animation: scanning 0.9s linear infinite;
}
.blob2{
  z-index: 2;
  width: 85%;
  height: 50%;
  position: absolute;
  right: 50%;
  bottom: 50%;
  border-radius: 50%;
  background-color: rgb( 0, 255, 255, 255);
  transform-origin: right bottom;
  animation: scanning 0.9s linear infinite;
}
@keyframes scanning{
  to{
    transform: rotate(360deg);
  }
}
/*流水线边框结束*/
</style>
