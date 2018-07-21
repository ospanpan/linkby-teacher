Page({
  data: {
    hideview:false,
    interactionCount: 0,  //班级圈互动数量

  },
  onLoad: function () {
    this.getInteractionCount(); //获取班级圈互动数量

  },
  deleteCircle:function(){
    this.setData({ hideview:true});
  },
  deleteEnter: function () {
    this.setData({ hideview: false });
  },

  //获取班级圈互动数量
  getInteractionCount: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetInteractionCount,
      {
        'userId': app.globalData.userInfo.user.id,
        'classesId': app.globalData.userInfo.user.curClassesId,
        'schoolId': app.globalData.userInfo.family.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ interactionCount: data.data });
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  }

})