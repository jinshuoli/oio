// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:'',
        name:'',
        phone:'',
        content:'',
        showadd:'',
        myacms:''
    },
    //弹框
    windowAlert:function(_title){
        wx.showToast({
            title: _title,
            icon: 'success',
            duration: 2000
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _self=this;
        var resl = wx.getStorageSync('loginRes');
        this.setData({
            token:resl.data.token
        });
        if(options.tel!='' && options.tel!=undefined){
            this.setData({
               phone: options.tel,
               showadd:'message_add_r2_c3'
            });
        }else{
            this.setData({
                showadd:'message_add_r2_c3'
            });
        }
        if(options.name!='' && options.name!=undefined){
            this.setData({
                name: options.name
            });
        }else{
            this.setData({
                name: this.data.phone
            });
        }
        //获取小号
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/getOwerAcms.do',
            data: {
            },
            header: {
                "Content-Type":"json",
                token : _self.data.token
            },
            method: 'GET',
            dataType:'json',
            success: function (res) {
                for(var i=0;i<res.data.length;i++){
                    if(res.data[i].acms!='' || res.data[i].acms!=null ){
                        _self.setData({
                            myacms: res.data[i].acms
                        });
                    }
                }
            },
            fail: function () {
                _self.windowAlert("没有获取到小号信息");
                return false;
            }
        });
    },
    //发送短消息
    messageSend:function(){
        var _self = this;
        if(this.data.phone==''){
            _self.windowAlert('请选择收件人!');
            return false;
        }else if(this.data.content=='') {
            _self.windowAlert('请填写短信内容！');
            return false;
        }else if(this.data.myacms=='') {
            _self.windowAlert('没有可用的小号！');
            return false;
        }else{
            //发送
            // console.log("使用小号："+_self.data.myacms);
            // console.log("对方号码："+_self.data.phone);
            // console.log("短信内容："+_self.data.content.value);
            wx.request({
                url: 'https://weixin1.haowaihao.com.cn/api/sendSms.do',
                data: {
                    acms:_self.data.myacms,
                    starttime:_self.formatDate(),
                    content:_self.data.content.value,
                    peer_no:_self.data.phone
                },
                header: {
                    "Content-Type":"json",
                    token : _self.data.token
                },
                method: 'POST',
                dataType:'json',
                success: function (res) {
                    var type = JSON.parse(res.data);//返回状态
                    if(type.result == 0){
                        _self.windowAlert("信息发送成功！");
                        wx.navigateTo({
                            url: '../message/list?tel='+_self.data.phone
                        })
                    }else{
                        if(type.msg!=null){
                            _self.windowAlert("信息发送失败！"+type.msg);
                        }else{
                            _self.windowAlert("信息发送失败！");
                        }
                    }
                },
                fail: function () {
                    _self.windowAlert("信息发送失败！");
                    return false;
                }
            });
        }

    },
    //输入
    charChange:function(e){
        this.setData({
           content : e.detail
        });
    },
    callto:function(e){
        this.setData({
            phone : e.detail.value
        });
    },
    selectPeople:function(){
        if(this.data.showadd!=""){
            wx.navigateTo({
                url: '../message/logs'
            })
        }
    },
    formatDate:function(){
        var nowtime = new Date();
        var year = nowtime.getFullYear();
        var month = nowtime.getMonth()+1;    //js从0开始取
        var date1 = nowtime.getDate();
        var hour = nowtime.getHours();
        var minutes = nowtime.getMinutes();
        var sec = nowtime.getSeconds();
        return year+"-"+month+"-"+date1+" "+hour+":"+minutes+":"+sec;
    }
})