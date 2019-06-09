import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/pages/index'
import PageNotFound from '@/pages/404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'is-active',
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
        requiresVisitor:true,
        title: 'Skills - MyApp'
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
              path: 'login',
              name: 'LoginPage',
              meta:{
                title: 'Skills - MyApp'
              },
              component: () => import('@/components/login')
            },
            {
              path: 'register',
              name: 'RegisterPage',
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
              path: '',
              name: 'DashboardPage',
              component: () => import('@/pages/admin/DashboardPage'),
              meta:{
                requiresAuth:true
              },
            },
            {
              path: 'AddSchool',
              name: 'AddSchool',
              component: () => import('@/pages/admin/school/AddSchool'),
              meta:{
                requiresAuth:true
              },
            },
            {
              path: 'AllSchools',
              name: 'AllSchools',
              component: () => import('@/pages/admin/school/Schools'),
              meta:{
                requiresAuth:true
              }
            },
            {
              path: 'School/:id',
              name: 'School',
              props:true,
              component: () => import('@/pages/admin/school/Schools'),
              meta:{
                requiresAuth:true
              }
            },
            {
              path: 'EditSchool/:id',
              name: 'EditSchool',
              props:true,
              component: () => import('@/pages/admin/school/EditSchool'),
              meta:{
                requiresAuth:true
              }
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
