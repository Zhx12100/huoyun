<template>
  <div class="waybillList waybillList-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-form ref="form" :inline="true" label-width="auto" size="medium">
      <el-form-item label="订单编号">
        <el-input v-model="formScreen.order_no" />
      </el-form-item>
      <el-form-item label="产品类型">
        <el-select v-model="formScreen.transport_way" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="陆运" :value="1" />
          <el-option label="空运" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="formScreen.status" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="待付款" :value="0" />
          <el-option label="待运输" :value="1" />
          <el-option label="运输中" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="已取消" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单用户">
        <el-input v-model="formScreen.nick_name" />
      </el-form-item>
      <el-form-item label="支付状态">
        <el-select v-model="formScreen.pay_flag" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="未支付" :value="false" />
          <el-option label="已支付" :value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="开票状态">
        <el-select v-model="formScreen.invoice_flag" placeholder="">
          <el-option label="全部" value="" />
          <el-option label="待开票" :value="0" />
          <el-option label="已开票" :value="1" />
        </el-select>
      </el-form-item>

      <el-button
        type="primary"
        :loading="listLoading"
        @click="getList"
        size="medium"
        >查询</el-button
      >
      <el-button type="warning" @click="piliangExport" size="medium"
        >批量导出</el-button
      >
      <el-button type="" @click="allExport" size="medium"
        >全部导出</el-button
      >
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      ref="multipleTable"
      element-loading-text="Loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_id }}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_no }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.transport_way }}
        </template>
      </el-table-column>
      <el-table-column label="提货方式" align="center">
        <template slot-scope="scope">
          {{ scope.row.delivery_way }}
        </template>
      </el-table-column>
      <el-table-column label="发货区域" align="center">
        <template slot-scope="scope">
          {{ scope.row.origin_area }}
        </template>
      </el-table-column>
      <el-table-column label="收货区域" align="center">
        <template slot-scope="scope">
          {{ scope.row.target_area }}
        </template>
      </el-table-column>
      <el-table-column label="订单总额" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_fee }}
        </template>
      </el-table-column>
      <el-table-column label="下单用户" align="center">
        <template slot-scope="scope">
          <img class="nick_image" :src="scope.row.head_image" alt="" />
          <span>{{ scope.row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.pay_flag ? "已支付" : "未支付" }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoice_flag ? "已开票" : "待开票" }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="操作"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            @click="getDetail(scope.row.order_id)"
            >订单详情</el-tag
          >
          <el-tag
            type="warning"
            v-if="scope.row.status == '待支付' || scope.row.status == '待运输'"
            @click="cancelOrder(scope.row.order_id)"
            size="small"
            >取消订单</el-tag
          >
          <el-tag
            v-if="scope.row.status == '待运输'"
            size="small"
            @click="openDriver(0, scope.row.order_id)"
            >填写信息</el-tag
          >
          <el-tag
            v-if="scope.row.status == '运输中'"
            size="small"
            @click="openDriver(1, scope.row.order_id)"
            >更新信息</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-box"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="formScreen.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="formScreen.page_len"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      title="订单详情"
      class="detail-box"
      :visible.sync="dialogVisibleDetail"
      width="600px"
    >
      <el-form ref="form" label-width="120px">
        <el-form-item label="订单编号：">
          {{ detail.order_no }}
        </el-form-item>
        <el-form-item label="下单时间：">
          {{ detail.create_time }}
        </el-form-item>
        <el-form-item label="产品类型：">
          {{ detail.transport_way }}
        </el-form-item>
        <el-form-item label="发货地址：">
          {{ detail.origin_address.address }}
        </el-form-item>
        <el-form-item label="发货人：">
          {{ detail.origin_address.name }} {{ detail.origin_address.phone }}
        </el-form-item>
        <el-form-item label="收货地址：">
          {{ detail.target_address.address }}
        </el-form-item>
        <el-form-item label="收货人：">
          {{ detail.target_address.name }} {{ detail.target_address.phone }}
        </el-form-item>
        <el-form-item label="送货跟踪：" v-if="detail.status == '运输中'">
          <p>
            <span>负责司机：</span> <span>{{ detail.driver_info.name }}</span>
          </p>
          <p>
            <span>联系电话：</span> <span>{{ detail.driver_info.phone }}</span>
          </p>
          <p>
            <span>车辆号码：</span> <span>{{ detail.driver_info.plate }}</span>
          </p>
        </el-form-item>
        <el-form-item label="货物详情：">
          <p>
            <span>货物名称：</span> <span>{{ detail.freight_name }}</span>
          </p>
          <p>
            <span>包装方式：</span> <span>{{ detail.freight_wrap }}</span>
          </p>
          <p>
            <span>总重量：</span> <span>{{ detail.weight }}</span>
          </p>
          <p>
            <span>总体积：</span> <span>{{ detail.volume }}</span>
          </p>
        </el-form-item>
        <el-form-item label="订单总额：">
          {{ detail.order_fee }}
        </el-form-item>
        <el-form-item label="订单备注：">
          {{ detail.note }}
        </el-form-item>
        <el-form-item label="下单用户：">
          {{ detail.nick_name }}
        </el-form-item>
        <el-form-item label="支付状态：">
          {{ detail.pay_flag ? "已支付" : "未支付" }}
        </el-form-item>
        <el-form-item label="订单状态：">
          {{ detail.status }}
        </el-form-item>
        <el-form-item label="开票状态：">
          {{ detail.invoice_flag ? "已开票" : "待开票" }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="driverTitle"
      class="driver-box"
      :visible.sync="dialogVisibleEditAdd"
      width="600px"
    >
      <el-form ref="form" label-width="auto" size="medium">
        <el-form-item label="负责司机：">
          <el-input v-model="driverForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input type="number" v-model="driverForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="车辆号码：">
          <el-input v-model="driverForm.plate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisibleEditAdd = false"
          >取 消</el-button
        >
        <el-button size="medium" type="primary" @click="setDriver"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getWaybillList,
  getWaybillDetail,
  setWaybillDriver,
  cancelWaybill,
  exportWaybill,
} from "@/api/waybill";
export default {
  name: "WaybillList",
  data() {
    return {
      list: null,
      listLoading: true,
      baseURL: process.env.VUE_APP_BASE_API,
      dialogVisibleDetail: false,
      dialogVisibleEditAdd: false,
      formScreen: {
        order_no: "",
        transport_way: "",
        pay_flag: "",
        nick_name: "",
        status: "",
        invoice_flag: "",
        page: 1,
        page_len: 10,
      },
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      detail: {
        origin_address: {},
        target_address: {},
      },
      driverTitle: "",
      driverForm: {
        name: "",
        phone: "",
        plate: "",
      },
      driverId: "",
    };
  },
  created() {
    
    if(this.$route.params.ids){
      console.log(this.$route.params.ids)
      // this.piliangExport2(this.$route.params.ids)
      this.getList(this.$route.params.ids);
    }else{
      this.getList();
    }
  },
  methods: {
    getList(ids) {
      var that = this;
      that.listLoading = true;
      let data = that.formScreen;
      if(ids){
        data.order_ids = ids
      }
      getWaybillList(data).then((response) => {
        console.log("获取订单列表", response);
        that.listLoading = false;
        that.list = response.data.result;
        that.total = response.data.data_sum;
      });
    },
    getDetail(id) {
      var that = this;
      getWaybillDetail({ order_id: id }).then((response) => {
        console.log("获取订单详情", response);
        // that.dialogVisibleDetail = false;
        that.dialogVisibleDetail = true;
        that.detail = response.data;
      });
    },
    openDriver(type, order_id) {
      let that = this;
      that.driverId = order_id;
      if (type == 0) {
        that.driverTitle = "填写信息";
        that.dialogVisibleEditAdd = true;
      } else {
        that.driverTitle = "更新信息";
        getWaybillDetail({ order_id: order_id }).then((response) => {
          console.log("获取订单详情", response);
          that.driverForm.name = response.data.driver_info.name;
          that.driverForm.phone = response.data.driver_info.phone;
          that.driverForm.plate = response.data.driver_info.plate;
          that.dialogVisibleEditAdd = true;
        });
      }
    },
    setDriver() {
      var that = this;
      let data = that.driverForm;
      data.order_id = that.driverId;
      if (!data.name || !data.phone || !data.plate) {
        that.$message({
          showClose: true,
          message: "请填写完整信息",
          type: "warning",
        });
        return false;
      }
      setWaybillDriver(data).then((response) => {
        console.log("更新信息", response);
        that.dialogVisibleEditAdd = false;
        that.$message({
          showClose: true,
          message: "更新成功",
          type: "success",
        });
        that.formScreen.page = 1;
        that.getList();
      });
    },
    cancelOrder(id) {
      let that = this;
      this.$confirm("确认取消此订单吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          cancelWaybill({ order_id: id }).then((response) => {
            console.log("取消订单", response);
            that.$message({
              showClose: true,
              message: "取消订单成功",
              type: "success",
            });
            that.formScreen.page = 1;
            that.getList();
          });
        })
        .catch(() => {});
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

    //全部导出
    allExport() {
      let that = this;
      var data = {
        nick_name: that.formScreen.nick_name,
        order_no: that.formScreen.order_no,
        transport_way: that.formScreen.transport_way,
        pay_flag: that.formScreen.pay_flag,
        status: that.formScreen.status,
        invoice_flag: that.formScreen.invoice_flag,
        order_ids: []
      }
      exportWaybill(data).then((response) => {
        console.log("全部导出", response);
        if(response.code==0){
          window.location.href = that.baseURL + response.data.url
        }
      });
    },
    //批量导出
    piliangExport() {
      let that = this;
      if(that.multipleSelection.length==0){
        that.$message({
          showClose: true,
          message: "请选择要导出的订单",
          type: "warning",
        });
        return false
      }
      var data = {
        nick_name: '',
        order_no: '',
        transport_way: '',
        pay_flag: '',
        status: '',
        invoice_flag: '',
        order_ids: that.multipleSelection.map(item => {
          return item.order_id
        })
      }
      exportWaybill(data).then((response) => {
        console.log("批量导出", response);
        if(response.code==0){
          window.location.href = that.baseURL + response.data.url
          that.multipleSelection = []
          that.$refs.multipleTable.clearSelection();
        }
      });
    },
    //关联订单导出
    // piliangExport2(ids){
    //   let that = this;
    //   var data = {
    //     nick_name: '',
    //     order_no: '',
    //     transport_way: '',
    //     pay_flag: '',
    //     status: '',
    //     invoice_flag: '',
    //     order_ids: ids
    //   }
    //   exportWaybill(data).then((response) => {
    //     console.log("关联订单导出", response);
    //     // return false
    //     if(response.code==0){
    //       window.location.href = that.baseURL + response.data.url
    //     }
    //   });
    // },
    //表格多选
    handleSelectionChange(val) {
      console.log("val", val);
      let that = this;
      this.multipleSelection = val;
    },
    getSwitchStatus: function (status) {
      console.log(status);
      switch (status) {
        case 0:
          return "待付款";
        case 1:
          return "待运输";
        case 2:
          return "运输中";
        case 3:
          return "已完成";
        case 4:
          return "已取消";
        case 5:
          return "（待）开票";
        case 6:
          return "历史开票";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.waybillList {
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
.detail-box {
  .el-form-item {
    margin-bottom: 0;
  }
  p {
    line-height: 32px;
    margin: 5px 0;
    // display: flex;
    // justify-content: space-between;
  }
}
.driver-box {
  .el-form {
    width: 80%;
    margin: 0 auto;
  }
  .el-form .el-form-item:last-child {
    margin-bottom: 0;
  }
}
.pagination-box {
  text-align: center;
  margin-top: 20px;
}
</style>
