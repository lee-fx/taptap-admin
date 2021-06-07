<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写游戏信息"></el-step>
      <el-step title="上传游戏文件"></el-step>
      <!-- <el-step title="填写游戏属性"></el-step> -->
      <!-- <el-step title="完成"></el-step> -->
    </el-steps>
    <game-info-detail v-show="showStatus[0]" v-model="gameParam" :is-edit="isEdit" @nextStep="nextStep">
    </game-info-detail>
    <Game-upload-detail v-show="showStatus[1]" v-model="gameParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep" @finishCommit="finishCommit">
    </Game-upload-detail>
  </el-card>
</template>
<script>
import GameInfoDetail from "./GameInfoDetail";
import GameUploadDetail from "./GameUploadDetail";
import {
  createGame,
  getGame,
  updateGame,
  gameTagListByGameId,
} from "@/api/game";

const defaultGameParam = {
  //
  // 游戏基础信息
  id: 0,
  name: "",
  mana: "0",
  attention: "0",
  image: {},
  file: {},
  description: "",
  game_size: "0",
  game_version: "1.0.1",
  status: 0,
  company_id: 0,
  game_tag_ids: "",
  fileList: [],
};
export default {
  name: "GameDetail",
  components: {
    GameInfoDetail,
    GameUploadDetail,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: 0,
      gameParam: Object.assign({}, defaultGameParam),
      showStatus: [true, false, false, false],
    };
  },
  created() {
    if (this.isEdit) {
      getGame(this.$route.query.id).then((response) => {
        console.log(response.data);
        let tmp = [];
        this.gameParam = response.data;
        if (response.data.file.url != "") {
          tmp.push(response.data.file);
          this.gameParam.fileList = tmp;
        }
      });
      // this.getGameCompanyList();
      gameTagListByGameId({ game_id: this.$route.query.id }).then(
        (response) => {
          // console.log(response.data);
          this.checkedTags = response.data;
        }
      );
    }
  },
  methods: {
    // 显示逻辑
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    // 上一步
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    // 下一步
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm("是否要提交该游戏", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (isEdit) {
          updateGame(this.gameParam).then((response) => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            this.$router.back();
          });
        } else {
          createGame(this.gameParam).then((response) => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            location.reload();
          });
        }
      });
    },
  },
};
</script>
<style>
.form-container {
  width: 800px;
}
</style>


