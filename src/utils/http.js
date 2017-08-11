/**
 * Created by mhf on 2017/7/28.
 * http配置
 */
import axios from 'axios'

// axios 配置
//axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://192.168.0.217:8082/mapwayonline/';
axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//// http request 拦截器
//axios.interceptors.request.use(
//  config => {
//  if (store.state.token) {
//  config.headers.Authorization = `token ${store.state.token}`;
//}
//return config;
//},
//err => {
//  return Promise.reject(err);
//});
//
//// http response 拦截器
//axios.interceptors.response.use(
//  response => {
//  return response;
//},
//error => {
//  if (error.response) {
//    switch (error.response.status) {
//      case 401:
//        // 401 清除token信息并跳转到登录页面
//        store.commit(types.LOGOUT);
//        router.replace({
//          path: 'login',
//          query: {redirect: router.currentRoute.fullPath}
//        })
//    }
//  }
//  // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
//  return Promise.reject(error.response.data)
//});

export default axios;
