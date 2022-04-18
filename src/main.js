import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios  from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import  NProgress from 'nprogress'
import  'nprogress/nprogress.css'


Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  NProgress.start();
  console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config
})
Vue.filter('dateFormat',function(orginVal){
 const dt=new Date(orginVal);
 const y=dt.getFullYear();
 const m=(dt.getMonth()+1+'').padStart(2,'0');
 const d=(dt.getDate()+'').padStart(2,'0');
 const hh=(dt.getHours()+'').padStart(2,'0');
 const mm=(dt.getMinutes()+'').padStart(2,'0');
 const ss=(dt.getSeconds()+'').padStart(2,'0');
 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.$http=axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
