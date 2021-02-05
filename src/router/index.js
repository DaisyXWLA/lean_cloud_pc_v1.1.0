import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/system/user/list'], resolve),
        name: 'list',
        meta: { title: '积分调整列表', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type',
        component: (resolve) => require(['@/views/system/type/index'], resolve),
        name: 'type',
        meta: { title: '提案类别' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'area',
        component: (resolve) => require(['@/views/system/area/index'], resolve),
        name: 'area',
        meta: { title: '区域管理' }
      }
    ]
  },
  {
    path: '/integralMall',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'commodityManage',
        component: (resolve) => require(['@/views/integralMall/commodityManage/index'], resolve),
        name: 'commodityManage',
        meta: { title: '商品管理' }
      }  
    ]
  },
  {
    path: '/integralMall',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'integralManage',
        component: (resolve) => require(['@/views/integralMall/integralManage/index'], resolve),
        name: 'integralManage',
        meta: { title: '订单管理' }
      }  
    ]
  },
  {
    path: '/integralMall',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'bonusPoints',
        component: (resolve) => require(['@/views/integralMall/bonusPoints/index'], resolve),
        name: 'bonusPoints',
        meta: { title: '额外积分奖励' }
      }  
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'buttonType',
        component: (resolve) => require(['@/views/system/buttonTypeManage/index'], resolve),
        name: 'buttonType',
        meta: { title: '按键类别' }
      }  
    ]
  },
  {
    path: '/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'buttonGroupType',
        component: (resolve) => require(['@/views/system/buttonGroupTypeManage/index'], resolve),
        name: 'buttonGroupType',
        meta: { title: '按键组类别' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'abnormalButton',
        component: (resolve) => require(['@/views/abnormalManage/buttonManage/index'], resolve),
        name: 'abnormalButton',
        meta: { title: '异常按键' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'abnormalButtonGroup',
        component: (resolve) => require(['@/views/abnormalManage/buttonGroupManage/index'], resolve),
        name: 'abnormalButtonGroup',
        meta: { title: '异常按键组' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'addButton',
        component: (resolve) => require(['@/views/abnormalManage/buttonManage/add'], resolve),
        name: 'addButton',
        meta: { title: '新增异常按键' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'modifyButton/:id(\\d+)',
        component: (resolve) => require(['@/views/abnormalManage/buttonManage/modify'], resolve),
        name: 'modifyButton',
        meta: { title: '修改异常按键' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'addButtonGroup',
        component: (resolve) => require(['@/views/abnormalManage/buttonGroupManage/add'], resolve),
        name: 'addButtonGroup',
        meta: { title: '新增异常按键组' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'modifyButtonGroup/:id(\\d+)',
        component: (resolve) => require(['@/views/abnormalManage/buttonGroupManage/modify'], resolve),
        name: 'modifyButtonGroup',
        meta: { title: '修改异常按键组' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'abnormalList',
        component: (resolve) => require(['@/views/abnormalManage/abnormalList/index'], resolve),
        name: 'abnormalList',
        meta: { title: '异常列表' }
      }  
    ]
  },
  {
    path: '/abnormalManage',          
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'abnormalDetail/:id(\\d+)',
        component: (resolve) => require(['@/views/abnormalManage/abnormalList/detail'], resolve),
        name: 'abnormalDetail',
        meta: { title: '异常详情' }
      }  
    ]
  },
  {
    path: '/equipmentManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'equipment',
        component: (resolve) => require(['@/views/equipmentManage/equipment/index'], resolve),
        name: 'equipment',
        meta: { title: '设备管理' }
      }  
    ]
  },
  {
    path: '/noticeManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'notice',
        component: (resolve) => require(['@/views/noticeManage/notice/index'], resolve),
        name: 'notice',
        meta: { title: '通知公告' }
      }  
    ]
  },
  {
    path: '/configuration',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'configList',
        component: (resolve) => require(['@/views/configuration/abnormal/index'], resolve),
        name: 'configList',
        meta: { title: '配置列表' }
      }  
    ]
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'boardManage',
        component: (resolve) => require(['@/views/abnormalManage/boardManage/index'], resolve),
        name: 'boardManage',
        meta: { title: '看板列表' }
      }  
    ]
  },
  {
    path: '/boardList',
    component: (resolve) => require(['@/views/boardList'], resolve),
    hidden: true
  },
  {
    path: '/abnormalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'statistics',
        component: (resolve) => require(['@/views/abnormalManage/statistics/index'], resolve),
        name: 'statistics',
        meta: { title: '数据报表' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'proposal',
        component: (resolve) => require(['@/views/proposalManage/proposal/index'], resolve),
        name: 'proposal',
        meta: { title: '提案列表' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'firstInstance',
        component: (resolve) => require(['@/views/proposalManage/firstInstance/index'], resolve),
        name: 'firstInstance',
        meta: { title: '提案一审' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'secondInstance',
        component: (resolve) => require(['@/views/proposalManage/secondInstance/index'], resolve),
        name: 'secondInstance',
        meta: { title: '提案二审' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'standard/:id/:scores',
        component: (resolve) => require(['@/views/proposalManage/standard/index'], resolve),
        name: 'standard',
        meta: { title: '评审标准' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'scoreList/:id/:resultId',
        component: (resolve) => require(['@/views/proposalManage/standard/list'], resolve),
        name: 'scoreList',
        meta: { title: '评分列表' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'official',
        component: (resolve) => require(['@/views/proposalManage/standard/official'], resolve),
        name: 'official',
        meta: { title: '评审标准(正式)' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'group',
        component: (resolve) => require(['@/views/proposalManage/group/index'], resolve),
        name: 'group',
        meta: { title: '评审标准(草稿)' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'statistics',
        component: (resolve) => require(['@/views/proposalManage/statistics/index'], resolve),
        name: 'statistics',
        meta: { title: '统计报表' }
      }  
    ]
  },
  {
    path: '/proposalManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'scoreDetail/:resultId',
        component: (resolve) => require(['@/views/proposalManage/standard/detail'], resolve),
        name: 'scoreDetail',
        meta: { title: '评分详情' }
      }  
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
