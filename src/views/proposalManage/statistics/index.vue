<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="提案状态分布饼图" name="first">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="所属部门" prop="deptId">
                <treeselect
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择部门"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="区域" prop="areaId">
                <treeselect
                  v-model="queryParams.areaId"
                  :options="areaOptions"
                  :show-count="true"
                  placeholder="请选择区域"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="提案类别" prop="proposalTypes">
                <el-select
                  multiple
                  v-model="queryParams.proposalTypes"
                  :filterable="true"
                  placeholder="请选择类别"
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
              <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
              <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
        <statusPieChart ref="statusPie"></statusPieChart>
      </el-tab-pane>
      <el-tab-pane label="提案类别分布饼图" name="second">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="所属部门" prop="deptId">
                <treeselect
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择部门"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="区域" prop="areaId">
                <treeselect
                  v-model="queryParams.areaId"
                  :options="areaOptions"
                  :show-count="true"
                  placeholder="请选择区域"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="状态" prop="auditStatus">
                <el-select
                  multiple
                  v-model="queryParams.auditStatus"
                  :filterable="true"
                  placeholder="请选择提案处理状态"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
              <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
        <typePieChart ref="typePie"></typePieChart>
      </el-tab-pane>
      <el-tab-pane label="提案数量趋势图" name="third">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="所属部门" prop="deptId">
                <treeselect
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择部门"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
              <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
            <el-col :span="4.5">
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
        <numLineChart ref="numLine"></numLineChart>
      </el-tab-pane>
      <el-tab-pane label="参与率趋势图" name="fourth">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="所属部门" prop="types">
                <treeselect
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择部门"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
              <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
            <el-col :span="4.5">
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
        <participateLineChart ref="participateLine"></participateLineChart>
      </el-tab-pane>
      <el-tab-pane label="人均提案数趋势图" name="fifth">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row>
            <el-col :span="4.5">
              <el-form-item label="所属部门" prop="deptId">
                <treeselect
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  placeholder="请选择部门"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4.5">
              <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
              <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
            <el-col :span="4.5">
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
        <ideaLineChart ref="ideaLine"></ideaLineChart>
      </el-tab-pane>
      <el-tab-pane label="排行列表" name="sixth">
        <el-row>
          <el-col :span="3"
            ><el-radio-group
              v-model="staffRank"
              @change="selectRadio"
              size="medium"
            >
              <el-radio-button label="员工排行"></el-radio-button>
              <el-radio-button
                label="部门排行"
              ></el-radio-button> </el-radio-group
          ></el-col>
          <el-col :span="18" v-if="staffRankShow">
            <el-form
              :model="queryParams"
              ref="staffRaankQueryForm"
              :inline="true"
            >
              <el-row>
                <el-col :span="4.5">
                  <el-form-item label="所属部门" prop="deptId">
                    <treeselect
                      v-model="queryParams.deptId"
                      :options="deptOptions"
                      :show-count="true"
                      placeholder="请选择部门"
                      style="width: 200px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4.5">
                  <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
                  <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
                <el-col :span="2.5">
                  <el-form-item>
                    <el-button
                      type="cyan"
                      icon="el-icon-search"
                      size="mini"
                      @click="handleQuery"
                      >搜索</el-button
                    >
                    <!-- <el-button
                      icon="el-icon-refresh"
                      size="mini"
                      @click="resetQuery"
                      >重置</el-button
                    > -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="18" v-if="deptRankShow">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
              <el-row>
                <el-col :span="4.5">
                  <el-form-item label="所属部门" prop="parentId">
                    <treeselect
                      v-model="queryParams.parentId"
                      :options="deptOptions"
                      :show-count="true"
                      placeholder="请选择部门"
                      style="width: 200px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4.5">
                  <el-form-item label="提案发起起始日期" prop="beginCreateTime">
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
                  <el-form-item label="提案发起截至日期" prop="endCreateTime">
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
                <el-col :span="2.5">
                  <el-form-item>
                    <el-button
                      type="cyan"
                      icon="el-icon-search"
                      size="mini"
                      @click="handleQuery"
                      >搜索</el-button
                    >
                    <!-- <el-button
                      icon="el-icon-refresh"
                      size="mini"
                      @click="resetQuery"
                      >重置</el-button
                    > -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-table
          ref="table"
          v-loading="loading"
          :data="staffRankData"
          v-if="staffRankShow"
        >
          <el-table-column
            align="center"
            type="index"
            label="排名"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="userName"
            label="员工姓名"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="deptName"
            label="所属部门"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="proposalCount"
            label="提案数量"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="userAllpoint"
            label="累计积分"
            class="lable"
          />
        </el-table>
        <pagination
          v-if="staffRankShow"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.current"
          :limit.sync="queryParams.size"
          @pagination="handleQuery"
        />
        <el-table
          ref="table"
          v-loading="loading"
          :data="deptRankData"
          v-if="deptRankShow"
        >
          <el-table-column
            align="center"
            type="index"
            label="排名"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="deptName"
            label="部门名称"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="deptProposalCount"
            label="提案数量"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="userProposalCountAvg"
            label="人均建议"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="userProposalCountAvg"
            label="人均积分"
            class="lable"
          />
          <el-table-column
            align="center"
            prop="userAllpointSum"
            label="累计积分"
            class="lable"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getTreeList } from "@/api/system/area";
