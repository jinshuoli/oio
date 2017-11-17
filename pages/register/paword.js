// pages/login/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paword:"", //密码
    pawordtwo:"" //二次密码
  },
  //下一步：进入公司名字注册。
  // nextstep: function () {
  //   wx.navigateTo({
  //     url: '../register/corporatename',
  //   })
  // },
  //监听密码框输入
  pwclick:function(e){
    this.data.paword=e.detail.value;
  },
  //监听二次密码输入
  pawdclick: function (e) {
    this.data.pawordtwo = e.detail.value;
  },
  
  //下一步：
  nextstep:function(){
    var self=this;
    var myreg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;//强：字母+数字+特殊字符 
    var myregsec = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;//中：字母+数字，字母+特殊字符，数字+特殊字符
    var myregstr = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;//弱：纯数字，纯字母，纯特殊字符
    if (self.data.paword && self.data.pawordtwo){  //验证两次输入密码不能为空
      if (!myreg.test(self.data.paword) && !myregsec.test(self.data.paword) && !myregstr.test(self.data.paword)){
        self.windowAlert('密码格式错误');
      } else if (self.data.paword.length < 6){
        self.windowAlert("密码长度为6-18位");
        return false;
      } else if (self.data.paword.value === self.data.pawordtwo.value){
        self.windowAlert("两次密码不同");
        return false;
      }
    }else{
      self.windowAlert("内容不能为空");
      return false;
    }
  },
  


//弹框
windowAlert:function(_title){
  wx.showToast({
    title: _title,
    icon:'success',
    duration:2000
  })
}
})