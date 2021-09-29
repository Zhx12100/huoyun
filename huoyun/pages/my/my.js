// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/user/detail_info',
      method: "post",
      header: { 'token': app.globalData.token },
      data: {},
      success: function (res) {
        console.log('获取个人数据', res.data.data)
        that.setData({
          detail: res.data.data
        })
      }
    })
  },


  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.service_phone,
    })
  },

  //跳转估价页面
  goAddressManage(event) {
    wx.navigateTo({
      url: `../addressManage/addressManage?type=${event.currentTarget.dataset.type}&origin=${event.currentTarget.dataset.origin}`
    })
  },

  goSetting(event) {
    wx.navigateTo({
      url: `../setting/setting`
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