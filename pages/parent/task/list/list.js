Page({
  data: {
    homeworkId: '',
    showDate: '',
    completeList: [],
    myCompletion: null,
    hiddenLoading: false
  },
  onLoad: function (option) {
    var curModule = this;
    curModule.setData({ homeworkId: option.homeworkId });
    var updateDate = new Date(option.date);
    var year = updateDate.getFullYear();
    var month = updateDate.getMonth() + 1;
    var strDate = updateDate.getDate();
    curModule.setData({ showDate: year +"-"+ month + "-" + strDate + "  周" + "日一二三四五六".charAt(updateDate.getDay())});
    curModule.getHomeworkCompletion();
  },
  //获取作业完成情况
  getHomeworkCompletion: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetHomeworkCompletion,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'homeworkId': curModule.data.homeworkId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ completeList: data.data.completeList }); 
          for(var i=0; i<data.data.completeList.length; i++){
            if (data.data.completeList[i].studentId == app.globalData.userInfo.family.studentId){
              data.data.completeList[i].index = (i+1);
              curModule.setData({ myCompletion: data.data.completeList[i] }); 
            }
          }
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
  }
  
})