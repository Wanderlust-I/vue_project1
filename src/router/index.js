import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from "../components/Welcome.vue"
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)
const routes = [
  {path:'/',redirect:'/login'},//重定向
{path:'/login',component:Login},
{path:'/home',component:Home,redirect:'welcome',children:[
 { path:'/welcome',component:Welcome},
 {path:'/users',component:Users}
]}
]
const router = new VueRouter({
  routes
})

//挂载路由导航守卫
    router.beforeEach((to,from,next)=>{
      if(to.path==='/login')
      return next();
      else{
      const tokenStr=  window.sessionStorage.getItem("token");
      if(!tokenStr) 
      next('/login')
      else 
      next();
      }
    })

export default router
