// pages/teacher/create/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teacherInfo: null,  //当前教师信息
    allClasses: []      //当前教师所有班级信息
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
    this.setData({ teacherInfo: app.globalData.userInfo.teacher });  //设置当前教师信息
    this.getAllClasses();   //获取当前教师所有班级列表
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toClassManager: function () {
    wx.navigateTo({
      url: '/pages/teacher/class/manage/manage'
    })
  },
  toCreateManager: function () {
    wx.navigateTo({
      url: '/pages/teacher/create/class/class?source=my'
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
  //教师获取所有班级信息
  getAllClasses: function () {
    var curModule = this;
    var app = getApp();
    wx.showLoading({ title: '正在加载...' });
    app.get_api_data(app.globalData.api_URL.GetAllClasses_Teacher,
      {
        'teacherId': app.globalData.userInfo.teacher.id,
        'schoolId': app.globalData.userInfo.teacher.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          var currentClasses = null;
          var otherClassesArr = [];
          var newClassesArr = [];
          for (var i = 0; i < data.data.length; i++) {
            if (app.globalData.userInfo.teacher.curClassesId == data.data[i].classesId) {
              currentClasses = data.data[i];
            } else {
              otherClassesArr.push(data.data[i]);
            }
          }
          newClassesArr.push(currentClasses);
          curModule.setData({ allClasses: newClassesArr.concat(otherClassesArr) });
        } else {
          wx.showToast({ title: data.msg });
        }
        wx.hideLoading();
      }, function () {
        wx.showToast({ title: "获取失败" });
        wx.hideLoading();
      });
  },
  //切换班级
  toChangeClasses: function (event) {
    var curModule = this;
    var classId = event.currentTarget.dataset.classid;
    var schoolId = event.currentTarget.dataset.schoolid;
    var app = getApp();
    wx.showLoading({ title: '正在切换', mask: true });
    app.post_api_data(app.globalData.api_URL.TeacherTransferClasses,
      {
        curClassesId: classId,
        id: app.globalData.userInfo.teacher.id,
        userId: app.globalData.userInfo.user.id,
        schoolId: schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          app.globalData.userInfo.user.curClassesId = classId;
          app.globalData.userInfo.teacher.curClassesId = classId;
          app.globalData.userInfo.teacher.schoolId = schoolId;
          curModule.reloadInfo();
          wx.showToast({ title: '切换完成', icon: "success" });
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
  //管理班级
  toManageClasses: function (event) {
    var classId = event.currentTarget.dataset.classid;
    var schoolId = event.currentTarget.dataset.schoolid;
    var className = event.currentTarget.dataset.classname;
    wx.navigateTo({ url: '/pages/teacher/class/manage/manage?classId=' + classId + '&schoolId=' + schoolId + '&className=' + encodeURIComponent(className) });
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
  },
  //退出
  toLogout: function () {
    wx.showLoading({ title: '正在退出', mask: true });
    var app = getApp();
    app.globalData.userInfo = null;
    wx.redirectTo({ url: '/pages/teacher/login/login' });
    setTimeout(function () {
      wx.hideLoading();
    }, 150);
  },

})