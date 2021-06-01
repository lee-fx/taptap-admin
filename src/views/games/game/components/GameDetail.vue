<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写游戏信息"></el-step>
      <el-step title="上传游戏文件"></el-step>
      <el-step title="填写游戏属性"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <game-info-detail v-show="showStatus[0]" v-model="gameParam" :is-edit="isEdit" @nextStep="nextStep">
    </game-info-detail>
    <game-sale-detail v-show="showStatus[1]" v-model="gameParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep">
    </game-sale-detail>
    <game-attr-detail v-show="showStatus[2]" v-model="gameParam" :is-edit="isEdit" @nextStep="nextStep" @prevStep="prevStep">
    </game-attr-detail>
    <game-relation-detail v-show="showStatus[3]" v-model="gameParam" :is-edit="isEdit" @prevStep="prevStep" @finishCommit="finishCommit">
    </game-relation-detail>
  </el-card>
</template>
<script>
import GameInfoDetail from "./GameInfoDetail";
import GameSaleDetail from "./GameUploadDetail";
import GameAttrDetail from "./GameAttrDetail";
import GameRelationDetail from "./GameRelationDetail";
import { createGame, getGame, updateGame } from "@/api/game";

const defaultGameParam = {

  // 游戏名称
  name: "",
  brandId: null,

  albumPics: "",
  brandName: "",
  deleteStatus: 0,
  description: "",
  detailDesc: "",
  detailHtml: "",
  detailMobileHtml: "",
  detailTitle: "",
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: "",
  lowStock: 0,

  newStatus: 0,
  note: "",
  originalPrice: 0,
  pic: "",
  //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  //商品满减
  productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
  //商品阶梯价格
  productLadderList: [{ count: 0, discount: 0, price: 0 }],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  //商品属性相关{productAttributeId: 0, value: ''}
  productAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  skuStockList: [],
  //商品相关专题{subjectId: 0}
  subjectProductRelationList: [],
  //商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaProductRelationList: [],
  productCategoryId: null,
  productCategoryName: "",
  productSn: "",
  promotionEndTime: "",
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: "",
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: "",
  sort: 0,
  stock: 0,
  subTitle: "",
  unit: "",
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0,
};
export default {
  name: "GameDetail",
  components: {
    GameInfoDetail,
    GameSaleDetail,
    GameAttrDetail,
    GameRelationDetail,
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
        this.gameParam = response.data;
      });
    }
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm("是否要提交该产品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (isEdit) {
          updateGame(this.$route.query.id, this.gameParam).then(
            (response) => {
              this.$message({
                type: "success",
                message: "提交成功",
                duration: 1000,
              });
              this.$router.back();
            }
          );
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


