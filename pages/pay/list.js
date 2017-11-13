// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _self=this;
        var resl = wx.getStorageSync('loginRes');
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/queryTopup.do',
            data: {
            },
            header: {
                token : resl.data.token
            },
            method: 'GET',
            dataType:'json',
            success: function (res) {
                var result = JSON.parse(res.data);
                for(var i = 0; i < result.length; i++){
                    if(result[i].state=="SUCCESS"){
                        result[i].state="充值成功"
                    }else if(result[i].state=="FALSE"){
                        result[i].state="充值失败"
                    }else{
                        result[i].state="等待结果"
                    }
                }
                _self.setData({
                    datas: result
                });
            }
        })
    },

    /**
     * 名称:页面刷新
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