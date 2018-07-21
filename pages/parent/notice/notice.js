Page({
  data: {
    noticeId: '',
    notice: null,
    hiddenLoading: false
  },
  onLoad: function (option) {
    var curModule = this;
    curModule.setData({ noticeId: option.noticeId });
    curModule.getNoticeDetails();
  },
  onUnload: function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.getNoticeList();
  },
  //获取通知详细信息
  getNoticeDetails: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetNoticeDetails,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'noticeId': curModule.data.noticeId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ notice: data.data });
          curModule.markNoticeReaded();
        } else {
          wx.showToast({ title: data.msg });
        }
        setTimeout(function () {
          curModule.setData({ hiddenLoading: true });
        }, 150);
      }, function () {
        wx.showToast({ title: "获取失败" });
        setTimeout(function () {
          curModule.setData({ hiddenLoading: true });
        }, 150);
      });
  },

  //标记为已读 
  markNoticeReaded: function(){
    var curModule = this;
    var app = getApp();
    app.post_api_data(app.globalData.api_URL.MarkNoticeReaded,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'noticeId': curModule.data.noticeId,
        'student': app.globalData.userInfo.family.student,
        'studentId': app.globalData.userInfo.family.studentId,
        'appellation': app.globalData.userInfo.family.appellation,
        'familyId': app.globalData.userInfo.family.id
      },
      function (data) { }, function () { });
  },

})