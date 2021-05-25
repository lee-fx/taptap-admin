<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.gameName" placeholder="游戏名称"></el-input>
          </el-form-item>
          <el-form-item label="游戏公司：">
            <el-select v-model="listQuery.brandId" placeholder="请选择" clearable>
              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddGame()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>

        <el-table-column type="selection" width="60" align="center"></el-table-column>

        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="ICON" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.icon"></template>
        </el-table-column>
        <el-table-column label="游戏名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="游戏公司" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.company}}</p>
            <p>简称：{{scope.row.company_tag}}</p>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">
            <p>
              <el-switch @change="handlePublishStatusChange(scope.$index, scope.row)" :active-value="0" :inactive-value="1" v-model="scope.row.status">
              </el-switch>
            </p>
            <!-- <p>新品：
              <el-switch @change="handleNewStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch @change="handleRecommendStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.recommandStatus">
              </el-switch>
            </p> -->
          </template>
        </el-table-column>
        <el-table-column label="评星" width="100" align="center">
          <template slot-scope="scope">{{scope.row.mana}}</template>
        </el-table-column>
        <el-table-column label="关注" width="100" align="center">
          <template slot-scope="scope">{{scope.row.attention}}</template>
        </el-table-column>
        <el-table-column label="版本" width="100" align="center">
          <template slot-scope="scope">{{scope.row.gameVersion}}</template>
        </el-table-column>
        <el-table-column label="大小" width="100" align="center">
          <template slot-scope="scope">{{scope.row.gameSize}}</template>
        </el-table-column>
        <el-table-column label="描述" width="120" align="center">
          <template slot-scope="scope">{{scope.row.gameDesc.slice(0,8)  + '...'}}</template>
        </el-table-column>
        <el-table-column label="标签" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowGameTagEditDialog(scope.row.id)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <!-- <p>
              <el-button size="mini" @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>

    // 分页
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10,20,50]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑游戏标签" :visible.sync="editGameTagInfo.dialogVisible" width="40%">
      <!-- <el-table style="width: 100%;margin-top: 20px" :data=editGameTagInfo.tagList border>
        <el-table-column label="名称" width="200" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.tagName"></el-input>
          </template>
        </el-table-column>
      </el-table> -->
      <!-- <el-checkbox-group v-model="selectServiceList">

        <el-table style="width: 100%;margin-top: 20px" :data=editGameTagInfo.tagList border>
          <el-table-column label="名称" width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.tagName"></el-input>
              <el-checkbox :label="scope.row.tagid">scope.row.tagName</el-checkbox>
            </template>
          </el-table-column>
        </el-table>

      </el-checkbox-group> -->

      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedTages" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in tages" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editGameTagInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
// 引入接口
import {
  fetchList,
  gameTags,
  gameTagListByGameId,
  
  // updateDeleteStatus,
  // updateNewStatus,
  // updateRecommendStatus,
  // updatePublishStatus,
} from "@/api/game";

// import { fetchList as fetchProductAttrList } from "@/api/productAttr";
// import { fetchList as fetchBrandList } from "@/api/brand";
// import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  gameName: "",
  pageNum: 1,
  pageSize: 10,
  // publishStatus: null,
  // verifyStatus: null,
  // productSn: null,
  // productCategoryId: null,
  // gameCompon: null,
};

const cityOptions = ["上海", "北京", "广州", "深圳"];

export default {
  name: "gameList",
  data() {
    return {
      editGameTagInfo: {
        dialogVisible: false, // 标签对话框打开
        tagList: [],
        // productId: null,
        // productSn: "",
        // productAttributeCategoryId: null,
        // stockList: [],
        // productAttr: [],
        // keyword: null,
      },
      checkAll: false, // 复选框
      checkedTages: [], // 选择的游戏标签
      tages: [], // 所有的游戏标签
      isIndeterminate: true,
      // 删除选项
      operates: [
        {
          label: "游戏上架",
          value: "publishOn",
        },
        {
          label: "游戏下架",
          value: "publishOff",
        },
        {
          label: "移入回收站",
          value: "recycle",
        },
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
    };
  },
  created() {
    this.getList();
    // this.getBrandList();
    // this.getProductCateList();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    },
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleShowGameTagEditDialog(gid) {
      // 显示对话框
      this.editGameTagInfo.dialogVisible = true;

      // console.log(gid);

      gameTags().then((response) => {
        console.log(response.data);
        this.editGameTagInfo.tages = response.data;
      });

      gameTagListByGameId({ game_id: gid }).then((response) => {
        console.log(response.data);
        this.editGameTagInfo.checkedTages = response.data;
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then((response) => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id,
          });
        }
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 添加游戏
    handleAddGame() {
      this.$router.push({ path: "/games/addGame" });
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateNewStatus(row.newStatus, ids);
    },
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "/pms/updateProduct", query: { id: row.id } });
    },
    handleShowProduct(index, row) {
      console.log("handleShowProduct", row);
    },
    handleShowVerifyDetail(index, row) {
      console.log("handleShowVerifyDetail", row);
    },
    handleShowLog(index, row) {
      console.log("handleShowLog", row);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("newStatus", newStatus);
      updateNewStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("recommendStatus", recommendStatus);
      updateRecommendStatus(params).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000,
        });
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then((response) => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000,
        });
      });
      this.getList();
    },
    handleEditSkuConfirm() {
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: "暂无sku信息",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateSkuStockList(
          this.editSkuInfo.productId,
          this.editSkuInfo.stockList
        ).then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    },
  },
};
</script>
<style></style>


