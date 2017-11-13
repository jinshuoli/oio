// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNum: true,//是否点击
    selctVal: '',
    selectArea: false,//是否选中
    isChecked:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //绑定下拉框
  selectMenu:function(e){
    var selectNum = this.data.selectNum;
    if (selectNum == true) {
      this.setData({
        selectArea: true,
        selectNum: false,
        isChecked:true
      })
    } else {
      this.setData({
        selectArea: false,
        selectNum: true,
        isChecked: false
      })
    }
  },
  //点击选择值
  selectNumber: function (e) {
    this.setData({
      selctVal: e.target.dataset.me,
      selectNum: true,
      selectArea: false,
    })
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
  
  }
})