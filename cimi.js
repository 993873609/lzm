var cimi = {
    /**
     * 得到一个随机不重复整数的数组
     * @param sInt 范围开始的整数
     * @param eInt 范围结束的整数
     * return 随机不重复整数的数组
     * e.g. cimi.getRandomIntArray(0, 10) 0~10随机不重复整数
     */
    getRandomIntArray: function(sInt, eInt) {
        var list=[];//结果数组
        var original=[];//给原始数组original赋值
        var count=eInt-sInt+1;
        //给原始数组original赋值
        for (var i=sInt;i<=eInt;i++){
            original.push(i);
        }
        for (i=0;i<count;i++){
            var index=Math.floor(Math.random()*original.length); //随机取一个位置
            list.push(original[index]);
            original.splice(index,1);//每一次取出一个，然后让这个数组减少一个， 取一个，减少一个，这样就可以做到永不重复了。
        }

        return list;
    },
    /**
     * 在手机屏幕底部打印Log
     * @param string 打印的字符串
     * @param color 打印的颜色，不填为白色
     */
    consoleLogMobile: function(string, color) {
        var domId='logOnScreen';
        var dom=document.getElementById(domId);
        if (!dom) {
            dom=document.createElement('div');
            document.body.appendChild(dom);
        }
        dom.setAttribute('id', domId);
        if (!color) color='#fff';
        dom.setAttribute('style', 'position: fixed; z-index: 9999; width: 100%; height: 30px; bottom: 0; left: 0; color: '+color);
        document.getElementById(domId).innerHTML=string;
    },
    /**
     * 弹出层
     * @method show 弹出弹出层 e.g. cimi.dialog.show('elmId')
     * @method close 关闭当前弹出层 e.g. cimi.dialog.close()
     */
    dialog: {
        maskId: '__cimi_dialog_mask',
        curTarget: null,
        show: function(elmId) {
            var target = document.getElementById(elmId), that = this;

            var maskElm = document.createElement('div');
            maskElm.id = that.maskId;
            maskElm.style.cssText = 'position:fixed;top:0;left:0;background: #000;width:100%;height:100%;z-index:9998;opacity: 0.7;filter:alpha(opacity=70)';

            if (that.curTarget) {
                that.curTarget.removeAttribute('style');
                that.curTarget.style.cssText = 'display:none';
            }
            if (!document.getElementById(that.maskId)) {
                document.body.appendChild(maskElm);
            }
            target.style.cssText = 'position:fixed;display:block;left:50%;top:50%;z-index:9999';
            target.style.marginLeft = '-'+(target.offsetWidth/2)+'px';
            target.style.marginTop = '-'+(target.offsetHeight/2)+'px';
            that.curTarget = target;
        },
        close: function() {
            var maskElm = document.getElementById(this.maskId);
            if (maskElm) maskElm.parentNode.removeChild(maskElm);

            if (this.curTarget) {
                this.curTarget.style.display = 'none';
                this.curTarget = null;
            }
        }
    },
    /**
     * 获取url地址的参数
     * @param name 参数名
     * e.g. 当前地址http://www.cimidesign.com?param=abc, 执行cimi.getQueryString('param')返回'abc'
     */
    getQueryString: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      return r ? decodeURIComponent(r[2])
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/ /g, "&nbsp;")
        .replace(/\'/g, "&apos;")
        .replace(/\"/g, "&quot;")
        .replace(/\//g, '&#x2F;')
        : null;
    },
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * cimi.dateFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * cimi.dateFormat("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * cimi.dateFormat("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * cimi.dateFormat("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * cimi.dateFormat("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    dateFormat: function (fmt, date) {
        var o = {
            "M+" : date.getMonth()+1, //月份
            "d+" : date.getDate(), //日
            "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时
            "H+" : date.getHours(), //小时
            "m+" : date.getMinutes(), //分
            "s+" : date.getSeconds(), //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S" : date.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }

        return fmt;
    },
    /**
     * 时间字符串转时间戳
     * @param dateStr 时间字符串 e.g. '2016-03-31 10:00:00'
     * return 时间戳 e.g. 1462762099645
     */
    getUnixTime: function(dateStr) {
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime();
        //return time_str.substr(0, 10); //返回秒数
        return time_str; //返回毫秒数
    },
    /**
     * 锚点跳转动画（仅限jQuery）
     * @param elmId 元素id
     */
    toAnchor: function (elmId) {
        var myY=$("#"+elmId).offset().top;
        $("html,body").stop().animate({scrollTop : myY},500);
    },
    /**
     * 播放音乐（解决微信不自动播放音乐）
     * 须先引入<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
     * 方案二(待测试)：加入stalled事件处理，发生stalled则重新audio.load() ; audio.play(); 或者保证audio.load()后，在canplaythrogh事件（或者readyState大于2后）进行audio.play()
     * @param elmId audio元素id
     */
    playAudio: function (elmId) {
        document.getElementById(elmId).play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            document.getElementById(elmId).play();
        }, false);
    },
    /**
     * 手机摇一摇
     * @param callback 摇一摇成功之后回调
     */
    initShake: function (callback) {
        if(window.DeviceMotionEvent) {
            var speed = 15;//定义一个数值
            var x,y,z,lastX,lastY,lastZ;x = y = z = lastX = lastY = lastZ = 0;//重置所有数值
            window.addEventListener('devicemotion', function(){
                var acceleration =event.accelerationIncludingGravity;//将传感值赋给acceleration
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed ) {
                    // TODO: 摇一摇触发事件
                    callback();
                }
                lastX = x;
                lastY = y;
                lastZ = z;
            }, false);
        }
    },
    /* DOM结构
    <div id="roll-box">
        <ul id="roll-cont">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
        </ul>
    </div>
    */
    /**
     * 垂直滚动（JS）
     * @param e.box [id] 包含整体的对象
     * @param e.obj [id] 内容对象
     * @param e.speed [number] 移动速度，默认值：30（数值越小，移动越快）
     * @compatibility chrome/firefox/IE6+/opera
     * e.g. cimi.vCarousel({ box: 'roll-box', obj: 'roll-cont', speed: 20});
     * */
    vCarousel : function (e) {
        // 初始化
        var box = document.getElementById(e.box);
        var obj1 = document.getElementById(e.obj);
        var obj2 = obj1.cloneNode(true); // 复制内容
        obj2.removeAttribute('id');
        box.appendChild(obj2);

        // 移动函数
        function movement() {
            if( box.scrollTop >= obj1.offsetHeight ){
                box.scrollTop -= obj1.offsetHeight;
            }else{
                box.scrollTop++;
            }
        }

        var invok = setInterval(movement,e.speed); // 定时调用

        box.onmouseover = function () { clearInterval(invok); }; // 清除定时器
        box.onmouseout = function () { invok = setInterval(movement,e.speed); }; // 恢复定时器
    },
    /**
     * 垂直滚动，每次滚动一条（jQuery）
     * @param e.obj [id] 包含整体的对象
     * @param e.speed [number] 滚动间隔
     * e.g. cimi.$vCarousel({ obj: '#roll', speed: 3000});
     * */
    $vCarousel : function (e) {
        var $this = $(e.obj);
        var scrollTimer;
        $this.hover(function() {
            clearInterval(scrollTimer);
        }, function() {
            scrollTimer = setInterval(function() {
                scrollNews($this);
            }, e.speed);
        }).trigger("mouseleave");

        function scrollNews(obj) {
            var $self = obj.find("ul");
            var lineHeight = $self.find("li:first").height();
            $self.animate({
                "marginTop": -lineHeight + "px"
            }, 600, function() {
                $self.css({
                    marginTop: 0
                }).find("li:first").appendTo($self);
            })
        }
    },
    /**
     * 水平跑马灯（jQuery）
     * @param e.box [id] 最外层包裹元素
     * @param e.hBox [id] 第二层包裹元素
     * @param e.obj [id] 滚动的元素
     * @param e.speed [number] 滚动间隔
     * e.g. cimi.$hCarousel({ box: 'roll-box', hBox: 'roll-hbox', obj: 'roll-cont1', speed: 20});
     * */
    $hCarousel : function (e) {
        // 初始化
        var box = document.getElementById(e.box);
        $(box).css({ 'white-space': 'nowrap'});//保持文字不换行

        var cont = document.getElementById(e.obj);
        var $contLi = $(cont).find('li');

        var objWidth = 0;
        for (var i = 0; i < $contLi.length; i++) {
            objWidth += parseFloat($contLi.eq(i).css('width'));
        }
        $(cont).css({ 'width': objWidth+'px'});

        var cloneCont = cont.cloneNode(true); // 复制内容
        cloneCont.removeAttribute('id');
        var hBox = document.getElementById(e.hBox);
        hBox.style.width = objWidth*2+'px';
        hBox.appendChild(cloneCont);
        // 移动函数
        function movement() {
            if( box.scrollLeft >= cont.offsetWidth ){
                box.scrollLeft -= cont.offsetWidth;
            }else{
                box.scrollLeft++;
            }
        }
        var invok = setInterval(movement,e.speed); // 定时调用
        box.onmouseover = function () { clearInterval(invok); }; // 清除定时器
        box.onmouseout = function () { invok = setInterval(movement,e.speed); }; // 恢复定时器
    },
    /**
     * Tab切换
     * @param opts.elmId 元素id
     * @param opts.tabPanel Tab切换主体元素类名（可为空）
     * @param opts.clickHandler Tab点击事件（可为空）
     * DOM结构:
     * <div id="elmId">
     *     <div>
     *         <a href="javascript:" class="selected">选项1</a>
     *         <a href="javascript:">选项2</a>
     *     </div>
     *     <div>
     *         <div class="tab-panel" style="display: block"></div>
     *         <div class="tab-panel"></div>
     *     </div>
     * </div>
     */
    tab: function(opts) {
        var oDiv = document.getElementById(opts.elmId);
        var hd = oDiv.getElementsByTagName('div')[0].getElementsByTagName('a');
        var bd = oDiv.getElementsByTagName('div')[1].getElementsByClassName(opts.tabPanel || 'tab-panel');
        for (var i = 0; i < hd.length; i++) {
            if (i == 0) {
                bd[i].style.display = 'block';
                hd[i].setAttribute('class', 'selected');
            } else {
                bd[i].style.display = 'none';
            }

            hd[i].index = i;
            hd[i].onclick = function() {
                show(this.index);
                if (opts.clickHandler) opts.clickHandler(this,this.index);
            }
        }
        function show(a) {
            var index = a;
            for (var j = 0; j < hd.length; j++) {
                hd[j].className = '';
                bd[j].style.display = 'none';
            }
            hd[index].className = 'selected';
            bd[index].style.display = 'block';
        }
    },
    /*
     * DOM结构:
     * <div id="elmId">
     *     <div class="tab-hd">
     *         <a href="javascript:" class="selected">选项1</a>
     *         <a href="javascript:">选项2</a>
     *     </div>
     *     <div class="tab-panel" style="display: block"></div>
     *     <div class="tab-panel"></div>
     * </div>
     */
    
    /**
     * Tab切换（jQuery/Zepto）
     * @param opts.elmId 元素id
     * @param opts.hd Tab头部（可为空）
     * @param opts.panel Tab内容部分（可为空）
     */
    $tab: function(opts) {
        var that = $('#'+opts.elmId);
        var hd_tabs_top = $(that).find(opts.hd ? opts.hd+' a' : '.tab-hd a');
        var hd_tab_panel = $(that).find(opts.panel || '.tab-panel');
        hd_tabs_top.eq(0).addClass('selected');
        hd_tab_panel.hide().eq(0).show();
        var tab_click = function(e,i){
            hd_tabs_top.removeClass('selected').eq(i).addClass('selected');
            hd_tab_panel.hide().eq(i).show();
            return false;
        };
        hd_tabs_top.each(function(i){
            $(this).on('click', function(e){
                tab_click(e,i);
            });
        });
    },
    /**
     * contenteditable的元素只能粘贴文本（Chrome浏览器天然支持contenteditable=“plaintext-only”）
     */
    contenteditableOnlyWords: function () {
        $('[contenteditable]').on('paste', function(e) {
            e.preventDefault();
            var text = null, textRange=null, sel=null;

            if(window.clipboardData && clipboardData.setData) {
                // IE
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            }
            if (document.body.createTextRange) {
                try {
                    document.execCommand("ms-beginUndoUnit", false, null);
                } catch (e) {}
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }

                textRange.text = text;
                textRange.collapse(false);
                textRange.select();

                try {
                    document.execCommand("ms-endUndoUnit", false, null);
                } catch (e) {}
            } else {
                document.execCommand("insertText", false, text);
            }
        });
    },
    //去掉所有html标记
    removeHTMLTag: function (str) {
        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        str = str.replace(/&nbsp;/ig,'');//去掉&nbsp;
        return str;
    },
    //判断浏览器是否是IE
    isIE: function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    },
    /**
     * 判断浏览器种类
     * e.g. 
     * var browser = cimi.getBrowserInfo();
     * var verinfo = cimi.getBrowserVersion();
     * if (browser.indexOf('ie') !== -1 && parseInt(verinfo) < 10) {}
     * */
    getBrowserInfo: function () {
        var agent = navigator.userAgent.toLowerCase() ;
        var regStr_ie = /msie [\d.]+;/gi ;
        var regStr_ff = /firefox\/[\d.]+/gi ;
        var regStr_chrome = /chrome\/[\d.]+/gi ;
        var regStr_saf = /safari\/[\d.]+/gi ;
        //IE11以下
        if(agent.indexOf('msie') > 0) {
          return agent.match(regStr_ie)[0] ;
        }
        //IE11版本中不包括MSIE字段
        if(agent.indexOf('trident') > 0&&agent.indexOf('rv') > 0){
          return 'ie ' + agent.match(/rv:(\d+\.\d+)/) [1];
        }
        //firefox
        if(agent.indexOf('firefox') > 0) {
          return agent.match(regStr_ff);
        }
        //Chrome
        if(agent.indexOf('chrome') > 0) {
          return agent.match(regStr_chrome);
        }
        //Safari
        if(agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
          return agent.match(regStr_saf);
        }
    },
    //判断浏览器版本
    getBrowserVersion: function () {
        return (cimi.getBrowserInfo()+'').replace(/[^0-9.]/ig,'');
    },
    /**
     * 弹出可拖动的弹窗
     * @param a.obj 弹窗id
     * @param a.tit 弹窗标题元素（只有拖动标题部分才能拖动）
     * e.g. cimi.$popDragableDialog({obj: '#pop_dialog', tit: '.tit'});
     * */
    $popDragableDialog: function (a) {
        var _mv=false;//移动标记
        var _x,_y;//鼠标离控件左上角的相对位置
        var _obj= $(a.obj);
        var _wid= _obj.width();
        var _hei= _obj.height();
        var _tit= _obj.find(a.tit);
        var docE =document.documentElement;
        var left=($(document).width()-_obj.width())/2;
        var top =(docE.clientHeight-_obj.height())/2;

        _tit.mousedown(function(e){
            _mv=true;

            var boundingBox = _obj[0].getBoundingClientRect();
            _obj.css({'position': 'fixed',top:boundingBox.top, left: boundingBox.left});

            _x=e.pageX-parseInt(_obj.css('left'));//获得左边位置
            _y=e.pageY-parseInt(_obj.css('top'));//获得上边位置
        });
        _obj.mouseup(function(e){
            _mv=false;
        });

        $(document).mousemove(function(e){
            if(_mv){
                var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                console.log(e.pageX);
                if(x<=0){x=0};
                x=Math.min(docE.clientWidth-_wid,x)-5;
                var y=e.pageY-_y;
                if(y<=0){y=0};
                y=Math.min(docE.clientHeight-_hei,y)-5;
                _obj.css({
                    top:y,left:x
                });//控件新位置
            }
        });

        $(document).on('mouseleave', function () {
            _mv=false;
        });

        reModel();
        $(window).bind('resize',function(){reModel();});
        $(document).keydown(function(event) {
            if (event.keyCode == 27) {
                _obj.hide();
            }
        });
        function reModel(){
            var b = docE? docE : document.body,
                height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
                width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
        }
    },
    /**
     * textarea/input自定义Placeholder
     * @param e 类名/id名
     * e.g. cimi.jsPlaceholder('#upload_title');(<input id="upload_title" type="text" data-placeholder="不超过20个字">)
     * */
    jsPlaceholder: function (e) {
        $(e).val($(e).attr('data-placeholder'));
        $(e).on('focus', function () {
            if($(this).val() == $(this).attr('data-placeholder')){
                $(this).val('');
            }
        }).on('blur', function () {
            if($(this).val() == ''){
                $(this).val($(this).attr('data-placeholder'));
            }
        });
    },
    /**
     * ios下自动播放问题
     * @param id media的ID名
     */
    mediaAutoPlay:function (id) {
        var media = document.getElementById(id),
            play = function(){
                media.play();
                document.removeEventListener("touchstart",play, false);
            };
        media && media.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            play();
        }, false);
        document.addEventListener("touchstart",play, false);
    },
    /**
     * 移动设备类型判断
     * @returns 0:iphone
     * @returns 1:Android
     * @returns {number}
     */
    ismobile:function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
            if(window.location.href.indexOf("?mobile")<0){
                try{
                    if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                        return 0;
                    }else{
                        return 1;
                    }
                }catch(e){}
            }
        }else if( u.indexOf('iPad') > -1){
            return 0;
        }else{
            return 1;
        }
    },
    /**
     * 内容滚动到底部
     * @param id
     */
    scrollBottom:function (id) {
        var $box = $('#'+id),
            $scrollHeight = $box.find('ul')[0].scrollHeight;
        $box.scrollTop($scrollHeight);
    },
    /**
     * 判断是否pc
     * PC：rerun true
     * M：rerun false
     * @returns {boolean}
     */
    isPc:function () {
        var os = ["Android","iPhone","Windows Phone","iPod","BlackBerry","MeeGo","SymbianOS"];  // 其他类型的移动操作系统类型，自行添加
        var info = navigator.userAgent;
        var len = os.length;
        for (var i = 0; i < len; i++) {
            if (info.indexOf(os[i]) > 0){
                return false;
            }
        }
        return true;
    },
    /**
     * 添加转义斜杠
     * @param str
     * @returns {XML|string|*}
     */
    addslashes:function (str) {
        str=str.replace(/\\/g,'\\\\');
        str=str.replace(/\'/g,'\\\'');
        str=str.replace(/\"/g,'\\"');
        str=str.replace(/\0/g,'\\0');
        return str;
    },
    /**
     * 删除转义的反斜杠
     * @param str
     * @returns {XML|string|*}
     */
    stripslashes:function (str) {
        str=str.replace(/\\'/g,'\'');
        str=str.replace(/\\"/g,'"');
        str=str.replace(/\\0/g,'\0');
        str=str.replace(/\\\\/g,'\\');
        return str;
    },
    /**
     * 去掉字符串前后所有空格
     * @param str
     * @returns {string|void|XML|*}
     */
    trim:function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /**
     * 去掉字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
     * 不设置第二个参数默认去除前后空格
     * @param str
     * @param is_global
     * @returns {string|void|XML|*}
     */
    trims:function (str,is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g")
        {
            result = result.replace(/\s/g,"");
        }
        return result;
    },
    /**
     * 返回一个从给定字符串剥离的HTML和PHP标签的字符串
     * str：要转义的html字符串
     * allow：可选参数  允许标记其不应该被剥离的标签字符串（如标签字符串：“<b><u>”）
     * @param str
     * @param allow
     * @returns {XML|string}
     */
    strip_tags:function (str,allow) {
        allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    },
    /**
     * 将html字符串转换为 HTML 实体
     * @param str
     * @returns {string}
     */
    htmlspecialchars:function (str) {
        var s = "";
        if (str.length == 0) return "";
        for   (var i=0; i<str.length; i++)
        {
            switch (str.substr(i,1))
            {
                case "<": s += "&lt;"; break;
                case ">": s += "&gt;"; break;
                case "&": s += "&amp;"; break;
                case " ":
                    if(str.substr(i + 1, 1) == " "){
                        s += " &nbsp;";
                        i++;
                    } else s += " ";
                    break;
                case "\"": s += "&quot;"; break;
                case "\n": s += "<br>"; break;
                default: s += str.substr(i,1); break;
            }
        }
        return s;
    },
    /**
     * HTML实体 转换为 html字符串
     * @param str
     * @returns {XML|string|*}
     */
    htmlspecialchars_decode:function (str) {
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, "''");
        str = str.replace(/&#039;/g, "'");
        return str;
    },
    /*
    * zepto动画滚动到某个元素的位置
    * @param options.to 滚动到目标dom的offset().top（必填）
    * @param options.target 滚动的载体dom（默认body）
    * @param options.durTime 动画时间
    * @param options.delay 延迟
    * @param options.callback 滚动完的回调
    * e.g. cimi.scroll({to: 0})
    */
    zeptoScroll: function (options) {
        var defaults = {
            target: window,
            durTime: 500,  //过渡动画时间
            delay: 30,     //定时器时间
            callback: null   //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = $(opts.target),
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.to - curTop,    //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback === 'function'){
                        opts.callback();
                    }
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.to);
        }, opts.delay);
    },
    /*
    * 获取Cookie
    * @param c_name cookie键名
    * e.g. cimi.getCookie('a20180212spring_pc_has_entered')
    */
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + '=');
            if (c_start !== -1)
            {
                c_start = c_start + c_name.length+1;
                var c_end = document.cookie.indexOf(';', c_start);
                if (c_end === -1) c_end = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(c_start, c_end))
            }
        }
        return ''
    },
    /*
    * 设置Cookie
    * @param c_name cookie键名
    * @param value 键值
    * @param expiredays 过期天数
    * e.g. cimi.setCookie('a20180212spring_pc_has_entered',true,365)
    */
    setCookie: function (c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + '=' + encodeURIComponent(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    },
,
    /**
     * 异形屏，水滴屏与齐刘海 iphonex
     * 通配18:9以上手机屏幕
     */
    isSpecialShaped: function () {
        var x = screen.width / (screen.height / 9); //16:9
        return (x >= 18 && x < 20) || x >= 4 && x < 5;
    },
    //判断a字符串结尾是否有b字符串
    judgeEndStr: function (a, b) {
        var d = a.length-b.length;
        return (d >= 0 && a.lastIndexOf(b) === d);
    },
    //通过script引入的形式加载js
    loadScript: function (url, charset, successCallback, errorCallback) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = charset;
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            successCallback && successCallback();
          }
        }
      } else {
        script.onload = function () {
          successCallback && successCallback();
        }
      }
      script.onerror = function () {
        errorCallback && errorCallback();
      }
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script)
    }
};


