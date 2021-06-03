<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="gameInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="游戏名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="游戏公司：" prop="tag_id">
        <el-select v-model="value.tag_id" @change="handleGameChange" placeholder="请选择">
          <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="游戏介绍：" prop="description">
        <el-input :autoSize="true" v-model="value.description" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="初始评星：">
        <el-input v-model="value.mana"></el-input>
      </el-form-item>
      <el-form-item label="初始关注：">
        <el-input v-model="value.attention"></el-input>
      </el-form-item>
      <el-form-item label="游戏包版本：">
        <el-input v-model="value.game_version"></el-input>
      </el-form-item>
      <el-form-item label="游戏状态：">
        <el-switch v-model="value.status" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>

      <el-form-item label="游戏标签：">

        <el-checkbox-group v-model="selectTagList">
          <el-checkbox v-for="tag in tags" :label="tag.id" :key="tag.id" :value="tag.id">{{tag.tagName}}</el-checkbox>
        </el-checkbox-group>

      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('gameInfoForm')">下一步，上传游戏信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchListWithChildren } from "@/api/productCate";
import { fetchList as fetchCompanyList } from "@/api/company";
import { getGame, gameTags } from "@/api/game";

export default {
  name: "GameInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasEditCreated: false,
      // 公司列表
      companyOptions: [],

      checkedTags: [], // 选择的游戏标签
      tags: [], // 所有的游戏标签

      rules: {
        name: [
          { required: true, message: "请输入游戏名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入游戏介绍", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    gameTags().then((response) => {
      // console.log(response.data);
      this.tags = response.data;
    });
  },
  computed: {
    //商品的编号
    gameId() {
      return this.value.id;
    },
    //选中的服务保证
    selectTagList: {
      get() {
        let list = [];
        if (
          this.value.game_tag_ids === undefined ||
          this.value.game_tag_ids == null ||
          this.value.game_tag_ids === ""
        )
          return list;
        let ids = this.value.game_tag_ids.split(",");
        for (let i = 0; i < ids.length; i++) {
          list.push(Number(ids[i]));
        }
        return list;
      },
      set(newValue) {
        let game_tag_ids = "";
        if (newValue != null && newValue.length > 0) {
          for (let i = 0; i < newValue.length; i++) {
            game_tag_ids += newValue[i] + ",";
          }
          if (game_tag_ids.endsWith(",")) {
            game_tag_ids = game_tag_ids.substr(0, game_tag_ids.length - 1);
          }
          this.value.game_tag_ids = game_tag_ids;
        } else {
          this.value.game_tag_ids = null;
        }
      },
    },
  },
  watch: {
    gameId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
  },
  methods: {
    //处理编辑逻辑
    getGameCompanyList() {
      fetchCompanyList({ pageNum: 1, pageSize: 100 }).then((response) => {
        this.companyOptions = [];
        let gameList = response.data.list;
        // console.log(gameList)
        for (let i = 0; i < gameList.length; i++) {
          this.companyOptions.push({
            label: gameList[i].name,
            value: gameList[i].id,
          });
        }
      });
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    handleGameChange(val) {
      let companyName = "";
      for (let i = 0; i < this.companyOptions.length; i++) {
        if (this.companyOptions[i].value === val) {
          companyName = this.companyOptions[i].label;
          break;
        }
      }
      this.value.companyName = companyName;
    },
  },
};
</script>

<style scoped>
</style>
