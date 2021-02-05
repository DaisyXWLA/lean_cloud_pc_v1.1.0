<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="异常数量饼图" name="first">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="异常类型" prop="types">
                <el-select
                  multiple
                  v-model="queryParams.types"
                  :filterable="true"
                  placeholder="请选择类型"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="按键组" prop="bts">
                <el-select
                  multiple
                  v-model="queryParams.bts"
                  :filterable="true"
                  placeholder="请选择按键组"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in buttonGroupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发起始日期" prop="beginCreateTime">
                <el-date-picker
                  v-model="queryParams.beginCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择起始日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发截至日期" prop="endCreateTime">
                <el-date-picker
                  v-model="queryParams.endCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择截至日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3.5">
              <el-form-item label="包含已解决异常" prop="isFinish">
                <el-select
                  v-model="queryParams.isFinish"
                  :filterable="true"
                  placeholder="请选择"
                  :clearable="false"
                >
                  <el-option
                    v-for="item in finishOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2.5">
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="statistics">
          <div class="box">
            <div class="num">{{ total }}</div>
            <div class="name">总数</div>
          </div>
          <div class="box">
            <div class="num">{{ finish }}</div>
            <div class="name">已解决</div>
          </div>
        </div>
        <numberPieChart ref="numberPie" @getNum="getNum"></numberPieChart>
      </el-tab-pane>
      <el-tab-pane label="异常数量趋势图" name="second">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="异常类型" prop="types">
                <el-select
                  multiple
                  v-model="queryParams.types"
                  :filterable="true"
                  placeholder="请选择类型"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="按键组" prop="bts">
                <el-select
                  multiple
                  v-model="queryParams.bts"
                  :filterable="true"
                  placeholder="请选择按键组"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in buttonGroupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发起始日期" prop="beginCreateTime">
                <el-date-picker
                  v-model="queryParams.beginCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择起始日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发截至日期" prop="endCreateTime">
                <el-date-picker
                  v-model="queryParams.endCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择截至日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3.5">
              <el-form-item label="时间单位" prop="dateType">
                <el-select
                  v-model="queryParams.dateType"
                  :filterable="true"
                  placeholder="请选择"
                  :clearable="false"
                  style="width: 155px"
                >
                  <el-option
                    v-for="item in timeUnitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2.5">
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <numberHistogramChart ref="numberHistogram"></numberHistogramChart>
      </el-tab-pane>
      <el-tab-pane label="异常类型分布饼图" name="third">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="异常类型" prop="types">
                <el-select
                  multiple
                  v-model="queryParams.types"
                  :filterable="true"
                  placeholder="请选择类型"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="按键组" prop="bts">
                <el-select
                  multiple
                  v-model="queryParams.bts"
                  :filterable="true"
                  placeholder="请选择按键组"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in buttonGroupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发起始日期" prop="beginCreateTime">
                <el-date-picker
                  v-model="queryParams.beginCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择起始日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发截至日期" prop="endCreateTime">
                <el-date-picker
                  v-model="queryParams.endCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择截至日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3.5">
              <el-form-item label="包含已解决异常" prop="isFinish">
                <el-select
                  v-model="queryParams.isFinish"
                  :filterable="true"
                  placeholder="请选择"
                  :clearable="false"
                  style="width: 155px"
                >
                  <el-option
                    v-for="item in finishOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2.5">
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <typePieChart ref="typePieChart"></typePieChart>
      </el-tab-pane>
      <el-tab-pane label="异常触发时间散点图" name="fourth">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="异常类型" prop="types">
                <el-select
                  multiple
                  v-model="queryParams.types"
                  :filterable="true"
                  placeholder="请选择类型"
                  :clearable="true"
                  @change="getType"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="按键" prop="buttons">
                <el-select
                  multiple
                  v-model="queryParams.buttons"
                  :filterable="true"
                  placeholder="请选择按键"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in buttonOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="按键组" prop="bts">
                <el-select
                  multiple
                  v-model="queryParams.bts"
                  :filterable="true"
                  placeholder="请选择按键组"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in buttonGroupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="事件触发起始日期" prop="beginCreateTime">
                <el-date-picker
                  v-model="queryParams.beginCreateTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择起始日期"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <scatterDiagram ref="scatterDiagram"></scatterDiagram>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
//异常类型
import { getButtonType } from "@/api/abnormal/buttonManage";
//按键组
import { getButtonGroup } from "@/api/abnormal/boardManage";
//异常按键
import { getButtons } from "@/api/abnormal/statistics";
//异常数量饼状图
import numberPieChart from "./numberPieChart";
//异常数量趋势图
import numberHistogramChart from "./numberHistogramChart";
//异常类型分布图
import typePieChart from "./typePieChart";
//异常触发时间散点图
import scatterDiagram from "./scatterDiagram";

