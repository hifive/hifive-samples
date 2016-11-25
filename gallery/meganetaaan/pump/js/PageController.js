$(function(){
    var pageController = {
        __name : 'pump.controller.PageController',
        pumpController : pump.controller.PumpController,
        _shooSound : null,
        _bangSound : null,
        _count : 0,
        _$counter : null,
        _$descriptionContainer : null,
        _$messageContainer : null,

        __ready : function () {
            this._shooSound = document.getElementById('shooSound');
            this._bangSound = document.getElementById('bangSound');
            // jQueryオブジェクトをキャッシュする
            this._$descriptionContainer = this.$find('#descriptionContainer');
            this._$messageContainer = this.$find('#messageContainer');
            this._$counter = this.$find('#counter');

            this._count = h5.api.storage.local.getItem('count');
            if(!this._count){
                this._count = 0;
            }
            this._showCount();

            // スクロールを無効にする
            $(window).on('touchmove.noScroll', function(e) {
                e.preventDefault();
            });
        },

        '#startButton click' : function(context, $el){
            // ユーザインタラクションでloadすれば、どこでも音声を再生できるようになる
            this._shooSound.load();
            this._bangSound.load();
            this.log.debug(this._shooSound);
            // バルーン表示
            this._$descriptionContainer.addClass('hidden');
            this.trigger('showBalloon');
        },

        '#restartButton click' : function(context, $el) {
            // バルーン表示
            this._$messageContainer.addClass('hidden');
            this.trigger('showBalloon');
        },

        '#counter click' : function(){
            if(confirm('カウンターをリセットしますか？')){
                h5.api.storage.local.removeItem('count');
                this._count = 0;
                this.log.debug(this._count);
                this._showCount();
                alert('リセットしました');
            }
        },

        '{rootElement} bang' : function(){
            // restartButton表示
            this._$messageContainer.removeClass('hidden');
            this._count++;
            this._showCount();
            h5.api.storage.local.setItem('count', this._count);
            this.log.debug(this._count);
        },

        _showCount : function(){
            this.log.debug(this._count);
            this._$counter.text(this._count);
        },
    };
    h5.core.controller('#container', pageController);
});
