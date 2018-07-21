Page({
  data: {
    title: '',
    content: ''
  },
  onLoad: function () {

  },
  //标题输入监听
  title_input: function (event) {
    if (event.detail.value.trim().length > 50) {
      this.setData({ title: event.detail.value.trim().substring(0, 50) });
    } else {
      this.setData({ title: event.detail.value.trim() });
    }
  },
  //内容输入监听
  content_input: function (event) {
    if (event.detail.value.trim().length > 100) {
      this.setData({ content: event.detail.value.trim().substring(0, 100) });
    } else {
      this.setData({ content: event.detail.value.trim() });
    }
  },
  //发布通知保存
  PubNotice: function () {
    if (this.data.title.length == 0) {
      wx.showToast({ title: '请输入通知标题' });
      return;
    }
    if (this.data.content.trim().length == 0) {
      wx.showToast({ title: '请输入通知内容' });
      return;
    }
    var curModule = this;
    var app = getApp();
    wx.showLoading({ title: '正在发布',mask:true });
    app.post_api_data(app.globalData.api_URL.PubNotice,
      {
        content: curModule.data.content,
        title: curModule.data.title,
        classesId: app.globalData.userInfo.teacher.curClassesId,
        schoolId: app.globalData.userInfo.teacher.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          wx.showToast({ title: '发布成功' });
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.getLastNotice();
          prevPage.getNoticeList();
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
  }
})