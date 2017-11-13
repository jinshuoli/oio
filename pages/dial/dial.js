/**
 * 拨号页面
 * author:峥嵘时代科技-无敌皮卡秋
 * time:2017/06/28
 */
//获取应用实例
var app = getApp();
var util = require('../../utils/OIO.interface.min.js');
var inputPhoneNum = "";
var PhoneNum = "";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    view: 'Hide',
    numArr: [
      { id: '1', changeColor: false, alphabet: '' },
      { id: '2', changeColor: false, alphabet: 'ABC' },
      { id: '3', changeColor: false, alphabet: 'DEF' },
      { id: '4', changeColor: false, alphabet: 'GHI' },
      { id: '5', changeColor: false, alphabet: 'JKL' },
      { id: '6', changeColor: false, alphabet: 'MNO' },
      { id: '7', changeColor: false, alphabet: 'PQRS' },
      { id: '8', changeColor: false, alphabet: 'TUV' },
      { id: '9', changeColor: false, alphabet: 'WXYZ' },
      { id: '✱', changeColor: false, alphabet: '' },
      { id: '0', changeColor: false, alphabet: '+' },
      { id: '#', changeColor: false, alphabet: '' }
    ],
    datas: [],
    token: '',
    PhoneNum: '',  //要呼叫的号码
    myacms: ''     //使用的小号a
  },
  onLoad: function (options) {
    var _self = this;
    var con = wx.getStorageSync('loginRes');
    this.setData({
      token: con.data.token
    });
    this.setData({
      PhoneNum: '',
      myacms: ''
    });
    //获取我的小号数据
    wx.request({
      url: 'https://weixin1.haowaihao.com.cn/api/getOwerAcms.do',
      data: {
      },
      header: {
        "Content-Type": "json",
        token: _self.data.token
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].unsubts == '' || res.data[i].unsubts == null) {
            res.data[i].unsubts = '';
          }
          if (res.data[i].tel == '' || res.data[i].tel == null) {
            res.data[i].tel = '';
          }
          if (res.data[i].name == '' || res.data[i].name == null) {
            res.data[i].name = '';
          }
        }
        _self.setData({
          datas: res.data
        });
      }
    })
  },
  /**
   *
   * 名称:监听页面加载
   *
   */
  onShow: function () {
    var _self = this;
    wx.getStorage({
      key: 'phoneLog',
      success: function (res) {
        var data = res.data;
        if (data != '') {
          _self.setData({
            PhoneNum: data,
            view: "Show"
          });
          wx.setStorage({
            key: 'phoneLog',
            data: ''
          });
        } else {
        }
      }
    })

  },
  //弹框
  windowAlert: function (_title) {
    wx.showToast({
      title: _title,
      icon: 'success',
      duration: 2000
    })
  },

  //新增联系人函数
  newContacts: function () {
    wx.redirectTo({
      url: "../logs/add?phone=" + this.data.PhoneNum,
      success: function (e) {
        //console.log(e)
      },
      fail: function (e) {
        //console.log(e);
      }
    });

  },
  //拨号键盘函数
  dialKeyboard: function (e) {
    var resetNumArr = this.data.numArr;
    var numArr = [];
    inputPhoneNum = app.addPhoneNumFormat(inputPhoneNum += e.target.id);
    for (var i = 0; i < this.data.numArr.length; i++) {
      if (e.target.id == this.data.numArr[i].id) {
        if (i == 9) {
          numArr[i] = { id: '✱', changeColor: true, alphabet: '' }
        } else if (i == 10) {
          numArr[i] = { id: '0', changeColor: true, alphabet: '+' }
        } else if (i == 11) {
          numArr[i] = { id: '#', changeColor: true, alphabet: '' }
        } else {
          numArr[i] = { id: i + 1, changeColor: true, alphabet: this.data.numArr[i].alphabet }
        }
      } else {
        if (i == 9) {
          numArr[i] = { id: '✱', changeColor: false, alphabet: '' }
        } else if (i == 10) {
          numArr[i] = { id: '0', changeColor: false, alphabet: '+' }
        } else if (i == 11) {
          numArr[i] = { id: '#', changeColor: false, alphabet: '' }
        } else {
          numArr[i] = { id: i + 1, changeColor: false, alphabet: this.data.numArr[i].alphabet }
        }
      }
    }
    this.setData({
      numArr: numArr
    })

    setTimeout(function () {
      this.setData({
        numArr: resetNumArr
      })
    }.bind(this), 100)

    this.setData({
      PhoneNum: inputPhoneNum
    })
    this.setData({
      view: "Show"
    })
  },
  //删除号码函数
  delPhoneNum: function (e) {
    if (inputPhoneNum.length == "1") {
      this.setData({
        view: "Hide"
      })
    }
    inputPhoneNum = app.delPhoneNumFormat(inputPhoneNum);
    this.setData({
      PhoneNum: inputPhoneNum
    })
  },
  //拨号函数
  dial: function () {
    var _self = this;
    if (this.data.PhoneNum != "" && this.data.PhoneNum != undefined) {
      //查询拨号是否有关联小号
      wx.request({
        url: 'https://weixin1.haowaihao.com.cn/api/getContacts.do',
        data: {
          phone: _self.data.PhoneNum,
          letter: ''
        },
        header: {
          token: _self.data.token,
          "Content-Type": "json"
        },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.data.length > 0) {
            if (res.data[0].acms !== '' && res.data[0].acms !== null) {
              _self.setData({
                myacms: res.data[0].acms
              });
            }
          }
          //随机选个小号
          if (_self.data.myacms == '') {
            var num = _self.data.datas.length;
            if (num < 1) {
              _self.windowAlert("您还没有绑定小号");
              return false;
            } else {
              var random = Math.floor(Math.random() * (num + 1));
              _self.setData({
                myacms: _self.data.datas[random].acms
              });
            }
          }
          _self._call();
        },
        fail: function () {
          _self.windowAlert("查询联系人失败");
          return false;
        }
      });
    } else {
      console.log("号码为空")
    }
  },
  _call: function () {

    var _self = this;
    PhoneNum = ((this.data.PhoneNum).replace("-", "")).replace("-", "");
    util.oio_interface({
      "model": "ax",
      "acms": _self.data.myacms,
      "calledms": _self.data.PhoneNum,
      "appkey": "xiaohaowaihao",
      "cardno": "111111",
      "cardtype": "1",
      "msgid": "b52179d301224f0e893d4ba418ea2d0c",
      "msgtype": "axbsubreq",
      "name": "水杉",
      "producttype": "2",
      "prtms": PhoneNum,
      "service": "acbss",
      "subts": "20170622162905",
      "ts": util.getTime(0)
    },
      function callback(data) {
        /*console.log(data); console.log(_self.data.myacms); console.log(_self.data.PhoneNum);*/
      });

    wx.makePhoneCall({
      phoneNumber: _self.data.myacms,
      
      success: function () {
        //util.oio_interface({ "model": "ax", "acms": _self.data.myacms, "calledms": _self.data.PhoneNum, "appkey": "hwh", "cardno": "111111", "cardtype": "1", "msgid": "b52179d301224f0e893d4ba418ea2d0c", "msgtype": "subreq", "name": "水杉", "producttype": "2", "prtms": PhoneNum, "service": "acbss", "subts": "20170622162905", "ts": util.getTime(0) }, function callback(data) { console.log(data); console.log(_self.data.myacms); console.log(_self.data.PhoneNum);});
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 10000
        });
        setTimeout(function () {
          wx.hideToast()
        }, 2000);

      },
      fail: function () {
        _self.windowAlert("拨打电话失败!");
      }
    });
  },

  /**
   * 名称:取消键盘
   * @param
   * @return
   * 
  */
  onSendFocus: function (e) {
    var data = e.detail.value;
    this.data.PhoneNum = data;
  },
})
