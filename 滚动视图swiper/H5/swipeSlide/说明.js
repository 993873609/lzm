$('.m-books').swipeSlide({
    continuousScroll : true, //循环滚动
    speed : 3000,   //间隔3秒自动滚动
    /*
     * 初始化执行一次的callback
     * 参数i 索引
     * 参数sum 总共几页
     * me 当前滑动对象$('.m-books')
     */
    firstCallback : function(i,sum,me){
        me.find('.m-dot span').first().addClass('z-cur');
    },
    /*
     * 每次翻页之后的callback
     */
    callback : function(i,sum,me){
        me.find('.m-dot span').removeClass('z-cur').eq(i).addClass('z-cur');
    }
});