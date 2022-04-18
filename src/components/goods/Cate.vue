<template>
    <div>
 <!-- 面包屑 -->
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片区域-->
<el-card>
    <el-row >
        <el-col >
            <el-button type="primary" @click='showAddCateDialog'>添加分类</el-button> 
        </el-col>
    </el-row>   
    <!-- 表格区域-->
  <tree-table  class="treetable" :data="cateList" :columns="columns" :selection-type="false"
:expand-type="false" show-index index-text="序号" border :show-row-hover="false">
<!-- 是否有效 -->
<template slot="isok" slot-scope="scope">
  <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
  <i class="el-icon-error" v-else style="color:red"></i>
  </template>
<!-- 排序 -->
<template slot="order" slot-scope="scope">
  <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
  <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
  <el-tag size="mini" type="warning" v-else>三级</el-tag>
  </template>
<!-- 操作 -->
<template slot="opt" slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">
    </el-button>
    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">
    </el-button>

  </template>
</tree-table>
<!-- 分页 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>
<!-- 添加对话框 -->
<!-- 添加分类对话框 -->
<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
  <!-- 添加分类表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类" prop="cat_pid">
      <!-- 级联选择器 -->
      <!-- options用来指定数据源，props用来指定配置对象 -->
       <el-cascader  v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-form-item>
</el-dialog>


 <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
    <el-form
             :model="editCateForm"
             :rules="editCateFormRules"
             ref="editCateFormRef"
             label-width="100px"
             >
        <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
    </span>
</el-dialog>

 </div>
</template>



<script>
    export default {
        data(){
             return {
  // 商品分类数据列表
      cateList: [],
      //查询分类数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //保存总数据条数
      total: 0,
    columns: [
    {label:'分类名称',prop:'cat_name'},
      {label:'是否有效',prop:'',type:'template',template:'isok'},
    {label:'排序',prop:'',type:'template',template:'order'},
    {label:'操作',prop:'',type:'template',template:'opt'}
],
addCateDialogVisible: false,
addCateForm:{
  //分类名称
  cat_name:'',
  //添加分类的父级id，0则表示父级为0.添加一级分类
  cat_pid:0,
  //添加分类的等级，0则表示添加一级分类
  cat_level:0
},
//添加分类校验规则
addCateFormRules:{
  //验证规则
  cat_name:[ {required:true , message:'请输入分类名称',trigger:'blur'} ]
},
parentCateList:[],
//配置级联菜单中数据如何展示
cascaderProps:{
  value:'cat_id',
  label:'cat_name',
  children:'children',
  expandTrigger:'hover'
},
//绑定用户选择的分类值
selectedKeys:[],
editCateDialogVisible: false,
editCateFormRules: {
    cat_name: [
        {required: true, message: '请输入分类名称', trigger: 'blur'}
    ]
},
editCateForm: ''
             }
},
   created(){
this.getCateList();
        },
        methods:{
                  //获取商品分类数据
 async getCateList() {

      const { data: res } = await this.$http.get('categories', { params:this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      //将数据列表赋值给cateList
      this.cateList = res.data.result
      //保存总数据条数
      this.total = res.data.total
    },
        //当pagesize发生改变时触发
  handleSizeChange(newSize){
    this.queryInfo.pagesize = newSize;
    this.getCateList();
  },
      //当pagesize发生改变时触发
  handleCurrentChange(newPage){
    this.queryInfo.pagenum = newPage;
    this.getCateList();
  },
  showAddCateDialog(){
       this.getParentCateList()
   this.addCateDialogVisible=true;
  },
    //获取父级分类数据列表
  async getParentCateList(){
  const { data: res } = await this.$http.get('categories', {
    params: {type:2}
  })

  if (res.meta.status !== 200) {
    return this.$message.error('获取商品分类列表数据失败')
  }
  this.parentCateList = res.data
},
//级联菜单中选择项发生变化时触发
parentCateChange(){
    console.log(this.selectedKeys)
    //如果用户选择了父级分类
    if(this.selectedKeys.length > 0){
      //则将数组中的最后一项设置为父级分类
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      //level也要跟着发生变化
      this.addCateForm.cat_level = this.selectedKeys.length
      return
    }else{
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      return
    }
  },
      //当关闭添加分类对话框时，重置表单
  addCateDialogClosed(){
    this.$refs.addCateFormRef.resetFields();
    this.selectedKeys = [];
    this.addCateForm.cat_pid = 0
    this.addCateForm.cat_level = 0
  },
  addCate() {
    //点击确定，完成添加分类
    this.$refs.addCateFormRef.validate(async valid => {
      if (!valid) return
      //发送请求完成添加分类
      const { data: res } = await this.$http.post(
        'categories',
        this.addCateForm
      )

      if (res.meta.status !== 201) {
        return this.$message.error('添加分类失败')
      }

      this.$message.success('添加分类成功')
      this.getCateList()
      this.addCateDialogVisible = false
    })
  },
 async showEditCateDialog(id) {
    const {data: res} = await this.$http.get('categories/' + id)
    if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
    this.editCateForm = res.data
    this.editCateDialogVisible = true
},
eidtCate() {
    this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {cat_name: this.editCateForm.cat_name})
        if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
        this.$message.success('更新分类名成功！')
        this.getCateList()
        this.editCateDialogVisible = false
    })
},


  async removeCate(id) {
      const confirRustle = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirRustle !== 'confirm') {
        return this.$message.info('已取消删除操作!')
      }

      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('分类删除失败!')
      }
      this.$message.success('该分类已经成功删除!')
      this.getCateList()
    }
  }
        }
    
    
</script>

<style lang="less" scoped>
.treetable{
    margin-top: 15px;
}
.el-cascader {
  width:100%
}
</style>