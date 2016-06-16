$(function(){
    var pageController = {
        __name : 'pump.controller.PageController',
        pumpController : pump.controller.PumpController,
        shooSound : null,
        bangSound : null,
        _count : 0,
        _$counter : null,
        __ready : function () {
            //XXX: jQueryのfindではloadができない？
            this.shooSound = document.getElementById('shooSound');
            this.bangSound = document.getElementById('bangSound');
            this._$counter = this.$find('#counter');
            this._count = h5.api.storage.local.getItem('count');
            if(!this._count){
                this._count = 0;
            }
            this._showCount();
        },

        '#startButton touchend' : function(context, $el){
            //this.pumpController.loadSounds();
            this.shooSound.play();
            this.bangSound.play();
            //pump.controller.PumpController.loadSounds();
            //this.log.debug(this.shooSound);
            this.$find('#descriptionContainer').hide();
        },

        '#startButton click' : function(context, $el){
            //this.pumpController.loadSounds();
            this.shooSound.load();
            this.bangSound.load();
            //pump.controller.PumpController.loadSounds();
            this.log.debug(this.shooSound);
            this.$find('#descriptionContainer').hide();
        },

        '#counter touchend' : function(){
            if(confirm('カウンターをリセットしますか？')){
                h5.api.storage.local.removeItem('count');
                this._count = 0;
                this.log.debug(this._count);
                this._showCount();
                alert('リセットしました');
            }
        },

        '{rootElement} bang' : function(){
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
    h5.core.controller('body', pageController);
});
