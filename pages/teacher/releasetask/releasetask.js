Page({
  data: {
    content: '',
    imageIds: [],
    files: []
  },
  onLoad: function () {

  },
  chooseImage: function (e) {
    var curModule = this;
    var app = getApp();
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({ title: '正在上传',mask:true });
        var tempFilePaths = res.tempFilePaths;
        var index=0;
        curModule.uploadImage(tempFilePaths, index, function(){
          setTimeout(function () {
            wx.hideLoading();
          }, 150);
        });
      }
    })
  },
  uploadImage: function(filePaths, index, sucFun){
    var app = getApp();
    var curModule = this;
    wx.uploadFile({
      url: app.globalData.api_URL.UploadUrl,
      filePath: filePaths[index],
      name: "file",
      formData: {
        'classesId': app.globalData.userInfo.teacher.curClassesId,
        'schoolId': app.globalData.userInfo.teacher.schoolId,
        'objType': 0
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = JSON.parse(res.data);
          if (data.data != null && data.data.id.length > 0) {
            curModule.data.imageIds.push(data.data.id);
            curModule.setData({
              files: curModule.data.files.concat(data.data.baseUrl + '/' + data.data.relativeUrl)
            });
            if ((index >= filePaths.length - 1) && typeof (sucFun)=="function"){
              sucFun();
            }else{
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

  //监听作业内容输入
  content_input: function (event) {
    if (event.detail.value.trim().length > 200) {
      this.setData({ content: event.detail.value.trim().substring(0, 200) });
    } else {
      this.setData({ content: event.detail.value.trim() });
    }
  },

  //发布作业
  pubHomework: function () {
    if (this.data.content.trim().length == 0 && this.data.imageIds.length == 0) {
      wx.showToast({ title: '请填写作业文字说明或图片' });
      return;
    }
    var app = getApp();
    var curModule = this;
    wx.showLoading({ title: '正在发布',mask:true });
    app.post_api_data(app.globalData.api_URL.PubHomework,
      {
        content: curModule.data.content,
        imageIds: curModule.data.imageIds.join(','),
        teacher: app.globalData.userInfo.teacher.realName + "老师",
        teacherId: app.globalData.userInfo.teacher.id,
        classesId: app.globalData.userInfo.teacher.curClassesId,
        schoolId: app.globalData.userInfo.teacher.schoolId
      },
      function (data) {
        console.log(JSON.stringify(data));
        if (data.apiStatus == "200") {
          wx.showToast({ title: '发布成功' });
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.getLastPubHomework();
          prevPage.getHomeworkList();
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
  }

})