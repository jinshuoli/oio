// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        userName: '',
        passWd: '',
        token:''
    },
  //忘记密码
  forgetPWD: function () {
      wx.navigateTo({
          url: '../login/forget'
      })
  },
  // 注册账号
  registerPWD:function(){
    wx.navigateTo({
      url: '../login/register'
    })
  },
  /**
   * 监听用户名输入
   */
  userNameInput: function (e) {
    this.data.userName =e.detail.value
  },

  /**
   * 监听密码输入
   */
  passWdInput: function (e) {
    this.data.userpassWd = e.detail.value
  },

  /**
   * 监听登录按钮
   */
  loginSubmit: function () {
    var _sel = this;
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.userName && this.data.userpassWd){
      if (!myreg.test(this.data.userName)){
        _sel.windowAlert('手机号错误'); return false;
      }
      this.logIn();
    }else{
      _sel.windowAlert('内容不能为空');return false;
    }
  
  },
  //弹框
  windowAlert:function(_title){
    wx.showToast({
      title: _title,
      icon: 'success',
      duration: 2000
    })
  },
    //请求登陆
    logIn: function () {
        var _self = this;
        var token = '';
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/login.do',
            data: {
                prtms: this.data.userName,
                apwd: this.data.userpassWd
            },
            method: 'POST',
            dataType:'json',
            success: function (res) {
                wx.setStorageSync('loginRes', '');//先清空
                wx.setStorageSync('loginRes', res);//把结果缓存起来
                wx.setStorageSync('loginPhone', _self.data.userName);//把用户名记录
                _self.setData({
                    token : res.data.token
                });
                if (res.data.result == 0){
                    // wx.navigateTo({
                    //     url: '../exclusive/addExclusive'
                    // });
                    wx.switchTab({
                        url: '../recently/recently'
                    });
                }else{
                    _self.windowAlert('登录失败');
                    return false;
                }
                //that.windowAlert('状态结果为：' + res.data.result);
            },
            fail: function (res) {
                _self.windowAlert(res.errMsg);return false;
            }
        });

    },


    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        var _self=this;
        if(options.phone!=='' && options.phone!=undefined){
            this.setData({
                userName:options.phone
            });
            wx.setStorageSync('loginPhone', options.phone);//把用户名记录
        }
        var loginPhone = wx.getStorageSync('loginPhone');
        if(loginPhone!='' && loginPhone!=undefined){
            this.setData({
                userName:loginPhone
            });
        }
    },
    /**
     * 名称:登录方法
     * @param
     * @return
    */
    onSend:function(){
      this.logIn();
    }
})