<template>
  <div class="waybillManagement-container waybillManagement">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form ref="form" :inline="true" label-width="auto" size="medium">
      <el-form-item label="省份">
        <el-input v-model="formScreen.province" />
      </el-form-item>
      <el-form-item label="城市">
        <el-input v-model="formScreen.city" />
      </el-form-item>
      <el-button type="primary" :loading="listLoading" @click="getActive(activeName)" size="medium">查询</el-button>
      <el-button type="warning" @click="exportData" :loading="exportLoading" size="medium">导出</el-button>
      <el-upload class="upload-demo" 
        style="display:inline-block;margin-left: 10px;" 
        :action="baseURL+'/admin/order/import_excel'" 
        :headers="{'token': `${token}`}"
        :on-success="importData"
        :show-file-list="false">
        <el-button type="success" size="medium">导入</el-button>
      </el-upload>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleTypeClick">
      <el-tab-pane label="陆运1" name="ly1">
        <el-table v-loading="listLoading" :data="listLy1" element-loading-text="Loading">
          <el-table-column label="ID" align="center" width="55">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="原寄省" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_province }}
            </template>
          </el-table-column>
          <el-table-column label="原寄市" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.origin_city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="原寄区" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_region }}
            </template>
          </el-table-column>
          <el-table-column label="目的省" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_province }}
            </template>
          </el-table-column>
          <el-table-column label="目的市" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.target_city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目的区" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_region }}
            </template>
          </el-table-column>
          <el-table-column label="流向" align="center">
            <template slot-scope="scope">
              {{ scope.row.flow }}
            </template>
          </el-table-column>
          <el-table-column label="轻抛系数" align="center">
            <template slot-scope="scope">
              {{ scope.row.throw_coefficient }}
            </template>
          </el-table-column>
          <el-table-column label="首重(公斤)" align="center">
            <template slot-scope="scope">
              {{ scope.row.first_weight }}
            </template>
          </el-table-column>
          <el-table-column label="最大重量(公斤)" align="center">
            <template slot-scope="scope">
              {{ scope.row.max_weight }}
            </template>
          </el-table-column>
          <el-table-column label="首重价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.first_price }}
            </template>
          </el-table-column>
          <el-table-column label="续重价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.extend_price }}
            </template>
          </el-table-column>
          <el-table-column label="自提地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系人" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系电话" align="center">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column label="送货费用" align="center">
            <template slot-scope="scope">
              {{ scope.row.delivery_price }}
            </template>
          </el-table-column>
          <el-table-column label="T29承诺失效" align="center">
            <template slot-scope="scope">
              {{ scope.row.promise_time }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="陆运2" name="ly2">
        <el-table v-loading="listLoading" :data="listLy2" element-loading-text="Loading">
          <el-table-column label="ID" align="center" width="55">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="原寄省" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_province }}
            </template>
          </el-table-column>
          <el-table-column label="原寄市" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.origin_city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="原寄区" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_region }}
            </template>
          </el-table-column>
          <el-table-column label="目的省" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_province }}
            </template>
          </el-table-column>
          <el-table-column label="目的市" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.target_city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目的区" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_region }}
            </template>
          </el-table-column>
          <el-table-column label="流向" align="center">
            <template slot-scope="scope">
              {{ scope.row.flow }}
            </template>
          </el-table-column>
          <el-table-column label="轻抛系数" align="center">
            <template slot-scope="scope">
              {{ scope.row.throw_coefficient }}
            </template>
          </el-table-column>
          <el-table-column label="最大重量" align="center">
            <template slot-scope="scope">
              {{ scope.row.max_weight }}
            </template>
          </el-table-column>
          <el-table-column label="最低单票价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.min_price }}
            </template>
          </el-table-column>
          <el-table-column label="单价" align="center">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="自提地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系人" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系电话" align="center">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column label="送货费用" align="center">
            <template slot-scope="scope">
              {{ scope.row.delivery_price }}
            </template>
          </el-table-column>
          <el-table-column label="T29承诺失效" align="center">
            <template slot-scope="scope">
              {{ scope.row.promise_time }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="空运" name="ky">
        <el-table v-loading="listLoading" :data="listKy" element-loading-text="Loading">
          <el-table-column label="ID" align="center" width="55">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="原寄省" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_province }}
            </template>
          </el-table-column>
          <el-table-column label="原寄市" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_city }}
            </template>
          </el-table-column>
          <el-table-column label="原寄区" align="center">
            <template slot-scope="scope">
              {{ scope.row.origin_region }}
            </template>
          </el-table-column>
          <el-table-column label="目的省" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_province }}
            </template>
          </el-table-column>
          <el-table-column label="目的市" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_city }}
            </template>
          </el-table-column>
          <el-table-column label="目的区" align="center">
            <template slot-scope="scope">
              {{ scope.row.target_region }}
            </template>
          </el-table-column>
          <el-table-column label="流向" align="center">
            <template slot-scope="scope">
              {{ scope.row.flow }}
            </template>
          </el-table-column>
          <el-table-column label="最低运费" align="center">
            <template slot-scope="scope">
              {{ scope.row.min_price }}
            </template>
          </el-table-column>
          <el-table-column label="45+" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_45 }}
            </template>
          </el-table-column>
          <el-table-column label="100+" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_100 }}
            </template>
          </el-table-column>
          <el-table-column label="300+" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_300 }}
            </template>
          </el-table-column>
          <el-table-column label="500+" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_500 }}
            </template>
          </el-table-column>
          <el-table-column label="1000+" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_1000 }}
            </template>
          </el-table-column>
          <el-table-column label="自提地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系人" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="自提点联系电话" align="center">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column label="送货费用" align="center">
            <template slot-scope="scope">
              {{ scope.row.delivery_price }}
            </template>
          </el-table-column>
          <el-table-column label="T29承诺失效" align="center">
            <template slot-scope="scope">
              {{ scope.row.promise_time }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-pagination class="pagination-box" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formScreen.page" :page-sizes="[10, 20, 50, 100]" :page-size="formScreen.page_len"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getManagementLy1,
  getManagementLy2,
  getManagementKy,
  exportExcel
} from "@/api/waybill";
export default {
  name: "WaybillManagement",
  data() {
    return {
      listLy1: null,
      listLy2: null,
      listKy: null,
      listLoading: false,
      exportLoading:false,
      formScreen: {
        openid: "",
        page: 1,
        page_len: 10,
        nick_name: "",
        freeze_flag: "",
      },
      pageSize: 10,
      total: 0,
      activeName: "ly1",
      baseURL: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    this.getActive(this.activeName);
  },
  methods: {
    getActive(paneName) {
      var that = this;
      console.log(paneName)
      that.formScreen.page = 1;
      switch (paneName) {
        case "ly1":
          that.getListLy1();
          break;
        case "ly2":
          that.getListLy2();
          break;
        case "ky":
          that.getListKy();
          break;
      }
    },
    getListLy1() {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      getManagementLy1(data).then((response) => {
        console.log("获取陆运1列表", response);
        that.listLoading = false;
        that.listLy1 = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    getListLy2() {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      getManagementLy2(data).then((response) => {
        console.log("获取陆运2列表", response);
        that.listLoading = false;
        that.listLy2 = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    getListKy() {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      getManagementKy(data).then((response) => {
        console.log("获取空运列表", response);
        that.listLoading = false;
        that.listKy = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      var that = this;
      that.formScreen.page_len = val;
      that.getActive(this.activeName);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      var that = this;
      that.formScreen.page = val;
      that.getActive();
    },

    //切换面板
    handleTypeClick(tab, event) {
      console.log(tab, event);
      var that = this;
      that.getActive(tab.paneName);
    },
    //导入文件
    importData(file) {
      console.log(file);
      var that = this
      if(file.code==2){//导入成功
        var type = 'warning'
      }else{
        var type = 'success'
      }
      that.$message({
        message: file.message,
        type: type
      });
    },
    //导出文件
    exportData() {
      var that = this;
      that.exportLoading = true;
      exportExcel({}).then((response) => {
        console.log("导出文件", response);
        that.exportLoading = false;
        window.location.href = that.baseURL + response.data.file_path
      });
    },
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
  },
};
</script>

<style lang="scss" scoped>
.waybillManagement {
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
