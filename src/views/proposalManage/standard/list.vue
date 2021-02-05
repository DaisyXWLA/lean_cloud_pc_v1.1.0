<template>
  <div class="app-container">
    <el-button icon="el-icon-check" size="mini" type="primary" @click="save"
      >保存</el-button
    >

    <div v-for="(item, index) in standardList" :key="index">
      <el-table
        ref="table"
        v-loading="loading"
        :data="item.data"
        :cell-style="tableCellStyle"
        :border="true"
      >
        <el-table-column
          align="center"
          prop="name"
          label="分值"
          class="lable"
          width="180"
        />
        <el-table-column
          v-for="(column, index) in item.header"
          :key="column.key"
          :prop="column.key"
          :label="column.label"
          align="center"
          :width="column.key == '得分' ? '100' : ''"
        >
          <template slot-scope="scope"
            ><span
              @click="
                cellClick(
                  scope.row,
                  scope.row.options[index].id,
                  scope.row.options[index].value
                )
              "
              v-if="index < item.header.length - 1"
              style="display: block; padding: 10px"
              >{{ scope.row.options[index].title }}</span
            >
            <span v-else
              ><el-input
                class="value"
                v-model="scope.row.value"
                readonly
                style="width: 100px"
              ></el-input></span
          ></template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提交评审"
      :visible.sync="open"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px"  @submit.native.prevent>
        <el-form-item prop="remark" label="已选总分">
          <div class="score">
            <el-row>
              <el-col :span="2"><el-input v-model="score" readonly /></el-col>
              <el-col :span="22"><span>分</span></el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="发起人积分" prop="launchScore">
          <div class="distribute">
            <el-input
              v-model="form.launchScore"
              placeholder="请输入分配给发起人的积分"
            />
          </div>
        </el-form-item>
        <el-form-item label="落实人积分" prop="finishScore">
          <div class="distribute">
            <el-input
              v-model="form.finishScore"
              placeholder="请输入分配给落实人的积分"
            />
          </div>
        </el-form-item>
        <el-form-item prop="remark" label="评审意见">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入评审意见"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStandard,
  submitGrade,
  getCheckResult,
} from "@/api/proposal/proposal";
export default {
  data() {
    return {
      form: {},
      // 表单校验
      rules: {
        launchScore: [
          { required: true, message: "发起人积分不能为空", trigger: "blur" },
        ],
        finishScore: [
          { required: true, message: "落实人积分不能为空", trigger: "blur" },
        ],
      },
      scoreDetails: [],
      loading: false,
      standardList: [],
      row: null,
      column: null,
      value: "",
      index: "",
      queryParams: { current: 1, size: 10 },
      open: false,
      gradingId: "",
      //选择的总分
      score: "",
      //发起人积分
      launchScore: "",
      //落实人积分
      finishScore: "",
      selectedDatas:[],
      checkFlag:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      //获取评审结果
      getCheckResult(this.$route.params.resultId).then((resSecond) => {
        if (resSecond.status == "SUCCESS") {
          this.checkFlag=resSecond.obj.pid
          this.queryParams.worksType = resSecond.obj.worksType;
          if(resSecond.obj.pid!=0){
              getCheckResult(resSecond.obj.pid).then((resFirst) => {
              this.selectedDatas=resFirst.obj.scoreDetails.map(item=>{
                return {parentId:item.dimensionId,id:item.standardId,score:item.score}
              })
              // console.log(resFirst.obj.scoreDetails)
              this.queryParams.worksType=resSecond.obj.worksType;
              this.queryParams.id=resSecond.obj.gradingId
              getStandard(this.queryParams).then((resStandard) => {
                if (resStandard.status == "SUCCESS") {
                  // console.log(resStandard);
                  if (resStandard.obj.length > 0) {
                    this.gradingId = resStandard.obj[0].data[0].gradingId;
                    for (let i = 0; i < resStandard.obj.length; i++) {
                      resStandard.obj[i].header.push({ label: "得分", key: "得分" });

                      for(let j=0;j<this.selectedDatas.length;j++){

                        for(let k=0;k<resStandard.obj[i].data.length;k++){

                          if(this.selectedDatas[j].parentId==resStandard.obj[i].data[k].id){

                            resStandard.obj[i].data[k].selectedId=this.selectedDatas[j].id
                            resStandard.obj[i].data[k].value=this.selectedDatas[j].score

                          }
                        }
                      }
                    }
                  }
                  this.standardList = resStandard.obj;
                }
              });
            });
          }else{
            this.queryParams.worksType=resSecond.obj.worksType;
            getStandard(this.queryParams).then((resStandard) => {
                if (resStandard.status == "SUCCESS") {
                  // console.log(resStandard);
                  if (resStandard.obj.length > 0) {
                    this.gradingId = resStandard.obj[0].data[0].gradingId;
                    for (let i = 0; i < resStandard.obj.length; i++) {
                      resStandard.obj[i].header.push({ label: "得分", key: "得分" });
                    }
                  }
                  this.standardList = resStandard.obj;
                }
              });
          }
          
        }
      });
    },
    //点击的单元格改变样式
    cellClick(row, id, value) {
      row.selectedId = id;
      row.value = value;
    },
    tableCellStyle(obj) {
      if (
        obj.columnIndex == 0 ||
        obj.columnIndex == obj.row.options.length + 1
      ) {
        return;
      } else {
        if (
          obj.columnIndex > 0 &&
          obj.columnIndex < obj.row.options.length + 1
        ) {
          if (obj.row.selectedId == obj.row.options[obj.columnIndex - 1].id) {
            return "background-color:#1890ff;color:#fff";
          }
        }
        return "background-color:#fff;";
      }
    },
    save() {
      let dataArr = [];
      let ids = [];
      let scoreArr = [];
      for (let i = 0; i < this.standardList.length; i++) {
        dataArr.push(this.standardList[i].data);
      }
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          ids.push(dataArr[i][j].selectedId);
          scoreArr.push(dataArr[i][j].value);
        }
      }
      // for(let i=0;i<ids.length;i++){
      //   if(ids[i]==''){
      //     ids.splice(i,1)
      //   }
      // }
      if (scoreArr.some((item) => item == undefined)) {
        this.msgError("每个维度必选一项!");
        return;
      } else {
        this.score = this.sum(scoreArr);
        this.$set(this.form,'launchScore',this.score);
        this.$set(this.form,'finishScore',0)
        // this.form.launchScore = this.score;
        // this.form.finishScore = 0;
      }
      this.open = true;
      this.scoreDetails = ids.map((item) => {
        return { standardId: item };
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (parseInt(this.form.launchScore) + parseInt(this.form.finishScore) != this.score) {
            this.msgError(
              "发起人积分与落实人积分综合不等于已选总积分，请核对后重试！"
            );
            return;
          }
          this.form.scoreDetails = this.scoreDetails;
          this.form.gradingId = this.gradingId;
          this.form.id = this.$route.params.resultId;
          // console.log(this.form);
          submitGrade(this.form).then((res) => {
            if (res.status == "SUCCESS") {
              console.log(res)
              this.msgSuccess("评审成功！");
              this.getList();
              this.open = false;
              if(this.checkFlag==0){
                this.$router.push({ path: "/proposalManage/firstInstance" });
              }else{
                this.$router.push({ path: "/proposalManage/secondInstance" });
              }
              
            } else {
              this.msgError(res.message);
              this.open = false;
              this.getList();
              this.scoreDetails = [];
            }
          });
        }
      });
      // console.log(this.form)
    },
    // submit() {
    //   this.form.scoreDetails = this.scoreDetails;
    //   this.form.worksId = this.$route.params.id;
    //   this.form.gradingId = this.gradingId;
    //   // console.log(this.form)
    //   submitGrade(this.form).then((res) => {
    //     if (res.status == "SUCCESS") {
    //       this.msgSuccess("评审成功！");
    //       this.getList();
    //       this.open = false;
    //       this.$router.push({ path: "/proposalManage/check" });
    //     } else {
    //       this.msgError(res.message);
    //       this.getList();
    //       this.open = false;
    //       this.scoreDetails = [];
    //     }
    //   });
    // },
    cancel() {
      this.open = false;
    },
    //数组求和
    sum(arr) {
      return eval(arr.join("+"));
    },
    //获取分配给发起人的积分
    getLaunchScore(value) {
      // console.log(value);
      this.launchScore = value;
    },
    //获取分配给落实人的积分
    getFinishScore(value) {
      this.finishScore = value;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #f2f2f2;
  border-bottom: none;
}
/deep/ .el-table .cell {
  cursor: pointer;
  padding: 0;
}
/deep/ .el-table td {
  padding: 0;
}
/deep/ .el-table--border td:first-child .cell {
  font-weight: bold;
}
//表头字体大小
/deep/ .el-table .el-table__header-wrapper th {
  font-size: 14px;
}
/deep/ .el-input__inner {
  border: 1px solid #dcdfe6 !important;
  width: 80%;
}
//改变经过高亮
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff;
}
.value {
  margin: 10px 0;
}
/deep/ .el-button {
  margin-bottom: 14px;
}
/deep/ .el-table td {
  &:last-child {
    width: 90px;
  }
}
.score {
  /deep/ .el-input__inner {
    padding: 0;
    border: none !important;
    text-align: center;
    width: 100%;
  }
}
.distribute {
  /deep/ .el-input__inner {
    width: 100%;
  }
}
</style>