/**
 * 手机横屏限制
 * 默认正常显示方向为Y,不需要配置参数的时候直接调用shineLandscape.init()即可
 *
 * 直接上例子(参数设置)：
 shineLandscape.init({
        direction:'x',                                                      //{string}页面正常显示的方向，默认：y
        img:'https://game.gtimg.cn/images/js/landscape/landscape.png',   //{string}自定义图片，不设置将使用默认图
        imgWidth:'128px',                                                   //{string}自定义图片宽度，默认128px
        bgColor:'#32373b',                                                  //{string}背景颜色，默认：#32373b
        txt:'自定义提示文字',                                               //{string}自定义提示文字，默认：'为了更好的体验，请将手机/平板竖(横)过来'
        txtColor:'#fff',                                                    //{string}提示文字颜色，默认：'#ffd40a'
        txtSize:'16px',                                                     //{string}提示文字大小，默认：'18px'
        zIndex:1,                                                           //{number}层级覆盖z-index值,默认99999
        initBack:function (direction) {                                     //初始化完毕执行，返回当前方向字符串{x,y}
            console.log('初始化完毕，当前页面方向为：'+direction)
        },
        changeDirection:function (direction) {                              //方向发生改变时，返回当前方向字符串{x,y}
            console.log('方向已改变为：',direction)
        },
        curDirectionY:function () {                                         //当前方向为 Y 时执行
            console.log('当前页面方向：Y')
        },
        curDirectionX:function () {                                         //当前方向为 X 时执行
            console.log('当前页面方向：X')
        }
    })
 *
 * @type {{init: shineLandscape.init, orientationFun: shineLandscape.orientationFun, eve: null, shineHtml: null, shineCss: string, extend: shineLandscape.extend}}
 */
