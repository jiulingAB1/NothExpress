import { axios } from '@/utils/request'

/**
 * 查询收件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressPage (parameter) {
  return axios({
    url: '/receiveExpress/page',
    method: 'get',
    params: parameter
  })
}

/**
 * 统计数据模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressCountData () {
  return axios({
    url: '/receiveExpress/countData',
    method: 'get'
  })
}

/**
 * 收件模块列表
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressList (parameter) {
  return axios({
    url: '/receiveExpress/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 新增取件模块列表
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressPickUpList (parameter) {
  return axios({
    url: '/receiveExpress/pickUpList',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加收件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressAdd (parameter) {
  return axios({
    url: '/receiveExpress/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 收件模块成功后查询
 *
 *@author wangxijun
 * @date 2024-5-27 19:11:28
 */
export function receiveExpressAddSuccessSelect (parameter) {
  return axios({
    url: '/receiveExpress/addSuccessSelect',
    method: 'get',
    params: parameter
  })
}

/**
 * 编辑收件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressEdit (parameter) {
  return axios({
    url: '/receiveExpress/edit',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除收件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressDelete (parameter) {
  return axios({
    url: '/receiveExpress/delete',
    method: 'post',
    data: parameter
  })
}

/**
 * 导出收件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:08
 */
export function receiveExpressExport (parameter) {
  return axios({
    url: '/receiveExpress/export',
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}

/**
 * 收件模块验证
 *
 *@author wangxijun
 * @date 2024-5-27 19:11:28
 */
export function receiveExpressAddVerification (parameter) {
  return axios({
    url: '/receiveExpress/addVerification',
    method: 'get',
    params: parameter
  })
}

/**
 * 清理日志
 *
 *@author wangxijun
 * @date 2024-5-27 19:11:28
 */
export function receiveExpressDeleteExpressLog (parameter) {
  return axios({
    url: '/receiveExpress/deleteExpressLog',
    method: 'post',
    data: parameter
  })
}

/**
 * 收件模块验证
 *
 *@author wangxijun
 * @date 2024-5-27 19:11:28
 */
export function receiveExpressEditVerification (parameter) {
  return axios({
    url: '/receiveExpress/editVerification',
    method: 'get',
    params: parameter
  })
}
