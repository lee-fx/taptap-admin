<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="gameUploadForm" label-width="120px" style="width: 720px" size="small">
      
      <el-form-item label="游戏icon：">
        <el-upload class="avatar-uploader" :action="handleBeforUploadImg()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="value.image_url" :src="value.image_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="游戏包：">
        <el-upload :action="handleBeforUploadApk()" :on-preview="handlePreview" :before-upload="beforeFileUpload" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传apk文件，且不超过200Mb</div>
        </el-upload>
      </el-form-item>

      <br>
      <br>
      <br>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写游戏信息</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交游戏</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";
import Tinymce from "@/components/Tinymce";

export default {
  name: "GameUploadDetail",
  components: { SingleUpload, MultiUpload, Tinymce },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.value.image_url = URL.createObjectURL(file.raw);
      this.value.image_remote_url = res.data;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 上传图片
    handleBeforUploadImg() {
      return "http://localhost:7788/game/upload/icon/" + this.value.id;
    },

    // 上传文件
    handleBeforUploadApk() {
      return "http://localhost:7788/game/upload/apk/" + this.value.id;
    },

    beforeFileUpload(file) {
      console.log(file.type)
      const isApk = file.type === "application/vnd.android.package-archive";
      const isLt200M = file.size / 1024 / 1024 < 200;

      if (!isApk) {
        this.$message.error("上传头像图片只能是 APK 格式!");
      }
      if (!isLt200M) {
        this.$message.error("上传头像图片大小不能超过 200MB!");
      }
      return isApk && isLt200M;
    },

    // 删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    //
    handlePreview(file) {
      console.log(file);
    },

    // 选择限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 包文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },

    // 删除文件
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handlePrev() {
      this.$emit("prevStep");
    },
    handleNext() {
      this.$emit("nextStep");
    },
    handleFinishCommit() {
      this.$emit("finishCommit", this.isEdit);
    },
  },
};
</script>

<style scoped>
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-color: #409eff;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}

.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
</style>