var shineLandscape = {
    eve:null,
    shineHtml:null,
    shineCss:'@keyframes Shine_landscapeAni{0%{transform:rotate(-90deg);}30%{transform:rotate(-90deg);}70%{transform:rotate(0deg);}100%{transform:rotate(0deg);}}@-webkit-keyframes Shine_landscapeAni{0%{transform:rotate(-90deg);}30%{transform: rotate(-90deg);}70%{transform:rotate(0deg);}100%{transform:rotate(0deg);}}.shine_landscape{width:100%;height:100%;background:#32373b;position:fixed;left:0;top:0;z-index:99999;display:none;text-align:center;}.shine_landscape_box{position:relative;margin-left:auto;margin-right:auto;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);}.shine_landscape img{-webkit-animation:Shine_landscapeAni 1.5s ease infinite alternate;width:auto; animation:Shine_landscapeAni 1.5s ease infinite alternate;}.shine_landscape span{font-size:18px;display:block;color:#ffd40a;text-align:center;width:100%;padding-top:5px;line-height:2;}',
    init:function (e) {
        this.eve = {direction: 'y', postStr:'竖', img:'https://game.gtimg.cn/images/js/landscape/landscape.png', imgWidth:'128px', bgColor:'#32373b', txt:'', zIndex:99999, txtColor:'#ffd40a', txtSize:'18px',initBack:'',changeDirection:'', callback : ''};
        this.eve = this.extend(this.eve, e);
        this.eve.direction ==='x' ? this.eve.postStr='横' : this.eve.postStr;
        if(e){!e.txt ? this.eve.txt = '为了更好的体验，请将手机/平板'+this.eve.postStr+'过来' : this.eve.txt}
        else{this.eve.txt = '为了更好的体验，请将手机/平板'+this.eve.postStr+'过来'}

        this.shineHtml='<div class="shine_landscape" id="Shine_landscape" style="background-color:'+this.eve.bgColor+';z-index:'+this.eve.zIndex+'"><div class="shine_landscape_box"><img src="'+this.eve.img+'" style="width: '+this.eve.imgWidth+'"><span style="color:'+this.eve.txtColor+';font-size:'+this.eve.txtSize+'">'+this.eve.txt+'</span></div></div>';
        var Shine_landscape_dom = document.getElementById('Shine_landscape'),
            _pos = null;
        var elm = document.createElement('div');
        elm.id= '______shineLandscape';
        if(!Shine_landscape_dom){document.body.appendChild(elm)}
        var __shine = document.getElementById('______shineLandscape');
        if(__shine){__shine.innerHTML=this.shineHtml}
        var cssElmId = document.getElementById('shine_landscape_css');
        if(!cssElmId){
            var cssElm = document.createElement('style');
            cssElm.id='______shine_landscape_css';
            document.head.appendChild(cssElm);
            var __shine_css = document.getElementById('______shine_landscape_css');
            if(__shine_css){__shine_css.innerHTML=this.shineCss}
        }
        var evt = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(evt, function(_pos) {
            _pos = shineLandscape.orientationFun();
            orientation(_pos);
            if(typeof shineLandscape.eve.changeDirection === 'function')shineLandscape.eve.changeDirection(_pos);
        });
        window.addEventListener('load',function (_pos) {
            _pos = shineLandscape.orientationFun();
            orientation(_pos);
            if(typeof shineLandscape.eve.initBack === 'function')shineLandscape.eve.initBack(_pos);
        });
        function orientation(_pos) {
            if (!_pos) {
                if (shineLandscape.eve.direction === 'x') {
                    document.documentElement.clientWidth > document.documentElement.clientHeight ? document.getElementById('Shine_landscape').style.display='none' : document.getElementById('Shine_landscape').style.display='block'
                }else {
                    document.documentElement.clientWidth < document.documentElement.clientHeight ? document.getElementById('Shine_landscape').style.display='none' : document.getElementById('Shine_landscape').style.display='block'
                }
            }else {
                _pos === shineLandscape.eve.direction ? document.getElementById('Shine_landscape').style.display='none' : document.getElementById('Shine_landscape').style.display='block'
            }
        }
    },
    //横屏提示
    orientationFun:function (){
        if (window.orientation === 180 || window.orientation === 0){
            //竖屏
            if(typeof this.eve.curDirectionY === 'function')this.eve.curDirectionY();
            return 'y'
        }
        if (window.orientation === 90 || window.orientation === -90){
            //横屏
            if(typeof this.eve.curDirectionX === 'function')this.eve.curDirectionX();
            return 'x'
        }
    },
    //复制对象、扩展对象
    extend:function (o) {
        for(var i = 1,len=arguments.length;i<len;i++){
            var source = arguments[i];
            for(var prop in source){
                o[prop] = source[prop];
            }
        }
        return o
    },
    /**
     * 异形屏，水滴屏与齐刘海 iphonex
     * 通配18:9以上手机屏幕
     */
    isSpecialShaped: function () {
        var x = screen.width / (screen.height / 9); //16:9
        return (x >= 18 && x < 20) || x >= 4 && x < 5;
    }
};


