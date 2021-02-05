<template>
  <div class="container">
    <div class="img">
      <el-image :src="imgSrc" fit="cover"></el-image
      ><span class="txt" :style="'font-size:' + fontSize + 'px'"
        >车间异常事件看板</span
      >
    </div>
    <el-table v-if="list.length == 0"></el-table>
    <el-table
      v-else
      stripe
      v-loading="loading"
      :data="list"
      :style="'font-size:' + fontSize + 'px'"
      :header-cell-style="{ 'font-size': +fontSize + 'px' }"
    >
      <el-table-column label="序号" type="index" width="100" align="center">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="ID"
        prop="id"
        width="100"
        v-if="showId"
        align="center"
      /> -->
      <el-table-column
        label="按键名称"
        prop="buttonName"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showButtonName"
      />
      <el-table-column
        label="按键组名称"
        prop="buttonTeamName"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showButtonTeamName"
      />

      <el-table-column
        label="事件类别"
        prop="buttonTypeName"
        width="180"
        align="center"
        v-if="showButtonTypeName"
      />
      <el-table-column
        label="区域"
        prop="areaName"
        align="center"
        v-if="showAreaName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="描述"
        prop="description"
        align="center"
        v-if="showDescription"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="触发人"
        prop="createUserName"
        width="150"
        align="center"
        v-if="showCreateUserName"
      />
      <el-table-column
        label="触发时间"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showCreateTime"
      >
        <template slot-scope="scope"
          ><span>{{ timeFormat(scope.row.createTime) }}</span></template
        ></el-table-column
      >
      <el-table-column
        label="响应人"
        prop="responseUserName"
        width="150"
        align="center"
        v-if="showResponseUserName"
      />

      <el-table-column
        label="总持续时间"
        prop="durationSeconds"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showDurationSeconds"
      >
        <template slot-scope="scope">
          <span>{{
            formatterTime(scope.row.durationSeconds)
          }}</span>
        </template></el-table-column
      >
      <el-table-column
        label="当前状态"
        prop="status"
        width="180"
        align="center"
        v-if="showStatus"
        :formatter="statusFormat"
      />
      <el-table-column
        label="当前状态开始时间"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showCurrentStatusBeginTime"
        ><template slot-scope="scope"
          ><span>{{
            timeFormat(scope.row.currentStatusBeginTime)
          }}</span></template
        ></el-table-column
      >
      <el-table-column
        label="当前状态持续时间"
        prop="currentStatusDurationSeconds"
        align="center"
        :show-overflow-tooltip="true"
        v-if="showCurrentStatusDurationSeconds"
      >
        <template slot-scope="scope">
          <span>{{
            formatterTime(scope.row.currentStatusDurationSeconds)
          }}</span>
        </template></el-table-column
      >
      <el-table-column label="重要程度" align="center" v-if="showImportantLevel"
        ><template slot-scope="scope">
          <span v-for="(item,index) in scope.row.buttonImportantLevel" :key="index"><i class="el-icon-star-on star"></i></span>
          <!-- <el-rate v-model="scope.row.buttonImportantLevel" disabled> </el-rate> -->
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="图片"
        prop="images"
        align="center"
        v-if="showImages"
      /> -->
      <el-table-column
        label="分配响应人数"
        prop="distributionUserCount"
        align="center"
        v-if="showDistributionUserCount"
      />
      <el-table-column
        label="响应时间"
        prop="responseTime"
        align="center"
        v-if="showResponseTime"
      />

      <el-table-column
        label="响应人是否必须到场"
        prop="showUp"
        align="center"
        v-if="showShowUp"
      />
    </el-table>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    /> -->
    <el-dialog
      title="密码验证"
      :visible.sync="open"
      :show-close="false"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="0" @submit.native.prevent>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入访问密码"
            style="width: 100%"
            @keyup.enter.native="submitForm"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { verify, getList } from "@/api/abnormal/board";
