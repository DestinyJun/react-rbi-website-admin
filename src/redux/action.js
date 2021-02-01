/**
 * desc：  行为事件
 * author：DestinyJun
 * date：  2021/1/26 22:14
 */
import {IS_LOADING_HIDDEN, IS_LOADING_SHOW} from "./actionType";

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