/**
 * 通用全局loading（SVG版）
 * 加载：loading.init();
 * 移除：loading.remove()
 * @type {{init: loading.init, remove: loading.remove, loadingSvg: string}}
 */
var loading = {
    init:function () {
        var loadDom = $('#loadingSvg').length;
        if(loadDom == 0)$('body').append(loading.loadingSvg);
    },
    remove:function () {
        $('#loadingSvg').remove();
    },
    loadingSvg: "<div id='loadingSvg' style='width: 100%;height: 100%;position: fixed;left: 0;top: 0;background: rgba(0,0,0,.5);z-index: 9999'><div style='width: 150px;height: 150px;position: absolute;left: 50%;top: 50%;margin-left: -75px;margin-top: -75px'><svg width='150px' height='150px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-default'><rect x='0' y='0' width='100' height='100' fill='none' class='bk'></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(0 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(30 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(60 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(90 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(120 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(150 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(180 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(210 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(240 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(270 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(300 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#101823' transform='rotate(330 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s' repeatCount='indefinite'/></rect></svg></div></div>"
}



/**
 * 获取文件夹内所有文件名的cmd命令：DIR *.*  /B >LIST.TXT
 * 预加载加载图片功能
 * loadImages.init(imgsArr, loading, loadCallback)
 * @type :
 * 参数：imgsArr  {图片地址数组}
 *      loading  {boolean}
 *      loadCallback {回调function}
 * 是否显示全局加载进度：loading (true:显示  默认不显示)
 *
 上例子：
 var imgLoadArr = ["cont-img1.jpg","cont-img2.jpg","cont-img3.jpg","cont-img4.jpg"]
 loadImages.init(imgLoadArr,true,function () {
    //图片加载完成
 })
 */
