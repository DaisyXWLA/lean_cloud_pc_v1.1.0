<template>
  <div class="app-container">
    <el-button icon="el-icon-check" size="mini" type="primary" @click="submit"
      >提交</el-button
    >
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :cell-style="tableCellStyle"
      :border="true"
    >
      <el-table-column
        align="center"
        prop="name"
        label="维度"
        class="lable"
        width="180"
      />
      <el-table-column
        v-for="(item, index) in header"
        :key="item.key"
        :prop="item.key"
        :label="item.label"
        align="center"
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
            v-if="index < header.length - 1"
            style="display: block; padding: 10px; text-align: left"
            >{{ scope.row.options[index].title }}</span
          >
          <span v-else
            ><el-input
              class="value"
              v-model="scope.row.value"
              readonly
            ></el-input></span
        ></template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      typeActive: false,
      loading: false,
      header: [
        {
          label: "1",
          key: "1",
        },
        {
          label: "2",
          key: "2",
        },
        {
          label: "5",
          key: "5",
        },
        {
          label: "10",
          key: "10",
        },
        {
          label: "得分",
          key: "得分",
        },
      ],
      data: [
        {
          id: "1",
          name: "工具应用",
          value: "",
          selectedId: "",
          options: [
            {
              pid: "1",
              id: "0",
              title: "有效使用CI基础工具(问题解决、5s、目视化管理、标准作业)",
              value: "1",
            },
            {
              pid: "1",
              id: "1",
              title: "有效使用CI高级工具 （防错、快换、TPM、看板、TPB）",
              value: "2",
            },
            {
              pid: "1",
              id: "2",
              title: "成功运用VSM与制约管理，并使用4种以上CI工具",
              value: "5",
            },
            {
              pid: "1",
              id: "3",
              title: "成功运用6 Sigma工具完成",
              value: "10",
            },
          ],
        },
        {
          id: "2",
          name: "质量",
          value: "",
          selectedId: "",
          options: [
            {
              pid: "2",
              id: "11",
              title: "能维持并提高品质",
              value: "1",
            },
            {
              pid: "2",
              id: "12",
              title: "能防止不良的发生",
              value: "2",
            },
            {
              pid: "2",
              id: "15",
              title: "不需要检查也能杜绝不良发生",
              value: "5",
            },
            {
              pid: "2",
              id: "100",
              title: "提高商品价值提高公司形象",
              value: "10",
            },
          ],
        },
      ],
      row: null,
      column: null,
      value: "",
      index: "",
    };
  },
  methods: {
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
    submit() {
      console.log(this.data);
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
  // cursor: ;
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
/deep/ .el-button{
  margin-bottom: 14px;
}
</style>