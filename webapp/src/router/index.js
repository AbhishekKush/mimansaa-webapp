import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/pages/index'
import PageNotFound from '@/pages/404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
    },
    {
      path: '/auth', 
      name: 'auth',
      component: () => import('@/components/auth'),
      meta:{
        requiresVisitor:true
      },
      //props: true ,
       children: [
            {
              // UserProfile will be rendered inside User's <router-view>
              // when /user/:id/profile is matched
              path: '',
              redirect: { name: 'LoginPage' },
            },
            {
              // UserProfile will be rendered inside User's <router-view>
              // when /user/:id/profile is matched
              path: 'login',
              name: 'LoginPage',
              component: () => import('@/components/login')
            },
            {
              // UserProfile will be rendered inside User's <router-view>
              // when /user/:id/profile is matched
              path: 'register',
              name: 'RegisterPage',
              redirect: { name: 'foo' },
              component: () => import('@/components/register')
            },
          ]
    },
    { 
      path: '/admin', 
      name: 'admin',
      component: () => import('@/pages/admin/index'),
      props: true ,
      meta:{
        requiresAuth:true
      },
      //props: true ,
       children: [
            {
              // UserProfile will be rendered inside User's <router-view>
              // when /user/:id/profile is matched
              path: '',
              name: 'DashboardPage',
              component: () => import('@/pages/admin/DashboardPage'),
              meta:{
                requiresAuth:true
              },
            }
          ]
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
    }
  ]
})
