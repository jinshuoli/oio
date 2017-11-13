// pages/user/user.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        info:''
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        var resl = wx.getStorageSync('loginRes');
        var _self=this;
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/getProtocol.do',
            data: {
            },
            header: {
              token : resl.data.token
            },
            method: 'GET',
            dataType:'json',
            success: function (res) {
                var result = JSON.parse(res.data);
                _self.setData({
                    info:result.protocol
                });
            }
        })
    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady: function () {

    }
});