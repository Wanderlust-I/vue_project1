<template>
<<<<<<< HEAD
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
=======
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <span>电商管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边区域 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="togglebutton" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#0078D4"
          :unique-opened=true
          :collapse="isCollapse"
          :collapse-transition=false
          :router="true"
        :default-active="activePath"
        >
          <el-submenu
            :index="String(item.id)"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+child.path"
              v-for="child in item.children"
              :key="child.id"
              @click="saveState('/'+child.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
           <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconlist: {
        125: "el-icon-user-solid",
        103: "el-icon-s-check",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      isCollapse:false,
      activePath:''
    };
  },
  created() {
    this.getMenulist();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
>>>>>>> ad1dd2c7fd35baebdecd6cde148c8e0f7537ceb5
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
<<<<<<< HEAD
  },
}; 
</script>

<style lang="less" scoped>
=======
    async getMenulist() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      else this.menulist = res.data;
      console.log(res);
    },
    //点击按钮切换折叠和展开
 toggleCollapse(){
this.isCollapse=!this.isCollapse;
 },
   saveState(activePath){
  window.sessionStorage.setItem('activePath',activePath);
  this.activePath=activePath;
}
  },

};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: lavender;
  font-size: 30px;
}
.el-container {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.home-container {
  height: 100%;
}
.el-menu{
  border-right:none;
}
.togglebutton{
  background-color: #485162;
  text-align: center;
  font-size:15px ;
  color:white;
  letter-spacing: 3px;  //设置字符间空白
  cursor: pointer;
}
>>>>>>> ad1dd2c7fd35baebdecd6cde148c8e0f7537ceb5
</style>