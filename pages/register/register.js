// pages/login/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regNum: '', // 手机号
    code: '', // 验证码
    vid: "",
  },

  // 监听输入框输入
  passNumber: function (e) {
    // this.data.regNum.setData(e.detail.value);
    this.data.regNum = e.detail.value;
  },
  //验证码
  passWdInput: function (e) {
    // this.data.code.setData(e.detail.value);
    this.data.code = e.detail.value;
  },

  // 监听获取验证码
  getPhoneCode: function (e) {
    var self = this;
    if (self.data.status == "1") {
      wx.showModal({ title: '信息提示', content: '请勿重复发送信息' });
      return false;
    }
    if (this.data.regNum == "") {
      wx.showModal({ title: '信息提示', content: '请输入电话号' });
      return false;
    }
    self.data.status = "1";
    self.ajax({ // 发送手机号给后台
      url: 'https://weixin1.haowaihao.com.cn/api/getSmsVcode.do',
      data: { phone: this.data.regNum },
      method: 'GET',
      type: 'postCode',
      text: '验证码发送成功！',
    })
  },
  /**
   * 下一步按钮
   */
  nextstep: function () {
    var self = this;
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.regNum && this.data.code) { // 判断手机号和验证码不能为空
      if (!myreg.test(this.data.regNum)) { // 判断手机号是否正确
        self.windowAlert('手机号错误');
        return false
      } else if (this.data.code.length !== 6) {
        self.windowAlert('验证码应为6位数字');
        return false
      }
      self.ajax({ // 如果手机号和验证码都正确 向后台发送数据
        url: 'https://weixin1.haowaihao.com.cn/api/VerSmsVcode.do',
        data: { vid: this.data.vid, vcode: this.data.code },
        method: 'GET',
        type: 'nextstep',
        text: '验证码错误',
      })
    } else {
      self.windowAlert('内容不能为空');
      return false;
    }
  },
  /**
   * @title: 封装ajax
   * @param：json
   * @return： null
   *
   */
  ajax: function (param) {
    var self = this;
    wx.request({
      url: param.url,
      data: param.data,
      header: {
        'Content-Type': 'json',
      },
      method: param.method,
      success: function (res) {
        var data = JSON.parse(res.data); //转换格式
        console.log(data);
        if (data.result === 0) {
          if (param.type == 'nextstep') {
            wx.navigateTo({ url: '../register/paword' }) // 跳转到下一页（密码）
          } else {
            // console.log(data.vid)
            self.data.vid = data.vid
       
            self.windowAlert(param.text);  // 验证码发送成功！
          }

        } else {
          self.windowAlert(param.text); // 验证码错误(后台判断)
        }
      }
    })
  },
  // 弹框
  windowAlert: function (_title) {
    wx.showToast({
      title: _title,
      icon: 'success',
      duration: 2000
    })
  }
})