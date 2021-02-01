/**
 * desc：  api维护模块
 * author：DestinyJun
 * date：  2021/2/1 17:23
 */

/**
 * 系统初始化接口
 * @type {{MENU_LIST: string}}
 */
export const LayoutApi = {
  MENU_LIST: '/rule/findMenuTree', // 初始化菜单
}

/**
 * 权限接口
 * @type {{MENU_LIST: string}}
 */
export const RuleApi = {
  GET_RULE_TREE: '/rule/findTree', // 获取权限树
}
