<template>
  <div class="water-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form :inline="true" :model="formScreen" label-width="auto" size="medium">
      <el-form-item label="用户">
        <el-input v-model="formScreen.nick_name" />
      </el-form-item>
      <el-form-item label="开票申请时间">
        <el-date-picker v-model="formScreendate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="warning" @click="allExport" size="medium">导出</el-button>
      <el-button type="primary" :loading="listLoading" @click="getList" size="medium">查询</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.invoice_id }}
        </template>
      </el-table-column>
      <el-table-column label="用户对象" align="center">
        <template slot-scope="scope">
          <img class="nick_image" :src="scope.row.head_image" alt="">
          <span>{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="抬头类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoice_head }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司税务号" align="center">
        <template slot-scope="scope">
          {{ scope.row.company_ein }}
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoice_fee }}
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.accept_email }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">
          {{ scope.row.accept_phone }}
        </template>
      </el-table-column>
      <el-table-column label="开票申请时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            @click="relevanceOrder(scope.row.order_ids)"
            >关联订单</el-tag
          >
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
import { getInvoiceList,exportInvoice } from "@/api/waybill";
export default {
  name: "Water",
  data() {
    return {
      list: [],
      listLoading: true,
      formScreen: {
        page: 1,
        page_len: 10,
        nick_name: "",
        start_time: "",
        end_time: "",
      },
      formScreendate:['',''],
      pageSize: 10,
      total: 0,
      baseURL: process.env.VUE_APP_BASE_API,
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
      getInvoiceList(data).then((response) => {
        console.log("获取开票列表", response);
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
    relevanceOrder(ids){
      let that = this
      that.$router.push({
        name: "WaybillList",
        params: {
          ids: ids,
        },
      });
    },
    //全部导出
    allExport() {
      let that = this;
      let data = that.formScreen;
      data.start_time = that.formScreendate[0]
      data.end_time = that.formScreendate[1]
      exportInvoice(data).then((response) => {
        console.log("导出", response);
        if(response.code==0){
          window.location.href = that.baseURL + response.data.url
        }
      });
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
