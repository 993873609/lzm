/**
 * author:�и�
 * */
/**��ͨʹ�����*/
{
    //�˻�id
    var accId = milo.cookie.get('F_PERSONAL_GID');
    //����id
    var areaId = milo.cookie.get('F_PERSONAL_AREAID');
    //�����ַ
    var apiUrl = 'http://apps.game.qq.com/lol/api/v2013/userinfo.php?p1=' + accId + '&p2=' + areaId + '&d1=retBaseinfo';
    //���ӵ�ǰ����
    var attach = this;

    //����ɹ�������
    var success = function () {
        /**
         *����ɹ���ִ�еĺ���
         *this����ʵ������request�������
         *��Ϊ��getScript�������ͻ�ȡһ��js�ļ�,���js�������,�Ѿ�������ɹ�����������������.retBaseinfo����js���һ������
         */
        if (retBaseinfo.status == 0) {
            //�Ұ�ĳ��������뵽��attach,������ʹ�����ķ���.
            this.attach.dealGuestShow(retBaseinfo.msg);
        } else {
            //���������ص����ݲ���,�ٴη�������
            //this.requestOne(true);���̷�������
            this.requestOne();//�����趨���ӳ�ʱ��,�Ӻ󷢳�
        }
    }
    //����״̬����,����401δ��¼��
    var error = function (XMLHttpRequest, textStatus) {
        //����ʲô����

        //return true;//������һ�γ���
        //return false;//���ڼ�����������
    }
    //����ľ�
    var fail = function () {
        console.log(this.apiUrl + '�����Դ����ľ�,����ʧ��');
    }
    var ajaxData = {
        apiUrl: apiUrl,
        successBack: success,
        errorBack: error,
        failBack: fail,
        $requestType: 'getScript',
        attach: attach
    }
    //ʵ����,��������.
    new RequestApi(ajaxData);
}


/**
 * jsonp����
 * */
{
    var apiUrl = '//apps.game.qq.com/wmp/v3.1/';
    //�������
    var param = {
        p0: 3,
        p1: 'searchIso',
        p2: "����",
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
            /**������,������ɾ����һ����������ܷ��ȡ������ */
            dataFilter: function (data, type) {
                //dataΪundefined,����������û�����jsonpCallback:'jCB',�Թ��Եķ���var result(�������Լ�������,�п��ܲ������) = {}�Ĵ����,����parseerror����.��Ȼ����,�����ǻ�������������ص�����,�Ӷ���result�����������;��ʱ���ǿ����ֶ�ִ�лص�����,��������.
                jCB(result);
            }
        },
        successBack: function (data) {
            //û��ʹ��dataFilter������
            //console.log(data);

            //ʹ����dataFilter������,resultΪ�������Լ������ı���
            //console.log(data, result);
        }
    }
    RequestApi(requestParam);
}