/**
 * ��װJquery������,������ʧ��,���ظ�����
 * author:�и�
 * params:{
 * tryTimes:���Դ���,Ĭ��3��,
 * tryInterval:ÿ�γ��Լ��ʱ��,Ĭ��500����
 * $requestType:ajax��getScript,����,��ͬ���͵Ľӿڶ�Ӧ�Ĵ���ʽ��һ��,
 * successBack:����,ִ�гɹ��ص�.
 * errorBack:����������ص�����,ÿ�η������󶼻�ִ��.�ú������뷵��false������/true����,��֪���������Ƿ����������һ������.
 * failBack:���Դ����þ�,ִ��ʧ�ܻص�,�ص������ڸ����������ִ��.
 * timeOut:��ʱʱ��,����������Ϊajax����Ч
 * data:����������Ϊajax��ʹ��,,ָ$.ajax(data),��Ҫ����url,success��error�ص�����,ʹ��apiUrl,successBack��failBack
 * apiUrl:����.
 * attach:���ӵĶ���,���԰�ĳЩ�����������.
 * }
 * ע��,��ʹ��jsonp,������صĲ���������һֱ��parsererror��,�˳��Ƿ��������صĲ��Ǳ�׼json����,��3�ַ���:
 * 1Ҫ����񷵻���������,������var ĳĳֵ = {}��������,�����Ǵ�{};
 * 2�ڲ����޸ĵ������,�Ƽ��������,����ʾ�������.��data,��Ӳ���jsonpCallback:test//�Լ���,�����һ��dataFilter����:function(data,type){test(ĳĳֵ)};
 * 3���Դ�������Ϊ1,��data�����complete����������,complete�����õ� ĳĳֵ �������.successBack����Ϊ�պ���,
 * **/
window.RequestApi = function (params) {
    //�����ж�
    if (!(this instanceof RequestApi)) return new RequestApi(params);

    /**���ݲ���*/
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
    /**���ݲ��� end*/

    /**��������*/
    this.requestOne = function (immediately) {
        //�ж�����ʱ��
        var delayTime = immediately ? 0 : this.tryInterval;
        //���Թر���һ������
        this.request$ && this.request$.abort();
        if (this.tryTimes === 0) {
            //��������þ�,ִ��ʧ�ܺ���
            this.failBack && this.failBack(this.errorRecord);
        } else {
            //������һ
            --this.tryTimes;
            //�ж��Ƿ�ѡ���Ӻ���
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
        console.log("ʧ��: " + this.apiUrl, textStatus);
        this.errorRecord.push(textStatus);
        //ִ��error�ص�,�ж��Ƿ�Ӧ���Զ�������һ�γ���
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
    /**�������� end*/

    //��ʼ�����,ִ�е�һ�γ���
    this.requestOne(true);
};