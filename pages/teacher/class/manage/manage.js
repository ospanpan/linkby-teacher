Page({
  data: {
    startX: 0, //开始坐标
    startY: 0, //开始坐标
    className: '',
    classId: '',
    schoolId: '',
    studentList: []
  },
  onLoad: function (option) {
    wx.showLoading({ title: '正在加载', mask:true });
    this.setData({ className: decodeURIComponent(option.className) });
    this.setData({ classId: option.classId });
    this.setData({ schoolId: option.schoolId });

    this.getAllStudents();
  },
  
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.studentList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      studentList: this.data.studentList
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
    that.data.studentList.forEach(function (v, i) {
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
      studentList: that.data.studentList
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

  //获取班级所有学生
  getAllStudents: function () {
    var app = getApp();
    var curModule = this;
    app.get_api_data(app.globalData.api_URL.GetStudents,
      {
        'classesId': curModule.data.classId,
        'schoolId': curModule.data.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {          
          // for (var i = 0; i < data.data.length; i++){
          //   data.data[i].isTouchMove = false;
          // }
          curModule.setData({ studentList: data.data });
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
  //添加成员
  toAddStudent: function () {
    wx.navigateTo({
      url: '/pages/teacher/class/addstudent/addstudent?classId=' + this.data.classId + '&schoolId=' + this.data.schoolId
    });
  },
  //编辑班级名称
  toEditClass: function () {
    wx.navigateTo({
      url: '/pages/teacher/class/updateSchool/updateSchool?classId=' + this.data.classId + '&schoolId=' + this.data.schoolId
    });
  },
  //修改学生
  toEditStudent: function (event) {
    var studentId = event.currentTarget.dataset.studentid;
    var classId = event.currentTarget.dataset.classid;
    var schoolId = event.currentTarget.dataset.schoolid;
    wx.navigateTo({
      url: '/pages/teacher/class/editstudent/editstudent?studentId=' + studentId + '&classId=' + this.data.classId + '&schoolId=' + schoolId
    });
  },
  //获取班级详细信息
  getClassesDetails: function () {
    var app = getApp();
    var curModule = this;
    app.get_api_data(app.globalData.api_URL.GetClassDetails,
      {
        'classesId': curModule.data.classId,
        'schoolId': curModule.data.schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.setData({ className: data.data.school.realName + data.data.classes.alias });
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  },
  //打电话
  toCall: function(event){
    var phone = event.currentTarget.dataset.phonenum;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    });
  },
  //删除
  toDelete: function(event){
    var studentId = event.currentTarget.dataset.studentid;
    var classId = event.currentTarget.dataset.classid;
    var schoolId = event.currentTarget.dataset.schoolid;    
    var app = getApp();
    var curModule = this;
    app.post_api_data(app.globalData.api_URL.DelStudent,
      {
        'id': studentId,
        'classesId': classId,
        'schoolId': schoolId
      },
      function (data) {
        if (data.apiStatus == "200") {
          curModule.getAllStudents();
        } else {
          wx.showToast({ title: data.msg });
        }
      }, function () {
        wx.showToast({ title: "获取失败" });
      });
  }
})