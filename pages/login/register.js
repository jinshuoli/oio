// pages/login/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regNum: '',
    code: '',//验证码
  },
  //下一步：进入面页面。
  nextpage: function () {
    wx.navigateTo({
      url: '../login/password',
    })
  },

  // 监听输入框输入
  passNumber: function (e) {
    this.data.regNum = e.detail.value;
  },
  //验证码
  passWdInput: function (e) {
    this.data.code = e.detail.value;
  },

  // 监听获取验证码
  getPhoneCode: function (e) {
    var _self = this;
    if (_self.data.status == "1") {
      wx.showModal({
        title: '信息提示',
        content: '请勿重复发送信息',
      });
      return false;
    }
    if (this.data.regNum == "") {
      wx.showModal({
        title: '信息提示',
        content: '请输入电话号',
      });
      return false;
    }
    _self.data.status = "1";
    this.callBackIn('https://weixin1.haowaihao.com.cn/api/getSmsVcode.do',
      { phone: this.data.regNum },
      'GET', '验证码发送成功', '验证码发送失败', '');
  },
  /**
  * 监听下一步按钮
  */
  nextstep: function () {
    var _sel = this;
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.regNum && this.data.code) {
      if (!myreg.test(this.data.regNum)) {
        _sel.windowAlert('手机号错误');
        return false
      }
      _sel.callBackIn('https://weixin1.haowaihao.com.cn/api/VerSmsVcode.do',
        {
          regNum: this.data.regNum,
          code: this.data.code,
        },
        'GET', '验证成功', '验证错误', 'login');
    } else {
      _sel.windowAlert('内容不能为空'); return false;
    }
  },
  //注册手机号
  //errinfo:错误信息   successinfo:成功信息    methosd:方法     datac:资料处理中心
  callBackIn: function (url, dataC, Method, SuccessInfo, ErrInfo, type) {
    var that = this;
    wx.request({
      url: url,
      data: dataC,
      header: {
        'Content-Type': 'json',
      },
      method: Method,
      success: function (res) {
        var data = JSON.parse(res.data);//转换格式
        console.log(data);
        if (data.result == 0) {
          that.nextpage()
        }
      }
    })
  },
  //弹框
  windowAlert: function (_title) {
    wx.showToast({
      title: _title,
      icon: 'success',
      duration: 2000
    })
  },
  /**dd
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    var loginPhone = wx.getStorageSync('loginPhone');
    if (loginPhone != '' && loginPhone != undefined) {
      this.setData({
        userName: loginPhone
      })
    }
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