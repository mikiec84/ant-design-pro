import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: '测试页',
        path: 'test',
      },
    ],
  },
  {
    name: 'market',
    icon: 'bank',
    path: 'market',
    children: [
      {
        name: '指数',
        path: 'index',
      },
      {
        name: '行业',
        path: 'industry',
      },
      {
        name: '申万',
        path: 'sw',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: '上海',
        path: 'sh',
      },
      {
        name: 'NHNL',
        path: 'nhnl',
      },
      {
        name: '破净率',
        path: 'broken',
      },
      {
        name: 'IPO',
        path: 'ipo',
      },
      {
        name: 'IPO Yearly',
        path: 'ipo-yearly',
      },
      {
        name: '涨跌停比率',
        path: 'zdr',
      },
      {
        name: 'CIX',
        path: 'cix',
      },
    ],
  },
  {
    name: 'stock',
    icon: 'bank',
    path: 'stock',
    children: [
      {
        name: '个股',
        path: 'equity',
      },
      {
        name: '组合',
        path: 'portfolio',
      },
      {
        name: '组合历史',
        path: 'portfolio-history',
      },
      {
        name: '神奇公式',
        path: 'magic',
      },
      {
        name: '分红',
        path: 'dividend',
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
