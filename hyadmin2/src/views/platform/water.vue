<template>
  <div class="water-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form :inline="true" :model="formScreen" label-width="auto" size="medium">
      <el-form-item label="备注">
        <el-input v-model="formScreen.openid" />
      </el-form-item>
      <el-form-item label="交易日期">
        <el-date-picker v-model="formScreendate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交易对象">
        <el-input v-model="formScreen.openid" />
      </el-form-item>
      <el-button type="primary" :loading="listLoading" @click="getList" size="medium">查询</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.pay_id }}
        </template>
      </el-table-column>
      <el-table-column label="流水单号" align="center">
        <template slot-scope="scope">
          {{ scope.row.pay_no }}
        </template>
      </el-table-column>
      <el-table-column label="出入方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入/支出" align="center">
        <template slot-scope="scope">
          {{ scope.row.pay_fee }}
        </template>
      </el-table-column>
      <el-table-column label="用户对象" align="center">
        <template slot-scope="scope">
          <img class="nick_image" :src="scope.row.head_image" alt="">
          <span>{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          {{ scope.row.note }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formScreen.page" :page-sizes="[10, 20, 50, 100]" :page-size="formScreen.page_len"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getWaterList } from "@/api/platform";
export default {
  name: "Water",
  data() {
    return {
      list: [],
      listLoading: true,
      formScreen: {
        openid: "",
        page: 1,
        page_len: 10,
        nick_name: "",
        start_time: "",
        end_time: "",
      },
      formScreendate:['',''],
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var that = this;
      that.listLoading = true
      let data = that.formScreen;
      data.start_time = that.formScreendate[0]
      data.end_time = that.formScreendate[1]
      getWaterList(data).then((response) => {
        console.log("获取流水", response);
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
  },
};
</script>

<style lang="scss" scoped>
.water {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .pagination-box {
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
