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
            url: 'https://weixin1.haowaihao.com.cn/api/querySms.do',
            data: {
            },
            header: {
                token : resl.data.token
            },
            method: 'POST',
            dataType:'json',
            success: function (res) {
                var result = JSON.parse(JSON.parse(res.data));
                for(var i=0;i<result.length;i++){
                    if(result[i].name==null){
                        result[i].name = result[i].peer_no
                    }
                    result[i].send_time = _self.formatDate(result[i].send_time);
                }
                _self.setData({
                    datas:result
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
    
        wx.showNavigationBarLoading();
        wx.showLoading({
            title: '刷新中'
        });
        var _self = this;
        _self.onLoad();

        wx.stopPullDownRefresh({
            success: function () {
                setTimeout(function () {
                    wx.hideLoading()
                }, 2000);
                wx.hideNavigationBarLoading();//
            }
        })
    },
    messageAdd: function(){
        wx.navigateTo({
            url: '../message/add'
        })
    },
    oneLine:function(e){
        var tel = e.currentTarget.dataset.tel;
        wx.navigateTo({
            url: '../message/list?tel='+tel
        })
    },
    formatDate:function(time){
        var time1 = time.split(" ");
        var time1_1 = time1[0].split("-");
        var time1_2 = time1[1].split(":");
        return time1_1[1]+"月"+time1_1[2]+"日 "+time1_2[0]+":"+time1_2[1];
    }
})