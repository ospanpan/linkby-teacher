// pages/teacher/create/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //确认框
    showShadow: false,
    showHomepage: true,
    showNotice: false,
    showCircle: false,
    showMy: false,
    isRelease: false,
    showRelease: true,
    showNoticeList: false,
    homeworkList: [],     //作业列表数据

    lastHomework: null,   //最后一条作业
    curPage_homework: 0,  //作业列表当前页码

    lastNotice: null,   //最后一条通知
    curPage_notice: 0,  //通知列表当前页码
    noticeList: [],     //通知列表

    teacherInfo: null,  //当前教师信息
    allClasses: [],      //当前教师所有班级信息

    startX: 0, //开始坐标
    startY: 0, //开始坐标

    curPage_dynamics: 0,  //朋友圈列表当前页码
    dynamicsList: [],     //朋友圈列表
    delType: '',          //模态对话框来源类型
    delId: ''            //模态对话框对象Id
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
    this.setData({ homeworkList: [] });
    this.setData({ lastHomework: null });
    this.setData({ curPage_homework: 0 });
    this.setData({ noticeList: [] });
    this.setData({ lastNotice: null });
    this.setData({ curPage_notice: 0 });
    this.setData({ dynamicsList: [] });
    this.setData({ curPage_dynamics: 0 });

    this.getLastPubHomework(); //获取发布的最后一条作业
    this.getHomeworkList(); //获取作业分页列表

    this.getLastNotice(); //获取最后一条通知
    this.getNoticeList(); //获取通知分页列表

    this.getAllClasses();   //获取当前教师所有班级列表

    this.getDynamicsList();   //获取班级圈动态
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
  showHomepage: function () {
    this.setData({
      showHomepage: true,
      showNotice: false,
      showCircle: false,
      showMy: false
    });
  },
  showNotice: function () {
    this.setData({
      showHomepage: false,
      showNotice: true,
      showCircle: false,
      showMy: false
    });
  },
  showCircle: function () {
    this.setData({
      showHomepage: false,
      showNotice: false,
      showCircle: true,
      showMy: false
    });
  },
  showMy: function () {
    this.setData({
      showHomepage: false,
      showNotice: false,
      showCircle: false,
      showMy: true
    });
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
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.noticeList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      noticeList: this.data.noticeList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.noticeList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      noticeList: that.data.noticeList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  deleteCircle: function (event) {
    var id = event.currentTarget.dataset.id;
    this.setData({ delId: id });
    this.setData({ delType: 1 });
    this.setData({
      showShadow: true
    })
  },
  hideShadow: function () {
    this.setData({
      showShadow: false
    })
  },
  //删除确认点击
  delConfirm: function (event) {
    var id = event.currentTarget.dataset.id;
    var deltype = event.currentTarget.dataset.type;
    var curModule = this;
    var app = getApp();
    wx.showLoading({ title: '正在删除', mask: true });
    app.post_api_data(app.globalData.api_URL.DelDynamics,
      {
        'id': id,
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'userId': app.globalData.userInfo.user.id
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ showShadow: false });
          wx.showToast({ title: "删除成功" });
          curModule.getDynamicsList();
        } else {
          curModule.setData({ showShadow: false });
          wx.showToast({ title: data.msg });
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 150);
      }, function () {
        curModule.setData({ showShadow: false });
        wx.showToast({ title: "删除失败" });
      });


  },

  createCircle: function () {
    wx.navigateTo({
      url: '/pages/teacher/circle/createCircle/createCircle'
    })
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
  getHomeworkList: function () {
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
          curModule.setData({ homeworkList: data.data.dataList });
        } else {
          wx.showToast({ title: data.msg });
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
  //跳转到发布通知
  toPubNotice: function () {
    wx.navigateTo({ url: '/pages/teacher/notice/create/create' });
  },
  //跳转到通知详细页
  toNoticeDetails: function (event) {
    var noticeId = event.currentTarget.dataset.noticeid;
    var classesId = event.currentTarget.dataset.classesid;
    var schoolId = event.currentTarget.dataset.schoolid;
    wx.navigateTo({
      url: '/pages/teacher/notice/check/check?noticeId=' + noticeId + '&classesId=' + classesId + '&schoolId=' + schoolId
    });
  },

  //获取最后一条通知
  getLastNotice: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetLastNotice,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          if (data.data.id != null) {
            curModule.setData({ lastNotice: data.data });
          }
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //获取通知列表
  getNoticeList: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetNoticeList,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'pageSize': 10,
        'page': (curModule.data.curPage_notice + 1)
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ curPage_notice: data.data.curPage });
          curModule.setData({ noticeList: data.data.dataList });
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },

  //教师获取所有班级信息
  getAllClasses: function () {
    var curModule = this;
    var app = getApp();
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
      }, function () {
        wx.showToast({ title: "获取失败" });
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

  //班级圈动态获取
  getDynamicsList: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetDynamicsList,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'pageSize': 10,
        'page': (curModule.data.curPage_dynamics + 1)
      },
      function (data) {
        if (data.apiStatus == "200") {
          for (var i = 0; i < data.data.dataList.length; i++) {
            data.data.dataList[i].dynamics.showTimeTxt = curModule.getDateDiff(data.data.dataList[i].dynamics.createDate);

            if (typeof (data.data.dataList[i].dynamics.imageIds) == "string"
              && data.data.dataList[i].dynamics.imageIds.length > 0) {
              data.data.dataList[i].dynamics.imgArr = data.data.dataList[i].dynamics.imageIds.split(",");
            }
          }
          curModule.setData({ dynamicsList: data.data.dataList });
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function (err) {
        wx.showToast({ title: '操作失败' });
      });
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