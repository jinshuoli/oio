// pages/login/forget.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        Vid: '',//发送短信的序列号
        userName: '',
        passCode:'',
        vcode:'',//验证码
        exptime:'',//有效期
        status:'',//获取验证码状态
    },
    //忘记密码
    forgetPWD: function () {
        wx.navigateTo({
            url: '../login/forget'
        })
    },
    /**
    * 监听用户名输入
    */
    userNameInput: function (e) {
        this.data.userName = e.detail.value;
    },
    //验证码输入
    passWdInput:function(e){
      this.data.passCode = e.detail.value;
    },
    /**
    * 监听获取验证码
    */
    getPhoneCode:function(e){
        var _self = this;
        if (_self.data.status == '1'){
          wx.showModal({
            title: '信息提示',
            content: '请勿重复发送短信',
          });
          return false;
        }
        if(this.data.userName == ''){
          wx.showModal({
              title:'信息提示',
              content:'请输入账户名',
          });
          return false;
        }
        _self.data.status = '1';
        this.callBackIn('https://weixin1.haowaihao.com.cn/api/getSmsVcode.do', { phone: this.data.userName },'GET','验证码发送成功','验证码发送失败','');
    },

    /**
    * 监听登录按钮
    */
    loginSubmit: function () {
        var _sel = this;
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (this.data.userName && this.data.passCode) {
            if (!myreg.test(this.data.userName)) {
                _sel.windowAlert('手机号错误'); return false;
            }
            _sel.callBackIn('https://weixin1.haowaihao.com.cn/api/VerSmsVcode.do', { vid: this.data.Vid,vcode: this.data.passCode },'GET','验证成功','验证码错误','login');
        } else {
            _sel.windowAlert('内容不能为空'); return false;
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
    //请求找回按钮
    callBackIn: function (url,dataC,Method,SuccessInfo,ErrInfo,type) {
        var that = this;
        wx.request({
            url: url,
            data: dataC,
            header:{
              'Content-Type': 'json',
            },
            method: Method,
            success: function (res) {
              var data = JSON.parse(res.data);//转换格式
              if (data.result == 0){
                    if(type == 'login'){
                        wx.navigateTo({
                          url: '../login/resetP?phone='+that.data.userName//跳转到重置密码阶段
                        })
                    }else{
                        that.data.Vid = data.vid;//发送短信序列号
                        that.data.passCode = data.vcode;//验证码
                        that.windowAlert(SuccessInfo);
                        // this.data.Vid = res.vid;//设置返回的vid
                        
                    }
                }else{
                    that.data.status = '';//修改点击状态 
                    that.windowAlert(ErrInfo);return false;
                }
            },
            fail: function (res) {
                that.windowAlert(ErrInfo);return false;
            }
        })
    },
    //取消按钮-返回登录页面
    loginCancle: function () {
      wx.navigateTo({
        url: '../login/login'
      })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _self=this;
        var loginPhone = wx.getStorageSync('loginPhone');
        if(loginPhone!='' && loginPhone!=undefined){
            this.setData({
                userName:loginPhone
            });
        }
    }
});