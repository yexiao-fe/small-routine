//index.js
//获取应用实例
const app = getApp()
const audioCtx = wx.createInnerAudioContext()
const src="http://acsing2.kugou.com/sing7/web/share/c0-dataMTI0MTI3MDU2NQ==-signb0a5c9fc6e4fdf491aa37391976c29d2?u=MTAyNDQ4NTQ5Nw==&us=06335d1775ee99a7c0d37c91c60a8b40"
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../express/express'
    })
  },
  onShow: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    audioCtx.src=src
    audioCtx.autoplay=true
    audioCtx.loop=true
    audioCtx.play()
    audioCtx.onPlay(()=>{
      audioCtx.duration;
      console.log('开始播放',audioCtx.duration)
    })
    console.log(audioCtx)
  },
  bindmarkertap:function(e){
    if(this.timer) return;
    this.timer=setTimeout(()=>{
      this.bindViewTap()
    },5200)
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          var latitude = res.latitude // 纬度
          var longitude = res.longitude // 经度
          const points=[];
          // 上部分公式 x [-2,2]
          function s(x){
            return  Math.sqrt(1-(Math.abs(x)-1)**2)
          }
          // 下部分公式 x [-2,2]
          function t(x){
            return Math.acos(1-Math.abs(x))-Math.PI
          }
          const x=[];
          const long=101;//奇数
          for(let i=0;i<long;i++){
            x.push(i*2/(long-1))
          }
          const xx=JSON.parse(JSON.stringify(x)).reverse();
          const xArr=[].concat(x,xx,x.map(e=>{return e*-1}),xx.map(e=>{return e*-1}));
          // 开始点
          const ratio=0.005;
          const offsety=1;//向上偏移
          xArr.forEach((e,i)=>{
            let y=0;
            if(i<long||i>3*long){
              y=s(e)+offsety
            }else{
              y=t(e)+offsety
            }
            points.push({
              longitude: longitude+e*ratio,
              latitude: latitude+y*ratio
            })
          })

          const polyline=[{ 
            points: points,
            color:"#efabf9",
            width: 4,
            dottedLine: false
          }]
          const markers= [{
            iconPath: "../../images/cat.png",
            id: 0,
            latitude: latitude,
            longitude: longitude,
            width: 50,
            height: 50,
            title:"你所在的地方，就是我心跳的地方"
          }]  
          this.setData({
            latitude,
            longitude,
            polyline,
            markers
          })
        }
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
