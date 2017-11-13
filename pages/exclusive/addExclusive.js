// pages/exclusive/addExclusive.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        css:'selectLi',
        sel:'',
        key:'北京',
        result:[],
        ifpay:1,
        flag:true,
        resl:"",
        logs:""
        },
    //弹出框的显隐
    getdata:function(){
      this.setData({ flag: false });
    },
    shows: function () {
      this.setData({ flag: true });
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
     * 监听用户名输入
     */
    searchInput: function (e) {
        this.data.key =e.detail.value
    },
    //小号选择   小号点击
    phoneSelect: function (e) {
        this.setData({
            sel:e.currentTarget.id          
        })
    },
    //地区点击显示
    // region:function(){
    //   console.log(value.code)
    // },
    //开始绑定
    bindStart : function (){ 
        var _self = this;
        var resl = wx.getStorageSync('loginRes');
        if(this.data.ifpay==1){
          // console.log(this.data.ifpay);
            if(this.data.sel!='' && this.data.sel!=undefined){
                wx.setStorageSync('wantAcms', this.data.sel);
                wx.navigateTo({
                  url: '../pay/pay'
                })
            }
        }else{
            //直接绑定
            wx.request({
                url: 'https://weixin1.haowaihao.com.cn/api/setAxBind.do',
                data: {
                    acms: _self.data.sel
                },
                header: {
                    "Content-Type":"json",
                    token : resl.data.token
                },
                method: 'POST',
                dataType:'json',
                success: function (res) {
                    if(res.data.result==0){
                        _self.windowAlert("绑定成功");
                        wx.navigateTo({
                            url: '../exclusive/exclusive'
                        })
                    } else if (res.data.result == 1){
                        _self.windowAlert("绑定失败");
                    } else if (res.data.result == 2) {
                      _self.windowAlert("数量已用完");
                    }
                }
            })
        }
        // console.log(sel);
    },
    //取消绑定
    bindEnd : function (){
      //返回上一级
      wx.navigateBack({
        delta: 1
      })
       
    },
    //渲染页面手机号
    searchSubmit: function(){     
        var _self = this;
        var resl = wx.getStorageSync('loginRes');
        this.setData({
            ifpay:resl.data.ifpay
        });
        wx.request({
            url: 'https://weixin1.haowaihao.com.cn/api/getCityNumber.do',
            data: {
                city: _self.data.key
            },
            header: {
                "Content-Type":"json",
                token : resl.data.token
            },
            method: 'POST',
            dataType:'json',
            success: function (res) {
              // console.log(res)
              // console.log("-----city："+city);
                if(res.data.number!='' && res.data.number!=undefined){                    var phones = res.data.number.split(",");
                    var city = res.data.city;//城市
                    _self.setData({
                        result: phones,
                        sel:'',
                        key:city
                    })
                 }else{
                  _self.setData({
                    result: '',
                    sel: '',
                    key: ''
                  })
                    _self.windowAlert("未查询到可用小号");
                  }
            }
        })
    },

    /**    
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var resl = wx.getStorageSync('loginRes');
      this.data.ifpay = resl.data.ifpay;    
        var _self = this;//*这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
      wx.request({ //定义函数
        url: 'https://weixin1.haowaihao.com.cn/api/getCityInfo.do',
        data: {//发动给后台的数据

        },
        header: {
          "Content-Type": "json",
          token: resl.data.token
        },
        method:"POST",//get为默认方法/POST
        success: function (res) {
          // console.log(res.data);//res.data相当于ajax里面的data，为后台返回数值
          _self.setData({ 
            //如果在success直接this就变成了wx.request()的this了，必须为getdata函数的this，不然无法重置调用函数
            logs: res.data           
          });
        },
        fail:function(err){  //请求失败
          console.log("失败")
        },
        complete:function(){
          //请求完成后执行的函数
        }
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

    },

    /**
     * 名称:搜索
     * @param
     * @return
    */
    onSearch:function(){
      this.searchSubmit();
      this.getdata();   
    }
})