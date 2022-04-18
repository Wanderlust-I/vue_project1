<template>
    <div>    
     <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
    <el-row>
        <el-col>
            <el-button type="primary"  @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
    </el-row>
     <!-- 角色列表区域 -->
<!--如果这是一个嵌套的数据，rowkey 是必须添加的属性 -->
<el-table :data="roleList" border>
    <!-- expand添加展开列 -->
    <el-table-column type="expand">
        <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdtop': '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                 <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag> 
                  <i class="el-icon-caret-right"></i>
                </el-col>
                  <!-- 渲染二，三级权限 -->
                <el-col :span="19">
               <el-row  :class="['bdtop',i2===0? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                   <el-col :span="6">
                       <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}} </el-tag>
                         <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                          <el-tag closable @close="removeRightById(scope.row,item3.id)" v-for="(item3,i3) in item2.children" type='warning'>{{item3.authName}}</el-tag>
                        </el-col>    
               </el-row>
                </el-col>
            </el-row>         
    </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" width="300px">
        <template slot-scope="scope"> 
            <el-button  @click="showEditDialog(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button @click="rolesdelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button  @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
        </template>
    </el-table-column>
</el-table>
</el-card>

  <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDislogClosed">
      <el-form :model="addRolesForm" :rules="addFormRules" ref="addRolesForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>


<el-dialog
  title="修改角色"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
  >
<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
    <el-form-item label="角色名称"  prop='rolename'>
        <el-input v-model="editForm.roleName" ></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
    </el-form-item>
 
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed"
      width="50%"
      >
      <el-tree
        :data="rightsList"
        :default-checked-keys="defKeys"
        node-key="id"
        ref="treeRef"
        default-expand-all 
        show-checkbox
        :props="treeProps">
      </el-tree>
      <div slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>

    </div>
</template>

<script>
export default {
 data(){
    return{
        //所有角色列表数据
         roleList:[],
         //控制分配权限对话框的显示
         setRightDialogVisible:false,
         rightsList:[],
         treeProps:{
           label:'authName',
           children:'children'
         },
         defKeys:[],
         roleId:'',
         editForm:{
           roleName:'',
           roleDesc:''
    },
        editDialogVisible:false,
           addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible:false

    }
    
 },
 created(){
     this.getRoleList();
 },
 methods:{
      async getRoleList(){
         const {data:res}= await this.$http.get('roles');
          if(res.meta.status!==200)
          this.$message.error("获取角色列表失败");
          else{
                this.roleList=res.data;
          }
     },
       addRolesUser() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) 
          return this.$message.error('添加角色失败!')
        this.$message.success('添加角色成功!')
            this.addDialogVisible = false
        this.getRoleList()
    
      })
       },
       async showEditDialog(id){
    const { data: res } = await this.$http.get('roles/' + id)
    if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
    this.editForm = res.data
    this.editDialogVisible = true
  },
  editDialogClosed(){
    this.$refs.editFormRef.resetFields();
  },
editUserInfo() {
    this.$refs.editFormRef.validate(async valid => {
    if (!valid) return this.$message.error('请填写完整用户信息')
    const { data: res } = await this.$http.put(
        'roles/' + this.editForm.roleId,
        this.editForm
    )
    if (res.meta.status !== 200) return this.$message.error('修改用户失败')
    this.$message.success('修改用户成功')
    this.editDialogVisible = false
  this.getRoleList()
    })
},
    //  根据id删除对应的权限
      removeRightById(role,rightId) {
        //弹框提示用户是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if(data.meta.status!==200){
            return this.$message.error("删除权限失败")
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //会重新渲染页面，不建议使用
        //  this.getRoleList();
        //因此直接把服务器返回的最新数赋给当前角色的children属性
          role.children = data.data
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
async  showSetRightDialog(role){
       this.roleId=role.id;
     //获取所有权限数据
      const {data:res}= await this.$http.get('rights/tree')
      if(res.meta.status!==200)
      this.$message.error('获取失败')
      else{
           this.rightsList=res.data
      }
      this.getLeafKeys(role,this.defKeys);
        this.setRightDialogVisible=true
   },
   //通过递归的方式获取角色下所有三级权限的id,并保存到defkeys数组中
   getLeafKeys(node,arr){
if(!node.children){
      return arr.push(node.id)
}
else{
  node.children.forEach(element => {
this.getLeafKeys(element,arr)
  });
}
   },
   setRightDialogClosed(){
     this.defKeys=[];
   },
  async allotRights(){
     const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
     const idStr=keys.join(',')
       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200)
        return this.$message.error('分配角色失败')

      this.$message.success('分配角色成功')
      this.getRoleList();
 
      this.setRightDialogVisible = false
   },
    async rolesdelete(id) {
      const confirmRusult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 没有使用await
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已取消该删除操作')
      }
      this.$http.delete('roles/' + id).then(res => {
        const { data: response } = res
        if (response.meta.status !== 200) 
          return this.$message.error('该用户删除失败')
        this.$message.success('该用户已经删除')
        this.getRoleList()
      })
    },
 }
}
</script>

<style lang="less" scoped>
.el-tag{
 margin: 7px;
}
.bdtop{
border-top: 1px solid #eee;
}
.bdbottom{
border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>