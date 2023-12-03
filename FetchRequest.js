
/**
 * author:行甫
 * 本类在浏览器自带的Fetch基础上,封装的一个具有出错重复请求的类,
 * 如果接口需要轮询,请直接使用fetch,减少内存开销
 * @param url 请求地址
 * @param catchData 请求附带的设置对象
 */
class FetchRequest {
    constructor(url, catchData) {
        /**重复发起几次请求,直到次数耗尽或请求成功,默认4次,间隔200毫秒 */
        this.tryTimes = 4;
        this.intervalTime = 200;
        this.url = url;
        this.catchData = catchData;
        /**借位的promise对象,代替原生fetch返回的promise响应 */
        this.promise = new Promise((resolve, reject) => {
            var tryFunction = () => {
                --this.tryTimes;
                fetch(this.url, this.catchData).then((response) => {
                    if(!response.ok){
                        throw new Error("服务器连通,但未正常响应请求");
                    }
                    this.promise = null;
                    this.url = null;
                    this.catchData = null;
                    tryFunction = null;
                    resolve(response);
                }).catch((error) => {
                    if (this.tryTimes > 0) {
                        $consoleWran("请求", this.url, "失败,继续尝试:", error);
                        setTimeout(()=>{
                            tryFunction();
                        },this.intervalTime);
                    } else {
                        $consoleError("请求", this.url, "次数耗尽.请检查服务情况:", error);
                        reject(error);
                    }
                });
            };
            tryFunction();
        });
    }
}
export function fetchRequest(url, catchData) {
    return new FetchRequest(url, catchData).promise;
}
/**
 * 用于请求js文件,带错误重试
 * 放于全局作用域下加载
 * @param url 请求地址
 * @param datakey 该js加载后,会生成的全局变量名称,用来检查js是否正确加载,如js里有多个,写其中一个
 * */
class FetchDataScript {
    constructor(url, datakey) {
        /**重复发起几次请求,直到次数耗尽或请求成功,默认4次 */
        this.tryTimes = 4;
        this.intervalTime = 200;
        this.url = url;
        this.datakey = datakey;
        /**借位的promise对象,代替原生fetch返回的promise响应 */
        this.promise = new Promise((resolve, reject) => {
            if(window[datakey]){
                resolve(window[datakey]);
                return;
            }
            var tryFunction = () => {
                --this.tryTimes;
                const jsonpScript = document.createElement('script');
                jsonpScript.setAttribute('src', url);
                jsonpScript.onerror = (error) => {
                    document.getElementsByTagName('head')[0].removeChild(jsonpScript);
                    if (this.tryTimes > 0) {
                        $consoleWran(`请求${this.url}失败,继续尝试:`, error);
                        setTimeout(()=>{
                            tryFunction();
                        },this.intervalTime);
                    } else {
                        $consoleError(`请求${this.url}次数耗尽,请检查服务情况:`, error);
                        reject(`请求${this.url}次数耗尽,请检查服务情况`);
                    }
                };
                jsonpScript.onload = () => {
                    var data = window[datakey];
                    if (!data) {
                        jsonpScript.onerror();
                        return;
                    }
                    resolve(data);
                }
                document.getElementsByTagName('head')[0].appendChild(jsonpScript);
            };
            tryFunction();
        });
    }
}
export function fetchDataScript(url, datakey) {
    return new FetchDataScript(url, datakey).promise;
}