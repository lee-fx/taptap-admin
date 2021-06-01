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
            <el-select v-model="listQuery.companyId" placeholder="请选择" clearable>
              <el-option v-for="item in companyOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-table-column label="游戏公司" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.company}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">
            <p>
              <el-switch @change="handleGameStatusChange(scope.$index, scope.row)" :active-value="0" :inactive-value="1" v-model="scope.row.status">
              </el-switch>
            </p>
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

              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10,20,50]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑游戏标签" :visible.sync="editGameTagInfo.dialogVisible" width="40%">
      <el-checkbox :indeterminate="editGameTagInfo.isIndeterminate" v-model="editGameTagInfo.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="editGameTagInfo.checkedTags" @change="handleCheckedTagesChange">
        <el-checkbox v-for="tag in editGameTagInfo.tags" :label="tag.id.toString()" :key="tag.id.toString()" :value="tag.id.toString()">{{tag.tagName}}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editGameTagInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditGameTagConfirm">确 定</el-button>
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
  updateGameTagList,
  updateGameStatus,
} from "@/api/game";

import { fetchList as fetchCompanyList } from "@/api/company";

const defaultListQuery = {
  gameName: "",
  pageNum: 1,
  pageSize: 10,
  companyId: 0,
};

export default {
  name: "gameList",
  data() {
    return {
      editGameTagInfo: {
        game_id: 0,
        dialogVisible: false, // 标签对话框打开
        checkAll: false, // 复选框
        checkedTags: [], // 选择的游戏标签
        tags: [], // 所有的游戏标签
        isIndeterminate: true,
        stockList: [], // 复选框暂存数组
      },
      companyOptions: [],
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      // 删除选项
      operates: [
        {
          label: "游戏关闭",
          value: "gameOff",
        },
        {
          label: "游戏开启",
          value: "gameOn",
        },
        {
          label: "移入回收站",
          value: "recycle",
        },
      ],
      operateType: null,

      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
    };
  },
  created() {
    this.getList();
    this.getCompanyList();
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
    // 全选按钮
    handleCheckAllChange() {
      if (
        this.editGameTagInfo.checkedTags.length !=
        this.editGameTagInfo.tags.length
      ) {
        let lag = this.editGameTagInfo.tags.map((item) => item.tagName);
        this.editGameTagInfo.checkedTags = lag;
      } else {
        this.editGameTagInfo.checkedTags = [];
      }
    },

    // 选中与取消选中
    handleCheckedTagesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.editGameTagInfo.tags.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.editGameTagInfo.tags.length;
    },

    // 点击修改game tag
    handleShowGameTagEditDialog(gid) {
      // 显示对话框
      this.editGameTagInfo.dialogVisible = true;
      this.editGameTagInfo.game_id = gid;

      // console.log(gid);

      gameTags().then((response) => {
        // console.log(response.data);
        this.editGameTagInfo.tags = response.data;
      });

      gameTagListByGameId({ game_id: gid }).then((response) => {
        // console.log(response.data);
        this.editGameTagInfo.checkedTags = response.data;
        this.editGameTagInfo.stockList = response.data;
      });
    },

    // 获取游戏信息
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },

    // 获取公司列表
    getCompanyList() {
      fetchCompanyList({ pageNum: 1, pageSize: 100 }).then((response) => {
        this.companyOptions = [];
        let companyList = response.data.list;
        for (let i = 0; i < companyList.length; i++) {
          this.companyOptions.push({
            label: companyList[i].name,
            value: companyList[i].id,
          });
        }
      });
    },

    // 获取游戏列表
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },

    // 添加游戏
    handleAddGame() {
      this.$router.push({ path: "/games/addGame" });
    },

    //
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
          message: "请选择要操作的游戏",
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
        console.log(this.operateType);
        switch (this.operateType) {
          case this.operates[0].value:
            this.updateGameStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updateGameStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
    },

    // 分页
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 批量操作
    handleGameStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateGameStatus(row.status, ids);
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

    // 修改游戏状态
    updateGameStatus(gameStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("gameStatus", gameStatus);
      updateGameStatus(params).then((response) => {
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

    // 修改游戏标签
    handleEditGameTagConfirm() {
      if (
        this.editGameTagInfo.stockList.toString() ==
        this.editGameTagInfo.checkedTags.toString()
      ) {
        this.$message({
          message: "暂无修改",
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
        // console.log(this.editGameTagInfo.checkedTags)
        updateGameTagList(this.editGameTagInfo.game_id, {
          tagNames: this.editGameTagInfo.checkedTags.toString(),
        }).then((response) => {
          this.editGameTagInfo.stockList = this.editGameTagInfo.checkedTags;
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
          this.editGameTagInfo.dialogVisible = false;
        });
      });
    },

  },
};
</script>
<style></style>


