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

	var SliderController = {

		__name: 'geo.SliderController',

		//値が変更されたとき、その値を親に通知
		'#slider input': function(context, $el) {
			var value = $el.val();
			this.setValue(value);
		},

		'#slider change': function(context, $el) {
			var value = $el.val();
			this.setValue(value);
		},

		//Sliderのmaxの属性値を指定する
		setMax: function(max) {
			var slider = this.$find('#slider');
			slider.attr({
				'max': max
			});
		},

		//設定されているmaxの値を取得
		getMax: function() {
			var slider = this.$find('#slider');
			var max = slider.attr('max');
			return max;
		},

		//SliderのValueを更新する。
		setValue: function(value) {
			var slider = this.$find('#slider');
			slider.val(value);
			this.trigger('SliderValueInput', {
				value: value
			});
		},

		//現在のvalueを取得
		getValue: function() {
			var slider = this.$find('#slider');
			var value = slider.val();
			return value;
		},

		initSlider: function(max) {
			this.setMax(max);
			this.setValue(0);
		}
	};

	//コントローラを公開
	h5.core.expose(SliderController);

})(jQuery);
