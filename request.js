/**
 * 封装Jquery请求类,若请求失败,会重复请求
 * author:行甫
 * params:{
 * tryTimes:尝试次数,默认3次,
 * tryInterval:每次尝试间隔时间,默认500毫秒
 * $requestType:ajax和getScript,必填,不同类型的接口对应的处理方式不一样,
 * successBack:必填,执行成功回调.
 * errorBack:请求发生错误回调函数,每次发生错误都会执行.该函数必须返回false不发起/true发起,告知错误处理方法是否继续发起下一次请求.
 * failBack:尝试次数用尽,执行失败回调,回调都绑定在改请求对象下执行.
 * timeOut:超时时间,在请求类型为ajax下有效
 * data:在请求类型为ajax下使用,,指$.ajax(data),不要包含url,success和error回调函数,使用apiUrl,successBack和failBack
 * apiUrl:必填.
 * attach:附加的对象,可以把某些对象存在这里.
 * }
 * 注意,若使用jsonp,编译相关的参数正常还一直报parsererror错,八成是服务器返回的不是标准json数据,有3种方法:
 * 1要求服务返回正常数据,不能是var 某某值 = {}这种类型,必须是纯{};
 * 2在不能修改的情况下,推荐这个方法,已在示例里更新.在data,添加参数jsonpCallback:test//自己定,再添加一个dataFilter方法:function(data,type){test(某某值)};
 * 3尝试次数设置为1,在data里添加complete函数来处理,complete里能拿到 某某值 这个变量.successBack设置为空函数,
 * **/
window.RequestApi = function (params) {
    //类型判断
    if (!(this instanceof RequestApi)) return new RequestApi(params);

    /**数据部分*/
    this.tryTimes = params['tryTimes'] || 3;
    this.timeOut = params['timeOut'] || 2000;
    this.tryInterval = params['tryInterval'] || 800;
    this.apiUrl = params.apiUrl;
    this.$requestType = params.$requestType;
    this.successBack = params.successBack;
    this.failBack = params['failBack'] || null;
    this.params = params;
    this.request$ = null;
    this.errorRecord = [];
    this.errorBack = params['errorBack'] || function () {
        return true;
    };
    this.attach = params['attach'] || null;
    /**数据部分 end*/

    /**方法部分*/
    this.requestOne = function (immediately) {
        //判断请求时间
        var delayTime = immediately ? 0 : this.tryInterval;
        //尝试关闭上一个请求
        this.request$ && this.request$.abort();
        if (this.tryTimes === 0) {
            //请求次数用尽,执行失败函数
            this.failBack && this.failBack(this.errorRecord);
        } else {
            //次数减一
            --this.tryTimes;
            //判断是否选择延后处理
            setTimeout(function () {
                switch (this.$requestType) {
                    case 'ajax': {
                        this.ajax();
                        break;
                    }
                    case 'getScript': {
                        this.getScript();
                        break;
                    }
                }
            }.bind(this), delayTime);
        }
    };
    this.handleError = function (XMLHttpRequest, textStatus) {
        console.log("失败: " + this.apiUrl, textStatus);
        this.errorRecord.push(textStatus);
        //执行error回调,判断是否应该自动发起下一次尝试
        this.errorBack(XMLHttpRequest, textStatus) && this.requestOne();
    };
    this.ajax = function () {
        var data = this.params.data;
        data['success'] = function (data) {
            this.successBack(data);
        }.bind(this);
        data['timeout'] = this.timeOut;
        data['error'] = this.handleError.bind(this);
        data['url'] = this.apiUrl;
        this.request$ = $.ajax(data);
    };
    this.getScript = function () {
        this.request$ = $.getScript(this.params.apiUrl).done(this.successBack.bind(this)).fail(this.handleError.bind(this));
    };
    /**方法部分 end*/

    //初始化完成,执行第一次尝试
    this.requestOne(true);
};