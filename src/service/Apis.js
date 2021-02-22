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
  ADD_COLUMN: '/column/add', // 栏目添加
  DEL_COLUMN: '/column/del', // 栏目删除
  UPDATE_COLUMN: '/column/update', // 栏目修改
  GET_COLUMN_TREE: '/column/findTree', // 获取栏目树
}

/**
 *  新闻类型管理
 * @type {{MENU_LIST: string}}
 */
export const NewsTypeApi = {
  ADD_NEWS_TYPE: '/newsType/add', // 新闻类型添加
  DEL_NEWS_TYPE: '/newsType/del', // 新闻类型删除
  UPDATE_NEWS_TYPE: '/newsType/update', // 新闻类型修改
  GET_NEWS_TYPE: '/newsType/findAll', // 新闻类型查询
}

/**
 *  友情连接类型管理
 * @type {{MENU_LIST: string}}
 */
export const FlinkTypeApi = {
  ADD_FLINK_TYPE: '/flinkType/add', // 友情连接类型添加
  DEL_FLINK_TYPE: '/flinkType/del', // 友情连接类型删除
  UPDATE_FLINK_TYPE: '/flinkType/update', // 友情连接类型修改
  GET_FLINK_TYPE: '/flinkType/findAll', // 友情连接类型查询
}

/**
 *  资源类型管理
 * @type {{MENU_LIST: string}}
 */
export const SourceTypeApi = {
  ADD_SOURCE_TYPE: '/sourceType/add', // 资源类型类型添加
  DEL_SOURCE_TYPE: '/sourceType/del', // 资源类型类型删除
  UPDATE_SOURCE_TYPE: '/sourceType/update', // 资源类型类型修改
  GET_SOURCE_TYPE: '/sourceType/findAll', // 资源类型类型查询
}

/**
 *  资源管理
 * @type {{MENU_LIST: string}}
 */
export const SourceApi = {
  ADD_SOURCE: '/source/upload', // 资源添加
  DEL_SOURCE: '/source/del', // 资源删除【根据URL删除】
  DEL_ID_SOURCE: '/source/delById', // 资源删除【根据ID删除】
  GET_SOURCE: '/source/findAll', // 资源查询
  GET_SOURCE_TYPE: '/sourceType/findAll', // 资源类型查询
}

/**
 *  新闻管理
 * @type {{MENU_LIST: string}}
 */
export const NewsApi = {
  ADD_NEWS: '/news/add', // 新闻添加
  DEL_NEWS: '/news/del', // 新闻删除
  UPDATE_NEWS: '/news/update', // 新闻修改
  GET_NEWS: '/news/findAll', // 新闻查询
  GET_SOURCE: '/source/findAll', // 资源列表查询
  GET_COLUMN_TREE: '/column/findTree', // 获取栏目树
  GET_NEWS_TYPE: '/newsType/findAll', // 新闻类型查询
  GET_NEWS_CONTENT: '/news/find', // 新闻内容查询
}

/**
 *  友情链接管理
 * @type {{MENU_LIST: string}}
 */
export const FlinkApi = {
  ADD_FLINK: '/flink/add', // 资源类型类型添加
  DEL_FLINK: '/flink/del', // 资源类型类型删除
  UPDATE_FLINK: '/flink/update', // 资源类型类型修改
  GET_FLINK: '/flink/findAll', // 资源类型类型查询
  GET_FLINK_TYPE: '/flinkType/findAll', // 资源类型类型查询
}

/**
 *  首页轮播图管理
 * @type {{MENU_LIST: string}}
 */
export const CarouselApi = {
  ADD_CAROUSE: '/carousel/add', // 首页轮播图添加
  DEL_CAROUSE: '/carousel/del', // 首页轮播图删除
  UPDATE_CAROUSE: '/carousel/update', // 首页轮播图修改
  GET_CAROUSE: '/carousel/findAll', // 首页轮播图查询
}

