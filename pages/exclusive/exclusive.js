// pages/exclusive/exclusive.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:[],
        myPhone:''
    },
    arrayRemove: function(arr,index){
        if(isNaN(index)||index>arr.length){return false;}
        for(var i=0,n=0;i<arr.length;i++)
        {
            if(arr[i]!=arr[index])
            {
                arr[n++]=arr[i]
            }
        }
        arr.length-=1;
        return arr;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    
        var _self = this;
        var resl = wx.getStorageSync('loginRes');
        //我的信息
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
                _self.setData({
                    myPhone:result.ms
                });
            }
        })
        //我的小号
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/getOwerAcms.do',
            data: {
            },
            header: {
                "Content-Type":"json",
                token : resl.data.token
            },
            method: 'GET',
            dataType:'json',
            success: function (res) {
               
                for(var i=0;i<res.data.length;i++){
                    if(res.data[i].unsubts=='' || res.data[i].unsubts==null ){
                        res.data[i].unsubts='';
                    }
                    if(res.data[i].tel=='' || res.data[i].tel==null ){
                        res.data[i].tel='';
                    }
                    if(res.data[i].name=='' || res.data[i].name==null ){
                        res.data[i].name='';
                    }
                    
                }
                _self.setData({
                    datas: res.data
                });
            }
        })
    },

    /**
    * 获取专属小号
    */
    addExclusive: function(){
        wx.navigateTo({
            url: '../exclusive/addExclusive'
        })
    },

    /**
    * 解绑专属小号
    */
    unbindExclusive: function (e) {
        wx.setStorageSync('unbindAcms_cname', e.currentTarget.dataset.cname);
        wx.setStorageSync('unbindAcms_tel', e.currentTarget.dataset.tel);
        wx.setStorageSync('unbindAcms_acms', e.currentTarget.dataset.acms);
        wx.setStorageSync('unbindAcms_date', e.currentTarget.dataset.date);
        wx.navigateTo({
            url: '../exclusive/unbindExclusive'
        })
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

    /**
     * 名称:截取时间
     * @param
     * @retrun
    */
    onSplit:function(time){
      if (time != undefined) {
        var str = time.split(' ');
        //获取里面第一个值
        var data = str[0];
        return data;
      }
    },
})