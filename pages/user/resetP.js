// pages/user/resetP.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     pwd:'',
     pwdTwo:'',   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },

  /**
   * 名称:输入密码
   * @param
   * @return
  */
  passOneInput:function(e){
      this.data.pwd = e.detail.value;
  },

  /**
   * 名称:第二次输入密码
   * @param
   * @return
  */
  passTwoInput:function(e){
      this.data.pwdTwo = e.detail.value;
  },

  /**
   * 名称:发送数据
   * @param
   * @return
  */
  loginResetSubmit:function(){
     var _self = this;
     var con = wx.getStorageSync('loginRes');
     if(_self.data.pwd == ''){
       wx.showModal({
         title:'信息提示',
         content:'请输入密码'
       });
       return false;
     };

     if(_self.data.pwdTwo == ''){
       wx.showModal({
         title: '信息提示',
         content: '请再次密码'
       });
       return false;
     }
     if (_self.data.pwd != _self.data.pwdTwo){
       wx.showModal({
         title: '信息提示',
         content: '请保持输入密码一致'
       });
       return false;
     }
     wx.request({
       url: 'https://weixin1.haowaihao.com.cn/api/changePwd.do',
       type:'GET',
       data:{
         "newpwd": _self.data.pwd
       },
       header:{
         'Content-Type': 'json',
         token: con.data.token,
       },
       success:function(res){
           if(res.data.result == '0'){
             wx.showModal({
               title: '信息提示',
               content: '密码修改成功',
               success:function(){
                  _self.loginOut();
               }
             });
           }else{
             wx.showModal({
               title: '信息提示',
               content: '密码修改失败',
               success:function(){

               },
             });
           }
       },
       fail:function(){

       },
     }) 
  },

  /**
   * @名称 登出
   * @param
   * @return
   */
  loginOut: function () {
    wx.clearStorage();
    wx.navigateTo({
      url: '../login/login'
    })
  },
  
  /**
   * 名称:取消事件
   *  @param
   * @return
  */
  loginResetCancle:function(){
    wx.navigateBack({
      delta: 1
    })
  }

})