import PieChart from "../../proposalManage/statistics/typePieChart";
export default {
  components: {
    numberPieChart,
    numberHistogramChart,
    typePieChart,
    scatterDiagram,

    PieChart
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      //异常类型下拉选项
      typeOptions: [],
      //异常按键下拉选项
      //异常按键组下拉选项
      buttonGroupOptions: [],
      //是否已解决
      finishOptions: [
        { value: true, label: "是" },
        { value: false, label: "否" },
      ],
      //时间单位
      timeUnitOptions: [
        { value: "1", label: "日" },
        { value: "2", label: "月" },
      ],
      //按键下拉选项
      buttonOptions: [],
      //tab索引
      index: "0",
      // 查询参数
      queryParams: {
        types: "",
        bts: "",
        beginCreateTime: this.getBeforeWeek(),
        endCreateTime: this.getTime(),
        isFinish: true,
        dateType: "1",
        buttons: "",
      },
      activeName: "first",
      total: "",
      finish: "",
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    getData() {
      //获取异常类型
      getButtonType().then((res) => {
        if (res.status == "SUCCESS") {
          this.typeOptions = res.obj;
        }
      });
      //获取按键
      //获取按键组
      getButtonGroup().then((res) => {
        if (res.status == "SUCCESS") {
          this.buttonGroupOptions = res.obj;
        }
      });
    },
    //获取总数、已解决数
    getNum(total, finish) {
      this.total = total;
      this.finish = finish;
    },
    //根据类型获取按键
    getType(type) {
      this.buttonOptions = [];
      if (type != "") {
        getButtons(type).then((res) => {
          if (res.status == "SUCCESS") {
            this.buttonOptions = res.obj;
          }
        });
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      let types = "";
      let bts = "";
      let buttons = "";
      if (this.queryParams.types != "") {
        types = this.queryParams.types.join(",");
      }
      if (this.queryParams.bts != "") {
        bts = this.queryParams.bts.join(",");
      }
      if (this.queryParams.buttons != "") {
        buttons = this.queryParams.buttons.join(",");
      }
      let beginCreateTime = this.queryParams.beginCreateTime;
      let endCreateTime = this.queryParams.endCreateTime;
      let isFinish = this.queryParams.isFinish;
      let dateType = this.queryParams.dateType;

      if (this.index == "0") {
        this.$refs.numberPie.getData(
          types,
          bts,
          beginCreateTime,
          endCreateTime,
          isFinish
        );
      } else if (this.index == "1") {
        this.$refs.numberHistogram.getData(
          types,
          bts,
          beginCreateTime,
          endCreateTime,
          isFinish,
          dateType
        );
      } else if (this.index == "2") {
        this.$refs.typePieChart.getData(
          types,
          bts,
          beginCreateTime,
          endCreateTime,
          isFinish
        );
      } else if (this.index == "3") {
        this.$refs.scatterDiagram.getData(types, buttons, bts, beginCreateTime);
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.types = "";
      this.queryParams.bts = "";
      this.queryParams.buttons = "";
      this.buttonOptions = [];
      this.handleQuery();
    },
    //切换tab
    handleClick(a, b) {
      this.index = a.index;
      this.resetQuery()
      this.handleQuery();
    },
    //获取当前时间
    getTime() {
      let date = new Date();
      return `${this.addZero(date.getFullYear())}-${this.addZero(
        date.getMonth() + 1
      )}-${this.addZero(date.getDate())}`;
    },
    //获取当前时间前一周
    getBeforeWeek() {
      let nowdate = new Date();
      let date = new Date(nowdate - 6 * 24 * 3600 * 1000);
      return `${this.addZero(date.getFullYear())}-${this.addZero(
        date.getMonth() + 1
      )}-${this.addZero(date.getDate())}`;
    },
    //时间补零
    addZero(time) {
      return time < 10 ? `0${time}` : time;
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .el-date-editor.el-input,
// .el-date-editor.el-input__inner {
//   width: 140px;
// }
.statistics {
  display: flex;
  justify-content: center;
  text-align: center;
  .box {
    margin: 20px;
    .num {
      font-size: 32px;
      color: #666;
    }
    .name {
      font-size: 20px;
      color: #999;
    }
  }
}
/deep/ .el-button{
  padding: 8px 10px
}
/deep/ .el-button + .el-button{
  margin-left: 5px;
}
/deep/ .el-form--inline .el-form-item{
  margin-right: 4px;
}
/deep/ .el-form-item__label{
  padding-right: 5px;
}
</style>