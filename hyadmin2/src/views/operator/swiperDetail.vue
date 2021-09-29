<template>
  <div class="app-container swiperDetail-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="轮播名称">
        <el-input v-model="formData.banner_name" type="text" />
      </el-form-item>
      <el-form-item label="轮播图片">
        <el-upload class="avatar-uploader" :action="baseURL+'/system/upload'" :headers="{'token': `${token}`}" :show-file-list="false" :on-success="handleAvatarSuccess">
          <img v-if="formData.banner_pic" :src="formData.banner_pic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model.number="formData.banner_priority" type="number" />
        <el-alert title="数值越大排位靠前，最大值999" type="info" show-icon>
        </el-alert>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="formData.banner_url" type="text" />
      </el-form-item>
      <el-form-item>
        <el-button type="" size="medium" @click="GLOBAL.$backPage">返回</el-button>
        <el-button type="primary" size="medium" :loading="buttonLoading" @click="setData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSwiperDetail, setSwiper } from "@/api/operator";
export default {
  name: "SwiperDetail",
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      formData: {
        banner_name: "",
        banner_priority: "",
        banner_pic: "",
        banner_id: "",
        banner_url:""
      },
      buttonLoading: false,
    };
  },
  mounted() {
    var that = this;
    console.log(that.$route.query.id);
    if (that.$route.query.id) {
      that.formData.banner_id = that.$route.query.id;
      that.getData();
    }
  },
  methods: {
    getData() {
      var that = this;
      getSwiperDetail({ banner_id: that.formData.banner_id }).then(
        (response) => {
          console.log("获取轮播详情", response);
          that.formData = response.data;
        }
      );
    },
    setData() {
      var that = this;
      var data = that.formData;
      that.buttonLoading = true;
      setSwiper(data)
        .then((response) => {
          console.log("保存轮播详情", response);
          that.$message({
            message: "保存成功",
            type: "success",
          });
          setTimeout(() => {
            that.$router.go(-1);
          }, 600);
          that.buttonLoading = false;
        })
        .catch((error) => {
          that.buttonLoading = false;
        });
    },
    handleAvatarSuccess(res, file) {
      var that = this;
      console.log(file);
      if (file.response.code == 2) {
        //导入失败
        var type = "warning";
      } else {
        var type = "success";
        that.formData.banner_pic = that.baseURL + file.response.data.file_path;
      }
      that.$message({
        message: file.response.message,
        type: type,
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

<style lang="scss">
.line {
  text-align: center;
}
.swiperDetail-container {
  .el-input,
  .el-textarea {
    width: 300px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: contain;
  }
  .el-alert--info.is-light{
    background: transparent;
    padding-left: 0;
  }
}
</style>