var loadImages = {
    init:function (imgsArr, loading, loadCallback) {
        //检测加载情况
        var checkLoad = function (e) {
            $(".images-load-section_txt").html( e.percent+"%" );
            if (e.percent === 100) {
                if(loading === true){
                    $(".images-load-section0").animate({opacity:0},400,function(){
                        $(".images-load-section0").hide();
                    });
                }
                if(typeof loadCallback === 'function'){
                    loadCallback(true)
                }
            }
        }
        if(loading === true){$('body').append(this.htmlDom)}
        // 加载进度反馈功能
        this.imgLoader(imgsArr, function(path, curNum, total) {
            var percent = parseInt( curNum / total * 100 , 10);
            checkLoad({
                percent:percent
            })
        });
    },
    // 加载图片功能
    load: function(path, callback) {
        var img = new Image();
        img.onload = function() {
            img.onload = null;
            callback(path);
        }
        img.src = path;
    },
    // 启动延迟加载功能
    imgLoader:function(imgs, callback) {
        var len = imgs.length,
            i = 0;
        while (imgs.length) {
            this.load(imgs.shift(), function(path) {
                callback(path, ++i, len);
            });
        }
    },
    htmlDom:'<div class="images-load-section0" style="width: 100%; height: 100%;position: fixed; left: 0; top: 0; z-index: 99999999; background: #000000;background: rgba(0,0,0,.8)"><span class="images-load-section_txt" style="display: block; width: 100%; font-size: 16px; color: #ffffff; position: absolute; top: 49%; left: 0; text-align: center; ">0%</span></div>'
}



