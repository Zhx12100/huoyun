<template>
  <div class="swiperList-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form
      :inline="true"
      :model="formScreen"
      label-width="auto"
      size="medium">
      <el-form-item label="轮播名称">
        <el-input v-model="formScreen.banner_name" />
      </el-form-item>
      <el-button
        type="primary"
        :loading="listLoading"
        @click="getList"
        size="medium">查询</el-button>
      <el-button size="medium" @click="goAddEdit()" icon="el-icon-plus">新增</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
    >
      <el-table-column label="ID" align="center" width="55">
        <template slot-scope="scope">
          {{ scope.row.banner_id }}
        </template>
      </el-table-column>
      <el-table-column label="轮播名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.banner_name }} 
        </template>
      </el-table-column>
      <el-table-column label="轮播图片" align="center">
        <template slot-scope="scope">
          <img class="avatar" :src="scope.row.banner_pic" alt="">
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.banner_priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag @click="goAddEdit(scope.row.banner_id)" size="medium"
            >编辑</el-tag>
          <el-tag
            type="warning"
            @click="deleteItem(scope.row.banner_id)"
            size="medium"
            >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-box"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="formScreen.page"
      :page-sizes="[1,10, 20, 50, 100]"
      :page-size="formScreen.page_len"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSwiperList, deleteSwiper } from "@/api/operator";
export default {
  name: "SwiperList",
  data() {
    return {
      list: [],
      listLoading: true,
      formScreen: {
        page: 1,
        page_len: 10,
        username: "",
      },
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      getSwiperList(data).then((response) => {
        console.log("获取轮播列表", response);
        that.listLoading = false;
        that.list = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      var that = this;
      that.formScreen.page_len = val;
      that.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      var that = this;
      that.formScreen.page = val;
      that.getList();
    },
    // 前往新增列表
    goAddEdit(id) {
      var that = this;
      that.$router.push({
        name: "SwiperDetail",
        query: {
          id: id || "",
        },
      });
    },
    deleteItem(id) {
      var that = this;
      console.log(id);
      that.$confirm("此操作将该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSwiper({ banner_id: id}).then((response) => {
            that.$message({
              type: "success",
              message: "删除成功!",
            });
            that.getList()
          });
        })
        .catch(() => {
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.swiperList-container {
  margin: 30px;
  .avatar {
    width: 100px;
    height: auto;
    display: inline-block;
    object-fit: contain;
    font-size: 0;
  }
  .pagination-box {
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
s