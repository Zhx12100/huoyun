import request from '@/utils/request'

//获取运营设置
export function getOperator(data) {
  return request({
    url: '/system/detail_program',
    method: 'post',
    data
  })
}
//保存运营设置
export function setOperator(data) {
  return request({
    url: '/system/save_program',
    method: 'post',
    data
  })
}
// 获取轮播列表
export function getSwiperList(data) {
  return request({
    url: '/system/list_banner',
    method: 'post',
    data
  })
}
// 获取轮播详情
export function getSwiperDetail(data) {
  return request({
    url: '/system/detail_banner',
    method: 'post',
    data
  })
}
// 删除轮播图
export function deleteSwiper(data) {
  return request({
    url: '/system/delete_banner',
    method: 'post',
    data
  })
}
// 获取轮播列表
export function setSwiper(data) {
  return request({
    url: '/system/save_banner',
    method: 'post',
    data
  })
}
