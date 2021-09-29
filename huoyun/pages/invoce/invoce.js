// pages/invoce/invoce.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isHideLoadMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()
  },

  //获取地址列表
  getDataList() {
    let that = this
    let data
    data = {
      page: 1,
      page_len: 10000,
      status: 6,
      search:''
    }
    // return false
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/list_order',
      method: "post",
      header: { 'token': app.globalData.token },
      data: data,
      success: function (res) {
        console.log('获取订单列表', res.data.data)
        let arr = []
        arr = that.data.list
        res.data.data.result.forEach((v, i) => {
          arr.push(v)
        })
        that.setData({
          list: arr
        })
        that.setData({
          isHideLoadMore: false
        })
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