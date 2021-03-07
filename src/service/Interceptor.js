/**
 * axios拦截器
 */
import axios from 'axios';
import {loadingHidden, loadingShow} from "../redux/action";
import {message} from "antd";
import {getObject} from "./sessionStorage";
import {HashRouter} from "react-router-dom";
import {Store} from "../redux/store";

// 组件外路由跳转
const router = new HashRouter()

// 配置全局请求地址
axios.defaults.baseURL = 'http://127.0.01:8090/admin'

//设置的请求次数，请求的间隙
// axios.defaults.retry = 4;
// axios.defaults.retryDelay = 1000;

// 无需验证的请求地址
const skipUrl = [
  `/login`,
];

// 登录状态码
const statusArr = ['1001','1002','1003','1004','1005','1006'];


// 全局设置超时时间
axios.defaults.timeout = 10000;

// 请求拦截
axios.interceptors.request.use(
  function (config) {
    // 加载loading
    Store.dispatch(loadingShow())
    // 配置token
    if (!(skipUrl.includes(config.url))) {
      config.headers['token'] = getObject('token');
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  function (response) {
    // 隐藏loading
    Store.dispatch(loadingHidden())
    if (statusArr.includes(response.data.status)) {
      message.error(response.data.message)
      router.replace('/login')
      return Promise.reject(response.data);
    }
    switch (response.data.status) {
      case 1000:
        message.success(response.data.message);
        return Promise.resolve(response.data)
      case 2000:
        message.success(response.data.message);
        return Promise.resolve(response.data)
      case 3000:
        message.success(response.data.message);
        return Promise.resolve(response.data)
      case 4000:
        message.success(response.data.message);
        return Promise.resolve(response.data)
      case 5000:
        return Promise.resolve(response.data)
      default:
        message.error(response.data.message)
        return Promise.reject(response.data);
    }
  },
  function (err) {
    loadingHidden();
    if (err.message.includes('timeout')) {
      message.error('请求超时，请稍后重试！')
    }
    if (err.message.includes('Network')) {
      message.error('连接网络失败，请检查网络连接是否正常！')
    }
    return Promise.reject(err);
  }
);

// 封装post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  });
}

// 封装get请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err)
      })
  });
}
