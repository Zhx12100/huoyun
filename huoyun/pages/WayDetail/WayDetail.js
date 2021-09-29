// pages/WayDetail/WayDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    if (options.order_id)
      that.setData({
        order_id: options.order_id
      })
    that.getDetail()
  },

  getDetail() {
    let that = this
    wx.pageScrollTo({
      scrollTop: 0
    })
    let url = '/applet/order/detail_order'
    wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
    wx.request({
      url: app.globalData.baseUrl + url,
      method: "post",
      header: { 'token': app.globalData.token },
      data: { order_id: that.data.order_id },
      success: function (res) {
        console.log('订单详情', res.data.data)
        that.setData({
          detail: res.data.data
        })
        wx.hideToast();
      }
    })
  },

  //确认订单
  confirmOrder(event) {
    let that = this
    let order_id = that.data.order_id
    wx.showModal({
      title: '提示',
      content: '确认该订单?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
          wx.request({
            url: app.globalData.baseUrl + "/applet/order/confirm_order",
            method: "POST",
            header: { 'token': app.globalData.token },
            data: {
              order_id: order_id
            },
            success: function (res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000
              })
              that.getDetail()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //确认付款
  payment(event) {
    let that = this
    let order_id = that.data.order_id
    wx.showModal({
      title: '提示',
      content: '确认付款吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
          wx.request({
            url: app.globalData.baseUrl + '/applet/order/pay_order',
            method: "post",
            header: { 'token': app.globalData.token },
            data: { order_id: order_id },
            success: function (response) {
              if (response.data.code == 1) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 2000
                })
              } else {
                let cans = response.data.data
                wx.requestPayment
                  (
                    {
                      "timeStamp": cans.timeStamp,
                      "nonceStr": cans.nonceStr,
                      "package": cans.package,
                      "signType": cans.signType,
                      "paySign": cans.paySign,
                      "success": function (res) {
                        console.log('微信支付成功', res)
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
                                      that.getDetail()
                                    }else{
                                      that.getDetail()
                                    }
                                  }
                                })
                              }
                            })
                          }
                        })
                        
                      },
                      "fail": function (res) {
                        console.log('支付失败', res)
                        wx.showToast({
                          title: '支付失败',
                          icon: 'error',
                          duration: 2000
                        })
                      },
                      "complete": function (res) { }
                    }
                  )
              }

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //取消订单
  cancelOrder(event) {
    let that = this
    let order_id = that.data.order_id
    wx.showModal({
      title: '提示',
      content: '确认取消该订单?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });
          wx.request({
            url: app.globalData.baseUrl + "/applet/order/cancel_order",
            method: "POST",
            header: { 'token': app.globalData.token },
            data: {
              order_id: order_id
            },
            success: function (res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000
              })
              that.getDetail()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //前往开票页面
  goOpenInvoce(){
    let that = this
    let order_id = that.data.order_id
    let ids = [order_id]
    wx.navigateTo({
      url: "../openInvoce/openInvoce?ids="+JSON.stringify(ids)
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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