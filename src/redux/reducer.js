/**
 * desc：  行为管理操作
 * author：DestinyJun
 * date：  2021/1/26 22:06
 */
import {IS_LOADING_HIDDEN, IS_LOADING_SHOW, IS_LOGIN, NO_LOGIN} from "./actionType";

// loading加载控制
export function LoadingReducer(state={
  isLoading: false,
  isLogin: false
}, action) {
  switch (action.type){
    case IS_LOADING_SHOW:
      state.isLoading = action.value;
      return state;
    case IS_LOADING_HIDDEN:
      state.isLoading = action.value;
      return state;
    case IS_LOGIN:
      state.isLogin = action.value;
      return state;
    case NO_LOGIN:
      state.isLogin = action.value;
      return state;
    default:
      return state
  }




}
