Page({
  data: {
    realName: '',
    schoolName: ''
  },
  onLoad: function () {

  },
  //点击确认按钮
  toSave: function () {
    var confirmModule = this;
    if (this.data.realName.trim().length == 0) {
      wx.showToast({ title: '请输入您的真实姓名' });
      return;
    }
    if (this.data.schoolName.trim().length == 0) {
      wx.showToast({ title: '请输入您的学校' });
      return;
    }
    var app = getApp();
    wx.showLoading({ title: '正在保存', mask:true });
    app.post_api_data(app.globalData.api_URL.SaveBasicInfo,
      {
        userId: app.globalData.userInfo.user.id,
        teacherId: app.globalData.userInfo.teacher.id,
        realName: confirmModule.data.realName,
        schoolName: confirmModule.data.schoolName
      },
      function (data) {
        if (data.apiStatus == "200") {
          app.globalData.userInfo.school = { id: data.data.schoolId, realName: confirmModule.data.schoolName };
          app.globalData.userInfo.teacher.realName = confirmModule.data.realName;
          app.globalData.userInfo.teacher.schoolId = data.data.schoolId;
          app.globalData.userInfo.user.curClassesId = '';
          app.globalData.userInfo.teacher.curClassesId = '';
          wx.redirectTo({ url: '/pages/teacher/create/createClass/createClass' });
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
  //监听姓名输入
  input_realName: function (event) {
    if (event.detail.value.trim().length > 10) {
      this.setData({ realName: event.detail.value.trim().substring(0, 10) });
    } else {
      this.setData({ realName: event.detail.value.trim() });
    }
  },
  //监听学校名称输入
  input_schoolName: function (event) {
    if (event.detail.value.trim().length > 20) {
      this.setData({ schoolName: event.detail.value.trim().substring(0, 20) });
    } else {
      this.setData({ schoolName: event.detail.value.trim() });
    }
  }
})