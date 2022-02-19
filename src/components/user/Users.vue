<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片 -->
<el-card class="box-card">
      <!-- 搜索和添加-->

 <el-row :gutter="20">
  <el-col :span="8"> 
     <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"> 
    <el-button  @click="getUserList" slot="append" icon="el-icon-search"></el-button>
  </el-input>  </el-col>
  <el-col :span="3">
      <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
  </el-col>
</el-row>

<!-- 用户列表 -->
<el-table :data='userList' border stripe>
     <el-table-column type='index' ></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
   <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
           <el-switch v-model="scope.row.mg_state" @change='stateChange(scope.row)'></el-switch>
   </template>
   </el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
<el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size='mini'></el-button>
<!-- 删除按钮 -->
<el-button  @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size='mini'></el-button>
<!-- 分配角色按钮 -->
  <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
<el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
</el-tooltip>
        </template>
      </el-table-column>
</el-table>

 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 对话框组件  :visible.sync(设置是否显示对话框) width(设置对话框的宽度)
:before-close(在对话框关闭前触发的事件) -->
<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
  @close='dialogClosed'
  >
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
      <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog> 

<!-- 修改用户对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
  >
<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    <el-form-item label="用户名">
      <!-- disabled禁用 -->
        <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>

    </div>
</template>
<script>
export default{
    created(){
        this.getUserList();
    },
data(){
  var checkEmail=(rule,value,cb)=>{
   const regEmail= /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
   if(regEmail.test(value)){
     return cb();
   }
   else 
   cb(new Error('请输入合法邮箱'))
  }
    var checkMobile=(rule,value,cb)=>{
   const regMobile= /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
   if(regMobile.test(value)){
     return cb();
   }
   else 
   cb(new Error('请输入合法手机号'))
  }
    return{
      //获取用户列表的参数对象
      queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2
      },
      userList:[],
      total:0,
      //控制对话框的显示和隐藏
      dialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单的验证规则对象
      addFormRules:{
        username:[
          {
            required:true,
            message:'请输入用户名',
            trigger:"blur"
          },
          {
            min:3,
            max:10,
            message: '长度在 3 到 15 个字符', 
            trigger: 'blur' 
          }
        ],
        password:[     {
            required:true,
            message:'请输入密码',
            trigger:"blur"
          },
          {
            min:6,
            max:15,
            message: '长度在 6 到 15 个字符', 
            trigger: 'blur' 
          }],
          email:[ {
            required:true,
            message:'请输入邮箱',
            trigger:"blur"
          },
          {
            validator:checkEmail,
            trigger:'blur'
          }],
          mobile:[     { required:true,
            message:'请输入手机号',
            trigger:"blur"
          },
              {
            validator:checkMobile,
            trigger:'blur'
          }
            
          ]
      },
      //控制修改用户对话框的显示与否
editDialogVisible: false,
//修改用户的表单数据
editForm: {
    username: '',
    email: '',
    mobile: ''
},
//修改表单的验证规则
 editFormRules:{
        username:[
          {
            required:true,
            message:'请输入用户名',
            trigger:"blur"
          },
          {
            min:3,
            max:10,
            message: '长度在 3 到 15 个字符', 
            trigger: 'blur' 
          }
        ],
        password:[     {
            required:true,
            message:'请输入密码',
            trigger:"blur"
          },
          {
            min:6,
            max:15,
            message: '长度在 6 到 15 个字符', 
            trigger: 'blur' 
          }],
          email:[ {
            required:true,
            message:'请输入邮箱',
            trigger:"blur"
          },
          {
            validator:checkEmail,
            trigger:'blur'
          }],
          mobile:[     { required:true,
            message:'请输入手机号',
            trigger:"blur"
          },
              {
            validator:checkMobile,
            trigger:'blur'
          }
            
          ]
      },
    }
},
methods:{
   async getUserList(){
const {data:res}= await this.$http.get('users',{params:this.queryInfo});
if(res.meta.status!==200){
 this.$message.error("获取用户列表失败");
}
this.userList=res.data.users ;
this.total=res.data.total;
console.log(res)
},
handleSizeChange(newSize){
this.queryInfo.pagesize=newSize;
this.getUserList();
},
handleCurrentChange(newPage){
this.queryInfo.pagenum=newPage;
this.getUserList();
},
 async stateChange(userinfo){
const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
if(res.meta.status!==200){
  userinfo.mg_state=! userinfo.mg_state
  this.$message.error("更新状态失败")
}
else
  this.$message.success("更新状态成功")
},
  // 监听对话框的关闭事件
      dialogClosed(){
           this.$refs.addFormRef.resetFields()
      },
      addUser(){
      this.$refs.addFormRef.validate( async valid => {
          if(!valid) return this.$message.error("请填写完整用户信息");
          //发送请求完成添加用户的操作
          const {data:res} = await this.$http.post("users",this.addForm)
          //判断如果添加失败，就做提示
          if (res.meta.status !== 201)
              return this.$message.error('添加用户失败')
          //添加成功的提示
          this.$message.success("添加用户成功")
          //关闭对话框
          this.addDialogVisible = false
          //重新请求最新的数据
          this.getUserList()
      })
  },
  //展示编辑用户的对话框
   async showEditDialog(id){
     //发送请求根据id获取用户信息
    const { data: res } = await this.$http.get('users/' + id)
    //判断如果添加失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
    //将获取到的数据保存到数据editForm中
    this.editForm = res.data
    //显示弹出窗
    this.editDialogVisible = true
  },
  //表单验证重置
  editDialogClosed(){
    this.$refs.editFormRef.resetFields();
  },
editUserInfo() {
    //用户点击修改表单中的确定按钮之后，验证表单数据
    this.$refs.editFormRef.validate(async valid => {
    if (!valid) return this.$message.error('请填写完整用户信息')
    //发送请求完成修改用户的操作
    const { data: res } = await this.$http.put(
        'users/' + this.editForm.id,
        this.editForm
    )
    if (res.meta.status !== 200) return this.$message.error('修改用户失败')
    this.$message.success('修改用户成功')
    //关闭对话框
    this.editDialogVisible = false
    //重新请求最新的数据
  this.getUserList()
    })
},
//根据id删除对应用户信息
 async removeUserById(id){
  const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>{
        return err 
      })
       //发送请求根据id完成删除操作
    const {data:res} = await this.$http.delete('users/'+id)
    //判断如果删除失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('删除用户失败')
    //修改成功的提示
    this.$message.success('删除用户成功')
    //重新请求最新的数据
    this.getUserList()
}
}
}

</script>

<style lang="less" scoped>

</style>