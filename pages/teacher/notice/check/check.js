Page({
  data: {
    wwc:true,
    noticeId: '',
    classesId: '',
    schoolId: '',
    notice: { totalStudents: 0, readStudents:0},
    readList: [],
    unreadList: []
  },
  onLoad: function (option) {
    var curModule = this;
    curModule.setData({ noticeId: option.noticeId });
    curModule.setData({ classesId: option.classesId });
    curModule.setData({ schoolId: option.schoolId });
    wx.showLoading({ title: '正在加载',mask:true });
    curModule.getNoticeDetails(function () {
      curModule.getNoticeReadInfo();
    });
  },
  noComplete:function(){
    this.setData(
      {wwc:true}
    );
  },
  complete: function () {
    this.setData(
      { wwc: false }
    );
  },
  //获取通知详细信息
  getNoticeDetails: function(sucFun){
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetNoticeDetails,
      {
        'classesId': curModule.data.classesId,
        'schoolId': curModule.data.schoolId,
        'noticeId': curModule.data.noticeId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ notice: data.data });
          if (typeof (sucFun) == "function") {
            sucFun(data);
          }
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //获取通知阅读情况
  getNoticeReadInfo: function(){
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetNoticeReadInfo,
      {
        'classesId': curModule.data.classesId,
        'schoolId': curModule.data.schoolId,
        'noticeId': curModule.data.noticeId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ readList: data.data.readList });
          curModule.setData({ unreadList: data.data.unreadList });
        } else {
          wx.showToast({ title: data.msg });
        }
        setTimeout(function(){
          wx.hideLoading();
        }, 150);
      }, function () {
        wx.showToast({ title: "获取失败" });
        setTimeout(function () {
          wx.hideLoading();
        }, 150);
      });
  }

})