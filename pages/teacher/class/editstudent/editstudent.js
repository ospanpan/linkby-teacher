// pages/teacher/class/editstudent/editstudent.js
Page({
  // 页面的初始数据
  data: {
    studentId: '',
    realName: '',
    classesId: '',
    schoolId: '',
    phoneNum: '',
    appellation: '',
    appellationType: 0,
    family: null,
    appellationTypeArr: [{ id: '0', text: '爸爸' }, { id: '1', text: '妈妈' }, { id: '2', text: '姐姐' },
      { id: '3', text: '哥哥' }, { id: '4', text: '爷爷' }, { id: '5', text: '奶奶' }]
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({ title: '正在加载', mask:true });
    this.setData({ studentId: options.studentId });
    this.setData({ classesId: options.classId });
    this.setData({ schoolId: options.schoolId });

    this.getStudentFamily(); //获取学生和家长信息
  },
  //获取学生和家长信息
  getStudentFamily: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetStudentFamilies,
      {
        'classesId': curModule.data.classesId,
        'schoolId': curModule.data.schoolId,
        'studentId': curModule.data.studentId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ realName: data.data.student.realName });
          curModule.setData({ phoneNum: data.data.student.phoneNum });
          curModule.setData({ appellation: data.data.families[0].appellation });
          curModule.setData({ appellationType: data.data.families[0].appellationType });
          curModule.setData({ family: data.data.families[0] });
        } else {
          wx.showToast({ title: data.msg });
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 150);
      }, function () {
        wx.showToast({ title: "获取失败" });
        setTimeout(function () {
          wx.hideLoading();
        }, 150);
      });
  },

  //选择家属关系
  bindAppellationChange: function (event) {
    this.setData({ appellationType: event.detail.value });
    for (var i = 0; i < this.data.appellationTypeArr.length; i++) {
      if (this.data.appellationTypeArr[i].id == event.detail.value) {
        this.setData({ appellation: this.data.appellationTypeArr[i].text });
        break;
      }
    }
  },
  //监听学生姓名输入
  student_input: function (event) {
    if (event.detail.value.trim().length > 10) {
      this.setData({ realName: event.detail.value.trim().substring(0, 10) });
    } else {
      this.setData({ realName: event.detail.value.trim() });
    }
  },
  //监听电话号码输入
  phoneNum_input: function (event) {
    if (event.detail.value.trim().length > 11) {
      this.setData({ phoneNum: event.detail.value.trim().substring(0, 11) });
    } else {
      this.setData({ phoneNum: event.detail.value.trim() });
    }
  },
  //保存
  saveStudent: function () {
    var app = getApp();
    var curModule = this;
    if (curModule.data.realName.length == 0) {
      wx.showToast({ title: '请输入学生姓名' });
      return;
    }
    if (curModule.data.appellationType.length == 0) {
      wx.showToast({ title: '请选择家属关系' });
      return;
    }
    if (app.validatemobile(curModule.data.phoneNum)) {
      wx.showLoading({ title: '正在保存', mask:true });
      app.post_api_data(app.globalData.api_URL.UpdateStudentFamily,
        {
          'student.id': curModule.data.studentId,
          'student.realName': curModule.data.realName,
          'student.classesId': curModule.data.classesId,
          'student.schoolId': curModule.data.schoolId,
          'student.phoneNum': curModule.data.phoneNum,
          'family.id': curModule.data.family.id,
          'family.student': curModule.data.realName,
          'family.appellation': curModule.data.appellation,
          'family.appellationType': curModule.data.appellationType,
          'family.classesId': curModule.data.classesId,
          'family.schoolId': curModule.data.schoolId,
          'user.phoneNum': curModule.data.phoneNum,
          'user.id': curModule.data.family.userId
        },
        function (data) {
          if (data.apiStatus == "200") {
            wx.showToast({ title: '保存成功' });
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.getAllStudents();
            wx.navigateBack();
          } else {
            wx.showToast({ title: data.msg });
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 150);
        }, function (err) {
          wx.showToast({ title: '操作失败' });
          setTimeout(function () {
            wx.hideLoading();
          }, 150);
        });
    } else {
      wx.showToast({ title: '请输入手机号码' });
      return;
    }
  },


})