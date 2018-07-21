Page({
  data: {
    files: []
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.api_URL.UploadUrl,
          filePath: tempFilePaths[0],
          name: "file",
          formData: {
            'classesId': app.globalData.userInfo.teacher.curClassesId,
            'schoolId': app.globalData.userInfo.teacher.schoolId,
            'objType': 0
          },
          success: function (res) {
            console.log("res=" + JSON.stringify(res));
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data);
              if (data.data != null && data.data.id.length > 0) {
                that.data.imageIds.push(data.data.id);
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                  files: that.data.files.concat(data.data.baseUrl + '/' + data.data.relativeUrl)
                });
              }
            }
          }
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  onLoad: function () {

  },
  deleteCircle: function () {
    this.setData({ hideview: true });
  },
  deleteEnter: function () {
    this.setData({ hideview: false });
  }
})