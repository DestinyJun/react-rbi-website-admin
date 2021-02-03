/**
 * desc：工具函数
 * author：DestinyJun
 * date：  2021/2/2 16:19
 */

/**
 * 树型结构转扁平化数据
 * @param data 数组
 * @returns {[]}
 */
export function reverseTree(data){
  let queen = [];
  const out = [];
  queen = queen.concat(data);
  while (queen.length) {
    const first = queen.shift();
    if (first.children) {
      queen = queen.concat(first.children);
      delete first.children;
    }
    out.push(first);
  }
  return out;
}

/**
 * 扁平化数据转树型结构
 * @param list
 * @param options
 * @returns {[]}
 */
export function transformTree (list, options = {}) {
  const {
    keyField = 'id',
    childField = 'children',
    parentField = 'parent_id'
  } = options

  const tree = []
  const record = {}

  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    const id = item[keyField]

    if (!id) {
      continue
    }
    if (record[id]) {
      item[childField] = record[id]
    } else {
      item[childField] = record[id] = []
    }

    if (item[parentField]) {
      const parentId = item[parentField]

      if (!record[parentId]) {
        record[parentId] = []
      }
      record[parentId].push(item)
    } else {
      tree.push(item)
    }
  }

  return tree
}
