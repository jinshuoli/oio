// pages/login/forget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      passwordSet:'',
      passwordSeTwo:'',
      phone:'',
  },

  /**
   * 监听密码输入
   */
  passOneInput: function (e) {
    this.data.passwordSet = e.detail.value;

  },

  /**
   * 监听再次密码输入
   */
  passTwoInput: function (e) {
    this.data.passwordSeTwo = e.detail.value;
  },

  /**
   * 监听登录按钮
   */
  loginResetSubmit: function () {
    var _sell = this;
    //打印收入账号和密码
    if (this.data.passwordSet && this.data.passwordSeTwo){
      this.resetIn();
    }else{
      _sell.windowAlert('内容不能为空');
    }
    

  },
  //弹框
  windowAlert: function (_title) {
    wx.showToast({
      title: _title,
      icon: 'success',
      duration: 2000
    })
  },
  //请求重置按钮
  resetIn: function () {
    var that = this;
    var resl = wx.getStorageSync('loginRes');
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/changePwd.do',
      data: {
        newpwd: this.data.passwordSeTwo,
        "phone":this.data.phone
      },
      header: {
        'Content-Type': 'json'
      },
      method: 'GET',
      dataType:'json',
      success: function (res) {
        var stus = res.data.result;
        if(stus == '0'){
          wx.showModal({
            title: '信息提示',
            content: '重置密码成功',
            success:function(){
              wx.navigateTo({
                url: '../login/login'
              })
            },
          });
        }else{
          wx.showModal({
            title:'信息提示',
            content:res.data.msg
          });
        }
       
      },
      fail: function (res) {
        that.windowAlert(res.errMsg);
        // that.showToastErr();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.phone = options.phone;
    
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