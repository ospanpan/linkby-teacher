// pages/teacher/create/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidePullDown: true,
    hidePullUp: true,
    hideNoMore: true,
    showNoticeList: false,
    lastNotice: null,   //最后一条通知
    curPage_notice: 0,  //通知列表当前页码
    totalPage_notice: 0,  //通知列表总页数
    noticeList: [],     //通知列表
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
    curModule.setData({ noticeList: [] });
    curModule.setData({ lastNotice: null });
    curModule.setData({ curPage_notice: 0 });
    curModule.setData({ totalPage_notice: 0 });

    curModule.getLastNotice(); //获取最后一条通知
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.getNoticeList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_notice > curModule.data.curPage_notice) {
        curModule.setData({ hideNoMore: true });
      } else {
        curModule.setData({ hideNoMore: false });
      }
    }); //获取通知分页列表
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
  loadMoreNotice: function(){
    var curModule = this;
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullUp: false });
    setTimeout(function(){
      if (curModule.data.totalPage_notice > curModule.data.curPage_notice) {
        curModule.getNoticeList(function () {
          curModule.setData({ hidePullUp: true });
          if (curModule.data.totalPage_notice > curModule.data.curPage_notice) {
            curModule.setData({ hideNoMore: true });
          } else {
            curModule.setData({ hideNoMore: false });
          }
        });
      } else {
        curModule.setData({ hidePullUp: true });
        curModule.setData({ hideNoMore: false });
      }
    }, 300);    
  },
  refreshNotice: function(){
    var curModule = this;
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.setData({ curPage_notice: 0 });
    curModule.getNoticeList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_notice > curModule.data.curPage_notice) {
        curModule.setData({ hideNoMore: true });
      } else {
        curModule.setData({ hideNoMore: false });
      }
    });
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
  getNoticeList: function (sucFun) {
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
          curModule.setData({ totalPage_notice: data.data.pageCount });
          curModule.setData({ noticeList: curModule.data.noticeList.concat(data.data.dataList) });
        } else {
          wx.showToast({ title: data.msg });
        }
        if (typeof (sucFun) == "function") {
          sucFun();
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
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
  }
})