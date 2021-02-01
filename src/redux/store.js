/**
 * desc：  存储全局状态
 * author：DestinyJun
 * date：  2021/1/26 21:55
 */
import {createStore} from "redux";
import {LoadingReducer} from "./reducer";

// loading加载控制
export const LoadingStore = createStore(LoadingReducer)
