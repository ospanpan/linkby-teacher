Page({
  data: {
    userPhone: '',
    yzm: '',
    hasMobile: false,
    sendable:false,
    validSeconds: 60,
    loginBtnTxt: "登录",
    toRegistTxt: "注册",
    verificationText: "发送验证码",
    loginBtnCls: 'login-btn login-btn-disabled' //登录按钮样式
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wx.showToast({
                title: "1-->" +JSON.stringify( res.userInfo)
              });
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    wx.showToast({
      title: "2-->" +JSON.stringify(e.detail.userInfo)
    });
  },
  //登录
  toConfirm: function (event) {
    var loginModule = this;
    if (this.data.loginBtnCls == "login-btn") {
      var app = getApp();
      if (!app.validatemobile(this.data.userPhone)) {
        wx.showToast({ title: '请输入手机号码' });
        return;
      } else if (loginModule.data.yzm.length!=4){
        wx.showToast({ title: '请输入验证码' });
        return;
      } else {
        var isToLogin = (loginModule.data.loginBtnTxt == "登录");
        if (isToLogin) {
          wx.showLoading({ title: '正在登录', mask:true });
          //登录操作
          app.post_api_data(app.globalData.api_URL.DoLogin,
            { 'user.phoneNum': loginModule.data.userPhone , 'yzm': loginModule.data.yzm, 'type': 0 },
            function (data) {
              setTimeout(function(){
                wx.hideLoading();
              }, 150);
              if (data.apiStatus == "200") {
                app.globalData.userInfo = data.data;
                console.log('登录成功' + JSON.stringify(data.data));
                if (data.data.teacher != null && data.data.teacher.id.length>0 && data.data.operation=="login"){
                  if (data.data.teacher.schoolId != null && data.data.teacher.schoolId.length > 0) {
                    if (data.data.teacher.curClassesId != null && data.data.teacher.curClassesId.length > 0) {
                      wx.redirectTo({ url: '/pages/teacher/homepage/homepage' });
                    } else {
                      wx.redirectTo({ url: '/pages/teacher/create/createClass/createClass' });
                    }
                  } else {
                    wx.redirectTo({ url: '/pages/teacher/create/confirm/confirm?json=' + encodeURIComponent(JSON.stringify(data.data)) });
                  }
                } else {
                  app.globalData.userInfo = data.data;
                  wx.redirectTo({ url: '/pages/teacher/create/confirm/confirm?json=' + encodeURIComponent(JSON.stringify(data.data)) });
                }       
              } else {
                wx.showToast({ title: data.msg });
              }
            }, function () {
              wx.showToast({ title: "登录失败" });
              setTimeout(function () {
                wx.hideLoading();
              }, 150);
            });
        } else {
          wx.showLoading({ title: '正在注册', mask: true });
          //注册操作
          app.post_api_data(app.globalData.api_URL.RegisterSave,
            { 'user.phoneNum': loginModule.data.userPhone, 'yzm': loginModule.data.yzm, 'type': 0 },
            function (data) {
              setTimeout(function () {
                wx.hideLoading();
              }, 150);
              if (data.apiStatus == "200") {
                app.globalData.userInfo = data.data;
                wx.redirectTo({ url: '/pages/teacher/create/confirm/confirm?json=' + encodeURIComponent(JSON.stringify(data.data)) });
              } else {
                wx.showToast({ title: data.msg });
              }
            }, function () {
              setTimeout(function () {
                wx.hideLoading();
              }, 150);
              wx.showToast({ title: "注册失败" });
            });
        }
      }
    }
  },
  //请求发送验证码
  sendVerification: function (e) {
    var loginModule = this;
    if (this.data.verificationText == '发送验证码') {
      var app = getApp();
      if (app.validatemobile(this.data.userPhone)) {
        var isToLogin = (this.data.loginBtnTxt == "登录");
        wx.showLoading({ title: '正在发送', mask:true });
        app.post_api_data((isToLogin ? app.globalData.api_URL.GetLoginYzm : app.globalData.api_URL.GetZcYzm),
          { 'phoneNum': this.data.userPhone }, function (data) {
            console.log(JSON.stringify(data));
            setTimeout(function () {
              wx.hideLoading();
            }, 150);
            if (data.apiStatus == "200") {
              loginModule.setData({ validSeconds: 1 * 60 });
              loginModule.setData({ verificationText: '重新发送' + loginModule.data.validSeconds + 's' });
              loginModule.setData({ sendable: false });
              setInterval(function () {
                if (loginModule.data.validSeconds > 1) {
                  loginModule.setData({ validSeconds: loginModule.data.validSeconds - 1 });
                  loginModule.setData({ verificationText: '重新发送' + loginModule.data.validSeconds + 's' });
                } else {
                  loginModule.setData({ sendable: true });
                  loginModule.setData({ verificationText: '发送验证码' });
                }
              }, 1000);
            } else {
              wx.showToast({ title: data.msg });
            }
          });
      }
    }
  },
  //点击切换到注册
  toRegist: function () {
    wx.showLoading({ title: '正在切换', mask:true });
    if (this.data.toRegistTxt == "注册") {
      this.setData({ toRegistTxt: "登录" });
      this.setData({ loginBtnTxt: "注册" });
    } else {
      this.setData({ loginBtnTxt: "登录" });
      this.setData({ toRegistTxt: "注册" });
    }
    setTimeout(function () {
      wx.hideLoading();
    }, 150);
  },
  //切换为家长端
  toTeacher: function () {
    wx.redirectTo({
      url: '/pages/parent/login/login'
    })
  },
  //手机号输入后检查合法性
  checkMobile: function (e) {
    this.setData({ userPhone: e.detail.value });
    if (this.data.userPhone.length > 0) {
      this.setData({ hasMobile: true });
    }
    if (e.detail.value.trim().length > 11) {
      this.setData({ userPhone: e.detail.value.trim().substring(0, 11) });
    } else {
      this.setData({ userPhone: e.detail.value.trim() });
    }
    var app = getApp();
    if (app.validatemobile(this.data.userPhone)) {
      this.setData({ loginBtnCls: 'login-btn' });
      this.setData({ sendable: true });
    } else {
      this.setData({ loginBtnCls: 'login-btn login-btn-disabled' });
      this.setData({ sendable: false });
    }
  },
  //清除手机号
  clearMobile: function () {
    this.setData({ userPhone: "" });
    this.setData({ hasMobile: false });
  },
  //监听验证码输入传值
  inputYzm: function (event) {
    if (event.detail.value.trim().length > 4) {
      this.setData({ yzm: event.detail.value.trim().substring(0, 4) });
    } else {
      this.setData({ yzm: event.detail.value.trim() });
    }
  }
})