// pages/logs/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    old_phone:'',
    array: [],
    status:'',//专属小号判断
    index: 0,
    contype:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _self = this;
    
      var name = options.name;
      var phone = options.tel;
      var acms = options.acms;//专属小号

    
      if(acms == ''){
        _self.data.status = '';
      }else{
        _self.data.status = acms;//设置当前的小号
      }
      var expre = options.expre;//失效时间
     
      if(expre == 'null' || expre == 'None'){
        _self.setData({
          contype:'content-type'
        });
      }else{
        var invalid = _self.onSetTime(expre);//失效时间
        var now = _self.onGetTime();//当前时间
        if(now >= invalid){
          _self.setData({
            contype: ''
          });
        }else{
          _self.setData({
            contype: 'content-type'
          });
        }
      }
      this.onGetPhone();
      this.data.old_phone = phone;
      this.data.phone = phone;
      this.setData({
        name:name,
        phone:phone
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
  
    var aa = ['13264013003', '119', '118', '110', '120', '170', '199'];
    var a = '118';
    
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
   * 去充值
   * 
   * 
  */
  onChange:function(){
    var _self = this;
    var data = _self.data.array[_self.data.index];//充值小号
   
    wx.setStorage({
      key:"wantAcms",
      data:data,
      success:function(){
        wx.redirectTo({
          url: '../pay/pay'
        });
      }
    });
  },


  /**
   * 
   * 
  */
  bindPickerChange: function (e) {
  },


  /**
   * 名称:设置电话
   * @param
   * @return
   * 
  */
  onSetTel: function (e) {
    var _self = this;
    _self.data.phone = e.detail.value;

  },

  /**
   * 名称:设置姓名
   * @param
   * @return
  */
  onSetName: function (e) {
    var _self = this;
    _self.data.name = e.detail.value;
  },

  /**
   * 名称:表单按钮触发事件
   * @param
   * @return
   * 
  */
  onSub: function () {
    var _self = this;
    var con = wx.getStorageSync('loginRes');
    //判断参数
    if (_self.data.name == '') {

      wx.showToast({
        title: '输入姓名',
      });
      return false;
    }
    if (_self.data.phone == '') {
      wx.showToast({
        title: '输入联系方式',
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
      url: 'https://weixin1.haowaihao.com.cn/api/updateLinkman.do',
      type: 'GET',
      data: {
        "new_name": _self.data.name,
        "old_tel": _self.data.old_phone,
        "new_tel": _self.data.phone,
        "acms":acms,
      },
      header: {
        token: con.data.token,
        'Content-Type': 'json',
      },
      success: function (res) {
        if (res.data.result == 0) {
          wx.showModal({
            title: '信息提示',
            content: '修改成功',
          });
        } else {
          wx.showModal({
            title: '信息提示',
            content: '保存失败',
          });
        }
        
      },
      fail: function () {

      },
    })
  },

  /**
   * 名称:删除联系人
   * @param
   * @return
  */
  onDelete:function(){
    
     var _self = this;
     var con = wx.getStorageSync('loginRes');
     wx.showModal({
       title: '信息提示',
       content: '是否删除该联系人',
       success:function(res){
         
         var r = res.confirm;
         if(r){
           wx.request({
             url: 'https://weixin1.haowaihao.com.cn/api/delLinkman.do',
             type: 'GET',
             data: {
               "tel": _self.data.old_phone
             },
             header: {
               token: con.data.token,
               'Content-Type': 'json'
             },
             success: function (res) {
               if (res.data.result == 0) {
                 wx.navigateBack({
                   delta: 1
                 })
               } else {
                 wx.showModal({
                   title: '信息提示',
                   content: '删除联系人失败',
                 });
               }
             },
             fail: function () {

             },
           })
         }
        
       }
     });
     
  },

  /**
 * 名称:接口小号
 * @param
 * @return
 * 
*/
  onGetPhone: function () {
    var _self = this;
    var con = wx.getStorageSync('loginRes');
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/userInfo.do',
      data: '',
      type: 'GET',
      header: {
        token: con.data.token,
        'Content-Type': 'application/json',
      },
      success: function (res) {
       
        _self.onFormArr(res.data);
      },
      fail: function (res) {

      }
    });
  },

  /**
   * 名称:数据组装
   * @param info 需要凭借数据
   * @return
  */
  onFormArr: function (info) {
    var _self = this;

    var obj = JSON.parse(info);

    //var data = { "result": "0", "ms": "13527636892", "company": "号外号", "name": "liuda", "acms": "13216574665,13264013003,158199,45678,12345" };
    var arr = obj.acms;
    var arr_list = arr.split(',');
    
    if (_self.data.status == '' || _self.data.status == 'null') {
      arr_list.unshift('未选择小号');
      _self.data.array = arr_list;
    } else {
      _self.data.array = arr_list;
      _self.onGetKey(_self.data.status,_self.data.array);
    }
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
   * 名称:比对当前小号选中的key
   * @param
   * @return
  */
  onCompard:function(){
    var _self = this;
    
  },

  /**
   * 名称:遍历数组获取key
   * @param
   * @return
   * 
  */
  onGetKey:function(str,arr){
      var _self = this;
      var num = '';
      for(var i=0;i < arr.length;i++){
        if(str == arr[i]){
           num = i;
        }
      }
      _self.data.index = num;
      _self.setData({
        index:num
      });
  },

  /**
   * 名称:获取当前时间戳
   * @param
   * @return int 时间戳
  */
  onGetTime:function(){
    var timestamp = Date.parse(new Date()); 
    return timestamp;
  },

  /**
   * 名称:转换时间格式
   * @param yy-mm-dd h:i:s 
   * @return int 时间搓
  */
  onSetTime:function(str){
      if(str != undefined){
        var timestamp1 = Date.parse(new Date(str));
        return timestamp1;
      }
  }
})