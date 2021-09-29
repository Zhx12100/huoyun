// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    /* swiper */
    baseUrl: app.globalData.baseUrl,
    swiperArr: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    regionStartIndex: [-1, -1, -1],
    regionEndIndex: [-1, -1, -1],
    regionStart: [
      [],
      [],
      []
    ],
    regionEnd: [
      [],
      [],
      []
    ],
    regionLinshi: [],
    areaData: {
      weight: '',
      volume: '',
      delivery_flag: true,
    },
    customItem: '',
    items: [{
        value: true,
        name: '送货上门',
        tips: '（不含卸货、上楼、进仓等服务。）'
      },
      {
        value: false,
        name: '自提',
        tips: '（不含卸货、上楼、进仓等服务。）'
      },
    ]
  },
  //跳转方式
  onLoad() {
    var that = this
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true
      })
    }
    that.getSwiper()
    that.getRegionProvince()
  },
  //获取轮播图列表
  getSwiper: function () {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/system/get_banner',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {},
      success: function (res) {
        console.log('swiper列表', res);
        that.setData({
          swiperArr: res.data.data
        })
      }
    })
  },
  //轮播图跳转
  goWebview(e){
    let that = this
    wx.navigateTo({
      url: "../webviewBox/webviewBox?name="+e.currentTarget.dataset.name+'&url='+e.currentTarget.dataset.url
    })
  },
  //获取发货区域省
  getRegionProvince: function () {
    let that = this
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/list_province',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: {},
      success: function (res) {
        console.log('省列表', res);
        var startArr = res.data.data.origin_province
        var endArr = res.data.data.target_province
        that.setData({
          'regionStart[0]': startArr,
          'regionEnd[0]': endArr
        })
        that.getRegionCity(0, that.data.regionStart[0][0]).then((res) => {
          let secondArr = []
          res.forEach((v, i) => {
            secondArr.push(v.city)
          })
          that.setData({
            'regionStart[1]': secondArr,
            'regionStart[2]': res[0].regions,
          })
        })
        that.getRegionCity(1, that.data.regionEnd[0][0]).then((res) => {
          let secondArr = []
          res.forEach((v, i) => {
            secondArr.push(v.city)
          })
          that.setData({
            'regionEnd[1]': secondArr,
            'regionEnd[2]': res[0].regions,
          })
        })
      }
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    let type = e.currentTarget.dataset.type
    if (type == 0) { //发货
      that.setData({
        regionStartIndex: e.detail.value
      })
    } else { //收货
      that.setData({
        regionEndIndex: e.detail.value
      })
    }
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    console.log(e.currentTarget.dataset.type)
    let that = this
    let type = e.currentTarget.dataset.type
    if (type == 0) {
      let changeIndex = `regionStartIndex[${e.detail.column}]`
      that.setData({
        [changeIndex]: e.detail.value
      })
    } else {
      let changeIndex = `regionEndIndex[${e.detail.column}]`
      that.setData({
        [changeIndex]: e.detail.value
      })
    }

    let column = e.detail.column
    let index = e.detail.value
    let regionStart = that.data.regionStart
    let regionEnd = that.data.regionEnd
    let regionStartIndex = that.data.regionStartIndex
    let regionEndIndex = that.data.regionEndIndex
    let regionProvince;
    let regionCity;
    let regionLinshi = that.data.regionLinshi
    if (column == 0) { //修改省
      if (regionStart[0].length == 0 || regionEnd[0].length == 0) {
        return false
      }
      if (type == 0) { //发货
        regionProvince = regionStart[0][index]
      } else { //收货
        regionProvince = regionEnd[0][index]
      }
      that.getRegionCity(type, regionProvince).then((res) => {
        console.log('获取市区列表', res)
        var secondArr = []
        res.forEach((v, i) => {
          secondArr.push(v.city)
        })
        if (type == 0) {
          regionStart[1] = secondArr
          regionStartIndex[1] = 0
          that.setData({
            regionStart: regionStart,
            regionStartIndex: regionStartIndex
          })
        } else {
          regionEnd[1] = secondArr
          regionEndIndex[1] = 0
          that.setData({
            regionEnd: regionEnd,
            regionEndIndex: regionEndIndex
          })
        }
        if (type == 0) {
          res.forEach((v, i) => {
            console.log(regionStart, regionStartIndex)
            if (v.city == regionStart[1][that.data.regionStartIndex[1]]) {
              regionStart[2] = v.regions
              regionStartIndex[2] = 0
              that.setData({
                regionStart: regionStart,
                regionStartIndex: regionStartIndex
              })
            }
          })
        } else {
          res.forEach((v, i) => {
            console.log(regionEnd, regionEndIndex)
            if (v.city == regionEnd[1][that.data.regionEndIndex[1]]) {
              regionEnd[2] = v.regions
              regionEndIndex[2] = 0
              that.setData({
                regionEnd: regionEnd,
                regionEndIndex: regionEndIndex
              })
            }
          })
        }
        that.setData({
          regionLinshi: res,
        })
      })
    } else if (column == 1) { //修改市
      console.log('kpg')
      if (type == 0 && regionStart[1].length == 0) {
        return false
      }
      if (type == 1 && regionEnd[1].length == 0) {
        return false
      }

      if (type == 0) { //发货
        regionCity = regionStart[1][index]
      } else { //收货
        regionCity = regionEnd[1][index]
      }
      regionLinshi.forEach((v, i) => {
        console.log('linshi', v, v.city, regionCity)
        if (v.city == regionCity) {
          if (type == 0) { //发货
            regionStart[2] = v.regions
            regionStartIndex[2] = 0
            that.setData({
              regionStart: regionStart,
              regionStartIndex: regionStartIndex
            })
          } else { //收货
            regionEnd[2] = v.regions
            regionEndIndex[2] = 0
            that.setData({
              regionEnd: regionEnd,
              regionEndIndex: regionEndIndex
            })
          }
        }

      })
    } else {
      // if(type == 0&&that.data.regionStartIndex[1].length===0){
      //   let changeIndex = `regionStartIndex[2]`
      //   that.setData({
      //     [changeIndex]:-1
      //   })
      // }else if(type == 1&&that.data.regionEndIndex[1].length===0){
      //   let changeIndex = `regionEndIndex[2]`
      //   that.setData({
      //     [changeIndex]:-1
      //   })
      // }
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
        header: {
          'token': app.globalData.token
        },
        data: {
          province: area
        },
        success: function (res) {
          resolve(res.data.data)
          // that.setData({
          //   swiperArr:res.data.data
          // })
        }
      })
    })
  },
  //公斤数
  bindWeight: function (e) {
    this.setData({
      ['areaData.weight']: e.detail.value*1
    })
  },
  //体积
  bindVolume: function (e) {
    this.setData({
      ['areaData.volume']: e.detail.value*1
    })
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
      ['areaData.delivery_flag']: JSON.parse(e.detail.value)
    })
  },
  //跳转估价页面
  goTransportMode() {
    let that = this
    let data = that.data.areaData
    let regionStart = that.data.regionStart
    let regionStartIndex = that.data.regionStartIndex
    let regionEnd = that.data.regionEnd
    let regionEndIndex = that.data.regionEndIndex
    data.origin_province = regionStart[0][regionStartIndex[0]]
    data.origin_city = regionStart[1][regionStartIndex[1]]
    data.origin_region = regionStart[2][regionStartIndex[2]]
    data.target_province = regionEnd[0][regionEndIndex[0]]
    data.target_city = regionEnd[1][regionEndIndex[1]]
    data.target_region = regionEnd[2][regionEndIndex[2]]
    console.log(regionEnd, regionEndIndex)
    console.log(data.volume)
    if (data.weight == '') {
      wx.showToast({
        title: '请填写公斤数',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (data.volume == '') {
      wx.showToast({
        title: '请填写总方数',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!data.origin_province || !data.origin_city || !data.origin_region) {
      wx.showToast({
        title: '请选择发货省市区',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!data.target_province || !data.target_city || !data.target_region) {
      wx.showToast({
        title: '请选择收货省市区',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    console.log(data)
    wx.showToast({title: '加载中', icon: 'loading', duration: 100000});
    wx.request({
      url: app.globalData.baseUrl + '/applet/order/get_cost',
      method: "post",
      header: {
        'token': app.globalData.token
      },
      data: data,
      success: function (res) {
        console.log('估价下单', res)
        if (res.data.code == 2) {
          wx.showToast({
            title: res.data.message,
            icon: 'error',
            duration: 1500
          })
          return false
        }
        var urls = encodeURIComponent(JSON.stringify(res.data.data));
        var orderInfo = {
          freight_name: "",
          freight_wrap: '',
          weight: data.weight,
          volume: data.volume,
          delivery_flag: data.delivery_flag,
          order_fee: '',
          index: '',
          note: "",
          origin_address: {
            province: data.origin_province,
            city: data.origin_city,
            region: data.origin_region,
            name: "",
            phone: "",
            address: ""
          },
          target_address: {
            province: data.target_province,
            city: data.target_city,
            region: data.target_region,
            name: "",
            phone: "",
            address: ""
          }
        }
        wx.setStorageSync('orderInfo', orderInfo)
        wx.hideToast()
        wx.navigateTo({
          url: "../transportMode/transportMode?data=" + urls
        })

      }
    })

    return false

    wx.navigateTo({
      url: "../transportMode/transportMode"
    })
  },
})