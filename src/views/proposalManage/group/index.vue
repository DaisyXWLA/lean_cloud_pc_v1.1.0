<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-refresh"
          size="mini"
          @click="handleUse"
          v-hasPermi="['system:role:add']"
          >启用</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="loading" @row-click="handleUpdate">
      <el-table-column label="序号" type="index" width="80">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分组名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="分组列数"
        prop="itemCount"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="每列分值"
        prop="itemScores"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.status != 2"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleOption(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.status != 2"
            >维度</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      :title="title"
      :visible.sync="open"
      size="45%"
      :with-header="false"
    >
      <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="22">
                <span>{{ title }}</span>
              </el-col>
              <el-col :span="2">
                <el-button icon="el-icon-receiving" @click="submitForm"
                  >保存</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" class="close"
            ><el-button icon="el-icon-close" @click="cancel"></el-button
          ></el-col>
        </el-row>
      </div>
      <div class="group-container">
        <div class="content">
          <el-form ref="form" :model="form" label-width="90px">
            <div class="box">
              <div class="title">评审标准分组基本信息</div>
              <div class="form">
                <el-row class="group-name">
                  <el-col :span="24">
                    <el-form-item label="分组名称" prop="name">
                      <el-input
                        v-model="form.name"
                        placeholder="请输入评审标准组名称"
                        @input="change($event)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="24">
                    <el-form-item label="分组列数" prop="itemCount">
                      <el-input
                        v-model="form.itemCount"
                        placeholder="请输入列数"
                        @change="getColumn"
                      />
                    </el-form-item>
                  </el-col>
                </el-row> -->
                <el-row
                  class="score"
                  v-for="(item, index) in form.columns"
                  :key="index"
                >
                  <el-col :span="2.5">
                    <span class="option-name">选项{{ index + 1 }}分值</span>
                  </el-col>
                  <el-col :span="19">
                    <el-form-item
                      v-if="form.columns.length > 0"
                      :prop="'columns.' + index + '.score'"
                      :rules="rules"
                    >
                      <el-input
                        v-model="item.score"
                        placeholder="请输入分值"
                        @input="change($event)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="1.5"
                    ><i
                      v-if="form.columns.length > 1"
                      style="
                        line-height: 36px;
                        color: #999;
                        padding-left: 15px;
                        font-size: 16px;
                      "
                      class="el-icon-delete"
                      @click="removeItem(item)"
                    ></i
                  ></el-col>
                  <el-col :span="1.5">
                    <i
                      v-if="index == form.columns.length - 1"
                      style="
                        padding-left: 15px;
                        line-height: 36px;
                        font-size: 16px;
                        color: #999;
                      "
                      class="el-icon-plus"
                      @click="addItem"
                    ></i>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      title="二审达标分值"
      :visible.sync="standardScoreOpen"
      append-to-body
      width="500px"
    >
      <el-form
        ref="standardScoreForm"
        :model="standardScoreForm"
        :rules="standardScoreRules"
        label-width="120px"
      >
        <el-form-item label="二审达标分值" prop="standardScore">
          <el-input v-model="standardScoreForm.standardScore" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStandardScore">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  groupList,
  startUse,
  editGroup,
  getGroupDetail,
  deleteGroup,
} from "@/api/proposal/proposal";
export default {
  data() {
    const emptyRules=(rule, value, callback)=>{
        if(value==''){
          callback(new Error('分值不能为空！'))
        }
          callback()
      }
    return {
      standardScoreOpen: false,
      open: false,
      loading: true,
      title: "",
      data: [],
      form: { columns: [{ score: "" }] },
      queryParams: {
        current: 1,
        size: 10,
      },
      rules:{
        emptyRules:[{validator:emptyRules,trigger: 'blur'}]
      },
      column: "",
      standardScoreForm: {},
      standardScoreRules: {
        standardScore: [
          { required: true, message: "二审达标分值不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    getList() {
      this.loading = false;
      groupList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.data = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增分组";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      this.open = true;
      this.title = "修改分组";
      //获取分组详情
      getGroupDetail(id).then((res) => {
        if (res.status == "SUCCESS") {
          this.form.name = res.obj.name;
          this.form.id = res.obj.id;
          // this.form.itemCount = res.obj.itemCount;
          this.form.columns = res.obj.itemScores.split(",").map((item) => {
            return { score: item };
          });
        }
      });
    },
    //启用
    handleUse() {
      this.standardScoreOpen = true;
    },
    //提交启用
    submitStandardScore() {
      this.standardScoreForm.worksType = 1;
      this.loading = true;
      startUse(this.standardScoreForm).then((res) => {
        if (res.status == "SUCCESS") {
          this.loading = false;
          this.standardScoreOpen = false;
          this.getList();
          this.msgSuccess("成功启用为正式版！");
        } else {
          this.loading = false;
          this.standardScoreOpen = false;
          this.msgError(res.message);
        }
      });
    },
    handleOption(row) {
      this.$router.push({
        path: `/proposalManage/standard/${row.id}/${row.itemScores}`,
      });
    },
    handleDelete(row) {
      this.open = false;
      const id = row.id;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteGroup(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.loading = false;
            this.form.orderBy = 1;
            this.form.gradingWorksType = 1;
            let scoreArr = [];
            scoreArr = this.form.columns
              .map((item) => {
                return item.score;
              })
              .join(",");
            // delete this.form.columns;
            this.form.itemScores = scoreArr;
            this.form.itemCount = this.form.columns.length;
            editGroup(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("修改分组成功！");
                this.open = false;
                this.loading = false;
                this.getList();
              } else {
                this.open = false;
                this.loading = false;
                this.msgError("修改分组失败，请重试！");
              }
            });
          } else {
            let scoreArr = [];
            scoreArr = this.form.columns
              .map((item) => {
                return item.score;
              })
              .join(",");
            // delete this.form.columns;
            this.form.itemScores = scoreArr;
            this.form.orderBy = 1;
            this.form.gradingWorksType = 1;
            // console.log(this.form);
            this.form.itemCount = this.form.columns.length;
            editGroup(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增分组成功！");
                this.open = false;
                this.loading = false;
                this.getList();
              } else {
                this.open = false;
                this.loading = false;
                this.msgError("新增分组失败，请重试！");
              }
            });
          }
        }
      });
    },
    //获取列数
    getColumn(column) {
      console.log(column);
      this.column = column;
      // if (column != "" && this.form.columns.length == 0) {
      //   for (let i = 0; i < column; i++) {
      //     this.form.columns.push({
      //       score: "",
      //     });
      //   }
      // } else if (column != "" && this.form.columns.length != 0) {
      // } else {
      //   this.form.columns.splice(0, this.form.columns.length);
      // }
    },
    //删除行
    removeItem(item) {
      let index = this.form.columns.indexOf(item);
      if (index !== -1) {
        this.form.columns.splice(index, 1);
      }
    },
    //添加行
    addItem() {
      this.form.columns.push({
        score: "",
      });
    },
    //input强制渲染
    change(e) {
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #ddd;
  border-bottom: 0;
}
/deep/ .el-drawer {
  background: #f9f9f9;
}
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.header {
  background: #f5f5f5;
  //   padding: 15px 30px;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
  .close {
    text-align: right;
    border-left: 1px solid #ddd;
    padding: 15px 30px 15px 0;
  }
  /deep/ .el-button {
    background: none;
    border: none;
    padding: 0;
    i {
      font-size: 18px;
      color: #999;
      font-weight: bold;
      vertical-align: middle;
    }
    span {
      color: #888;
      vertical-align: middle;
    }
  }
}
.group-container {
  padding: 0 30px;
  .content {
    .box {
      border: 1px solid #e5e5e5;
      background: #fff;
      margin-top: 20px;
      // padding: 30px 15px;
      .title {
        font-size: 16px;
        color: #555;
        padding: 15px;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
      }
      .form {
        padding: 20px 20px;
        /deep/ .el-form-item__label {
          color: #999;
        }
        .group-name{
          /deep/ .el-form-item{
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .score {
    /deep/ .el-input--medium {
      margin-bottom: 5px;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
    .option-name {
      display: inline-block;
      width: 90px;
      color: #999;
      font-size: 14px;
      font-weight: 700;
      text-align: right;
      padding-right: 12px;
      line-height: 36px;
    }
  }
}
</style>