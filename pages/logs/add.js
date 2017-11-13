// pages/logs/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name_type:false,
    phone_type:false,
    name:'',
    phone:'',
    array: [],
    index: 0,
    privatePhone:'',//选择中的专属小号
    status:'',
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
     
    if(options.phone != undefined){
      _self.data.phone = options.phone;
      _self.data.status = '1';
      _self.setData({
        phone: options.phone
      });
    }

    this.onGetPhone();
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
   * 名称:表单按钮触发事件
   * @param
   * @return
   * 
  */
  onSub:function(){
    var _self = this;
   
    var con = wx.getStorageSync('loginRes');
    //判断参数
    if(_self.data.name == ''){
      
      wx.showToast({
        title: '输入姓名',
      });
      return false;
    }
    if(_self.data.phone == '') {
      wx.showToast({
        title: '输入联系方式'
      });
      return false;
    }
    //设置新增小号
    var acms = _self.data.array[_self.data.index];
    
    //判断是整型还是字符串
    var re = /^[0-9]+.?[0-9]*$/;
    if (!re.test(acms)) {
      //str
      acms = '';
    }
   
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/addLinkman.do',
      type:'GET',
      data:{
        "name": _self.data.name,
        "tel": _self.data.phone,
        "acms": acms,
      },
      header:{
       
        'Content-Type': 'json',
        token: con.data.token,
      },
      success:function(res){
         var type = res.data.result;//返回状态
         if(type == '0'){
           wx.showModal({
             title: '信息提示',
             content: '保存成功',
           });
         }else{
           wx.showModal({
             title:'信息提示',
             content:'操作失败,请重试',
           });
         }
      },
      fail:function(){

      },
    })
  },

  /**
   * 名称:设置姓名
   * @param
   * @return
  */
  onSetName:function(e){
    var _self = this;
    _self.data.name = e.detail.value;
    
  },

  /**
   * 名称:设置电话
   * @param
   * @return
   * 
  */
  onSetTel:function(e){
    var _self = this;
    _self.data.phone = ((e.detail.value).replace("-", "")).replace("-", "");
    
  },

  /**
   * 名称:设置专属小号
   * @param
   * @return
  */
  onSetPriPhone:function(){
    var _self = this;
    var arr = _self.data.array;
    var num = _self.data.index;
  
    _self.privatePhone = arr[num];
   
  },

  /**
   * 名称:接口小号
   * @param
   * @return
   * 
  */
  onGetPhone:function(){
    var _self = this;
    var con = wx.getStorageSync('loginRes');
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/userInfo.do',
      data:'',
      type:'GET',
      header:{
        token: con.data.token,
        'Content-Type': 'application/json',
      },
      success:function(res){
         _self.onFormArr(res.data);
      },
      fail:function(res){

      }
    });
  },

  /**
   * 名称:数据组装
   * @param info 需要凭借数据
   * @return
  */
  onFormArr:function(info){
    var _self = this;

    var obj = JSON.parse(info);
     
    //var data = { "result": "0", "ms": "13527636892", "company": "号外号", "name": "liuda", "acms": "13216574665,13264013003,158199,45678,12345" };
    var arr = obj.acms;
    var arr_list = arr.split(',');
    arr_list.unshift('不选择小号');//向数组添加一个空
    _self.data.array = arr_list;
    _self.setData({
      array: _self.data.array
    })

  },

  /**
   * 名称:选定事件 
   * @param
   * @return
  */
  bindPickerChange: function (e) {
  
    this.setData({
      index: e.detail.value
    });
    this.data.index = e.detail.value;
  },

  /**
   * 名称:取消事件
   * @param
   * @return
  */
  onBack:function(){
    if(this.data.status == '1'){
      wx.switchTab({
        url:'../dial/dial'
      })
    }else{
      wx.navigateBack({
        delta: 1
      });
    }
  

  },

})