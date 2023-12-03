!function (e) {
    var flag = true;

    function hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }
    function addClass(elem, cls) {
        if (!hasClass(elem, cls)) {
            elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
        }
    }
    function removeClass(elem, cls) {
        if (hasClass(elem, cls)) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }

    //设备判断
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        // if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {}
    }

    // alert('w:'+screen.width+',h:'+screen.height)
    function isIphoneX(){
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    }
    var html = document.getElementsByTagName('html')[0]
    if(isIphoneX()){
        addClass(html, 'iphonex')
    }

    function l(h, id) {
        var s = document.createElement('link');
        s.href = h;
        s.rel = 'stylesheet';
        s.type = 'text/css';
        s.charset = 'utf-8';
        if (id) s.id = id;
        document.getElementsByTagName('head')[0].appendChild(s);
    }

    function a() {
        var lCss = document.getElementById('landscapeCss');
        var viewport = document.getElementById('viewport');
        viewport.setAttribute('content', 'width=device-width,user-scalable=no');

        var winW=0,scaleW=0;
        var setViewportScale = function (w) {
            winW = document.documentElement.clientWidth;
            scaleW = winW / w;
            viewport.setAttribute('content', 'width='+w+',initial-scale='+scaleW+', maximum-scale='+scaleW+', minimum-scale='+scaleW+', user-scalable=no, viewport-fit=contain');
        }
        var setViewport = function (w) {
            viewport.setAttribute('content', 'width=' + w + ',user-scalable=no, viewport-fit=contain');
        }

        function lCssCreate() {
            if (!lCss) l(e.__css._l_css, 'landscapeCss');
        }

        function u(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r ? decodeURIComponent(r[2]) : null;
        }


        var sUserAgent = navigator.userAgent.toLowerCase();
        var Android = sUserAgent.match(/android/i) == "android" ? true : false;

        //开始设置
        if(!Android){
            if (window.orientation) {
                if (window.orientation === 90 || window.orientation === -90) { /!*landscape*!/
                    setViewportScale(1136)
                    lCssCreate();
                } else if (window.orientation === 180 || window.orientation === 0) { /!*portrait*!/
                    if (lCss) document.getElementsByTagName('head')[0].removeChild(lCss);
                    setViewportScale(640)
                }
            } else {
                var w = document.documentElement.clientWidth, h = document.documentElement.clientHeight;
                if (w > h) { /!*landscape*!/
                    setViewportScale(1136)
                    lCssCreate();
                } else { /!*portrait*!/
                    if (lCss) document.getElementsByTagName('head')[0].removeChild(lCss);
                    setViewportScale(640)
                }
            }
        }else{
            if (window.orientation === 90 || window.orientation === -90) { /*landscape*/
                setViewportScale(1136)
                lCssCreate();
            } else if (window.orientation === 180 || window.orientation === 0) { /*portrait*/
                if (lCss) document.getElementsByTagName('head')[0].removeChild(lCss);
                setViewportScale(640)
            }
        }
        flag = true
    }

    l(e.__css._p_css);
    var b = null;
    window.addEventListener('resize', function () {
        if(!flag) return
        flag = false
        clearTimeout(b);
        b = setTimeout(a, 300)
    }, !1);
    a();
}(window,__css);
