// pages/teacher/create/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidePullDown: true,
    hidePullUp: true,
    hideNoMore: true,
    isRelease: false,
    showRelease: true,
    showNoticeList: false,
    homeworkList: [],     //作业列表数据
    lastHomework: null,   //最后一条作业
    curPage_homework: 0,  //作业列表当前页码
    totalPage_homework: 0 //作业列表总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reloadInfo();
  },
  //班级切换后重新更新页面数据
  reloadInfo: function () {
    var app = getApp();
    var curModule = this;
    curModule.setData({ homeworkList: [] });
    curModule.setData({ lastHomework: null });
    curModule.setData({ curPage_homework: 0 });

    curModule.getLastPubHomework(); //获取发布的最后一条作业
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.getHomeworkList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_homework > curModule.data.curPage_homework) {
        curModule.setData({ hideNoMore: false });
      } else {
        curModule.setData({ hideNoMore: true });
      }
    }); //获取作业分页列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  switchTabs: function () {
    this.setData({
      showRelease: true
    })
  },
  switchTabsTwo: function () {
    this.setData({
      showRelease: false
    })
  },
  switchTaskTabs: function () {
    this.setData({
      showNoticeList: false
    })
  },
  switchTaskTabsTwo: function () {
    this.setData({
      showNoticeList: true
    })
  },
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var id = event.currentTarget.dataset.id;
    var imgArr = [];
    for (var i = 0; i < this.data.dynamicsList.length; i++) {
      if (this.data.dynamicsList[i].dynamics.id == id) {
        imgArr = this.data.dynamicsList[i].dynamics.imgArr;
        break;
      }
    }
    //图片预览  本地图片不能预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    });
  },

  loadMoreHomework: function(){
    var curModule = this;
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullUp: false });
    setTimeout(function(){
      if (curModule.data.totalPage_homework > curModule.data.curPage_homework) {
        curModule.getHomeworkList(function () {
          curModule.setData({ hidePullUp: true });
          if (curModule.data.totalPage_homework > curModule.data.curPage_homework) {
            curModule.setData({ hideNoMore: true });
          } else {
            curModule.setData({ hideNoMore: false });
          }
        });
      }  
    }, 300);      
  },

  refreshHomework: function(){
    var curModule = this;
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.setData({ curPage_homework:0 });
    curModule.getHomeworkList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_homework > curModule.data.curPage_homework) {
        curModule.setData({ hideNoMore: true });
      } else {
        curModule.setData({ hideNoMore: false });
      }
    });
  },

  refreshLastHomework: function(){
    
  },

  //获取发布的最后一条作业
  getLastPubHomework: function (sucFun) {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetLastPubHomework,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          var homework = data.data;
          if (homework.id != null) {
            var today = new Date();
            var lastPubDate = new Date(homework.createDate);
            curModule.setData({ isRelease: (today.getFullYear() == lastPubDate.getFullYear() && today.getMonth() == lastPubDate.getMonth() && today.getDate() == lastPubDate.getDate()) });
            if (typeof (homework.imageIds) == "string" && homework.imageIds.trim().length > 0) {
              homework.imageIds = homework.imageIds.split(',')[0];
            } else {
              homework.imageIds = '/icons/img1.png';
            }
            curModule.setData({ lastHomework: homework });
          } else {
            curModule.setData({ isRelease: false });
          }
          if (typeof (sucFun) == "function") {
            sucFun(homework);
          }
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //获取作业分页列表
  getHomeworkList: function (sucFun) {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetHomeworkList,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'pageSize': 10,
        'page': (curModule.data.curPage_homework + 1)
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ curPage_homework: data.data.curPage });
          curModule.setData({ totalPage_homework: data.data.pageCount });
          curModule.setData({ homeworkList: data.data.dataList });          
        } else {
          wx.showToast({ title: data.msg });
        }
        if(typeof(sucFun)=="function"){
          sucFun();
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //跳转到作业详细页
  toHomeworkDetails: function (event) {
    var homeworkId = event.currentTarget.dataset.id;
    var classesId = event.currentTarget.dataset.classesid;
    var schoolId = event.currentTarget.dataset.schoolid;
    wx.navigateTo({ url: '/pages/teacher/task/check/check?homeworkId=' + homeworkId + '&classesId=' + classesId + '&schoolId' + schoolId });
  },
  //跳转到发布作业
  toReleaseHomework: function () {
    wx.navigateTo({ url: '/pages/teacher/releasetask/releasetask' });
  },
  //显示刚刚时间类
  getDateDiff: function (dateStr) {
    var publishTime = this.getDateTimeStamp(dateStr) / 1000,
      d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = parseInt(new Date().getTime() / 1000),
      d,

      date = new Date(publishTime * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }
    if (H < 10) {
      H = '0' + H;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
      return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
      if (d_seconds <= 0) {
        return '刚刚';
      } else {
        return d_seconds + '秒前';
      }
    } else if (d_days >= 3 && d_days < 30) {
      return M + '-' + D + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
    }
  },
  getDateTimeStamp: function (dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
  }
})