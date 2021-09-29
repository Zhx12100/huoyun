// pages/openInvoce/openInvoce.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      value: 0,
      name: '企业'
    },
    {
      value: 1,
      name: '个人或事业单位'
    },
    ],
    order_ids : [],
    invoice_head: 0,
    orderPrice:0,
    company_name:'',
    company_ein:'',
    accept_email:'',
    accept_phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      order_ids:JSON.parse(options.ids)
    })
    console.log(that.data.order_ids)
    that.getPrice()
  },

  //送货方式
  radioChange(e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = that.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    that.setData({
      invoice_head: e.detail.value*1
    })
  },

  //企业名称
  bindCompanyName: function (e) {
    this.setData({
      company_name: e.detail.value
    })
  },

  //公司税号
  bindCompanyEin: function (e) {
    this.setData({
      company_ein: e.detail.value
    })
  },

  //邮箱号
  bindAcceptEmail(e){
    this.setData({
      accept_email: e.detail.value
    })
  },

   //手机号
   bindAcceptPhone(e){
    this.setData({
      accept_phone: e.detail.value
    })
  },

  //获取发票金额
  getPrice(){
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/invoice_fee',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {order_ids:that.data.order_ids},
      success: function (res) {
        console.log('获取订单金额',res)
        that.setData({
          orderPrice:res.data.data.invoice_fee
        })
      }
    })
  },

  goAddEditAddress(){
    let that = this
    let data = {
      order_ids : that.data.order_ids,
      invoice_head: that.data.invoice_head,
      company_name:that.data.company_name,
      company_ein:that.data.company_ein,
      accept_email:that.data.accept_email,
      accept_phone:that.data.accept_phone
    }
    if(!data.company_name||!data.accept_email||!data.  accept_phone){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if(data.invoice_head==0){
      if(!data.company_ein){
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none',
          duration: 1500
        })
        return false
      }
    }
    wx.showToast({title: '加载中', icon: 'loading', duration: 100000});
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/make_invoice',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        console.log('提交开票',res)
        if(res.data.code==0){
          wx.showToast({
            title: '开票成功',
            icon: 'success',
            duration: 1000
          })
          
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000
          })
        }
        setTimeout(()=>{
          wx.hideToast()
          wx.navigateBack({//返回
            delta: 1
          })
        },1000)
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