var apec = null;
var designTag = null;
var getArgs = function() {
    var args = {};
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf("=");
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        value = decodeURIComponent(value);
        args[argname] = value;
    }
    return args;
}
$(function(){
    apec = new Aspire();
    var search = location.search;
    if(search!=""&&/design=([1-9]|[a-z]{0,})/.test(search)){

        //designTag = search.split(/=/)[1];
        designTag = getArgs().design;
        apec.designPage.find('.friends-design')[0].style['background-image'] = 'url('+apec.paths+designTag+'.png)';
        var id = designTag.match(/\d/);
        global.changeDesignDesc(designTag.replace(/\d/,''),id[0]);
        global._gameTag = 4;
    }
});
window.onload = function(){
    apec.init();

};
var Aspire = function(){
    this.mainNode = $('#main');
    this.operationSection = this.mainNode.find('.operation-section');
    this.section = this.mainNode.find('section');
    this.conPage = this.mainNode.find('#conPage');
    this.superCover = $('#superCover');
    this.wardrobe = $('#wardrobe');
    this.fmPage = this.mainNode.find('#fmPage');
    this.backPage = this.mainNode.find('.back-page');
    this.lightDesc = this.mainNode.find('#light-desc');
    this.shareTip = this.mainNode.find('#shareWx');
    this.designPage = this.mainNode.find('#design-page');
};
Aspire.prototype = {
    loading:null,
    selectPremier:null,
    selectWard:null,
    paths:'http://mat1.gtimg.com/news/2014/zt/apecshow/img/',
    premier:{
        path:'http://mat1.gtimg.com/news/2014/zt/apecshow/img/',
        anbei:{
            name:'安倍晋三',
            country:'日本首相',
            title:'2006越南·奥黛秀',
            src:'anbei.png',
            ward:['刘德华同款&么么哒...','Size改小点&俺腿儿短','穿上龙袍&也不像太子咩...','穿上秋裤&感觉自己萌萌哒','中华立领&穿出村长范儿']
        },
        habo:{
            name:'哈珀',
            country:'加拿大总理',
            title:'2013印尼·安代克',
            src:'habo.png',
            ward:['刘德华同款&么么哒...','我欢喜&中国汉服','还是大叔&我最帅','我在加拿大&都不穿秋裤','比奥巴马&好看']
        },
        najibu:{
            name:'纳吉布',
            country:'马来西亚总理',
            title:'2008秘鲁·彭丘',
            src:'nabuji.png',
            ward:['刘德华同款&么么哒...','谁提马航!&跟谁急','尼玛马航...&真丢面儿','有一种寒冷&叫忘穿秋裤','我是坐马航&来的...']
        },
        aobama:{
            name:'奥巴马',
            country:'美国总统',
            title:'2011美国·西装',
            src:'aobama.png',
            ward:['刘德华同款&么么哒...','白天&不懂夜的黑','朕&就是这样的嘿汉子','米歇尔&喊我回家穿秋裤','我就是&长腿麻豆儿']
        },

        pujing:{
            name:'普京',
            country:'俄罗斯总统',
            title:'2004智利·查曼多',
            src:'pujing.png',
            ward:['刘德华同款&么么哒...','那谁...&不要惹我','我是&普京大帝!','秋裤&不如伏特加管用','我穿中华立领&最帅！']
        }
    },
    pics:{
        premier:[
            'tbg.png','light.png','anbei.png','pujing.png','aobama.png','habo.png','najibu.png'
        ],
        pujing:[
            'pujing1.png','pujing2.png','pujing3.png','pujing4.png','pujing5.png'
        ],
        aobama:[
            'aobama1.png','aobama2.png','aobama3.png','aobama4.png','aobama5.png'
        ],
        anbei:[
            'anbei1.png','anbei2.png','anbei3.png','anbei4.png','anbei5.png'
        ],
        najibu:[
            'najibu1.png','najibu2.png','najibu3.png','najibu4.png','najibu5.png'
        ],
        habo:[
            'habo1.png','habo2.png','habo3.png','habo4.png','habo5.png'
        ]
    },//预先加载所有政要的净身像；
    init:function(){
        this.adjustPageHeight();
        if(designTag){
            this.designPage.removeClass('hidden-apec');
        }
        this.initFmPage();
        return this;
    },
    //执行顺序
    //1、封面背景，所有小图片，自动加载
    //2、onload时间后，执行动画
    //3、动画执行同时开始预加载，执行完毕，显示加载进度
    //4、加载完毕后，开始提示上滑箭头，同时开始加载剩余图片

    initFmPage:function(){
        var that = this;
        var loadTag = false;
        this.loading = $('#loading');
        var apecTitle = $('.apec-title');
        apecTitle.find('img.s1').addClass('shift-left');
        apecTitle.find('img.s2').addClass('shift-right');
        setTimeout(function(){
            apecTitle.find('img.s3').addClass('ui-popup');
            //显示loading指数
            if(!loadTag){
                that.loading.removeClass('hidden-apec');
            }
        },600);
        //首次图片预先加载，premier、背景图、前两个人服装图
        this.lazyLoad(this.pics.premier.concat(this.pics.aobama,this.pics.pujing),function(){
            //图片加载完毕后，显示上滑按钮
            loadTag = true;//就不用再显示了;
            that.start_callback();
        });
    },
    adjustPageHeight:function(){
        var width = $(window).width();
        var height = $(window).height();
        $('body').height(height);
        if(width>640){
             this.lightDesc.find('.desc').addClass('scale-large');
        }
        /*this.backPage.height(height);
        this.fmPage.height(height);
        this.conPage.height(height);
        this.lightDesc.height(height);*/
    },
    lazyLoad:function(pics,callback){
        var index = 0;
        var len = pics.length;
        var img = new Image();
        var load = function(){
            img.src = apec.paths+pics[index];
            img.onload = function() {
                index ++ ;
                var percentage = (index/len).toFixed(2)*100+'';
                if (index < len) {
                    load();
                    apec.loading.find('.progress').text(percentage.slice(0,2));
                }else{
                    callback();
                }
            };
            return img;
        };
        if(len > 0){
            load();
        }else{
            callback();
        }
    },
    start_callback : function(){
        // 开启window的滚动
        global._scrollStart();
        //确定页面切换主配角
        global.init(this.fmPage,this.conPage,0);
        // 开启页面切换
        global.page_start();

        // 箭头显示,及隐藏加载百分比
        this.loading.addClass('hidden-apec');
        this.operationSection.find('.arrow').removeClass('hidden-apec');
        //预先加载所有政要的各式服装
        global.add_handle_event();
        this.lazyDown(this.pics.anbei.concat(this.pics.habo,this.pics.najibu));
    },
    lazyDown:function(pics){
        var index = 0;
        var len = pics.length;
        var img = new Image();
        var load = function(){
            img.src = apec.paths+pics[index];
            img.onload = function() {
                index ++ ;
                if (index < len) {
                    load();
                }
            }
        };
        if(len > 0){
            load();
        }
    }
};
/**********************
 * 通用函数 global
 * */
 var global = {
    /****对象统一标记****/
    _gameTag        : 0,                                    //0:表示游戏开始切换阶段，1：表示政要选择阶段，2：表示衣服选择阶段，3：表示配饰选择阶段
    _events 		: {},									// 自定义事件---this._execEvent('scrollStart');
    _windowHeight	: $(window).height(),					// 设备屏幕高度
    _windowWidth 	: $(window).width(),
    _page 			: $('.m-page'),							// 模版页面切换的页面集合
    _pageNum		: $('#superCover').find('.back-page').size(),					// 模版页面的个数
    _pageNow		: 0,									// 页面当前的index数
    _pageNext		: null,									// 页面下一个的index数
    _fmPage		    : null,									// 页面当前的index数
    _nextPage		: null,									// 页面下一个的index数
    _touchStartValY	: 0,									// 触摸开始获取的第一个值
    _touchDeltaY	: 0,									// 滑动的距离

    _moveStart		: true,									// 触摸移动是否开始
    _movePosition	: null,									// 触摸移动的方向（上、下）
    _movePosition_c	: null,									// 触摸移动的方向的控制
    _mouseDown		: false,								// 判断鼠标是否按下
    init:function(nodeF,nodeE){
        this._fmPage = nodeF;
        this._nextPage = nodeE;
        this.initLazyLoadImg();
        this._gameTag = 0;
    },
    initLazyLoadImg:function(){
        apec.conPage[0].style['background-image'] = 'url("'+apec.conPage.data('src')+'")';
        apec.superCover.find('.back-page').each(function(){
            this.style['background-image'] = 'url("'+$(this).data('src')+'")';
        });
        apec.wardrobe.find('.ward-cover .image')[0].style['background-image'] = 'url('+apec.paths+'aobama.png)';
        apec.wardrobe.find('.ward-transition .te-front .image')[0].style['background-image'] = 'url('+apec.paths+'aobama.png)';
    },
    /****页面滚动条控制****/
    //禁止滚动条
    _scrollStop		: function(){
        //禁止滚动
        $(window).on('touchmove.scroll',global._scrollControl);
        $(window).on('scroll.scroll',global._scrollControl);
    },
    //启动滚动条
    _scrollStart 	: function(){
        //开启屏幕禁止
        $(window).off('touchmove.scroll');
        $(window).off('scroll.scroll');
    },
    //滚动条控制事件
    _scrollControl	: function(e){e.preventDefault();},

    /****封页事件绑定****/
    // 页面切换开始
    page_start		: function(){
        apec.operationSection.on('touchstart mousedown',global.page_touch_start);
        apec.operationSection.on('touchmove mousemove',global.page_touch_move);
        apec.operationSection.on('touchend mouseup',global.page_touch_end);
        apec.designPage.find('.design-self').on('touchend mouseup',global.designBtnEnd);


    },

    // 页面切换停止
    page_stop		: function(){
        apec.operationSection.off('touchstart mousedown');
        apec.operationSection.off('touchmove mousemove');
        apec.operationSection.off('touchend mouseup');
    },
    _eventType:true,                             //eventType true=点击事件  fasle=滑动事件
    _slideStatus:false,                          //slideStatus  true=动作进行中，false=动作已完成
    _slideInit:false,                            //手滑动，和自动执行两种。
    // page触摸移动start

    designBtnEnd:function(){
        apec.designPage.addClass('hidden-apec');
        global._slideStatus = false;
        global._gameTag = 0;  //由用户分享开始游戏
    },
    //ok没有问题--这里是统一的
    page_touch_start: function(e){
        if(global._slideStatus) return; //动作进行中，不能执行新操作
        if(e.type == "touchstart"){
            global._touchStartValY = window.event.touches[0].pageY;
        }else{
            global._touchStartValY = e.pageY||e.y;
        }

        global._scrollStop();
        global._eventType = global.isClickTheBtn($(e.target));
        /*if($(e.target).hasClass('select')&&global._gameTag==1){
            global.selectedTheBtn($(e.target));
        }
        if($(e.target).hasClass('back')&&global._gameTag==2){
            global.selectedTheBtn($(e.target));
        }
        if($(e.target).hasClass('decoration')&&global._gameTag==2){
            global.selectedTheBtn($(e.target));
        }*/
        // start事件
        global._handleEvent('start');
    },

    // page触摸移动move
    page_touch_move : function(e){
        if(global._eventType) return;
        e.preventDefault();
        if(global._slideStatus) return; //动作进行中，不能执行新操作

        var moveP;
        // 获取移动的值
        if(e.type == "touchmove"){
            moveP = window.event.touches[0].pageY;
            move = true;
        }else{
            if(global._mouseDown){
                moveP = e.pageY||e.y;
                move = true;
            }else return;
        }
        global.page_position(e,moveP);
        // move事件
        global._handleEvent('move');
    },


    // page触摸移动判断方向
    page_position: function(e,moveP){
        // 设置移动的距离
        this._slideInit = true;     //slideInit--true:表示开始，手动操作，false:没有手动操作
        if(moveP!='undefined') this._touchDeltaY = moveP - this._touchStartValY;
        // 设置移动方向
        this._movePosition = this._touchDeltaY >0 ? 'down' : 'up';
        if(!this._movePosition_c){
            console.log('change');
            if(this._touchDeltaY>0){
                if(this._fmPage.prev('.back-page').length==0){
                    this._pageNext = this._pageNum-1;
                }else{
                    this._pageNext = this._pageNow-1;
                }
            }else{
                if(this._fmPage.next('.back-page').length==0){  //如果是最后一个
                    this._pageNext = 0;
                }else{
                    this._pageNext = this._pageNow+1;
                }
            }
            this._movePosition_c = this._movePosition;
        }
        this. page_translate();
    },
    // page触摸移动设置函数
    page_translate	: function(node){
        // 没有传值返回
        var y_1,y_2,scale,
            y = this._touchDeltaY;
        if(this._gameTag == 0 && this._movePosition=='up'){    //游戏开始
            this._fmPage.addClass('.p-hide');
            this._nextPage.removeClass('.p-hide').addClass('p-active');
            apec.operationSection.find('.arrow').addClass('hidden-apec');

            this._nextPage.attr('data-translate',Math.max($(window).height(),this._nextPage.height()));
            this._fmPage.attr('data-translate',0);

            // 切换的页面移动
            if(this._nextPage.attr('data-translate')) y_1 = y + parseInt(this._nextPage.attr('data-translate'));
            this._nextPage[0].style['-webkit-transform'] = 'translate(0,'+y_1+'px)';

            // 当前的页面移动
            if(this._fmPage.attr('data-translate')) y_2 = y + parseInt(this._fmPage.attr('data-translate'));
            scale = 1 - Math.abs(y*0.2/$(window).height());
            y_2 = y_2/5;
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,'+y_2+'px) scale('+scale+')';
            this._fmPage[0].style['opacity'] = 1-Math.abs(y*0.2/$(window).height());
        }else if(this._gameTag == 1){   //男神选择
            //更新当前页面和页面装填
            global._fmPage = apec.conPage.find('.back-page:eq('+global._pageNow+')');
            global._nextPage = apec.conPage.find('.back-page:eq('+global._pageNext+')');
            this._nextPage.removeClass('p-hide').addClass('p-action');
            this._fmPage.addClass('p-hide');

            //执行当前页面和下一页面的轮换动画
            scale = Math.abs(y/$(window).height());
            this._nextPage[0].style['-webkit-transform'] = 'scale('+scale+')';
            y_2 = -Math.abs(y);
            scale = (1 - Math.abs(y*2/$(window).height()));
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,'+y_2+'px) scale('+scale+')';
        }else{
            this._slideInit = false;
        }
    },

    // page触摸移动end
    page_touch_end	: function(e){
        //当页面继续完成后续动作，和页面切换动画时，禁止操作
        console.log('end');
        if(global._eventType){          //点击事件
            if(global._gameTag>0){
                global._slideStatus=true;
                console.log($(e.target).attr('class'));
                if(global._gameTag==1&&$(e.target).hasClass('select')){
                    apec.superCover.addClass('hidden-apec');
                    apec.wardrobe.removeClass('hidden-apec');
                    apec.operationSection.find('.select').addClass('animation').removeClass('visible');
                    setTimeout(function(){
                        apec.operationSection.find('.select').addClass('hidden-apec');
                        apec.operationSection.find('.decoration').removeClass('hidden-apec').addClass('visible');
                        global._slideStatus=false;
                    },1000);
                    //游戏进入装饰阶段
                    global._gameTag = 2;
                    global.selectThePremier(global._fmPage.data('name'));
                }else if(global._gameTag>1&&$(e.target).hasClass('back')){
                    global.returnToSelectPage();
                }else if(global._gameTag==2&&$(e.target).hasClass('decoration')){
                    //global.shareByWxChannel();

                    global.upTheOrderBtn('share-back');

                }else if(global._gameTag==2&&$(e.target).parent().hasClass('cloth')){
                    var currentNode = $(e.target);
                    var index = currentNode.data('index');
                    global.premierSelectCloth(index);//传入当前id
                    apec.selectWard = index;
                    global.displayShareTipArrow();
                    currentNode.siblings().removeClass('selected');
                    currentNode.addClass('selected');
                }
                else if(global._gameTag==3&&$(e.target).hasClass('back-select')){
                    global.returnToSelectPage();
                }
                else if(global._gameTag==3&&$(e.target).hasClass('share-decoration')){
                    global.displayShareTipArrow(true);
                }

                else{
                    global._slideStatus = false;
                }
            }
        }else{                          //move事件
            if(!global._slideInit)return;

            // 确保移动了
            if(Math.abs(global._touchDeltaY)>0){
                global._nextPage[0].style['-webkit-transition'] = 'all 0.6s';
                global._fmPage[0].style['-webkit-transition'] = 'all 0.6s';
            }
            // 页面切换
            if(Math.abs(global._touchDeltaY)>=100){		// 切换成功
                global._slideStatus=true;
                global.slideOutPremierMsg()
                global.page_success();


            }else if(Math.abs(global._touchDeltaY)>0&&Math.abs(global._touchDeltaY)<100){	// 切换失败
                global._slideStatus=true;
                global.page_fail();
                if(this._gameTag==1){
                    global.slideInPremierMsg();
                }

            }else{									// 没有切换

                if(this._gameTag==1&&this._touchDeltaY>0){
                    global._slideStatus=true;
                    global.slideInPremierMsg();
                    global.page_fail();
                }
            }
        }
        // end事件
        global._handleEvent('end');
        // 注销控制值
        global._movePosition = null;
        global._movePosition_c = null;
        global._touchStartValY = 0;
        global._eventType = false;
    },

    // 切换成功
    page_success	: function(){
        if(this._gameTag == 0){
            // 下一个页面的移动
            this._nextPage[0].style['-webkit-transform'] = 'translate(0,0)';

            // 当前页面变小的移动
            var y = this._touchDeltaY > 0 ? $(window).height()/5 : -$(window).height()/5;
            var scale = 0.8;
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,'+y+'px) scale('+scale+')';
        }else if(this._gameTag == 1){
            this._nextPage[0].style['-webkit-transform'] = 'scale(1,1)';
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,0) scale(0)';

        }
        // 成功事件
        this._handleEvent('success');
    },

    // 切换失败
    page_fail	: function(){
        if(this._gameTag == 0){
            this._nextPage[0].style['-webkit-transform'] = 'translate(0,'+$(window).height()+'px)';
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,0) scale(1)';
            apec.operationSection.find('.arrow').removeClass('hidden-apec');
        }else if(this._gameTag == 1){
            if(this._nextPage){
                this._nextPage[0].style['-webkit-transform'] ='scale(0)';
            }
            this._fmPage[0].style['-webkit-transform'] = 'translate(0,0) scale(1,1)';

        }
        this._handleEvent('fail');
    },
    _on:function(type, fn){
        if(!this._events[type]){
            this._events[type] = [];
        }
        this._events[type].push(fn);
    },
    _handleEvent:function(type){
         if(!this._events[type]){
             return;
         }
        var i= 0,l = this._events[type].length;
        if(!l){
            return;
        }
        for(; i<l; i++){
            this._events[type][i].apply(this,[].slice.call(arguments,1));
        }
    },
    add_handle_event:function(){
        this._on('start',global.lazy_third);//首页开始加载后，开始预先加载后面的图片资源
        this._on('success',global.freshGameTag);//首页开始加载后，开始预先加载后面的图片资源
        this._on('fail',global.defaultGameTag);//首页开始加载后，开始预先加载后面的图片资源
    },
    /****图片资源的预加载****/
    lazy_third:function(){
        //加载后三个图片
    },
    //操作成功后的处理工作
    freshGameTag:function(){
        if(this._gameTag == 0){
            this._gameTag = 1;
            setTimeout(function(){
                global._fmPage.addClass('hidden-apec');
                global._nextPage.removeClass('p-active').addClass('p-action');
                global._fmPage = apec.conPage.find('.back-page:eq(0)');
                global._nextPage = apec.conPage.find('.back-page:eq(1)');
                global._pageNow = 0;
                global._pageNext = 1;
                apec.operationSection.find('.select').addClass('visible');
                global.slideInPremierMsg();
            },300);
            setTimeout(function(){

                global._slideStatus = false;
            },600);


        }else if(this._gameTag>0){
            setTimeout(function(){
                global._fmPage[0].style['-webkit-transition'] = '';
                global._fmPage[0].style['-webkit-transform'] = '';
                global._nextPage[0].style['-webkit-transition'] = '';

                global._fmPage = global._nextPage;
                global._pageNow = global._pageNext;
                global._pageNext = null;
                global._nextPage = null;
                global._moveStart = true;
                global.slideInPremierMsg();
            },300);
            setTimeout(function(){


                global._slideStatus = false;
            },800);

        }
        global._touchDeltaY = 0;
    } ,
    defaultGameTag:function(){
        setTimeout(function(){
            if(global._gameTag == 0){
                global._fmPage.addClass('p-action');
                global._nextPage.removeClass('p-active').addClass('p-hide');
            }else if(global._gameTag==1){
                global._fmPage.removeClass('p-hide');
                global._fmPage[0].style['-webkit-transition'] = '';


                if(global._nextPage){
                    global._nextPage.addClass('p-hide');
                    global._nextPage[0].style['-webkit-transition'] = '';
                    global._nextPage[0].style['-webkit-transform'] = '';
                }
            }
            global._slideStatus = false;
            global._touchDeltaY = 0;
        },800);

    },
    slideInPremierMsg:function(){
        var name = global._fmPage.data('name');
        apec.lightDesc.find('.desc div').addClass('animation_3');
        apec.lightDesc.find('.name').text(apec.premier[name].name);
        apec.lightDesc.find('.country').text(apec.premier[name].country);
        apec.lightDesc.find('.title').text(apec.premier[name].title);
        apec.lightDesc.find('.desc').addClass('slide-out');
    },
    slideOutPremierMsg:function(){
        var descNode =  apec.lightDesc.find('.desc');
        descNode.find('div').removeClass('animation_3');
        descNode.removeClass('slide-out');
    },
    selectThePremier:function(name){
       // apec.wardrobe.find('.ward-cover .image')[0].attr('src',apec.paths+name+'.png');
        apec.wardrobe.find('.ward-cover .image')[0].style['background-image'] = 'url('+apec.paths+name+'.png)' ;
        var opt = apec.operationSection.find('.opt');
        opt.find('.cloth .item').removeClass('selected');
        opt.find('.cloth .item:last').addClass('selected');
        opt.children('div').addClass('hidden-apec');
        opt.find('div.cloth').removeClass('hidden-apec');
        opt.addClass('visible');
        apec.operationSection.find('.back').addClass('visible');
        var transitionNode =  apec.wardrobe.find('.ward-transition');
        transitionNode.find('.te-front .image')[0].style['background-image'] = 'url('+apec.paths+name+'.png)' ;
        transitionNode.data('name',name);
        apec.selectPremier = name;
    },
    //按钮按下状态
    selectedTheBtn:function(btn){
        btn.removeClass('animation').addClass('selected');
    },
    returnToSelectPage:function(){
        console.log('back');
        apec.superCover.removeClass('hidden-apec');
        apec.wardrobe.addClass('hidden-apec');
        apec.operationSection.find('.select').attr('class','clickEvent select animation visible');
        apec.operationSection.find('.decoration').attr('class','clickEvent decoration animation hidden-apec');
        apec.operationSection.find('.back').attr('class','clickEvent back animation');
        apec.operationSection.find('.opt').attr('class','clickEvent opt');
        apec.lightDesc.find('.finish-header').removeClass('move-down');
        apec.selectPremier = null;
        apec.selectWard = null;
        setTimeout(function(){
            global._slideStatus=false;
            global._gameTag = 1;
            console.log(global._gameTag);
        },300);

    },
    isClickTheBtn:function(node){
        //如果是点击落在这些位置上，自动判断为“点击事件”
        if(node.hasClass('clickEvent')||node.parents('.clickEvent').length>0){
            if(/select|decoration/.test(node.attr('class'))){
                global.selectedTheBtn(node);
            }
            return true;
        } else{
            return false;
        }
    },
    premierSelectCloth:function(id){
        var transitionNode = apec.wardrobe.find('.ward-transition');
        //transitionNode.find('.te-back .image').attr('src',apec.paths+transitionNode.data('name')+id+'.png');
        //apec.paths+transitionNode.data('name')+id+'.png)';
        transitionNode.find('.te-back .image')[0].style['background-image'] = 'url('+apec.paths+transitionNode.data('name')+id+'.png)';
        transitionNode.find('.te-back .image').data('src',apec.paths+transitionNode.data('name')+id+'.png');
        if(id=='0'){
            //transitionNode.find('.te-back .image').attr('src',apec.paths+transitionNode.data('name')+'.png');
            transitionNode.find('.te-back .image')[0].style['background-image'] = 'url('+apec.paths+transitionNode.data('name')+'.png)';
            transitionNode.find('.te-back .image').data('src',apec.paths+transitionNode.data('name')+'.png');
        }
        apec.wardrobe.find('.ward-cover').addClass('hidden-apec');
        global.changePremierDesc(id);
        transitionNode.find('.opacity-wrapper').removeClass('hidden-opacity');
        transitionNode.addClass('rotated');
        setTimeout(function(){
            transitionNode.find('.opacity-wrapper').addClass('hidden-opacity');
            transitionNode.removeClass('rotated');
            var src=transitionNode.find('.te-back .image').data('src');
            apec.wardrobe.find('.ward-cover .image')[0].style['background-image'] = 'url('+src+')';
            transitionNode.find('.te-front .image')[0].style['background-image'] = 'url('+src+')';
            apec.wardrobe.find('.ward-cover').removeClass('hidden-apec');
            global._slideStatus = false;
        },300);
    },
    upTheOrderBtn:function(tag){
        var opt = apec.operationSection.find('.opt');
        opt.removeClass('visible');
        apec.operationSection.find('.decoration').addClass('selected');
        setTimeout(function(){
            opt.addClass('visible');
            opt.children('div').addClass('hidden-apec');
            opt.find('div.'+tag).removeClass('hidden-apec');
            global._slideStatus = false;
            global._gameTag = 3;
            apec.lightDesc.find('.finish-header').addClass('move-down');
            apec.operationSection.find('.select').addClass('hidden-apec');
            apec.operationSection.find('.back').addClass('hidden-apec');
            apec.operationSection.find('.decoration').addClass('hidden-apec');
        },500);


    },
    displayShareTipArrow:function(tag){
        if(tag){
            apec.shareTip.removeClass('hidden-apec');
        }
        if(apec.selectPremier&&apec.selectWard){
            var style='';
            switch(apec.selectWard){
                case 1:
                    style = '大衣哥';
                    break;
                case 2:
                    style = '汉服';
                    break;
                case 3:
                    style = '龙袍';
                    break;
                case 4:
                    style = '秋裤';
                    break;
                case 5:
                    style = '中华立领';
                    break;

            }
            dataForWeixin.tContent = '我刚为 '+apec.premier[apec.selectPremier].country+apec.premier[apec.selectPremier].name+
                ' 设计的"'+style+'"APEC盛装碉堡了，你也来试试吧';
            dataForWeixin.url="http://news.qq.com/zt2014/APECshow/index.htm?design="+apec.selectPremier+apec.selectWard;
        }

    } ,
    changePremierDesc:function(id){
        if(id!=0){
            var tag = apec.premier[apec.selectPremier].ward[id-1].split('&');
            apec.lightDesc.find('.country').text(tag[0]);
            apec.lightDesc.find('.title').text(tag[1]);
        }else{
            apec.lightDesc.find('.country').text(apec.premier[apec.selectPremier].country);
            apec.lightDesc.find('.title').text(apec.premier[apec.selectPremier].title);
        }
    },
    changeDesignDesc:function(premier,id){
        apec.designPage.find('.name').text(apec.premier[premier].name);
        if(id!=0){
            var tag = apec.premier[premier].ward[id-1].split('&');
            apec.designPage.find('.country').text(tag[0]);
            apec.designPage.find('.title').text(tag[1]);
        }else{
            apec.designPage.find('.country').text(apec.premier[premier].country);
            apec.designPage.find('.title').text(apec.premier[premier].title);
        }
    }











};
/*  |xGv00|fdc8b4c712ca915b09a96abe389a2ea0 */