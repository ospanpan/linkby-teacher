Page({
  data: {
    showHomepage: true,
    showTask: false,
    showNotice: false,
    showMy: false,
    //首页通知内容
    lastestNotice: null,
    //首页最新作业
    lastHomework: null,
    //作业勤奋榜
    taskRanking: [],
    //您的孩子第几个完成了作业
    homeWorkCompleteTips: '',
    //班级圈列表
    dynamicsList: [],
    //班级圈页码
    curPage_dynamics: 0,
    homeworkList: [],     //作业列表数据
    curPage_homework: 0,  //作业列表当前页码
    curPage_notice: 0,  //通知列表当前页码
    noticeList: [],     //通知列表

    familyInfo: { student: "", appellation:""},  //当前家长信息
    userInfo: null,     //用户信息
    allClasses: [],      //当前家长所有班级信息

    interactionCount: 0, //班级圈互动数量
  },
  onLoad: function () {
    var app = getApp();
    if (app.globalData.userInfo.family!=null){
      this.setData({ familyInfo: app.globalData.userInfo.family });
    }
    if (app.globalData.userInfo.user != null) {
      this.setData({ userInfo: app.globalData.userInfo.user });
    }
    if (this.data.userInfo != null && this.data.familyInfo.id!=null){
      this.reloadInfo();
    }
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code;
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.AppID + '&secret=' + app.Secret+'&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var openid = res.data.openid //返回openid
            app.post_api_data(app.globalData.api_URL.UpdateUserInfo,
              {
                'id': app.globalData.userInfo.user.id,
                'uuId': openid
              },
              function (data) {}, function (err) {});
          }
        })
      }
    })
  },

  onPullDownRefresh: function(){
    
  },

  onReachBottom: function(){
    
  },

  reloadInfo: function(){
    var curModule = this;
    var app = getApp();
    this.setData({ familyInfo: app.globalData.userInfo.family });
    this.setData({ userInfo: app.globalData.userInfo.user });
    this.getLastestNotice();    //获取最新的一条通知
    this.getLastPubHomework(function (homework) {
      curModule.getHomeworkCompletion(homework.id);
    });  //获取发布的最后一条作业
    this.getTecherDynamicsList();//获取班级圈老师动态
    this.getHomeworkList();//获取作业分页列表
    this.getNoticeList();//获取通知列表

    this.getAllClasses(); //获取所有班级
    this.getInteractionCount(); //获取班级圈互动数量


  },

  showHomepage: function () {
    this.setData({
      showHomepage: true,
      showTask: false,
      showNotice: false,
      showMy: false
    });
    var curModule = this;
    var app = getApp();
    this.getLastestNotice();    //获取最新的一条通知
    this.getLastPubHomework(function (homework) {
      curModule.getHomeworkCompletion(homework.id);
    });  //获取发布的最后一条作业
    this.getTecherDynamicsList();//获取班级圈老师动态
  },
  showTask: function () {
    this.setData({
      showHomepage: false,
      showTask: true,
      showNotice: false,
      showMy: false
    });
    this.getHomeworkList();//获取作业分页列表
  },
  showNotice: function () {
    this.setData({
      showHomepage: false,
      showTask: false,
      showNotice: true,
      showMy: false
    });
    this.getNoticeList();//获取通知列表
  },
  showMy: function () {
    this.setData({
      showHomepage: false,
      showTask: false,
      showNotice: false,
      showMy: true
    });
    var app = getApp();
    this.setData({ familyInfo: app.globalData.userInfo.family });
    this.setData({ userInfo: app.globalData.userInfo.user });
    this.getAllClasses(); //获取所有班级
    this.getInteractionCount(); //获取班级圈互动数量
  },
  toShowTask: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '../task/content/content?homeworkId=' + id });
  },
  toShowNotice: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '../notice/notice?noticeId='+id });
    var formId = e.detail.formId;

    var app = getApp();
    console.log("formId=" + formId + ", userId=" + app.globalData.userInfo.user.id);
    app.post_api_data(app.globalData.api_URL.AddSaveForm, {
      'userId': app.globalData.userInfo.user.id,
      'formId': formId
    }, function(data){
      console.log(JSON.stringify(data));
    }, function(){});
  },
  toTaskCompleteList: function () {
    wx.navigateTo({
      url: '../task/list/list?homeworkId=' + this.data.lastHomework.id + '&date=' + this.data.lastHomework.updateDate
    })
  },
  toClassCircle:function(){
    wx.navigateTo({
      url: '../circle/circle'
    })
  },

  //获取最新的一条通知
  getLastestNotice: function(){
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetLastNotice,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          if (data.data.id != null) {
            curModule.setData({ lastestNotice: data.data });
          }
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //获取通知列表
  getNoticeList: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetClassNoticeList,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'familyId': app.globalData.userInfo.family.id,
        'pageSize': 10,
        'page': (curModule.data.curPage_notice + 1)
      },
      function (data) {
        if (data.apiStatus == "200") {
          for (var i = 0; i < data.data.dataList.length; i++){
            var createDate = new Date(data.data.dataList[i].notice.createDate);
            var month = createDate.getMonth() + 1;
            var strDate = createDate.getDate();
            var hour = createDate.getHours();
            hour = hour < 10 ? ('0' + hour) : hour;
            var minute = createDate.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;  
            data.data.dataList[i].notice.date = month + "-" + strDate + "  周" + "日一二三四五六".charAt(createDate.getDay());
            data.data.dataList[i].notice.time = hour + ":" + minute;
          }
          curModule.setData({ curPage_notice: data.data.curPage });
          curModule.setData({ noticeList: data.data.dataList });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },

  //获取发布的最后一条作业
  getLastPubHomework: function (sucFun) {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetLastPubHomework,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId
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
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },

  //获取作业完成情况
  getHomeworkCompletion: function (homeworkId) {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetHomeworkCompletion,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'homeworkId': homeworkId
      },
      function (data) {
        if (data.apiStatus == "200") {
          var tempTaskRanking=[];
          for (var i = 0; i < data.data.completeList.length; i++){
            if (app.globalData.userInfo.family.studentId == data.data.completeList[i].studentId){
              curModule.setData({ homeWorkCompleteTips:'您的孩子第'+(i+1)+'个完成了作业'});
            }
            if(i==0){
              tempTaskRanking.push({ name: data.data.completeList[i].student.substr(0,1), color: '#17c6ee' });
            }else if(i==1){
              tempTaskRanking.push({ name: data.data.completeList[i].student.substr(0, 1), color: '#ff9e5c' });
            }else if(i==2){
              tempTaskRanking.push({ name: data.data.completeList[i].student.substr(0, 1), color: '#ff7b8a' });
            }
          }          
          curModule.setData({ taskRanking: tempTaskRanking });
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
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
        'pageSize': 10,
        'page': (curModule.data.curPage_homework + 1)
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ curPage_homework: data.data.curPage });
          curModule.setData({ homeworkList: data.data.dataList });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
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
  //获取班级圈老师动态
  getTecherDynamicsList: function(){
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetTecherDynamicsList,
      {
        'classesId': app.globalData.userInfo.family.classesId,
        'schoolId': app.globalData.userInfo.family.schoolId,
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
  },

  //获取所有班级信息
  getAllClasses: function () {
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetAllClasses_Family,
      {
        'userId': app.globalData.userInfo.user.id
      },
      function (data) {
        if (data.apiStatus == "200") {
          var currentClasses = null;
          var otherClassesArr = [];
          var newClassesArr = [];
          for (var i = 0; i < data.data.length; i++) {
            if (app.globalData.userInfo.user.curClassesId == data.data[i].classes.id) {
              currentClasses = data.data[i];
            } else {
              otherClassesArr.push(data.data[i]);
            }
          }
          if (currentClasses != null && currentClasses.classes!=null && currentClasses.classes.id != null && currentClasses.classes.id.length>0){
            newClassesArr.push(currentClasses);
          }          
          curModule.setData({ allClasses: newClassesArr.concat(otherClassesArr) });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },

  //切换班级
  toChangeClasses: function (event) {
    var curModule = this;
    var classId = event.currentTarget.dataset.classid;
    var app = getApp();
    wx.showLoading({ title: '正在切换', mask:true });
    app.post_api_data(app.globalData.api_URL.FamilyTransferClasses,
      {
        curClassesId: classId,
        id: app.globalData.userInfo.user.id
      },
      function (data) {
        if (data.apiStatus == "200") {
          app.globalData.userInfo.user.curClassesId = classId; 
          curModule.getCurrentFamilyUserInfo(classId, function(){
            curModule.reloadInfo();
            wx.showToast({ title: '切换完成', icon: "success" });
          });
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
  //获取当前家长信息
  getCurrentFamilyUserInfo: function (classesId, sucFun){
    var curModule = this;
    var app = getApp();
    app.get_api_data(app.globalData.api_URL.GetCurrentFamilyUserInfo,
      {
        'userId': app.globalData.userInfo.user.id,
        'classesId': classesId
      },
      function (data) {
        if (data.apiStatus == "200") {
          app.globalData.userInfo = data.data;
          if (typeof (sucFun)=="function"){
            sucFun();
          }
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //获取班级圈互动数量
  getInteractionCount: function(){
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
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },

  //退出
  toLogout: function () {
    wx.showLoading({ title: '正在退出', mask: true });
    var app = getApp();
    app.globalData.userInfo = null;
    wx.redirectTo({ url: '/pages/parent/login/login' });
    setTimeout(function () {
      wx.hideLoading();
    }, 150);
  },

})