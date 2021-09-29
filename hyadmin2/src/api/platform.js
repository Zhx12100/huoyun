import request from '@/utils/request'

//订单列表
export function getWaterList(data) {
  return request({
    url: '/admin/order/pay_detail',
    method: 'post',
    data
  })
}
