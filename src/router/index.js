import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index.vue'
import formDesign from '@/components/formDesign/index.vue'
import chartDesign from '@/components/chartDesign/index.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      component: Index,
      children:[
        {
          path:'',
          name:'main',
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
          component:res => require(['@/components/main.vue'],res)
        },
        {
          path:'/datacenter',
          component: res => require(['@/components/dataCenter/index.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/datacenter/edit/:dataid',
          name: '数据编辑',
          component: res => require(['@/components/dataCenter/edit/Edit.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/formdesign',
          name:'formDesign',
          component: formDesign,
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/mapdesign',
          name: 'mapDesign',
          component: res => require(['@/components/mapDesign/index.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/mapdesign/render/:mapid',
          name: '地图编辑',
          component: res => require(['@/components/mapDesign/render/Render.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/mapdesign/preview/:mapid',
          name: '地图预览',
          component: res => require(['@/components/mapDesign/preview/Preview.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/formdesign/init/:id',
          name:'formdesigninit',
          component: res => require(['@/components/formDesign/FormIndex.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/mapdesign/new',
          component: res => require(['@/components/mapDesign/render/Render.vue'], res),
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        },
        {
          path:'/chartDesign',
          name:'chartDesign',
          component: chartDesign,
          meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
        }
//    		{
//    			   数据源中心
//    		}
      ]
    },
    { path: '/login', component: resolve => require(['../components/Login/Login.vue'], resolve) },
    { path: '/test',
      meta: {
        requireAuth: false, // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Index,
    },
    {
      path:'/appformpreview/:id',
      name:'appformpreview',
      meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
      component:res => require(['@/components/formDesign/preview/appformpreview.vue'],res)
    },
    {
      path:'/showformpreview/:id/:detail',
      name:'showformpreview',
      meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
      component:res => require(['@/components/formDesign/preview/showformpreview.vue'],res)
    },
     {
      path:'/share/form/:uuid',
      name:'shareform',
      meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
      component:res => require(['@/components/formDesign/share/index.vue'],res)
    },
    {
      path:'/share/map/:uuid',
      name: '地图分享',
      meta: {requireAuth: false,}, // 添加该字段，表示进入这个路由是需要登录的
      component:res => require(['@/components/mapDesign/share/Share.vue'],res)
    },
  ]
})
