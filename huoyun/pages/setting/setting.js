// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send_flag: false,
    driver_flag: false,
    order_flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getStatus()
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

  switchSendFlag(event) {
    console.log(event)
    let that = this
    if(event.detail.value==true){
      wx.requestSubscribeMessage({
        tmplIds: ['QNmlOhq16O9Ybi0mrEX_azNgDKATysxrvf-qQzpsaj8'],
        success(dingy) {
          that.setData({
            send_flag: dingy['QNmlOhq16O9Ybi0mrEX_azNgDKATysxrvf-qQzpsaj8'] == "reject" ? false : true
          })
          that.changeStauts()
        }
      })
    }else{
      that.setData({
        send_flag: event.detail.value
      })
      that.changeStauts()
    }
  },
  switchDriverFlag(event) {
    console.log(event)
    let that = this
    if(event.detail.value==true){
      wx.requestSubscribeMessage({
        tmplIds: ['JHHkYbEe2mpJp3En1d6u1Ds_AA1rTXOgYUd0jxFD0lY'],
        success(dingy) {
          that.setData({
            driver_flag: dingy['JHHkYbEe2mpJp3En1d6u1Ds_AA1rTXOgYUd0jxFD0lY'] == "reject" ? false : true
          })
          that.changeStauts()
        }
      })
    }else{
      that.setData({
        driver_flag: event.detail.value
      })
      that.changeStauts()
    }
  },
  switchOrderFlag(event) {
    console.log(event)
    let that = this
    if(event.detail.value==true){
      wx.requestSubscribeMessage({
        tmplIds: ['B6BmQjt5glfBHpVpDWnerFQw0-iHn03YZnvuNf6Hfr4'],
        success(dingy) {
          that.setData({
            order_flag: dingy['B6BmQjt5glfBHpVpDWnerFQw0-iHn03YZnvuNf6Hfr4'] == "reject" ? false : true
          })
          that.changeStauts()
        }
      })
    }else{
      that.setData({
        order_flag: event.detail.value
      })
      that.changeStauts()
    }
  },

  changeStauts() {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/user/change_subscribe',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {
        send_flag: that.data.send_flag,
        driver_flag: that.data.driver_flag,
        order_flag: that.data.order_flag,
      },
      success: function (res) {
        console.log('改变订阅状态', res)
      }
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