Page({
  data: {
    schoolName: '',
    gradeName: '',
    gradeId: '',
    classNo: '',
    source: ''
  },
  onLoad: function (option) {
    var app = getApp();
    if (app.globalData.userInfo != null) {
      this.setData({ schoolName: app.globalData.userInfo.school.realName });
    }
    this.setData({ source: option.source });
  },
  selGrade: function () {
    wx.navigateTo({
      url: '/pages/teacher/create/grade/grade?selGradeId=' + this.data.gradeId
    })
  },
  classNo_input: function (event) {
    if (event.detail.value.trim().length > 10) {
      this.setData({ classNo: event.detail.value.trim().substring(0, 10) });
    } else {
      this.setData({ classNo: event.detail.value.trim() });
    }
  },
  saveClasses: function () {
    var curModule = this;
    if (this.data.gradeId.trim().length == 0) {
      wx.showToast({ title: '请选择年级' });
      return;
    }
    if (this.data.classNo.trim().length == 0) {
      wx.showToast({ title: '请输入班级' });
      return;
    }
    var app = getApp();
    wx.showLoading({ title: '正在保存', mask:true });
    app.post_api_data(app.globalData.api_URL.CreateClasses,
      {
        'teacherId': app.globalData.userInfo.teacher.id,
        'schoolId': app.globalData.userInfo.school.id,
        'classes.alias': curModule.data.classNo,
        'classes.schoolId': app.globalData.userInfo.school.id,
        'classes.grade': curModule.data.gradeId,
        'classes.classNo': curModule.data.classNo
      },
      function (data) {
        if (data.apiStatus == "200") {
          app.globalData.userInfo.classes = data.data.classes;
          app.globalData.userInfo.user.curClassesId = data.data.classes.id;
          app.globalData.userInfo.teacher.schoolId = data.data.classes.schoolId;
          app.globalData.userInfo.teacher.curClassesId = data.data.classes.id;
          
          if (curModule.data.source=="my"){
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.getAllClasses();
            wx.navigateBack();
          }else{
            wx.redirectTo({ url: '/pages/teacher/create/import/import' });
          }          
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
  }
})