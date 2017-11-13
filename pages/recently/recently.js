// pages/recently/recently.js
/**
 * 最近通话
 * author：峥嵘时代科技-无敌皮卡秋
 * time：2017/07/11
 */
var app = getApp();
Page({
  data: {
    requestUrl: 'https://weixin1.haowaihao.com.cn/api/findCdr.do',
    phoneImg:'https://weixin1.haowaihao.com.cn/static/images/recently/recentlyOut.png',
    nameId:'2',
    arr:'',
  },

  onShow: function (options) {
    this.onTiem('2017-05-05 16:56:34');
    var _self = this;
    var con = wx.getStorageSync('loginRes');
    //先清空
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/findCdr.do',
      data: '',
      method: "GET",
      header: {
          token :con.data.token
      },
      success: function (res) {
          var list = _self.onFormData(res.data);
          _self.setData({
              arr: list
          });
      },
      fail: function (res) {
          //console.log(res);
      }
    })
  },
  /*
   * 名称:点击事件
   * @param
   * @return
   * 
  */
  onclick:function(e){
   
    var phone = e.currentTarget.dataset.phone;
    //写入缓存中
    if(phone != undefined){
      wx.setStorage({
        key: "phoneLog",
        data: phone,
        success:function(){
          //页面跳转
          wx.switchTab({
            url: '../dial/dial',
          });
        },
      })
    }

    
    
  },

  /**
   * 名称:处理数据
   * @param 待处理的数据
   * @return [] 处理完成的数据 arr
  */
  onFormData:function(res){
   var _self = this;
    var No = 'https://weixin1.haowaihao.com.cn/static/images/recently/recentlyOut.png';
    var Off = 'https://weixin1.haowaihao.com.cn/static/images/recently/recentlyInbound.png';
    if(res == undefined){
      return false;
    }else{
      for(var i = 0; i < res.length; i++){
        if (res[i].duration != 'null'){
          res[i].duration = _self.onDate(res[i].duration);
        }
        if(res[i].date != 'None'){
          res[i].date = _self.onTiemNum(res[i].date);
        }
        if(res[i].call_time != 'None'){
          res[i].call_time = _self.onTiem(res[i].call_time);
        }
        switch (res[i].call_type) {
          case ("0"):
            res[i].call_type = No;
            break;
          case ("1"):
            res[i].call_type = Off;
            break;
          default:
            res[i].call_type = No;
        }
      }
      return res;
      
    }
    
  },

 /**
  * 名称:转换时间 
  * @param int
  * @return 时间格式
  */ 
  onDate:function(int){
      if(int != undefined){
        var theTime = parseInt(int);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60);
          theTime = parseInt(theTime % 60);
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
          }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "小时" + result;
        }
        return result;
      }
  },

  /**
   * 名称:转换时间格式
   * @param 时间格式
   * @return
   * 
  */
  onTiemNum:function(time){
    if(time != undefined){
       var str = time.split(' ');
       //获取里面第一个值
       var data = str[0];
       var li = data.substring(5);
       var res = li.replace('-','/');
       return res;
    }
  },


  /**
   * 名称:获取时间
   * @param
   * @return
  */
  onTiem:function(time){
      if(time != undefined){
        var str = time.split(' ');
        //获取里面第一个值
        var data = str[1];
        var li = data.substring(0,5);
       return li;
      }
  },



  /**
   * 名称:用户刷新
   * @param
   * @return
  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();//
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
        wx.hideNavigationBarLoading();//
      },
    });



  },

})