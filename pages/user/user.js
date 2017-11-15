// pages/user/user.js
Page({

  /**
  * 页面的初始数据
  */
  data: {
    name: '',
    company: '',
    ms: '',
    acms: ''
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onShow: function (options) {

    var resl = wx.getStorageSync('loginRes');

    var _self = this;
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/userInfo.do',
      data: {
      },
      header: {
        token: resl.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {

        var result = JSON.parse(res.data);
        var str = _self.onSplit(result.acms);
        _self.setData({
          name: result.name,
          company: result.company,
          ms: result.ms,
          acms: str
        });
      }
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },

  /**
  * 名称:专属小号
  * @param
  * @return
  */
  onPrivate: function () {
    wx.navigateTo({
      url: '../exclusive/exclusive'
    })
  },

  /**
  * 名称:账户充值
  * @param
  * @return
  */
  onUserMoney: function () {
    wx.navigateTo({
      url: '../pay/pay'
    })
  },

  /**
  * 名称:修改密码
  * @param
  * @return
  */
  onUpdatePwd: function () {
    wx.navigateTo({
      url: '../user/resetP'
    })
  },

  /**
  * @名称 关于产品
  * @param
  * @return
  */
  onAbout: function () {
    wx.navigateTo({
      url: '../user/info'
    })
  },
  /**
  * @公司注册
  * @param
  * @return
  */
  company: function () {
    wx.navigateTo({
      url: '../login/company'
    })
  },
  /**
   * @名称 登出
   * @param
   * @return
   */
  loginOut: function () {
    var loginPhone = wx.getStorageSync('loginPhone');
    wx.clearStorage();
    wx.navigateTo({
      url: '../login/login?phone=' + loginPhone
    })
  },
  /**
   * 名称:截取数据
   * @param str
   * @return stt
  */
  onSplit: function (arr) {
    if (arr != undefined) {
      var list = arr.split(',');
      var str = list[0];
      return str;
    }
  },
  /**
       * 名称:用户刷新
       * @param
       * @return
      */
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '刷新中',
    });
    var _self = this;
    _self.onLoad();

    wx.stopPullDownRefresh({
      success: function () {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000);
        wx.hideNavigationBarLoading();
      }
    })
  }
})