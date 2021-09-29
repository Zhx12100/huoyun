import request from '@/utils/request'

//订单列表
export function getWaybillList(data) {
  return request({
    url: '/admin/order/list_order',
    method: 'post',
    data
  })
}
//订单详情
export function getWaybillDetail(data) {
  return request({
    url: '/admin/order/detail_order',
    method: 'post',
    data
  })
}

//更新信息
export function setWaybillDriver(data) {
  return request({
    url: '/admin/order/save_driver',
    method: 'post',
    data
  })
}

//q取消订单
export function cancelWaybill(data) {
  return request({
    url: '/admin/order/cancel_order',
    method: 'post',
    data
  })
}

//导出
export function exportWaybill(data) {
  return request({
    url: '/admin/order/export_order',
    method: 'post',
    data
  })
}

export function getManagementLy1(data) {
  return request({
    url: '/admin/order/list_one',
    method: 'post',
    data
  })
}

export function getManagementLy2(data) {
  return request({
    url: '/admin/order/list_two',
    method: 'post',
    data
  })
}

export function getManagementKy(data) {
  return request({
    url: '/admin/order/list_air',
    method: 'post',
    data
  })
}

export function exportExcel(data) {
  return request({
    url: '/admin/order/export_excel',
    method: 'post',
    data
  })
}

//开票管理
export function getInvoiceList(data) {
  return request({
    url: '/admin/order/list_invoice',
    method: 'post',
    data
  })
}

//导出发票
export function exportInvoice(data) {
  return request({
    url: '/admin/order/export_invoice',
    method: 'post',
    data
  })
}