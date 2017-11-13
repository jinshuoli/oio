//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  /**
   * 拨号号码增加标准格式处理函数
   * @param：传入拨号号码
   * @author：峥嵘时代科技-无敌皮卡秋
   * @time：2017/07/07
   */
  addPhoneNumFormat: function (phonenum) {
    if (phonenum.length >= 3) {
      var threePhoneNum = phonenum.substr(0, 3);
      if ((this.globalData.themRoughly).indexOf(threePhoneNum) != -1) {
        if (threePhoneNum != "400") {
          if (phonenum.length == "9") {
            phonenum = threePhoneNum + '-' + phonenum.substr(3, 4) + '-' + phonenum.substr(7, 4);
          }
        } else {
          if (phonenum.length == "9") {
            phonenum = threePhoneNum + '-' + phonenum.substr(3, 3) + '-' + phonenum.substr(6, 4);
          }
        }
      } else if ((this.globalData.areaCode).indexOf(threePhoneNum) != -1) {
        if (threePhoneNum.substr(0, 2) == "01" || threePhoneNum.substr(0, 2) == "02") {
          if (phonenum.length == "4") {
            phonenum = phonenum.substr(0, 3) + '-' + phonenum.substr(3, 7);
          }
        } else {
          if (phonenum.length == "5") {
            phonenum = phonenum.substr(0, 4) + '-' + phonenum.substr(4, 7);
          }
        }
      }
    }
    return phonenum;
  },

  /**
   * 拨号号码去除标准格式处理函数
   * @param：传入拨号号码
   * @author：峥嵘时代科技-无敌皮卡秋
   * @time：2017/07/07
   */
  delPhoneNumFormat: function (phonenum) {
    if (phonenum.length >= 3) {
      var threePhoneNum = phonenum.substr(0, 3);
      if ((this.globalData.themRoughly).indexOf(threePhoneNum) != -1) {
        if (threePhoneNum != "400") {
          if (phonenum.length == "10") {
            phonenum = phonenum.replace('-', '');
            phonenum = phonenum.substring(0, phonenum.length - 1);
          }
        } else {
          if (phonenum.length == "9") {
            phonenum = phonenum.replace('-', '');
            phonenum = phonenum.substring(0, phonenum.length - 1);
          }
        }
      } else if ((this.globalData.areaCode).indexOf(threePhoneNum) != -1) {
        if (threePhoneNum.substr(0, 2) == "01" || threePhoneNum.substr(0, 2) == "02") {
          if (phonenum.length == "5") {
            phonenum = phonenum.replace("-", "");
          }
        } else {
          if (phonenum.length == "6") {
            phonenum = phonenum.replace("-", "");
          }
        }
      }
    }

    phonenum = phonenum.substring(0, phonenum.length - 1);
    return phonenum;
  },

  /**
   * 手机号码中间四位隐藏
   * @param：传入手机号码
   * @author：峥嵘时代科技-无敌皮卡秋
   * @time：2017/07/11
   */
  phoneMiddleFourHidden: function (phonenum) {
    if (phonenum.length == "11") {
      if (phonenum.substring(0, 1) == "0") {
        phonenum = phonenum.substring(0, 4) + "****" + phonenum.substring(8, 11);
      } else if (phonenum.substring(0, 1) == "1") {
        phonenum = phonenum.substring(0, 3) + "****" + phonenum.substring(7, 11);
      }
    } else if (phonenum.length == "10") {
      phonenum = phonenum.substring(0, 3) + "****" + phonenum.substring(7, 10);
    }
    return phonenum;
  },

  /**
   * 将通话时长的秒数转换为时分秒
   * @param：传入通话时长的秒数
   * @author：峥嵘时代科技-无敌皮卡秋
   * @time：2017/07/11
   */
  formatSeconds: function (duration) {
    var hh = parseInt(duration / 3600);
    var mm = parseInt((duration - hh * 3600) / 60);
    var ss = parseInt((duration - hh * 3600) % 60);
    hh != 0 ? hh = hh + "小时" : hh = "";
    mm != 0 ? mm = mm + "分" : mm = "";
    ss != 0 ? ss = ss + "秒" : ss = "";
    var length = hh + mm + ss;
    if (duration > 0) {
      return length;
    }
  },

  globalData: {
    userInfo: null,
    themRoughly: "130,131,132,133,134,135,136,137,138,139,147,150,151,152,153,155,156,157,158,159,176,177,178,180,181,182,183,184,185,186,187,188,    189,400,170,171",
    areaCode: "010,021,022,023,0311,0312,0313,0314,0315,0316,0317,0318,0319,0310,0335,0351,0349,0350,0352,0353,0354,0355,0356,0357,0358,0358,0359,0471,0470,0472,0473,0474,0475,0476,0476,0477,0477,0478,0479,0479,0482,024,0411,0412,0413,0414,0415,0416,0417,0418,0419,0410,0431,0432,0433,0433,0434,0435,0436,0437,0438,0438,0439,0439,0440,0451,0452,0453,0454,0455,0456,0457,0458,0459,0450,4623,4681,025,0510,0511,0512,0513,0514,0515,0516,0517,0518,0519,0520,0523,025,0571,0572,0573,0574,0575,0576,0577,0578,0579,0570,0580,0551,0550,0552,0553,0554,0555,0556,0557,0558,0559,0562,0563,0564,0565,0591,0592,0593,0594,0595,0596,0597,0598,0599,0590,0593,0791,0792,0793,0794,0795,0796,0797,0798,0799,0790,0701,0531,0532,0533,0534,0535,0536,0537,0538,0539,0530,0631,0633,0634,0371,0372,0373,0374,0375,0376,0377,0378,0379,0370,0391,0392,0393,0394,0396,027,0710,0711,0712,0713,0714,0715,0716,0717,0718,0719,0724,0731,0732,0733,0734,0735,0736,0737,0738,0739,,0739,0730,0744,0745,0746,020,0661,0663,0750,0751,0752,0753,0754,0755,0756,0757,0758,0759,0760,0768,0769,0771,0772,0773,0774,0775,0776,0777,0778,0779,0898,0899,0890,08001,08003,08005,0898,028,0812,0813,0814,0815,0816,0817,0818,0819,0810,0830,0831,0832,0833,0834,0835,0836,0837,0838,0839,0851,0852,0853,0854,0855,0856,0857,0858,0859,0871,0872,0873,0874,0875,0876,0877,0878,0879,0870,0888,0891,029,029,0910,0911,0912,0913,0914,0915,0916,0917,0919,0931,0932,0933,0934,0935,0936,0937,0938,0939,0930,0951,0952,0953,0954,0971,0972,0973,0974,0975,0976,0977,0978,0979,0991,0992,0993,0994,0995,0996,0997,0998,0999,0990,0908,00852,00853,00886"
  }

})
