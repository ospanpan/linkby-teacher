//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  AppID: 'wx261219aa3350e382',
  Secret: 'd707e8b9d631872d3918b9b0b754241a',
  globalData: {
   userInfo: { "user": { "id": "6a0625d2be735b50", "phoneNum": "15658860588", "uuId": null, "icon": null, "province": null, "city": null, "isEnable": 1, "isDel": 0, "curClassesId": null }, "teacher": { "id": "d95d8f2a7e8e969c", "schoolId": "c307104a9836bbc2", "realName": "小爱", "userId": "6a0625d2be735b50", "phoneNum": "15658860588", "isDel": 0, "curClassesId": "947e0010c1a4d11e" }, "family": null, "school": { "id": "c307104a9836bbc2", "realName": "幼儿园", "province": null, "city": null, "isDel": 0 }, "token": { "userId": "6a0625d2be735b50", "token": "A76FFBEF73F5730A078B39BAFD640F8E", "timestamp": "2018-05-09 22:08", "uuid": null, "phoneNum": "15658860588" } },
    // userInfo: { "user": { "id": "e1eccbe78b61e7a0", "phoneNum": "18912341234", "uuId": null, "icon": null, "province": null, "city": null, "isEnable": 1, "isDel": 0, "curClassesId": "947e0010c1a4d11e" }, "teacher": null, "family": { "id": "168b74084f17e2ec", "student": "陈海波", "studentId": "711bb61706fc5aec", "appellation": "哥哥", "appellationType": 3, "classesId": "947e0010c1a4d11e", "schoolId": "c307104a9836bbc2", "userId": "e1eccbe78b61e7a0", "isDel": 0 }, "school": null, "token": { "userId": "e1eccbe78b61e7a0", "token": "98631C789032989BCB18964B7882BF64", "timestamp": "2018-05-15 22:56", "uuid": null, "phoneNum": "18912341234" } },
    api_URL: {
      UploadUrl: 'https://api.linkby.cn/ImgUpload/ImgUploadHandler.ashx', //图片上传接口

      GetLoginYzm: 'https://api.linkby.cn/API/Yzm/GetLoginYzm',  //获取登录验证码
      GetZcYzm: 'https://api.linkby.cn/API/Yzm/GetZcYzm', //获取注册验证码
      CheckYzm: 'https://api.linkby.cn/API/Yzm/CheckYzm',  //检查验证码是否有效
      RegisterSave: 'https://api.linkby.cn/API/Register/RegisterSave',  //注册信息保存
      DoLogin: 'https://api.linkby.cn/API/Login/DoLogin',  //登录
      UpdateUserInfo: 'https://api.linkby.cn/API/Login/UpdateUserInfo', //更新用户头像，微信openId, 省份，城市
      GetToken: 'https://api.linkby.cn/API/Login/GetToken', //请求Token
      SaveBasicInfo: 'https://api.linkby.cn/API/Teacher/SaveBasicInfo', //完善信息
      GetAllGrades: 'https://api.linkby.cn/API/Constant/GetAllGrades', //获取年级常量列表
      CreateClasses: 'https://api.linkby.cn/API/Classes/CreateClasses', //创建班级保存
      GetLastPubHomework: 'https://api.linkby.cn/API/Homework/GetLastPubHomework',  //获取当前班级发布的最后一条作业
      PubHomework: 'https://api.linkby.cn/API/Homework/PubHomework',  //发布作业
      GetHomeworkList: 'https://api.linkby.cn/API/Homework/GetHomeworkList', //获取作业分页列表
      GetAllClasses_Teacher: 'https://api.linkby.cn/API/Teacher/GetAllClasses', //教师获取所有班级信息
      GetStudents: 'https://api.linkby.cn/API/Classes/GetStudents', //获取班级所有学生
      AddStudentFamily: 'https://api.linkby.cn/API/Classes/AddStudentFamily', //添加学生家长
      GetClassDetails: 'https://api.linkby.cn/API/Classes/GetClassDetails', //获取班级详细信息
      UpdateClasses: 'https://api.linkby.cn/API/Classes/UpdateClasses', //更新班级保存
      GetStudentFamilies: 'https://api.linkby.cn/API/Classes/GetStudentFamilies', //获取学生家长
      UpdateStudentFamily: 'https://api.linkby.cn/API/Classes/UpdateStudentFamily', //更新学生和家长信息
      GetHomeworkDetails: 'https://api.linkby.cn/API/Homework/GetDetails', //获取作业详细信息
      GetHomeworkCompletion: 'https://api.linkby.cn/API/Homework/GetCompletion', //获取作业完成情况
      GetLastNotice: 'https://api.linkby.cn/API/Notice/GetLastNotice', //获取最后一条通知
      PubNotice: 'https://api.linkby.cn/API/Notice/PubNotice', //发布通知
      GetNoticeList: 'https://api.linkby.cn/API/Notice/GetNoticeList', //获取通知列表
      GetClassNoticeList: 'https://api.linkby.cn/API/Notice/GetClassNoticeList', //家长端通知分页列表（带自己阅读情况）
      TeacherTransferClasses: 'https://api.linkby.cn/API/Teacher/TransferClasses', //教师班级切换
      GetNoticeDetails: 'https://api.linkby.cn/API/Notice/GetDetails',  //获取通知详细信息
      GetNoticeReadInfo: 'https://api.linkby.cn/API/Notice/GetReadInfo', //获取通知阅读情况
      DelStudent: 'https://api.linkby.cn/API/Classes/DelStudent', //删除学生
      GetDynamicsList: 'https://api.linkby.cn/API/Dynamics/GetDynamicsList', //获取班级圈动态
      PubDynamics: 'https://api.linkby.cn/API/Dynamics/PubDynamics', //发布班级圈动态
      DelDynamics: 'https://api.linkby.cn/API/Dynamics/DelDynamics', //删除自己发的班级圈动态
      GetTecherDynamicsList: 'https://api.linkby.cn/API/Dynamics/GetTecherDynamicsList', //获取班级圈老师动态
      MarkHomeworkFinished: 'https://api.linkby.cn/API/Homework/MarkFinished',  //家长标记作业已完成
      MarkNoticeReaded: 'https://api.linkby.cn/API/Notice/MarkReaded',  //标记通知为已读
      GetAllClasses_Family: 'https://api.linkby.cn/API/Family/GetAllClasses', //家长获取所有班级信息
      FamilyTransferClasses: 'https://api.linkby.cn/API/Family/TransferClasses',  //家长切换班级
      GetCurrentFamilyUserInfo: 'https://api.linkby.cn/API/Family/GetCurrentUserInfo', //获取当前家长信息
      GetInteractionCount: 'https://api.linkby.cn/API/Message/GetInteractionCount', //获取班级圈互动数量
      AddSaveForm: 'https://api.linkby.cn/API/Form/AddSaveForm',  //用户表单id保存

      
    }
  },
  //全局验证手机号格式是否正确
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      return false;
    }
    if (mobile.length != 11) {
      return false;
    }
    var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!mobileReg.test(mobile)) {
      return false;
    }
    return true;
  },
  //发起get方式网络请求
  get_api_data: function (apiUrl, param, sucFun, errFun) {
    wx.request({
      url: apiUrl,
      method: "GET",
      data: param,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (typeof (sucFun) == "function") { sucFun(res.data); }
      },
      fail: function () {
        if (typeof (errFun) == "function") { errFun(); }
      }
    });
  },
  //post方式提交数据
  post_api_data: function (apiUrl, param, sucFun, errFun) {
    wx.request({
      url: apiUrl,
      method: "POST",
      data: param,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (typeof (sucFun) == "function") { sucFun(res.data); }
      },
      fail: function () {
        if (typeof (errFun) == "function") { errFun(); }
      }
    });
  }
})