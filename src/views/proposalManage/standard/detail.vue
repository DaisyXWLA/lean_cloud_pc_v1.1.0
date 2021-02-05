<template>
  <div class="app-container">
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
        >
          <template slot-scope="scope"
            ><span
              v-if="index < item.header.length"
              style="display: block; padding: 10px; text-align: left"
              >{{ scope.row.options[index].title }}</span
            ></template
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getStandard,
  getVersion,
  getCheckResult,
} from "@/api/proposal/proposal";
export default {
  data() {
    return {
      form: {},
      typeActive: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      //版本下拉选项
      versionOptions: [],
      standardList: [],
      queryParams: { current: 1, size: 10 },
      row: null,
      column: null,
      value: "",
      index: "",
      selectedIds: [],
      dataIds: [],
    };
  },
  created() {
    this.getList();
    this.getVersionOptions();
  },
  methods: {
    getList() {
      //获取评审结果
      getCheckResult(this.$route.params.resultId).then((res) => {
        if (res.status == "SUCCESS") {
          for (let i = 0; i < res.obj.scoreDetails.length; i++) {
            this.selectedIds.push(res.obj.scoreDetails[i].standardId);
          }
          this.queryParams.worksType = res.obj.worksType;
          this.queryParams.id = res.obj.gradingId;
          getStandard(this.queryParams).then((res) => {
            if (res.status == "SUCCESS") {
              this.standardList = res.obj;
              let datas = [];
              for (let i = 0; i < res.obj.length; i++) {
                datas.push(res.obj[i].data);
              }
              for(let i=0;i<datas.length;i++){
                for(let j=0;j<datas[i].length;j++){
                  for(let k=0;k<datas[i][j].options.length;k++){
                    for(let l=0;l<this.selectedIds.length;l++){
                      if(this.selectedIds[l]==datas[i][j].options[k].id){
                        datas[i][j].options[k].flag=true
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
    getVersionOptions() {
      //获取版本下拉选项
      getVersion().then((res) => {
        if (res.status == "SUCCESS") {
          // console.log(res);
          this.versionOptions = res.obj.map((item) => {
            return {
              label: `${item.version}(${item.createUserName})`,
              value: item.id,
              status: item.status,
            };
          });
          for (let i = 0; i < this.versionOptions.length; i++) {
            if (this.versionOptions[i].status == 1) {
              this.versionOptions[i].label = "正式版";
            }
          }
        }
      });
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
          if ( obj.row.options[obj.columnIndex - 1].flag) {
            return "background-color:#1890ff;color:#fff";
          }
        }
        return "background-color:#fff;";
      }
    },
    submit() {
      let dataArr = [];
      let ids = [];
      for (let i = 0; i < this.standardList.length; i++) {
        dataArr.push(this.standardList[i].data);
      }
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          ids.push(dataArr[i][j].id);
        }
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #f2f2f2;
  border-bottom: none;
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
</style>