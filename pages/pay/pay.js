// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        none: 'ul_none',
        phone: '',
        acms:[],
        wx_money:0,
        token:'',
        date: '',
        hiddenLoading:true
    },
    //弹框
    windowAlert:function(_title){
        wx.showToast({
            title: _title,
            icon: 'success',
            duration: 2000
        })
    },

    //充值记录
    payList: function () {
        wx.navigateTo({
            url: '../pay/list'
        })
    },
    //下拉菜单点击事件
    onClickShow:function(e){
        if(this.data.none==""){
            this.setData({
                none :'ul_none'
            });
        }else{
            this.setData({
                none :''
            });
        }
    },
    //下拉菜单选择事件
    onPhoneSel:function(e){
        var selPhone = e.target.dataset.phone;
        this.setData({
            none: 'ul_none',
            phone :selPhone
        });
    },
    //支付事件
    startPay: function(e){
      
        var _self = this;
      
        this.setData({
            wx_money : e.currentTarget.dataset.money,
            date : e.currentTarget.dataset.date
        });
        var wx_money = _self.data.wx_money;
        if(this.data.phone==''){
            _self.windowAlert("请先选择要充值的小号");return false;
        }

        if(wx_money<0.1){
            _self.windowAlert("付金额不能少于0.1元");return false;
        }
        _self.onClick(e.currentTarget.dataset.money);
        //支付请求准备
        wx.login({
            success: function(res){
                _self.setData({
                    hiddenLoading:false
                });
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://weixin1.haowaihao.com.cn/api/getWeiXinPublic.do',
                        data: {
                          appid:'wxd7e3f82150105ba8',
                          secret:'eaf2aab4ae4b93144c401dfb9af4528b',
                            js_code:res.code,
                            amt: wx_money*100,
                            days:_self.data.date,
                            acms:_self.data.phone
                        },
                        method: 'POST',
                        dataType:'json',
                        header: {
                            token : _self.data.token,
                            "Content-Type": "json"
                        },
                        success: function(re){
                          console.log(re)
                            if(re.statusCode=='200'){
                                wx.requestPayment({
                                        'timeStamp': re.data.timeStamp,
                                        'nonceStr': re.data.nonceStr,
                                        'package': re.data.package,
                                        'signType': 'MD5',
                                        'paySign': re.data.paySign,
                                        'success':function(res){
                                            _self.setData({
                                                hiddenLoading:true
                                            });
                                            _self.windowAlert("支付成功！支付结果会有3~5分钟延迟！");
                                            wx.navigateTo({
                                                url: '../pay/list'
                                            })
                                        },
                                        'fail':function(res){
                                          console.log(res);
                                            _self.setData({
                                                hiddenLoading:true
                                            });
                                            _self.windowAlert("支付失败！");
                                        },
                                        'complete':function(res){
                                        }
                                    })
                            }else{
                                _self.windowAlert(res.errMsg);return false;

                            }
                        }
                    })
                } else {
                    // console.log('获取用户登录态失败！' + res.errMsg)
                }
            },
            fail: function(res){
                _self.windowAlert(res.errMsg);return false;
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _self=this;
        var resl = wx.getStorageSync('loginRes');
        var wphone = wx.getStorageSync('wantAcms');
        if(wphone!=''){
            this.setData({
                phone:wphone
            });
        }
        this.setData({
            token:resl.data.token
        });
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/userInfo.do',
            data: {
            },
            header: {
                token : resl.data.token
            },
            method: 'GET',
            dataType:'json',
            success: function (res) {
                var result = JSON.parse(res.data);
                if(result.acms!='' && result.acms!=undefined){
                    var result_arr = result.acms.split(",");
                    _self.setData({
                        acms:result_arr,
                        phone:result_arr[0]
                    });
                }

            }
        })
    },
    paying: function(){
        //发起支付

    },

    /**
     * 名称:点击效果事件
     * @param int 事件
     * @return
    */
    onClick:function(int){
        if(int == undefined){
          return false;
        }else{         
          this.setData({
            bg1:'',
            bg3:'',
            bg10:'',
            bg20:'',
          });
          if(int == '1'){
            this.setData({
              bg1: 'pay-bg'
            });
          }else if(int == '3'){
            this.setData({
              bg3: 'pay-bg'
            });
          }else if( int == '10'){
            this.setData({
              bg10: 'pay-bg'
            });
          }else if( int == '20'){
            this.setData({
              bg20: 'pay-bg'
            });
          }         
        }
    },
})