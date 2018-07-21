Page({
  data: {
    student: '',
    phoneNum: '',
    appellation: '妈妈',
    appellationType: 1,
    classId: '',
    schoolId: '',
    appellationTypeArr: [{ id: '0', text: '爸爸' }, { id: '1', text: '妈妈' }, { id: '2', text: '姐姐' },
      { id: '3', text: '哥哥' }, { id: '4', text: '爷爷' }, { id: '5', text: '奶奶' }]
  },
  onLoad: function (option) {
    this.setData({ classId: option.classId });
    this.setData({ schoolId: option.schoolId });
  },

  //监听学生姓名输入
  student_input: function (event) {
    if (event.detail.value.trim().length > 10) {
      this.setData({ student: event.detail.value.trim().substring(0, 10) });
    } else {
      this.setData({ student: event.detail.value.trim() });
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
  //点击确定
  saveStudent: function () {
    var app = getApp();
    var curModule = this;
    if (curModule.data.student.length == 0) {
      wx.showToast({ title: '请输入学生姓名' });
      return;
    }
    if (curModule.data.appellationType.length == 0) {
      wx.showToast({ title: '请选择家属关系' });
      return;
    }
    if (app.validatemobile(curModule.data.phoneNum)) {
      wx.showLoading({ title: '正在保存', mask:true });
      app.post_api_data(app.globalData.api_URL.AddStudentFamily,
        {
          'student.realName': curModule.data.student,
          'student.classesId': curModule.data.classId,
          'student.schoolId': curModule.data.schoolId,
          'student.phoneNum': curModule.data.phoneNum,
          'family.student': curModule.data.student,
          'family.appellation': curModule.data.appellation,
          'family.appellationType': curModule.data.appellationType,
          'family.classesId': curModule.data.classId,
          'family.schoolId': curModule.data.schoolId,
          'user.phoneNum': curModule.data.phoneNum,
          'user.curClassesId': curModule.data.classId
        },
        function (data) {
          if (data.apiStatus == "200") {
            wx.showToast({ title: '添加成功' });
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
  }

})