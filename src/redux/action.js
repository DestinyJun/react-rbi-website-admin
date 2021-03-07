/**
 * desc：  行为事件
 * author：DestinyJun
 * date：  2021/1/26 22:14
 */
import {IS_LOADING_HIDDEN, IS_LOADING_SHOW, IS_LOGIN, NO_LOGIN} from "./actionType";

/**
 * loading状态管理
 * @returns {{type: string, value}}
 */
// loading显示
export function loadingShow() {
  return {type: IS_LOADING_SHOW, value: true}
}
// loading隐藏
export function loadingHidden(value) {
  return {type: IS_LOADING_HIDDEN, value: false}
}
// 已登录
export function isLogin(value) {
  return {type: IS_LOGIN, value: true}
}
// 未登录
export function noLogin(value) {
  return {type: NO_LOGIN, value: false}
}
