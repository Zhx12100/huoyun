// pages/addressManage/addressManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    origin: '',
    searchText: '',
    page: 0,
    page_len: 5,
    list: [],
    isHideLoadMore: true,
    area: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    // origin 0 从下单页面跳转过来  1 从其他页面跳转过来
    // type start 筛选发货地址  end 筛选收货地址
    console.log('地址类型', options.type == 'start' ? '发货' : '收货')
    console.log('来源', options.origin == '0' ? '下单页面' : '设置页面')
    console.log('area', options.area)
    if (options.type)
      that.setData({
        type: options.type
      })
    if (options.origin)
      that.setData({
        origin: options.origin
      })
    if (options.area != '' && options.area != 'undefined')
      that.setData({
        area: options.area
      })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData({
      page: 0,
      list: []
    })
    that.getDataList(that.data.type, that.data.origin)
  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    let that = this
    that.setData({
      page: 0,
      list: []
    })
    that.getDataList(that.data.type, that.data.origin)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  scrollHandler(){
    console.log('上拉触底')
    let that = this
    that.getDataList(that.data.type, that.data.origin)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //回车搜索
  onConfirms() {
    let that = this
    that.setData({
      page: 0,
      list: []
    })
    that.getDataList(that.data.type, that.data.origin)
  },

  //获取地址列表
  getDataList(type, origin) {
    let that = this
    let url
    console.log(type, origin)
    if (type == 'end' && origin == 1) {//收货-设置
      url = '/applet/user/accept/list_address'
    } else if (type == 'start' && origin == 1) {//发货-设置
      url = '/applet/user/take/list_address'
    } else if (type == 'end' && origin == 0) {//收货-下单
      url = '/applet/order/accept/list_address'
    } else if (type == 'start' && origin == 0) {//发货-下单
      url = '/applet/order/take/list_address'
    }
    that.setData({
      page: that.data.page + 1
    })
    let data
    if (origin == 0) {
      data = {
        page: that.data.page,
        page_len: that.data.page_len,
        area: that.data.area,
      }
    } else {
      data = {
        page: that.data.page,
        page_len: that.data.page_len,
        search: that.data.searchText,
      }
    }

    wx.showNavigationBarLoading() //在标题栏中显示加载
    // return false
    wx.request({
      url: app.globalData.baseUrl + url,
      method: "post",
      header: { 'token': app.globalData.token },
      data: data,
      success: function (res) {
        console.log('获取列表', res.data.data)
        var arr = that.data.list
        res.data.data.result.forEach((v, i) => {
          arr.push(v)
        })
        that.setData({
          list: arr,
          isHideLoadMore: res.data.data.result.length === 0 || res.data.data.result.length < that.data.page_len ? false : true
        })
        // console.log(that.data.isHideLoadMore)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  //搜索内容
  bindSearch: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  //跳转新增编辑地址
  goAddEditAddress(event) {
    console.log(event)
    let that = this
    wx.navigateTo({
      url: "../addEditAddress/addEditAddress?editadd=" + event.currentTarget.dataset.editadd + "&type=" + (that.data.type == 'start' ? 'start' : 'end') + "&address_id=" + event.currentTarget.dataset.id || ''
    })
  },
  //删除地址
  deleteAddress(event) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除该地址吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.baseUrl + "/applet/user/delete_address",
            method: "POST",
            header: { 'token': app.globalData.token },
            data: {
              address_id: event.currentTarget.dataset.id
            },
            success: function (res) {
              console.log('删除地址', res);
              that.setData({
                page: 0,
                list: []
              })
              that.getDataList(that.data.type, that.data.origin)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //保存
  goBack: function (event) {
    let that = this
    if (that.data.origin == 0) {
      let list = that.data.list
      let index = event.currentTarget.dataset.index
      let address = list[index]
      let type = that.data.type
      var pages = getCurrentPages(); //当前页面栈
      if (pages.length > 1) {
        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
        console.log('上一页数据', beforePage.data)
        if (type == 'start') {
          beforePage.data.startAddress = address
        } else {
          beforePage.data.endAddress = address
        }
        wx.navigateBack({
          delta: 1
        })
      }
    }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})