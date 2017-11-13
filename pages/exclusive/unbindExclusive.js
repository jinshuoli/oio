// pages/exclusive/unbindExclusive.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        acms : '',
        cname : '',
        tel : '',
        date : ''
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
        this.setData({
            cname : wx.getStorageSync('unbindAcms_cname'),
            tel : wx.getStorageSync('unbindAcms_tel'),
            acms : wx.getStorageSync('unbindAcms_acms'),
            date : wx.getStorageSync('unbindAcms_date')
        })
    },
    //提交解绑
    subUnBind: function (){
        var resl = wx.getStorageSync('loginRes');
        var _self=this;
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/unAxBind.do',
            data: {
                acms : _self.data.acms
            },
            header: {
                "Content-Type":"json",
                token : resl.data.token
            },
            method: 'POST',
            dataType:'json',
            success: function (res) {
                if(res.data.result==0){
                    _self.windowAlert("解绑成功");
                    wx.redirectTo({
                        url: '../exclusive/exclusive'
                    })
                }else{
                    _self.windowAlert("解绑失败");
                }
            }
        })
    },
    toPay: function(){
        wx.setStorageSync('wantAcms',this.data.acms);
        wx.redirectTo({
            url: '../pay/pay'
        })
    }
})