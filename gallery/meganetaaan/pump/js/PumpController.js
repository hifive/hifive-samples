$(function() {
    // コントローラの元となるオブジェクトを作成
    var pumpController = {
        _WAITTIME : 200,
        _PUMP2AIRRATE : 800,
        _$balloonContainer : null,

        __name : 'pump.controller.PumpController',

        shooSound : null,

        _shakeController : pump.controller.ShakeController,

        __construct : function() {
            this.log.info('{0}を実行', '__construct');
        },
        __init : function() {
            this.log.info('{0}を実行', '__init');
        },
        __ready : function() {
            this.log.info('{0}を実行', '__ready');
            this.shooSound = document.getElementById('shooSound');
            this._$balloonContainer = this.$find('.balloonContainer');
        },

        '{rootElement} shake' : function(context, $el) {
            // バルーンが表示されていないときは、膨らます処理を行わない
            if (this._$balloonContainer.hasClass('hidden')) {
                return;
            }
            var maxAc = context.evArg.maxAc;
            this.$find('#debugWindow')
                    .append('pump: ' + String(maxAc) + '<br>');

            var blow = maxAc * this._PUMP2AIRRATE;
            this.trigger('pump', {'blow' : blow});
            this._pumpDown();
            setTimeout(this.own(this._pumpUp), this._WAITTIME);
        },

        _pumpDown : function() {
            this.log.info('pumpDown');
            var $pumpPic = this.$find('.pumpPic');
            $pumpPic.attr('class', 'pumpPic pumpPic2');

            // 再生中に再び再生すると音が出なくなるので停止して、再生位置を0にする
            this.shooSound.pause();
            this.shooSound.currentTime = 0;
            this.shooSound.play();
        },

        _pumpUp : function() {
            this.log.info('pumpUp');
            var $pumpPic = this.$find('.pumpPic');
            $pumpPic.attr('class', 'pumpPic pumpPic1');
        }
    };

    h5.core.expose(pumpController);
});
