<template>
    <div>
<!-- 面包屑 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区  -->
<el-card>
    <el-row :gutter="20">
        <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
        <el-col :sapn="4"></el-col>
    </el-row>
     <el-table :data="goodslist" stripe border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
             @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
</el-card>

<el-dialog title="修改商品" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editGoodsForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
           <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
      </el-dialog>


    </div>
</template>

<script>
export default {
    data(){
        return {
            // 查询参数对象
 queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0,
      editDialogVisible:false,
      editGoodsForm:''

        }
    },
    created(){
 this.getGoodsList();
    },
    methods:{
 async getGoodsList(){
  const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
   if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total;
},
handleSizeChange(newsize){
  this.queryInfo.pagesize = newSize;
      this.getGoodsList();
},
  handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async removeById(id){
          this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
     .then(async () => {
          const { data } = await this.$http.delete(`goods/${id}`);
          if (data.meta.status !== 200) {
            return this.$message.error(data.meta.msg);
          }
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    goAddPage(){
        this.$router.push('goods/add')
    },
   async showEditDialog(id) {
       
      const { data: res } = await this.$http.get(`goods/`+id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询商品数据失败~')
      }
      this.editGoodsForm = res.data
    this.editDialogVisible = true
      return this.$message.success('查询商品数据成功~')
    },
    editFormInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$http
          .put(`goods/`+this.editGoodsForm.goods_id ,
          this.editGoodsForm
          )
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改商品失败!')
            }
            this.$message.success('修改商品成功!')
            this.getGoodsList()
          })
        this.editDialogVisible = false
      })
    },
    }
}
</script>

<style lang="less" scoped>

</style>