Page({
  data: {
    content: '',
    imageIds: [],
    files: []
  },
  chooseImage: function (e) {
    var curModule = this;
    var app = getApp();
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var index = 0;
        wx.showLoading({ title: '正在上传', mask:true });
        curModule.uploadImage(tempFilePaths, index, function () { 
          setTimeout(function () {
            wx.hideLoading();
          }, 150);
        });
      }
    })
  },
  uploadImage: function (filePaths, index, sucFun) {
    var app = getApp();
    var curModule = this;
    wx.uploadFile({
      url: app.globalData.api_URL.UploadUrl,
      filePath: filePaths[index],
      name: "file",
      formData: {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'objType': 1
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = JSON.parse(res.data);
          if (data.data != null && data.data.id.length > 0) {
            curModule.data.imageIds.push(data.data.id);
            curModule.setData({
              files: curModule.data.files.concat(data.data.baseUrl + '/' + data.data.relativeUrl)
            });
            if ((index >= filePaths.length - 1) && typeof (sucFun) == "function") {
              sucFun();
            } else {
              index++;
              curModule.uploadImage(filePaths, index, sucFun);
            }
          }
        }
      }
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  onLoad: function () {

  },
  deleteCircle:function(){
    this.setData({ hideview:true});
  },
  deleteEnter: function () {
    this.setData({ hideview: false });
  },
  //监听内容输入
  content_input: function(event){
    if (event.detail.value.trim().length > 200) {
      this.setData({ content: event.detail.value.trim().substring(0, 200) });
    } else {
      this.setData({ content: event.detail.value.trim() });
    }
  },
  //动态发布保存
  pubDynamics: function(){
    if (this.data.content.length == 0 && imageIds.length==0){
      wx.showToast({ title: '请输入内容或选择图片' });
      return;
    }
    var app = getApp();
    var curModule = this;
    wx.showLoading({ title: '正在发布', mask:true });
    app.post_api_data(app.globalData.api_URL.PubDynamics,
      {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'content': curModule.data.content,
        'imageIds': curModule.data.imageIds.join(","),
        'type': 1,
        'alias': app.globalData.userInfo.teacher.realName + "老师",
        'userId': app.globalData.userInfo.user.id
      },
      function (data) {
        if (data.apiStatus == "200") {
          wx.showToast({ title: '发布成功' });
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.getDynamicsList();
          wx.navigateBack();
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

})