Page({
  data: {
    schoolName: '',
    gradeName: '',
    gradeId: '',
    classNo: '',
    schoolId: '',
    classId: '',
    curSchool: null,
    curClasses: null
  },
  onLoad: function (option) {
    wx.showLoading({ title: '正在加载', mask:true });
    this.setData({ schoolId: option.schoolId });
    this.setData({ classId: option.classId });

    this.getClassesDetails(); //获取班级详细信息
  },
  //获取班级详细信息
  getClassesDetails: function () {
    var app = getApp();
    var curModule = this;
    app.get_api_data(app.globalData.api_URL.GetClassDetails,
      {
        'classesId': curModule.data.classId,
        'schoolId': curModule.data.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ curSchool: data.data.school });
          curModule.setData({ curClasses: data.data.classes });

          curModule.setData({ schoolName: data.data.school.realName });
          curModule.setData({ gradeName: data.data.gradeName });
          curModule.setData({ classNo: data.data.classes.alias });
          curModule.setData({ gradeId: data.data.classes.grade });
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

  schoolName_input: function (event) {
    if (event.detail.value.trim().length > 20) {
      this.setData({ schoolName: event.detail.value.trim().substring(0, 20) });
    } else {
      this.setData({ schoolName: event.detail.value.trim() });
    }
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
    var app = getApp();
    var curModule = this;
    wx.showLoading({ title: '正在保存', mask:true });
    app.post_api_data(app.globalData.api_URL.UpdateClasses,
      {
        'school.id': curModule.data.schoolId,
        'school.realName': curModule.data.schoolName,
        'classes.id': curModule.data.classId,
        'classes.alias': curModule.data.classNo,
        'classes.grade': curModule.data.gradeId,
        'classes.classNo': curModule.data.classNo,
        'classes.schoolId': curModule.data.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          wx.showToast({ title: '更改成功' });
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.getClassesDetails();
          var myClassesPage = pages[pages.length - 3];
          myClassesPage.getAllClasses();
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
  },
})