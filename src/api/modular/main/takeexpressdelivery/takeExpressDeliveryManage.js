import { axios } from '@/utils/request'

/**
 * 查询取件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryPage (parameter) {
  return axios({
    url: '/takeExpressDelivery/page',
    method: 'get',
    params: parameter
  })
}

/**
 * 取件模块列表
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryList (parameter) {
  return axios({
    url: '/takeExpressDelivery/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加取件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryAdd (parameter) {
  return axios({
    url: '/takeExpressDelivery/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 取件模块数据获取
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryTakeExpressPeopleData (parameter) {
  return axios({
    url: '/takeExpressDelivery/takeExpressPeopleData',
    method: 'get',
    params: parameter
  })
}

/**
 * 编辑取件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryEdit (parameter) {
  return axios({
    url: '/takeExpressDelivery/edit',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除取件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryDelete (parameter) {
  return axios({
    url: '/takeExpressDelivery/delete',
    method: 'post',
    data: parameter
  })
}

/**
 * 导出取件模块
 *
 * @author wangxijun
 * @date 2024-05-10 21:10:46
 */
export function takeExpressDeliveryExport (parameter) {
  return axios({
    url: '/takeExpressDelivery/export',
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}
