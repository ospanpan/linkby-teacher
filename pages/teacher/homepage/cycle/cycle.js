// pages/teacher/create/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidePullDown: true,
    hidePullUp: true,
    hideNoMore: true,
    curPage_dynamics: 0,  //朋友圈列表当前页码
    totalPage_dynamics: 0, //朋友圈总页数
    dynamicsList: [],     //朋友圈列表
    delType: '',          //模态对话框来源类型
    delId: ''             //模态对话框对象Id
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
    curModule.setData({ dynamicsList: [] });
    curModule.setData({ curPage_dynamics: 0 });
    curModule.setData({ totalPage_dynamics: 0 });
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.getDynamicsList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_dynamics > curModule.data.curPage_dynamics) {
        curModule.setData({ hideNoMore: true });
      } else {
        curModule.setData({ hideNoMore: false });
      }
    });   //获取班级圈动态
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
  loadMoreCycle: function(){
    var curModule = this;
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullUp: false });
    setTimeout(function () {
      if (curModule.data.totalPage_dynamics > curModule.data.curPage_dynamics) {
        curModule.getDynamicsList(function(){
          curModule.setData({ hidePullUp: true });
          if (curModule.data.totalPage_dynamics > curModule.data.curPage_dynamics) {
            curModule.setData({ hideNoMore: true });
          } else {
            curModule.setData({ hideNoMore: false });
          }
        });
      }
    }, 300);
  },
  refreshCycle: function(){
    var curModule = this;
    curModule.setData({ curPage_dynamics: 0 });
    curModule.setData({ hideNoMore: true });
    curModule.setData({ hidePullDown: false });
    curModule.getDynamicsList(function(){
      curModule.setData({ hidePullDown: true });
      if (curModule.data.totalPage_dynamics > curModule.data.curPage_dynamics) {
        curModule.setData({ hideNoMore: true });
      } else {
        curModule.setData({ hideNoMore: false });
      }
    });
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
  //班级圈动态获取
  getDynamicsList: function (sucFun) {
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
          curModule.setData({ curPage_dynamics: data.data.curPage });
          curModule.setData({ totalPage_dynamics: data.data.pageCount });
        } else {
          wx.showToast({ title: data.msg });
        }
        if (typeof (sucFun) == "function") {
          sucFun();
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
  }
})