import icon from "@/assets/board_bg/icon.png";
export default {
  data() {
    return {
      imgSrc: icon,
      loading: false,
      list: [],
      open: false,
      form: {},
      // 总条数
      total: 0,
      rules: {
        password: [
          { required: true, message: "访问密码不能为空！", trigger: "blur" },
        ],
      },
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
      },
      //密码
      itenPwd: "",
      timer: null,
      //刷新间隔
      time: "",
      //整体字体大小设置
      fontSize: "",
      //字段展示与否
      showId: false,
      showButtonName: false,
      showCreateTime: false,
      showButtonTypeName: false,
      showCreateUserName: false,
      showResponseUserName: false,
      showCurrentStatusBeginTime: false,
      showCurrentStatusDurationSeconds: false,
      showDescription: false,
      showAreaName: false,
      showStatus: false,
      showButtonTeamName: false,
      showImportantLevel: false,
      showImages: false,
      showDistributionUserCount: false,
      showResponseTime: false,
      showDurationSeconds: false,
      showShowUp: false,
    };
  },
  mounted() {
    verify(this.$route.query.id).then((res) => {
      if (res.status == "SUCCESS") {
        this.time = res.obj.refreshTime;
        this.fontSize = res.obj.fontSize;
        if (res.obj.status == 2) {
          this.msgError("看板已停用！");
          return;
        }
        if (res.obj.isNeedPwd) {
          this.open = true;
        } else {
          this.getList();
          this.timer = setInterval(() => {
            if (this.queryParams.current * this.queryParams.size < this.total) {
              this.queryParams.current += 1;
              this.getList();
            } else {
              this.queryParams.current = 1;
              this.getList();
            }
          }, this.time * 1000);
        }
      } else {
        this.msgError("请求失败，请重试！");
      }
    });
  },
  methods: {
    getList() {
      this.queryParams.screenId = this.$route.query.id;
      getList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          if (res.obj.records.length > 0) {
            this.list = res.obj.records;
            console.log(this.list);
            // if (this.list[0].id != null) {
            //   this.showId = true;
            // }
            if (this.list[0].buttonName != null) {
              this.showButtonName = true;
            }
            if (this.list[0].createTime != null) {
              this.showCreateTime = true;
            }
            if (this.list[0].buttonTypeName != null) {
              this.showButtonTypeName = true;
            }
            if (this.list[0].createUserName != null) {
              this.showCreateUserName = true;
            }
            if (this.list[0].responseUserName != null) {
              this.showResponseUserName = true;
            }
            if (this.list[0].currentStatusBeginTime != null) {
              this.showCurrentStatusBeginTime = true;
            }
            if (this.list[0].currentStatusDurationSeconds != null) {
              this.showCurrentStatusDurationSeconds = true;
            }
            if (this.list[0].description != null) {
              this.showDescription = true;
            }
            if (this.list[0].areaName != null) {
              this.showAreaName = true;
            }
            if (this.list[0].status != null) {
              this.showStatus = true;
            }
            if (this.list[0].buttonTeamName != null) {
              this.showButtonTeamName = true;
            }
            if (this.list[0].buttonImportantLevel != null) {
              this.showImportantLevel = true;
            }
            // if (this.list[0].images != null) {
            //   this.showImages = true;
            // }
            if (this.list[0].distributionUserCount != null) {
              this.showDistributionUserCount = true;
            }
            if (this.list[0].responseTime != null) {
              this.showResponseTime = true;
            }
            if (this.list[0].durationSeconds != null) {
              this.showDurationSeconds = true;
            }
            if (this.list[0].showUp != null) {
              this.showShowUp = true;
            }
            this.total = res.obj.total;
            this.loading = false;
          } else {
            this.list = [];
            this.total = res.obj.total;
            this.loading = false;
          }
        } else {
          this.loading = false;
          this.msgError("获取看板数据失败，请重试！");
        }
      });
    },
    submitForm() {
      console.log('aaaaaaaaaaaaaaa')
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.queryParams.screenId = this.$route.query.id;
          this.queryParams.password = this.form.password;
          getList(this.queryParams).then((res) => {
            console.log(res);
            if (res.status == "SUCCESS") {
              this.itenPwd = this.form.password;
              if (res.obj.records.length > 0) {
                this.list = res.obj.records;
                // if (this.list[0].id != null) {
                //   this.showId = true;
                // }
                if (this.list[0].buttonName != null) {
                  this.showButtonName = true;
                }
                if (this.list[0].createTime != null) {
                  this.showCreateTime = true;
                }
                if (this.list[0].buttonTypeName != null) {
                  this.showButtonTypeName = true;
                }
                if (this.list[0].createUserName != null) {
                  this.showCreateUserName = true;
                }
                if (this.list[0].responseUserName != null) {
                  this.showResponseUserName = true;
                }
                if (this.list[0].currentStatusBeginTime != null) {
                  this.showCurrentStatusBeginTime = true;
                }
                if (this.list[0].currentStatusDurationSeconds != null) {
                  this.showCurrentStatusDurationSeconds = true;
                }
                if (this.list[0].description != null) {
                  this.showDescription = true;
                }
                if (this.list[0].areaName != null) {
                  this.showAreaName = true;
                }
                if (this.list[0].status != null) {
                  this.showStatus = true;
                }
                if (this.list[0].buttonTeamName != null) {
                  this.showButtonTeamName = true;
                }
                if (this.list[0].buttonImportantLevel != null) {
                  this.showImportantLevel = true;
                }
                // if (this.list[0].images != null) {
                //   this.showImages = true;
                // }
                if (this.list[0].distributionUserCount != null) {
                  this.showDistributionUserCount = true;
                }
                if (this.list[0].responseTime != null) {
                  this.list[0].showResponseTime = true;
                }
                if (this.list[0].durationSeconds != null) {
                  this.showDurationSeconds = true;
                }
                if (this.list[0].showUp != null) {
                  this.showShowUp = true;
                }
                this.total = res.obj.total;
                this.open = false;
                this.loading = false;
                this.timer = setInterval(() => {
                  this.queryParams.password = this.itenPwd;
                  if (
                    this.queryParams.current * this.queryParams.size <
                    this.total
                  ) {
                    this.queryParams.current += 1;
                    this.getList();
                  } else {
                    this.queryParams.current = 1;
                    this.getList();
                  }
                }, this.time * 1000);
              } else {
                this.list = [];
                this.total = res.obj.total;
                this.open = false;
                this.loading = false;
              }
            } else {
              if (res.obj == "pwdError") {
                this.reset();
                this.loading = false;
                this.msgError(res.message);
              } else {
                this.loading = false;
                this.msgError(res.message);
              }
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    //格式化时间
    formatterTime(time) {
      let result = parseInt(time);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}小时`;
      if (m !== "00") res += `${m}分`;
      // res += `${s}秒`;
      return res;
    },
    // 字典状态字典翻译
    statusFormat(row, column, value) {
      if (value == 0) {
        return "未处理";
      } else if (value == 1) {
        return "已分配";
      } else if (value == 2) {
        return "已响应";
      } else if (value == 3) {
        return "处理中";
      } else if (value == 4) {
        return "已完成";
      } else if (value == 5) {
        return "已总结";
      }
    },
    //日期格式化
    timeFormat(time) {
      let date = new Date(time);
      let newTime = `${this.addZero(date.getMonth() + 1)}-${this.addZero(
        date.getDate()
      )}  ${this.addZero(date.getHours())}:${this.addZero(date.getMinutes())}`;
      return newTime;
    },
    //时间补零
    addZero(time) {
      return time < 10 ? `0${time}` : time;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // height: 100%;
  // background-image: url("../assets/board_bg/bg.jpg");
  // background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background-image: url("../assets/board_bg/bg.jpg");
  background-size: cover;
  padding: 0 0.5rem 0.5rem;
}
.img {
  position: relative;
  text-align: center;
  margin-bottom: 0.4rem;
  .txt {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: rgba($color: #fff, $alpha: 0.9);
    font-weight: bolder;
  }
}
/deep/ .el-dialog {
  width: 10rem;
  .el-dialog__title {
    font-size: 0.3rem;
  }
  .el-dialog__headerbtn {
    font-size: 0.4rem;
  }
  .el-dialog__header {
    padding: 0.2rem 0.5rem;
  }
  .el-dialog__body {
    padding: 0.8rem 0.8rem 0.2rem;
  }
}
/deep/ .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  background: rgba($color: #0268e8, $alpha: 0.6);
  color: rgba($color: #fff, $alpha: 0.9);
}
/deep/ .el-table {
  background: rgba($color: #072e7d, $alpha: 0.3);
  border: 1px solid #0268e8;
  color: rgba($color: #fff, $alpha: 0.9);
}
/deep/ .el-table tr {
  background: rgba($color: #072e7d, $alpha: 0.5);
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #0268e8 !important;
}
/deep/ .el-table th.is-leaf,
/deep/ .el-table td {
  border-bottom: 1px solid #0268e8;
}
/deep/ .el-table--group::after,
.el-table--border::after,
.el-table::before {
  background: #0268e8;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba($color: #0268e8, $alpha: 0.2);
}
/deep/ .el-table__empty-text {
  color: rgba($color: #fff, $alpha: 0.9);
}
/deep/ .el-table .cell {
  line-height: 0.8rem;
}
/deep/ .el-rate {
  height: 0.5rem;
  line-height: 0.8rem;
}
/deep/ .el-rate__icon {
  font-size: 0.6rem;
}
.star{
  color: #f7ba2a;
}
</style>