// pages/transportMode/transportMode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailTop:-100,
    gujiaData : '',
    detailTitle:'',
    detailContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var dataTemp = decodeURIComponent(options.data);//函数可把字符串作为 URI 组件进行解码。
    var Traces = JSON.parse(dataTemp);//航一页传过来的json字符串转化成json数组  物流信息进度
    that.setData({
      gujiaData: Traces
    })
    console.log('gujia',that.data.gujiaData)
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
  showDetail(e){
    var that = this
    var type = e.currentTarget.dataset.type
    that.setData({
       detailTop: 0,
       detailTitle:type=='air'?'空运':'陆运',
       detailContent : that.data.gujiaData[type].detail
    })
  },
  hideDetail(){
    var that = this
    that.setData({
       detailTop: -100
    })
  },
  //跳转下单页面
  goPlaceOrder(e){
    let that = this
    wx.showToast({title: '加载中', icon: 'loading', duration: 100000});
    let gettype = e.currentTarget.dataset.gettype
    let index = e.currentTarget.dataset.index
    let order_fee = e.currentTarget.dataset.fee
    let orderInfo = wx.getStorageSync('orderInfo')
    orderInfo.index = index
    orderInfo.order_fee = order_fee
    wx.setStorageSync('orderInfo', orderInfo)
    wx.hideToast()
    wx.navigateTo({
      url: "../placeOrder/placeOrder?gettype="+gettype
    })
  },

  goBack(){
    wx.navigateBack({//返回
      delta: 1
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