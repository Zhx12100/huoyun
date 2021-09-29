// pages/addeditaddress/addeditaddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionIndex: [-1, -1, -1],
    region: [[], [], []],
    regionLinshi: [],
    formData: {
      name: '',
      phone: '',
      address: ''
    },
    customItem: '',
    editadd: '',
    type: '',
    address_id: '',
    detail: {}
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
    console.log('编辑还是新增', options.editadd, options.editadd == 'edit' ? '编辑' : '新增')
    if (options.editadd)
      that.setData({
        editadd: options.editadd
      })
    if (options.type)
      that.setData({
        type: options.type
      })
    if (options.address_id)
      that.setData({
        address_id: options.address_id
      })


    console.log('that.data.editadd', that.data.editadd)
    if (that.data.editadd == 'edit') {
      that.getDetail().then((res) => {
        console.log('111')
        that.getRegionProvince()
      })
    } else {
      that.getRegionProvince()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //获取地址详情
  getDetail() {
    let that = this
    return new Promise(function (resolve, reject) {
      let url = '/applet/user/detail_address'
      wx.request({
        url: app.globalData.baseUrl + url,
        method: "post",
        header: { 'token': app.globalData.token },
        data: { address_id: that.data.address_id },
        success: function (res) {
          console.log('地址详情', res.data.data)
          that.setData({
            'formData.name': res.data.data.name,
            'formData.phone': res.data.data.phone,
            'formData.address': res.data.data.address,
            detail: res.data.data
          })
          resolve(res.data.data)
        }
      })
    })
  },

  //获取发货区域省
  getRegionProvince: function () {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/list_province',
      method: "post",
      header: { 'token': app.globalData.token },
      data: {},
      success: function (res) {
        console.log('省列表', res);
        var Arr =
          that.data.type == 'start' ? res.data.data.origin_province : res.data.data.target_province
        that.setData({
          'region[0]': Arr
        })
        
        //省市区回显
        if (that.data.editadd == 'edit') {
          let region = that.data.region
          Arr.forEach((v, i) => {
            if (v == that.data.detail.adr_province) {
              that.setData({
                'regionIndex[0]': i
              })
            }
          })
          let type = that.data.type == 'start' ? 0 : 1
          that.getRegionCity(type, that.data.detail.adr_province).then((res) => {
            var secondArr = []
            res.forEach((v, i) => {
              secondArr.push(v.city)
            })
            region[1] = secondArr
            that.setData({
              region: region,
              regionLinshi: res
            })
            secondArr.forEach((v, i) => {
              if (v == that.data.detail.adr_city) {
                that.setData({
                  'regionIndex[1]': i
                })
              }
            })
            res.forEach((v, i) => {
              if(v.city == that.data.detail.adr_city){
                region[2] = v.regions
                that.setData({
                  region: region,
                })
              }
            })
            that.data.region[2].forEach((v, i) => {
              if (v == that.data.detail.adr_region) {
                that.setData({
                  'regionIndex[2]': i
                })
              }
            })
          })
        } else {
          let type = that.data.type == 'start' ? 0 : 1
          that.getRegionCity(type, that.data.region[0][0]).then((res) => {
            let secondArr = []
            res.forEach((v, i) => {
              secondArr.push(v.city)
            })
            that.setData({
              'region[1]': secondArr,
              'region[2]': res[0].regions,
            })
          })
        }
      }
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    that.setData({
      regionIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let that = this
    let type = that.data.type == 'start' ? 0 : 1
    let changeIndex = `regionIndex[${e.detail.column}]`
    that.setData({
      [changeIndex]: e.detail.value
    })

    let column = e.detail.column
    let index = e.detail.value
    let region = that.data.region
    let regionIndex = that.data.regionIndex
    let regionProvince;
    let regionCity;
    let regionLinshi = that.data.regionLinshi
    if (column == 0) {//修改省
      if (region[0].length == 0) {
        return false
      }
      regionProvince = region[0][index]
      that.getRegionCity(type, regionProvince).then((res) => {
        console.log('获取市区列表', res)
        var secondArr = []
        res.forEach((v, i) => {
          secondArr.push(v.city)
        })
        region[1] = secondArr
        regionIndex[1] = 0
        that.setData({
          region: region,
          regionIndex: regionIndex
        })

        res.forEach((v, i) => {
          if(v.city == region[1][that.data.regionIndex[1]]){
            region[2] = v.regions
            regionIndex[2] = 0
            that.setData({
              region: region,
              regionIndex: regionIndex
            })
          }
        })
        that.setData({
          regionLinshi: res,
        })
      })
    } else if (column == 1) {//修改市
      if (region[1].length == 0) {
        return false
      }
      regionCity = region[1][index]
      regionLinshi.forEach((v, i) => {
        if (v.city == regionCity) {
          region[2] = v.regions
          regionIndex[2] = 0
          that.setData({
            region: region,
            regionIndex: regionIndex
          })
        }
      })
    } else {
    }
    // let province = regionProvince

  },
  //获取发货城市地区列表
  getRegionCity: function (type, area) {
    return new Promise(function (resolve, reject) {
      let that = this
      let url;
      if (type == 0) {
        url = '/applet/order/origin_city'
      } else {
        url = '/applet/order/target_city'
      }
      wx.request({
        url: app.globalData.baseUrl + url,
        method: "post",
        header: { 'token': app.globalData.token },
        data: { province: area },
        success: function (res) {
          resolve(res.data.data)
          // that.setData({
          //   swiperArr:res.data.data
          // })
        }
      })
    })
  },

  //姓名
  bindName: function (e) {
    this.setData({
      ['formData.name']: e.detail.value
    })
  },
  //手机号码
  bindMobile: function (e) {
    this.setData({
      ['formData.phone']: e.detail.value
    })
  },
  //详细地址
  bindDetail: function (e) {
    this.setData({
      ['formData.address']: e.detail.value
    })
  },
  //保存
  goBack: function () {
    let that = this
    let url
    if (that.data.type == 'start') {
      url = '/applet/user/take/save_address'
    } else {
      url = '/applet/user/accept/save_address'
    }
    let formData = that.data.formData
    let region = that.data.region
    let regionIndex = that.data.regionIndex
    if (!region[0][regionIndex[0]] || !region[1][regionIndex[1]] || !region[2][regionIndex[2]]) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    let regions = `${region[0][regionIndex[0]]}${region[1][regionIndex[1]]}${region[2][regionIndex[2]]}`
    let data = {
      address_id: that.data.address_id,
      name: formData.name,
      phone: formData.phone,
      region: regions,
      address: formData.address,
      adr_province: region[0][regionIndex[0]],
      adr_city: region[1][regionIndex[1]],
      adr_region: region[2][regionIndex[2]],
    }
    if (data.name == '' || data.phone == '' || data.address == '') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500
      })
      return false
    }

    wx.showToast({ title: '', icon: 'loading', duration: 1000 });
    wx.request({
      url: app.globalData.baseUrl + url,
      method: "post",
      header: { 'token': app.globalData.token },
      data: data,
      success: function (res) {
        wx.showToast({
          title: '请求成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 500)

      }
    })
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