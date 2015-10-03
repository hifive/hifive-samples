(function() {
    /**
     * ShakeController定義
     */
    var shakeController = {
        _SHAKEINTERVAL : 170,
        _maxAc : 0,

        _isShaking : false,
        _startShakingThreshold : 10.0,
        _stopShakingThreshold : 6.0,

        _FRAME : 30,

        _counter : 0,

        /**
         * コントローラ名
         * @type String
         */
        __name : 'pump.controller.ShakeController',

        __init : function(){
            this._past = Date.now();
        },

        /*
         * デバッグ用
         */
        '.shakeButton click' : function(context, $el){
            context.event.preventDefault();
            this.trigger('shake', {maxAc : 10});
        },

        /*
         * 加速度センサーのイベント
         */
        '{window} devicemotion' : function(context, $el) {

            var now = Date.now();

            // （重力加速度を除外した）加速度
            var ac = context.event.originalEvent.acceleration;
            var score = this._magnitude(ac);

            context.event.preventDefault();

            // 直前のshakeから一定時間経っていなければ終了
            // this.log.debug(now - this._past);
            if (now - this._past < this._SHAKEINTERVAL) {
                return;
            }

            // 加速度の最大値を更新
            if (score > this._maxAc) {
                this._maxAc = score;
            }

            // isShakingフラグが立つ、降りるタイミングでイベント発火
            if (!this._isShaking && score > this._startShakingThreshold) {
                this._isShaking = true;
            }
            if (this._isShaking && score < this._stopShakingThreshold) {
                this._isShaking = false;
                var evArg = {maxAc : this._maxAc};
                this.log.debug(evArg, this.__name);
                this.trigger('shake', evArg);
                this._maxAc = 0;
                this._past = now;
            }
        },

        _magnitude : function(ac){
            return Math.sqrt(Math.pow(ac.x, 2) + Math.pow(ac.y, 2) + Math.pow(ac.z, 2));
        }
    };

    // shakeControllerをグローバルに公開
    h5.core.expose(shakeController);
})();
