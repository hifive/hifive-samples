/*
 * Copyright (C) 2014 NS Solutions Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function($) {
	/**
	 * 再生速度を調整するコントローラ
	 */
	var SpeedController = {

		__name: 'geo.SpeedController',

		//速度は1から20まで
		_REGEXP: new RegExp('^(20)|(1[0-9])|([1-9])'),

		'{rootElement} change': function() {
			var speed = this.getSpeed();
			this.trigger('speedChanged', {
				speed: speed
			});
		},

		getSpeed: function() {
			var speed = this.$find('#speed').val();
			if (!this.validate(speed)) {
				alert('speed should be a numeric between 1 to 20');
				this.setSpeed(1);
				return 1;
			}
			speed = Number(speed);
			return speed;
		},

		setSpeed: function(speed) {
			this.$find('#speed').val(speed).change();
		},

		//1～20までの数値かをチェック
		validate: function(value) {

			if (typeof value === 'number') {
				value = value.toString();
			}

			var index = value.search(this._REGEXP);
			if (index === -1) {
				return false;
			} else {
				return true;
			}
		},

		'#plus click': function() {
			var speed = this.getSpeed();
			if (this.validate(speed)) {
				var validatedSpeed = Number(speed);
				if (validatedSpeed >= 20) {
					alert('speed should be a numeric between 1 to 20');
				} else {
					validatedSpeed++;
					this.setSpeed(validatedSpeed);
				}
			} else {
				this.setSpeed(1);
			}
		},

		'#minus click': function() {
			var speed = this.getSpeed();
			if (this.validate(speed)) {
				var validatedSpeed = Number(speed);
				if (validatedSpeed <= 1) {
					alert('speed should be a numeric between 1 to 20');
				} else {
					validatedSpeed--;
					this.setSpeed(validatedSpeed);
				}
			} else {
				this.setSpeed(1);
			}
		}
	};

	h5.core.expose(SpeedController);

})(jQuery);