import { treeselect } from "@/api/system/dept";
import { getType, staffRank, deptRank } from "@/api/proposal/proposal";
//提案状态分布饼图
import statusPieChart from "./statusPieChart";
//提案类别分布饼图
import typePieChart from "./typePieChart";
//参与率分布曲线图
import numLineChart from "./numLineChart";
//参与率分布曲线图
import participateLineChart from "./participateLineChart";
//人均提案分布曲线图
import ideaLineChart from "./ideaLineChart";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    statusPieChart,
    typePieChart,
    numLineChart,
    participateLineChart,
    ideaLineChart,
    Treeselect,
  },
  data() {
    return {
      staffRank: "员工排行",
      deptRank: "部门排行",
      staffRankShow: true,
      deptRankShow: false,
      staffRankData: [],
      deptRankData: [],
      // 遮罩层
      loading: false,
      //部门下拉选项
      deptOptions: [],
      //类型下拉选项
      typeOptions: [],
      //区域下拉选项
      areaOptions: [],
      //提案处理状态下拉选项
      statusOptions: [
        { dictValue: "0", dictLabel: "审核未通过" },
        { dictValue: "1", dictLabel: "待审核" },
        { dictValue: "2", dictLabel: "待落实" },
        { dictValue: "3", dictLabel: "已完成" },
        { dictValue: "5", dictLabel: "验收通过" },
        { dictValue: "4", dictLabel: "已撤销" },
      ],
      //时间单位
      timeUnitOptions: [
        { value: "1", label: "日" },
        { value: "2", label: "月" },
      ],
      levelOptions: [
        { value: "2", label: "车间级" },
        { value: "3", label: "班组级" },
      ],
      //tab索引
      index: "0",
      // 查询参数
      queryParams: {
        current: 1,
        size: 20,
        deptId: undefined,
        parentId:'',
        areaId: undefined,
        proposalTypes: "",
        auditStatus: "",
        dateType: "1",
        level:undefined,
        beginCreateTime: this.getBeforeWeek(),
        endCreateTime: this.getTime(),
      },
      activeName: "first",
      total: 0,
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
      //获取部门选项
      treeselect().then((res) => {
        this.deptOptions = res.data;
        this.queryParams.parentId=res.data[0].id
      });
      //获取类别选项
      getType().then((res) => {
        this.typeOptions = res.obj;
      });
      //获取区域选项
      getTreeList().then((res) => {
        this.areaOptions = res.obj;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      let proposalTypes = "";
      let auditStatus = "";
      let deptId = "";
      let areaId = "";
      if (this.queryParams.proposalTypes != "") {
        proposalTypes = this.queryParams.proposalTypes.join(",");
      }
      if (this.queryParams.auditStatus != "") {
        auditStatus = this.queryParams.auditStatus.join(",");
      }
      if (this.queryParams.deptId != undefined) {
        deptId = this.queryParams.deptId;
      }
      if (this.queryParams.areaId != undefined) {
        areaId = this.queryParams.areaId;
      }

      let beginCreateTime = this.queryParams.beginCreateTime;
      let endCreateTime = this.queryParams.endCreateTime;
      let dateType = this.queryParams.dateType;
      if (this.index == "0") {
        this.$refs.statusPie.getData(
          deptId,
          areaId,
          proposalTypes,
          beginCreateTime,
          endCreateTime
        );
      } else if (this.index == "1") {
        this.$refs.typePie.getData(
          deptId,
          areaId,
          auditStatus,
          beginCreateTime,
          endCreateTime
        );
      } else if (this.index == "2") {
        this.$refs.numLine.getData(
          deptId,
          beginCreateTime,
          endCreateTime,
          dateType
        );
      } else if (this.index == "3") {
        this.$refs.participateLine.getData(
          deptId,
          beginCreateTime,
          endCreateTime,
          dateType
        );
      } else if (this.index == "4") {
        this.$refs.ideaLine.getData(
          deptId,
          beginCreateTime,
          endCreateTime,
          dateType
        );
      } else if (this.index == "5") {
        // console.log(this.staffRankShow);
        if (this.staffRankShow) {
          let obj = {};
          obj.deptId = this.queryParams.deptId;
          obj.beginCreateTime = this.queryParams.beginCreateTime;
          obj.endCreateTime = this.queryParams.endCreateTime;
          staffRank(obj).then((res) => {
            if (res.status == "SUCCESS") {
              this.staffRankData = res.obj.records;
              this.total = res.obj.total;
            } else {
              this.msgError(res.message);
            }
          });
        } else if (this.deptRankShow) {
          let obj = {};
          obj.parentId = this.queryParams.parentId;
          obj.beginCreateTime = this.queryParams.beginCreateTime;
          obj.endCreateTime = this.queryParams.endCreateTime;
          deptRank(obj).then((res) => {
            if (res.status == "SUCCESS") {
              this.deptRankData = res.obj;
              console.log(res)
            } else {
              this.msgError(res.message);
            }
          });
        }
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptId = undefined;
      this.queryParams.areaId = undefined;
      this.queryParams.level=undefined;
      this.queryParams.proposalTypes = "";
      this.queryParams.auditStatus = "";
      this.handleQuery();
    },
    //切换tab
    handleClick(a, b) {
      this.index = a.index;
      this.resetQuery();
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
    //选择员工排行/部门排行
    selectRadio(label) {
      if (label == "员工排行") {
        this.staffRankShow = true;
        this.deptRankShow = false;
        this.resetQuery();
        let obj = {};
        obj.beginCreateTime = this.queryParams.beginCreateTime;
        obj.endCreateTime = this.queryParams.endCreateTime;
        staffRank(obj).then((res) => {
          if (res.status == "SUCCESS") {
            this.staffRankData = res.obj.records;
            this.total = res.obj.total;
          } else {
            this.msgError(res.message);
          }
        });
      } else if (label == "部门排行") {
        this.staffRankShow = false;
        this.deptRankShow = true;
        this.handleQuery()
        // let obj = {};
        // obj.parentId=this.queryParams.departmentId;
        // obj.beginCreateTime = this.queryParams.beginCreateTime;
        // obj.endCreateTime = this.queryParams.endCreateTime;
        // deptRank(obj).then((res) => {
        //   if (res.status == "SUCCESS") {
        //     this.deptRankData = res.obj;
        //   } else {
        //     this.msgError(res.message);
        //   }
        // });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .el-date-editor.el-input,
// .el-date-editor.el-input__inner {
//   width: 140px;
// }
/deep/ .el-table {
  border: 1px solid #f2f2f2;
  border-bottom: none;
}
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
/deep/ .el-button {
  padding: 8px 10px;
}
/deep/ .el-button + .el-button {
  margin-left: 5px;
}
/deep/ .el-form--inline .el-form-item {
  margin-right: 4px;
}
/deep/ .el-form-item__label {
  padding-right: 5px;
}
/deep/ .pagination-container {
  height: 30px;
}
</style>