//锚点跳转滑动效果
$('a[href*=#],area[href*=#]').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var $target = $(this.hash);
        $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
        if ($target.length) {
            var targetOffset = $target.offset().top;
            $('html,body').animate({
                scrollTop: targetOffset
            }, 1000);
            return false;
        }
    }
});

/**
 * 扩展JS的数组方法——插入元素到数组的指定位置
 * @param index 数组的索引
 * @param item 要插入的对象
 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

/**
 * 获取scrolltop
 * e.g. window.getWinScrollTop()
 */
Window.prototype.getWinScrollTop = function () {
    return document.documentElement.scrollTop||document.body.scrollTop;
};

/**
 * 给元素添加绑定事件
 * e.g. document.addEvent(document.getElementById('id'), 'click', function (e){});
 */
Document.prototype.addEvent = function (obj,type,handle) {
    try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type,handle,false);
    }catch(e){
        try{  // IE8.0及其以下版本
            obj.attachEvent('on' + type,handle);
        }catch(e){  // 早期浏览器
            obj['on' + type] = handle;
        }
    }
};

/**
 * JS获取样式
 * e.g. document.getStyle(document.getElementsByClassName('btn-next')[0], 'bottom')
 */
Document.prototype.getStyle = function ( obj , attr ) {

    if ( window.getComputedStyle ) {
        return getComputedStyle( obj , null )[attr];
    }else{
        return obj.currentStyle[attr];//IE
    }
};















