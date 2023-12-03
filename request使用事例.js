/**
 * author:行甫
 * */
/**普通使用情况*/
{
    //账户id
    var accId = milo.cookie.get('F_PERSONAL_GID');
    //大区id
    var areaId = milo.cookie.get('F_PERSONAL_AREAID');
    //请求地址
    var apiUrl = 'http://apps.game.qq.com/lol/api/v2013/userinfo.php?p1=' + accId + '&p2=' + areaId + '&d1=retBaseinfo';
    //附加当前对象
    var attach = this;

    //请求成功处理函数
    var success = function () {
        /**
         *请求成功后执行的函数
         *this是你实例化的request请求对象
         *因为是getScript请求类型获取一个js文件,这个js里的内容,已经在这个成功函数的作用域里了.retBaseinfo就是js里的一个对象
         */
        if (retBaseinfo.status == 0) {
            //我把某个对象放入到了attach,在这里使用它的方法.
            this.attach.dealGuestShow(retBaseinfo.msg);
        } else {
            //服务器返回的数据不对,再次发起请求
            //this.requestOne(true);立刻发出请求
            this.requestOne();//按照设定的延迟时间,延后发出
        }
    }
    //发生状态错误,例如401未登录等
    var error = function (XMLHttpRequest, textStatus) {
        //做点什么处理

        //return true;//继续下一次尝试
        //return false;//不在继续尝试请求
    }
    //请求耗尽
    var fail = function () {
        console.log(this.apiUrl + '请求尝试次数耗尽,请求失败');
    }
    var ajaxData = {
        apiUrl: apiUrl,
        successBack: success,
        errorBack: error,
        failBack: fail,
        $requestType: 'getScript',
        attach: attach
    }
    //实例化,发出请求.
    new RequestApi(ajaxData);
}


/**
 * jsonp请求
 * */
{
    var apiUrl = '//apps.game.qq.com/wmp/v3.1/';
    //请求参数
    var param = {
        p0: 3,
        p1: 'searchIso',
        p2: "亚索",
        p3: self.s_type,
        r1: 'result',
        p4: 1,
        order: self.s_order,
        pagesize: 10,
        page: self.page,
        source: 'web_pc'
    };
    var requestParam = {
        apiUrl: apiUrl,
        $requestType: 'ajax',
        data: {
            type: 'GET',
            data: param,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'jCB',
            /**拦截器,建议先删除试一下正常情况能否获取到数据 */
            dataFilter: function (data, type) {
                //data为undefined,若服务器并没有理会jsonpCallback:'jCB',自顾自的返回var result(服务器自己命名的,有可能不叫这个) = {}的代码块,导致parseerror报错.虽然报错,但还是会解析服务器返回的数据,从而有result这个变量存在;这时我们可以手动执行回调函数,跳过报错.
                jCB(result);
            }
        },
        successBack: function (data) {
            //没有使用dataFilter拦截器
            //console.log(data);

            //使用了dataFilter拦截器,result为服务器自己命名的变量
            //console.log(data, result);
        }
    }
    RequestApi(requestParam);
}