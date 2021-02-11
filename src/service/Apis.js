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
  ADD_RULE: '/rule/add', // 权限添加
  DEL_RULE: '/rule/del', // 权限删除
  UPDATE_RULE: '/rule/update', // 权限修改
  GET_RULE_TREE: '/rule/findTree', // 获取权限树
  GET_RULE_ACTION: '/ruleAction/findAll', // 获取权限标识
}

/**
 * 权限标识接口
 * @type {{MENU_LIST: string}}
 */
export const RuleActionApi = {
  ADD_RULE_ACTION: '/ruleAction/add', // 权限行为添加
  DEL_RULE_ACTION: '/ruleAction/del', // 权限行为删除
  UPDATE_RULE_ACTION: '/ruleAction/update', // 权限行为修改
  GET_RULE_ACTION: '/ruleAction/findAll', // 获取行为标识
}

/**
 * 栏目管理接口
 * @type {{MENU_LIST: string}}
 */
export const ColumnApi = {
  ADD_COLUMN: '/column/add', // 权限添加
  DEL_COLUMN: '/column/del', // 权限删除
  UPDATE_COLUMN: '/column/update', // 权限修改
  GET_COLUMN_TREE: '/column/findTree', // 获取权限树
}
