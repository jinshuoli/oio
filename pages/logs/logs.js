//logs.js
var util = require('../../utils/util.js')
Page({
  
  data: {
    none: '',
    type:'1',
    url:'https://weixin1.haowaihao.com.cn/api/getContacts.do',
    search:'',
    status:'',
  },
  /**
   * 名称:初始化加载
   * @param
   * @return
   * 
  */
  onShow: function () {
    this.data.type = '1';
    var none = '';
    var type = '1';
    this.setData({
      none: '',
      type: type
    });
   this.onSendData();
   
  },

  /**
   * 名称:请求数据
   * @param int 电话号, 可选字段 str 姓名 可选字段
   * @return
  */
  onSendData:function(int,str){
    var _self = this;
      var con = wx.getStorageSync('loginRes');
    if(int == undefined){
      int = '';
    }
    if(str == undefined){
      str = '';
    }
    if(_self.data.status == '1'){
      int = _self.data.search;
    } else if (_self.data.status == '2'){
      str = _self.data.search;
    }
    wx.request({
        url: 'https://weixin1.haowaihao.com.cn/api/getContacts.do',
        data: {
            phone: int,
            letter:str
        },
        header: {
            token : con.data.token,
            "Content-Type":"json"
        },
        method: 'GET',
        dataType:'json',
        success: function (res) {
        
           _self.onFormData(res.data);
        }
    })
  },

  /**
   * 名称:格式化数据
   * @param data {} 待处理的数据
   * @return
  */
  onFormData:function(data){
   
      var arr = '';
      var _self = this;
      if(data == undefined){
        return false;
      }else{
        if(data.length == undefined){
          _self.setData({
            arr: ''
          });
        }else{
          _self.setData({
            arr: data
          });
        }
      }
  },


  /*
   * 名称: 通讯录中的新增图标按钮
   *@param
   *@return 
   *  
  */
  onClickAdd:function(e){
    var status = e.target.dataset.id;
    var none = '';
    var type = '';
    if(status == 1){
     none = 'contact-add-div-open';
     type = '0';
    }else{
      none = '';
      type = '1';
    }
    this.setData({
      none: none,
      type: type
    });
    
  },

  /*
   * 名称: 点击查询事件
   * @param 
   * @return
   */
  onSearch:function(){
    console.log('查询事件');
  },

  /*
   * 名称:手机通讯录触发事件 调用手机本事的通讯录
   * @param
   * @return
   */
  onPhone:function(){
      this.setData({
          none: '',
          type: 1
      });
    wx.addPhoneContact({
      firstName: '客户',//姓名
      mobilePhoneNumber:'',//手机号码
      weChatNumber:'',//微信号
      success:function(){

      }

    });  
    console.log('手机通讯录,歪!110吗?有人看我');
  },
  /*
   * 名称: 小程序触发事件
   * @param
   * @return
  */
  onSystem:function(){
    console.log('小程序通讯录,你看啥,还看我');
    this.setData({
        none: '',
        type: 1
    });
    wx.navigateTo({
      url: '../logs/add'
    })
  },

  /*
   * 名称:点击查看详情
   * @param int
   * @return
  */
   onInfo:function(e){
     var data = e.currentTarget.dataset.tel;
        this.setData({
           none: '',
           type: 1
        });
     if(data != undefined){
       wx.setStorage({
         key: "phoneLog",
         data: data,
         success: function () {
           //页面跳转
           wx.switchTab({
             url: '../dial/dial'
           });
         },
       })
     } 
   
   },

/**
 * 名称:查询事件
 * @param
 * @return
*/
onKey:function(e){
  var _self = this;
  var str = e.detail.value;
  _self.data.search = str;
  //判断是整型还是字符串
  var re = /^[0-9]+.?[0-9]*$/;
  if(re.test(str)){
   //int
    _self.onSendData(str,''); 
    _self.data.status = '1';
    console.log(_self.data.status + re.test(str))
  }else{
    //string
    // _self.onSendData('',str);
    // _self.data.status = '2'; 
    // console.log(_self.data.status + re.test(str))
    _self.onSendData(str, '');
    _self.data.status = '1';
    console.log(_self.data.status + re.test(str))
  }
},

/**
 * 名称:用户详情
 * @param
 * @return
*/
onUpdate:function(e){
  var _self = this;
  var name = e.currentTarget.dataset.name;
  var tel = e.currentTarget.dataset.tel;
  var acms = e.currentTarget.dataset.acms;//专属小号
  var expre = e.currentTarget.dataset.expre;//失效时间


  wx.navigateTo({
    url: '../logs/update?name='+name+'&tel='+tel+'&acms='+acms+'&expre='+expre,
  });
},


/**
 * 名称:用户刷新
 * @param
 * @return
*/
onPullDownRefresh: function () {
  console.log('下拉刷新');
  wx.showNavigationBarLoading();//
  wx.showLoading({
      title:'刷新中',
  });
  var _self = this;
  _self.onSendData();
  
  wx.stopPullDownRefresh({
    success:function(){
      setTimeout(function () {
        wx.hideLoading()
      }, 2000);
      wx.hideNavigationBarLoading();//
    },
  }); 
},
})
