$(function() {
    // コントローラの元となるオブジェクトを作成
    var balloonController = {
        _air : 100,
        _capacity : 450000,
        _bangSound : null,
        _$balloonContainer : null,
        _$balloon : null,
        _$stringSvg : null,

        __name : 'pump.controller.balloonController',
        __construct : function() {
            this.log.info('{0}を実行', '__construct');
        },
        __init : function() {
            this.log.info('{0}を実行', '__init');
        },
        __ready : function() {
            this.log.info('{0}を実行', '__ready');
            this._bangSound = document.getElementById('bangSound');
            // jQueryオブジェクトをキャッシュ
            this._$balloonContainer = this.$find('.balloonContainer');
            this._$balloon = this._$balloonContainer.find('.balloon');
            this._$line = this._$balloonContainer.find('#stringSvg #string');
            this._$human = this.$find('#pumpPicContainer');
        },

        '{document} showBalloon' : function() {
            // バルーンの表示、初期サイズを設定
            this._$balloonContainer.removeClass('hidden');
            this._$balloon.css({
                width : 10,
                height : 10
            });
            this.log.debug('balloonの半径を5に設定');
            // 棒を描画
            this._drawLine();
        },

        '{document} pump' : function(context, $el) {
            this._air += context.evArg.blow;
            if (this._air > this._capacity) {
                this.bang();
                return;
            }
            var r = this._squareRt(this._air);
            this._$balloon.css({
                width : r * 2,
                height : r * 2
            });
            this.log.debug('balloonの半径を{0}に設定', r);
        },

        '{window} resize' : function() {
            // 配置が変わるので棒を再描画
            this._drawLine();
        },

        _drawLine : function() {
            if (this._$balloon.length === 0) {
                return;
            }
            // バルーンと人の位置から棒の描画座標を求める
            var balloonOffset = this._$balloon.position();
            var tiedX = balloonOffset.left + this._$balloon.outerWidth() * 0.5;
            var tiedY = balloonOffset.top + this._$balloon.outerHeight() * 0.5;

            var humanOffset = this._$human.position();
            var x = humanOffset.left;
            var y = humanOffset.top;

            this.log.debug('from({0}, {1}) to({2}, {3})', x, y, tiedX, tiedY);

            this._$line.attr('x1', tiedX);
            this._$line.attr('y1', tiedY);
            this._$line.attr('x2', x);
            this._$line.attr('y2', y);
        },

        _squareRt : function(v) {
            return Math.pow(v / (Math.PI * 2), 1 / 2);
        },

        bang : function() {
            this._$balloonContainer.addClass('hidden');
            this._bangSound.play();
            this._air = 100;
            this.trigger('bang');
        }
    };

    // balloonControllerを要素にバインド
    h5.core.controller('#main', balloonController);
});
