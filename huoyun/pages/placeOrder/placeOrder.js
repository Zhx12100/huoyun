// pages/placeOrder/placeOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    gettype: '',
    customItem: '',
    freightWrapArr: [{
        value: 0,
        name: '不需要'
      },
      {
        value: 1,
        name: '胶带'
      },
      {
        value: 2,
        name: '木板'
      },
      {
        value: 3,
        name: '编织袋'
      },
      {
        value: 4,
        name: '泡沫箱'
      },
    ],
    items: [{
      value: '0',
      name: '现付',
      tips: ''
    }, ],
    detailTop: -100,
    contract: '',
    cb: [], //是否同意运输服务合同

    startAddress: {
      address: '',
      name: '',
      phone: ''
    },
    endAddress: {
      address: '',
      name: '',
      phone: ''
    },
    send_flag: false,
    driver_flag: false,
    order_flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('运输方式', options.gettype == 'air' ? '空运' : '陆运')
    console.log('送货方式', wx.getStorageSync('orderInfo').delivery_flag == true ? '送货上门' : '自提')
    console.log('获取数据信息', options, wx.getStorageSync('orderInfo'))
    that.setData({
      orderInfo: wx.getStorageSync('orderInfo'),
      gettype: options.gettype == 'air' ? '空运' : '陆运'
    })

    let orderInfo = that.data.orderInfo
    if (orderInfo.delivery_flag == false) { //如果是自提
      that.getZtAddress()
    }
    //获取运输合同
    that.getContract()
    //获取订阅授权信息
    that.getStatus()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //公斤数
  bindWeight: function (e) {
    this.setData({
      ['orderInfo.weight']: e.detail.value * 1
    })
    this.getGujia()
  },
  //体积
  bindVolume: function (e) {
    this.setData({
      ['orderInfo.volume']: e.detail.value * 1
    })
    this.getGujia()
  },
  //备注
  bindName: function (e) {
    this.setData({
      ['orderInfo.freight_name']: e.detail.value
    })
  },
  //备注
  bindNote: function (e) {
    this.setData({
      ['orderInfo.note']: e.detail.value
    })
  },

  getStatus() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/user/detail_info',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {},
      success: function (res) {
        console.log('获取运输合同', res.data.data)
        that.setData({
          send_flag: res.data.data.send_flag,
          driver_flag: res.data.data.driver_flag,
          order_flag: res.data.data.order_flag,
        })
      }
    })
  },

  //估价
  getGujia() {
    let that = this
    let orderInfo = that.data.orderInfo
    let data = {
      delivery_flag: orderInfo.delivery_flag,
      origin_city: orderInfo.origin_address.city,
      origin_province: orderInfo.origin_address.province,
      origin_region: orderInfo.origin_address.region,
      target_city: orderInfo.target_address.city,
      target_province: orderInfo.target_address.province,
      target_region: orderInfo.target_address.region,
      volume: orderInfo.volume,
      weight: orderInfo.weight
    }
    console.log('估价数据', data)
    if (data.weight == '') {
      return false
    }
    if (data.volume == '') {
      return false
    }
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/get_cost',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        console.log('估价下单', res.data.data)
        let response = res.data.data
        that.setData({
          'orderInfo.order_fee': that.data.gettype == '空运' ? response.air.fee : response.land.fee
        })
      }
    })

    return false

    wx.navigateTo({
      url: "../transportMode/transportMode"
    })
  },

  //自提时 - 收货地址 获取
  getZtAddress() {
    var that = this
    let orderInfo = that.data.orderInfo
    let data = {
      way: that.data.gettype == '陆运' ? 1 : 2,
      origin_city: orderInfo.origin_address.city,
      origin_province: orderInfo.origin_address.province,
      origin_region: orderInfo.origin_address.region,
      target_city: orderInfo.target_address.city,
      target_province: orderInfo.target_address.province,
      target_region: orderInfo.target_address.region,
      index: orderInfo.index
    }
    // that.data.orderInfo.delivery_flag = true
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/self/get_address',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        console.log('自提时 - 收货地址', res.data.data)
        orderInfo.target_address.name = res.data.data.name
        orderInfo.target_address.phone = res.data.data.phone
        orderInfo.target_address.address = res.data.data.address
        that.setData({
          endAddress: res.data.data
        })
      }
    })
  },

  //同意运输服务合同
  listenCheckboxContractChange(e) {
    console.log(e)
    this.setData({
      cb: e.detail.value
    })
  },
  //获取运输合同
  getContract() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/system/get_contract',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {},
      success: function (res) {
        console.log('获取运输合同', res.data.data)
        that.setData({
          contract: res.data.data.contract.replace(/\<img/g, "<img style='width:100%；height:auto;display:block;'")
        })
      }
    })
  },

  //跳转地址管理页面
  goAddressManage(event) {
    let that = this
    let area
    if (event.currentTarget.dataset.type == 'start') {
      let origin_address = that.data.orderInfo.origin_address
      area = origin_address.province + origin_address.city + origin_address.region
    }
    if (event.currentTarget.dataset.type == 'end') {
      let target_address = that.data.orderInfo.target_address
      area = target_address.province + target_address.city + target_address.region
    }
    wx.navigateTo({
      url: `../addressManage/addressManage?type=${event.currentTarget.dataset.type}&origin=${event.currentTarget.dataset.origin}&area=${area}`
    })
  },

  //跳转新增编辑地址
  goAddEditAddress(event) {
    wx.navigateTo({
      url: "../addEditAddress/addEditAddress?type=" + event.currentTarget.dataset.type
    })
  },

  // 选择包装方式
  bindPickerChangeFs: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var mchObj = that.data.freightWrapArr[e.detail.value];
    that.setData({
      'orderInfo.freight_wrap': mchObj.value * 1,
      switchFreight: mchObj.name
    })
    console.log(that.data.orderInfo.freight_wrap)
  },

  //下单
  submitOrder() {
    let that = this
    if (that.data.cb.length === 0) {
      wx.showToast({
        title: '请阅读并同意《运输服务合同》',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let orderInfo = that.data.orderInfo
    orderInfo.origin_address.name = that.data.startAddress.name
    orderInfo.origin_address.phone = that.data.startAddress.phone
    orderInfo.origin_address.address = that.data.startAddress.address
    orderInfo.target_address.name = that.data.endAddress.name
    orderInfo.target_address.phone = that.data.endAddress.phone
    orderInfo.target_address.address = that.data.endAddress.address
    console.log('orderInfo', orderInfo)
    if (
      orderInfo.freight_wrap === '' ||
      orderInfo.volume === '' ||
      orderInfo.weight === '' ||
      orderInfo.freight_name === '' ||
      orderInfo.origin_address.name === '' ||
      orderInfo.target_address.name === ''
    ) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      })
      return false
    }

    // if(that.data.send_flag==false||that.data.driver_flag==false||that.data.order_flag==false){

    // }else{
    that.orderRequest(orderInfo)
    // }
    // wx.showToast({title: '加载中', icon: 'loading', duration: 100000});

    return false

  },

  orderRequest(orderInfo) {
    let that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 100000
    });
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/save_order',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: orderInfo,
      success: function (res) {
        console.log('下单', res.data.data)
        if (res.data.code == 0) {
          //获取支付参数
          wx.request({
            url: app.globalData.baseUrl + '/applet/order/pay_order',
            method: "post",
            header: {
              'token': app.globalData.token
            },
            data: {
              order_id: res.data.data.order_id
            },
            success: function (response) {
              console.log('获取支付参数', response)
              if (response.data.code == 1) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 2000
                })
                setTimeout(() => {
                  wx.reLaunch({
                    url: "../WayDetail/WayDetail?order_id=" + res.data.data.order_id
                  })
                }, 500)
              } else {
                let cans = response.data.data
                wx.requestPayment({
                  "timeStamp": cans.timeStamp,
                  "nonceStr": cans.nonceStr,
                  "package": cans.package,
                  "signType": cans.signType,
                  "paySign": cans.paySign,
                  "success": function (pays) {
                    console.log('微信支付成功', pays)
                    //授权
                    wx.requestSubscribeMessage({
                      tmplIds: ['QNmlOhq16O9Ybi0mrEX_azNgDKATysxrvf-qQzpsaj8', 'JHHkYbEe2mpJp3En1d6u1Ds_AA1rTXOgYUd0jxFD0lY', 'B6BmQjt5glfBHpVpDWnerFQw0-iHn03YZnvuNf6Hfr4'],
                      success(dingy) {
                        console.log('成功订阅', dingy)
                        wx.showToast({
                          title: '成功订阅',
                          icon: 'success',
                          duration: 2000
                        })
                        wx.request({
                          url: app.globalData.baseUrl + '/applet/user/change_subscribe',
                          method: "post",
                          header: {
                            'token': app.globalData.token
                          },
                          data: {
                            send_flag: dingy['QNmlOhq16O9Ybi0mrEX_azNgDKATysxrvf-qQzpsaj8'] == "reject" ? false : true,
                            driver_flag: dingy['JHHkYbEe2mpJp3En1d6u1Ds_AA1rTXOgYUd0jxFD0lY'] == "reject" ? false : true,
                            order_flag: dingy['B6BmQjt5glfBHpVpDWnerFQw0-iHn03YZnvuNf6Hfr4'] == "reject" ? false : true,
                          },
                          success: function (sendDing) {
                            wx.showModal({
                              title: '提示',
                              content: '可以在 我的-系统设置 里更改订阅消息设置',
                              showCancel: false,
                              success: function (que) {
                                if (que.confirm) {
                                  // that.orderRequest(orderInfo)
                                  setTimeout(() => {
                                    wx.reLaunch({
                                      url: "../WayDetail/WayDetail?order_id=" + res.data.data.order_id
                                    })
                                  }, 500)
                                } else {
                                  // that.orderRequest(orderInfo)
                                  setTimeout(() => {
                                    wx.reLaunch({
                                      url: "../WayDetail/WayDetail?order_id=" + res.data.data.order_id
                                    })
                                  }, 500)
                                }
                              }
                            })
                          }
                        })
                      }
                    })
                    // wx.showToast({
                    //   title: '支付成功',
                    //   icon: 'success',
                    //   duration: 2000
                    // })

                  },
                  "fail": function (paysError) {
                    console.log('支付失败', paysError)
                    wx.showToast({
                      title: '支付失败',
                      icon: 'error',
                      duration: 2000
                    })
                    setTimeout(() => {
                      wx.reLaunch({
                        url: "../WayDetail/WayDetail?order_id=" + res.data.data.order_id
                      })
                    }, 500)
                  },
                  "complete": function (res) {}
                })
              }
            },
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

  showDetail() {
    var that = this
    that.setData({
      detailTop: 0
    })
  },
  hideDetail() {
    var that = this
    that.setData({
      detailTop: -100
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    console.log(that.data.startAddress)
    let startAddress = that.data.startAddress;
    let endAddress = that.data.endAddress;
    that.setData({
      startAddress: startAddress,
      endAddress: endAddress,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})