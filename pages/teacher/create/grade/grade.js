Page({
  data: {
    selGradeId: '',
    selGradeName: '',
    allGrades: []
  },
  onLoad: function (option) {
    console.log(JSON.stringify(option));
    wx.showLoading({ title: '正在加载', mask:true });
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetAllGrades, {},
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ allGrades: data.data });
          if (typeof (option.selGradeId) == "string" && option.selGradeId.length>0) {
            curModule.setData({ selGradeId: option.selGradeId });
            for (var i = 0; i < curModule.data.allGrades.length; i++){
              for (var j = 0; j < curModule.data.allGrades[i].gradeList.length; j++){
                if (option.selGradeId == curModule.data.allGrades[i].gradeList[j].id){
                  curModule.setData({ selGradeName: curModule.data.allGrades[i].title + "-" + curModule.data.allGrades[i].gradeList[j].title });
                  break;
                }
              }
            }
          }else{
            if (curModule.data.allGrades.length>0){
              var firstGrade = curModule.data.allGrades[0];
              if (firstGrade.gradeList.length>0){
                curModule.setData({ selGradeId: firstGrade.gradeList[0].id, selGradeName: firstGrade.title + "-" + firstGrade.gradeList[0].title });
              }              
            }
          }
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
  onUnload: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      gradeId: this.data.selGradeId,
      gradeName: this.data.selGradeName
    });
  },
  //点击选中年级
  selectGrade: function (event) {
    this.setData({ selGradeId: event.currentTarget.dataset.id });
    this.setData({ selGradeName: event.currentTarget.dataset.name });
    wx.navigateBack();
  }
})