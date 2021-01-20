/**
 * desc：  请求拦截器
 * author：DestinyJun
 * date：  2021/1/20 14:36
 */
import axios from 'axios';

// 配置全局请求地址
// axios.defaults.baseURL = 'http://127.0.01:8090/admin'

// 配置请求超时时间
axios.defaults.timeout = 3000;

// 请求拦截
axios.interceptors.request.use(
  function (config) {
  // 配置token
  config.headers['token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIhQCMkJSomIiwiYXVkIjoiIiwiaWF0IjoxNjA5MzIxNDMxLCJuYmYiOjE2MDkzMjE0MzQsImV4cCI6MTYxOTMyMTQzMSwiZGF0YSI6eyJ1aWQiOjEsInVpcCI6IjEyNy4wLjAuMSJ9fQ.thxpFMKoMEaMhx6p4mN-gDb-nfVwEmsSkFGUuz_9riY';
  console.log('我执行了哈哈11');
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
    console.log(response);
    //拦截响应，做统一处理
    if (response.data.code) {}
    return response
  },
  function (error) {
    console.log(error);
    // 处理响应失败
    return Promise.reject(error);
  }
)
