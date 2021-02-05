<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :filterable="true"
          placeholder="请选择商品状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

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
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="soldOut"
          >下架</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="commodityList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.image == ''" fit="cover">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <el-image
            v-else
            :src="baseURL + scope.row.image"
            :preview-src-list="[baseURL + scope.row.image]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="商品价格（积分）" prop="price" align="center" />
      <el-table-column label="商品状态" prop="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-else-if="scope.row.status == 2">下架</span>
          <span v-else-if="scope.row.status == 3">删除</span>
        </template>
      </el-table-column>
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
            v-if="scope.row.status!=2"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sold-out"
            @click="soldOut(scope.row)"
            v-if="scope.row.status!=2"
            >下架</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input
            v-model.number="form.price"
            placeholder="请输入商品价格（积分）"
          />
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <upload ref="upload" @getImgUrl="getImgUrlFromChild"></upload>
        </el-form-item>
        <el-form-item>
          <div class="pic-list">
            <div class="pic-box" v-for="item in imgList" :key="item.id">
              <el-image :src="item.src"></el-image>
              <i
                class="el-icon-close close-icon"
                @click="deletePic(item.id)"
              ></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  commodityList,
  addOrUpdateCommodity,
  getCommodity,
  deleteCommodity,
  uploadImg,
} from "@/api/commodity/info";
import upload from "@/components/upload/index";
export default {
  components: { upload },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 类别表格数据
      commodityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      //图片路径
      imgUrl: "",
      //上传的图片
      imgList: [],
      //追加图片
      addImgList: [],
      //从组件中获取的上传信息
      imgInfo: [],
      //状态下拉选项
      statusOptions: [
        {
          key: "",
          title: "全部",
        },
        {
          key: "1",
          title: "正常",
        },
        {
          key: "2",
          title: "下架",
        },
        {
          key: "3",
          title: "删除",
        },
      ],
      formdata: null,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        status: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
      },
      baseURL:''
    };
  },
  created() {
    this.getList();
  },
  mounted(){
    this.baseURL=process.env.VUE_APP_BASE_API
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      commodityList(this.queryParams).then((res) => {
        console.log(res);
        if (res.status == "SUCCESS") {
          this.commodityList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
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
      this.form = {
        name: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增商品";
      this.imgList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const commodityId = row.id || this.ids;
      this.imgList = [];
      getCommodity(commodityId).then((res) => {
        if (res.obj.image != "") {
          this.imgList = res.obj.image.split(";").map((item, index) => {
            return { src: this.baseURL + item, id: index };
          });
        }
        this.form = res.obj;
        this.open = true;
        this.title = "修改商品";
      });
    },
    // 下架
    soldOut(row) {
      const commodityId = row.id || this.ids;
      const status = 2;
      this.$confirm("是否确认下架已选商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteCommodity(commodityId, status);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("下架成功！");
        });
    },
    //获取上传的图片路径
    getImgUrlFromChild(data) {
      this.imgInfo = data;
      this.formdata = new FormData();
      for (let i = 0; i < this.imgInfo.length; i++) {
        this.formdata.append(
          "filelist" + Math.random() * 10,
          this.imgInfo[i].raw
        );
      }
      this.addImgList = this.imgInfo.map((item, index) => {
        return { src: item.url, id: Math.random().toString(36).substr(2) };
      });
      this.imgList = this.addImgList;
    },
    //删除图片
    deletePic(id) {
      for (let i = 0; i < this.imgList.length; i++) {
        if (id == this.imgList[i].id) {
          this.imgList.splice(i, 1);
          this.imgInfo.splice(i, 1);
        }
      }
      this.formdata = new FormData();

      for (let i = 0; i < this.imgInfo.length; i++) {
        this.formdata.append(
          "filelist" + Math.random() * 10,
          this.imgInfo[i].raw
        );
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.imgList.length == 0) {
              this.form.image = this.imgUrl;
              this.addOrUpdate(this.form, "修改");
              this.imgInfo=[]
            } else {
              uploadImg(this.formdata).then((res) => {
                this.imgUrl = res.obj;
                this.form.image = this.imgUrl;
                this.addOrUpdate(this.form, "修改");
                this.imgInfo=[]
              });
            }
          } else {
            uploadImg(this.formdata).then((res) => {
              console.log(res);
              if (res.status == "SUCCESS") {
                this.imgUrl = res.obj;
                this.form.image = this.imgUrl;
                this.addOrUpdate(this.form, "新增");
              } else {
                this.msgError("图片上传失败，请重试！");
              }
            });
          }
        }
      });
    },
    //新增修改
    addOrUpdate(form, tips) {
      addOrUpdateCommodity(form).then((res) => {
        if (res.status == "SUCCESS") {
          this.msgSuccess(`${tips}成功`);
          this.open = false;
          this.getList();
        } else {
          this.open = false;
          this.msgError(`${tips}失败，请重试！`);
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const commodityId = row.id || this.ids;
      const status = 3;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteCommodity(commodityId, status);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    // 删除图片
    handleRemove(file) {
      // console.log(file);
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片下载
    handleDownload(file) {
      // console.log(file);
    },
    // 超出限制数量提示
    handleExceed(file, fileList) {
      if (fileList == 1) {
        this.msgError("超出附件最大上传量！");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions span + span {
  margin-left: 5px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions {
  font-size: 16px;
}
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-image {
  width: 35px;
  height: 35px;
  line-height: 35px;
}
//上传列表
/deep/ .el-upload-list {
  display: none;
}
.pic-list {
  margin-left: -70px;
  .pic-box {
    display: inline-block;
    margin: 0 5px;
    width: 78px;
    height: 78px;
    position: relative;
    /deep/ .el-image {
      width: 78px;
      height: 78px;
      border-radius: 5px;
    }
    .close-icon {
      position: absolute;
      right: -10px;
      top: -8px;
      color: #fff;
      background: rgba($color: #000000, $alpha: 0.3);
      border-radius: 50%;
      padding: 2px;
      font-size: 12px;
      box-sizing: border-box;
    }
  }
}
// /deep/ .el-upload-list{
//   width: 70px;
//   height: 70px;
//   margin-left: -70px;
//   margin-top: 10px;
// }
// /deep/ .el-upload-list--picture .el-upload-list__item-thumbnail{
//   float: none;
// }
// /deep/ .el-upload-list--picture .el-upload-list__item{
//   height: 120px;
//   border: none;
// }
// /deep/ .el-upload-list--picture .el-upload-list__item-name{
//   margin-top: 5px;
// }
// /deep/ .el-upload-list__item-name{
//   margin-left: -90px;
//   float: left;
// }
</style>
