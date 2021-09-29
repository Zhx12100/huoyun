const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 196,
    currentTab: '',
    piliangShow: false,
    kaipiaoData: [{
        select: 0
      },
      {
        select: 0
      }
    ],
    triggered:true,

    searchText: '',
    page: 0,
    page_len: 5,
    list: [],
    list2: [],
    isHideLoadMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    /**
     * 获取当前设备的宽高
     */
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       winWidth: res.windowWidth,
    //       winHeight: res.windowHeight
    //     });
    //   }
    // });
  },
  onRefresh(){
    console.log('下拉刷新')
    // return false
    let that = this
    that.setData({
      triggered:true
    })
    that.claerData()
  },

  //下拉刷新
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  scrollHandler() {
    console.log('上拉加载')
    // return false
    let that = this
    that.getDataList()
  },

  getSwitchStatus(status) {
    switch (status) {
      case 0:
        return '待付款';
      case 1:
        return '待运输';
      case 2:
        return '运输中';
      case 3:
        return '已完成';
      case 4:
        return '已取消';
      case 5:
        return '（待）开票';
      case 6:
        return '历史开票';
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉触底')
    // return false
    let that = this
    that.getDataList()
  },

  onShow: function () {
    let that = this
    that.setData({
      page: 0,
      list: [],
      list2: [],
    })
    that.getDataList()
  },

  claerData() {
    let that = this
    that.setData({
      page: 0,
      list: [],
      list2: [],
      isHideLoadMore: true
    })
    that.getDataList()
  },

  //获取地址列表
  getDataList() {
    let that = this
    that.setData({
      page: that.data.page + 1
    })
    let data
    data = {
      page: that.data.page,
      page_len: that.data.page_len,
      status: that.data.currentTab,
      search: that.data.searchText
    }

    wx.showNavigationBarLoading() //在标题栏中显示加载
    // return false
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/list_order',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        console.log('获取订单列表', res.data.data)
        let arr = []
        if (that.data.currentTab != 5) {
          arr = that.data.list
        } else {
          arr = that.data.list2
        }
        console.log(that.data.currentTab)
        res.data.data.result.forEach((v, i) => {
          if (that.data.currentTab == 5) {
            v.select = 0
          }
          arr.push(v)
        })

        that.setData({
          isHideLoadMore: res.data.data.result.length === 0 || res.data.data.result.length < that.data.page_len ? false : true,
          triggered:false
        })

        if (that.data.currentTab != 5) {
          that.setData({
            list: arr
          })
        } else {
          that.setData({
            list2: arr
          })
          console.log('list2', that.data.list2)
        }
        // console.log(that.data.isHideLoadMore)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //  tab切换逻辑
  swichNav: function (e) {
    var that = this;
    console.log(e.target.dataset.current)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == '') {
        that.setData({
          currentTab: e.target.dataset.current,
        })
      } else {
        that.setData({
          currentTab: parseInt(e.target.dataset.current),
        })
      }
      if (e.target.dataset.current == 5) {
        that.setData({
          winHeight: 300
        })
      } else {
        that.setData({
          winHeight: 196
        })
      }
    }
    that.claerData()
  },

  //回车搜索
  onConfirms() {
    let that = this
    that.setData({
      page: 0,
      list: []
    })
    that.getDataList()
  },

  //搜索内容
  bindSearch: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  //跳转下单页面
  goWayDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: "../WayDetail/WayDetail?order_id=" + e.currentTarget.dataset.id
    })
  },
  //前往发票页面
  goInvoce(ecent) {
    wx.navigateTo({
      url: "../invoce/invoce"
    })
  },
  //前往开票页面
  goOpenInvoce(e) {
    let that = this
    let arr = [e.currentTarget.dataset.id]
    let order_id = JSON.stringify(arr)
    wx.navigateTo({
      url: "../openInvoce/openInvoce?order_id=" + order_id
    })
  },

  //展示批量开票
  showPiliang() {
    var that = this
    that.setData({
      piliangShow: !that.data.piliangShow
    })
    if (that.data.piliangShow == true) {
      that.setData({
        winHeight: 430
      })
    } else {
      that.setData({
        winHeight: 300
      })
    }
  },

  //选择发票
  selectInvoce(event) {
    var that = this
    var index = event.currentTarget.dataset.index
    var select = that.data.list2[index].select
    that.setData({
      [`list2[${index}].select`]: select == 0 ? 1 : 0
    })
  },

  //全选发票
  allSelect() {
    var that = this
    var arr = that.data.list2
    arr.forEach((v, i) => {
      v.select = 1
    })
    that.setData({
      list2: arr
    })
  },
  cacelAllSelect() {
    var that = this
    var arr = that.data.list2
    arr.forEach((v, i) => {
      v.select = 0
    })
    that.setData({
      list2: arr,
      piliangShow: false
    })
  },

  //确认订单
  confirmOrder(event) {
    let that = this
    let order_id = event.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认该订单?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
          });
          wx.request({
            url: app.globalData.baseUrl + "/applet/order/confirm_order",
            method: "POST",
            header: {
              'token': app.globalData.token
            },
            data: {
              order_id: order_id
            },
            success: function (res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000
              })
              that.claerData()
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
    let order_id = event.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认取消该订单?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
          });
          wx.request({
            url: app.globalData.baseUrl + "/applet/order/cancel_order",
            method: "POST",
            header: {
              'token': app.globalData.token
            },
            data: {
              order_id: order_id
            },
            success: function (res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000
              })
              that.claerData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //前往开票页面
  goOpenInvoce(event){
    let that = this
    let order_id = event.currentTarget.dataset.id
    let ids = [order_id]
    wx.navigateTo({
      url: "../openInvoce/openInvoce?ids="+JSON.stringify(ids)
    })
  },
  goOpenInvoceAll(){
    let that = this
    let arr = []
    that.data.list2.forEach((v,i) =>{
      if(v.select==1){
        arr.push(v.order_id)
      }
    })
    let ids = arr
    wx.navigateTo({
      url: "../openInvoce/openInvoce?ids="+JSON.stringify(ids)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})