$(function() {
	// コントローラの元となるオブジェクトを作成
	var shakeController = {
		_SHAKEINTERVAL : 300,
		_maxAc : 0,
		_lastShakedTimeMillis : 0,

		_isMoving : false,
		_startMovingThreshold : 10.0,
		_stopMovingThreshold : 6.0,

		__name : 'pump.controller.ShakeController',
		__construct : function() {
			this.log.info('{0}を実行', '__construct');
		},
		__init : function() {
			this.log.info('{0}を実行', '__init');
		},
		__ready : function() {
			this.log.info('{0}を実行', '__ready');
		},
		'#pumpPicContainer click' : function(context, $el){
			this.trigger('shake', {maxAc : 10});
		},
		'{window} devicemotion' : function(context, $el) {
			context.event.preventDefault();
			var currentTimeMillis = new Date().getTime();

			// 直前のshakeから一定時間経っていなければ終了
			if (currentTimeMillis - this._lastShakedTimeMillis < this._SHAKEINTERVAL) {
				return;
			}

			// （重力加速度を除外した）加速度を取得する
			var ac = context.event.originalEvent.acceleration;

			// 加速度の最大値を更新
			if (ac.y > this._maxAc) {
				this._maxAc = ac.y;
			}

			this.log.debug('加速度 x:{0}, y:{1}, z:{2}', ac.x, ac.y, ac.z);
			if (!this._isMoving && ac.y > this._startMovingThreshold) {
				this._isMoving = true;
			}
			if (this._isMoving && ac.y < this._stopMovingThreshold) {
				this.trigger('shake', {
					maxAc : this._maxAc
				});
				this._isMoving = false;
				this._maxAc = 0;
				this._lastShakedTimeMillis = currentTimeMillis;
			}
		}
	};

	// shakeControllerをグローバルに公開
	h5.core.expose(shakeController);
});