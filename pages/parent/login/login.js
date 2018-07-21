Page({
  data: {
    //用户输入手机号
    userPhone: '',
    //验证码
    yzm: '',
    //是否显示清除按钮
    isShowClear: false,
    //是否显示验证码正确图标
    isShowCorrect: false,
    verificationText: '发送验证码',
    //登录按钮样式
    loginBtnCls: 'login-btn login-btn-disabled',
    //是否可以发送验证码
    sendable: false,
    //显示错误提示
    isShowError: false,
    //班级测试数据
    classList: [
      { value: '平阳中学初一（1）班', classID: '001' },
      { value: '水头一中初三（3）班', classID: '002' },
      { value: '赵河中学初二（2）班', classID: '003' }
    ],
    //显示加入班级
    hideview:false,
    //是否显示快捷登录
    isPhoneLogin:true
  },
  onLoad: function () {

  },
  toHomePage: function () {
    if (this.data.loginBtnCls == "login-btn") {

      if (this.data.userPhone.length != 11) {
        this.setData({ isShowError: true });
        return;
      }
      this.setData({ hideview:true});
    }
  },
  //发送验证码
  sendVerification: function () {
    var loginModule = this;
    if (this.data.verificationText == '发送验证码' && this.data.sendable) {
      var app = getApp();
      if (app.validatemobile(this.data.userPhone)) {
        app.post_api_data(app.globalData.api_URL.GetLoginYzm,
          { 'phoneNum': this.data.userPhone }, function (data) {
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
  //监听验证码输入
  yzm_input: function(event){
    if (event.detail.value.trim().length > 4) {
      this.setData({ yzm: event.detail.value.trim().substring(0, 4) });
    } else {
      this.setData({ yzm: event.detail.value.trim() });
    }
  },
  //执行登录
  toLogin: function(){
    var loginModule = this;
    if (this.data.loginBtnCls == "login-btn") {
      var app = getApp();
      if (!app.validatemobile(this.data.userPhone)) {
        wx.showToast({ title: '请输入手机号码' });
        return;
      } else if (loginModule.data.yzm.length != 4) {
        wx.showToast({ title: '请输入验证码' });
        return;
      } else {
          app.post_api_data(app.globalData.api_URL.DoLogin,
            { 'user.phoneNum': loginModule.data.userPhone, 'yzm': loginModule.data.yzm, 'type': 1 },
            function (data) {
              if (data.apiStatus == "200") {
                app.globalData.userInfo = data.data;
                console.log('登录成功' + JSON.stringify(data.data));
                wx.redirectTo({ url: '/pages/parent/homepage/homepage' });
              } else {
                wx.showToast({ title: data.msg });
              }
            }, function () {
              wx.showToast({ title: "操作失败" });
            });
        }
    }
  },
  //切换教师端
  toTeacher: function () {
    wx.redirectTo({
      url: '/pages/teacher/login/login'
    })
  },
  //清除手机号
  cleanUserPhone: function () {
    this.setData({ userPhone: '',
      isShowClear: false,
      sendable: false, 
      loginBtnCls: 'login-btn login-btn-disabled' });
  },  
  showCorrect: function (val) {
    if (val.detail.cursor > 3) {
      this.setData({ isShowCorrect: true });
    }
    else {
      this.setData({ isShowCorrect: false });
    }
  },
  goToHomePage:function(){
    wx.redirectTo({
      url: '../homepage/homepage'
    })
  },
  inputLogin:function(){
    this.setData({ isPhoneLogin: false });
  },

  //监听手机号输入
  userPhone_input:function(event){
    if (event.detail.value.trim().length > 11) {
      this.setData({ userPhone: event.detail.value.trim().substring(0, 11) });
    } else {
      this.setData({ userPhone: event.detail.value.trim() });
    }
    if(this.data.userPhone.length>0){
      this.setData({ isShowClear: true });
    }else{
      this.setData({ isShowClear: false });
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


})