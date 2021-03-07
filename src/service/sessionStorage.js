/**
 * desc：  本地缓存封装（会话）
 * author：DestinyJun
 * date：  2021/1/27 10:45
 */
const LocalStorage = sessionStorage;

/**
 * 存储对象
 * @param key
 * @param value
 */
function setObject(key, value){
  LocalStorage.setItem(key,JSON.stringify(value))
}

/**
 * 获取本地缓存对象
 * @param key
 * @returns {any}
 */
function getObject(key){
  return JSON.parse(LocalStorage.getItem(key) || null)
}

/**
 * 指定移除本地缓存
 * @param key
 */
function remove(key) {
  LocalStorage.removeItem(key);
}

/**
 * 清除所有缓存
 */
function clear() {
  LocalStorage.clear();
}

export {setObject,getObject,remove,clear}
