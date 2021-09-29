// pages/status/status.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide: false,
    phoneNumber:'',
    setInter:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 100000 });
    let that = this
    console.log(1)

    that.data.setInter = setInterval(function () {
      console.log(app.globalData.freeze_flag)
      if(app.globalData.freeze_flag!==''){
        if (app.globalData.freeze_flag == true) {
          that.setData({
            isHide: true,
            phoneNumber:app.globalData.phoneNumber
          })
        }else{
          wx.switchTab({
            url: '/pages/index/index',
          })
          clearInterval(that.data.setInter)
        }
      }
      
    }, 1000)
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