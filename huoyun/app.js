// app.js
App({
  onLaunch() {
    var that = this
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    console.log(1)
    // return false
    wx.login({
      success: res => {
        console.log('wx.login', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        wx.request({
          url: that.globalData.baseUrl + '/applet/login',
          method: "post",
          data: {
            code
          },
          success: function (res) {
            console.log('openId', res.data.data);
            wx.setStorageSync('userInfo', res.data.data)
            if (res.data.data.is_new == false) {//如果登陆过
              if (res.data.data.freeze_flag == true) {//如果该账号已被冻结phone
                that.globalData.phoneNumber = res.data.data.phone
                return false
              } else { //如果未冻结
                that.globalData.token = res.data.data.token
                // wx.switchTab({
                //   url: '/pages/index/index',
                // })
              }
              that.globalData.freeze_flag = res.data.data.freeze_flag
            } else {
              wx.redirectTo({
                url: '/pages/login/index',
              })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    // baseUrl: 'https://freight.coschat.com',
    baseUrl: 'https://www.fywl-express.com',
    token: '',
    freeze_flag: '',
    phoneNumber: false,
  }
})