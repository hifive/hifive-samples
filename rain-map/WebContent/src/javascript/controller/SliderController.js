/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {

	var SliderController = {

		__name: 'geo.SliderController',

		//値が変更されたとき、その値を親に通知
		'#slider input': function(context, $el) {
			var value = $el.val();
			this.trigger('sliderValueChanged', {value: value});
		},

		'#slider change': function(context, $el) {
			var value = $el.val();
			this.trigger('sliderValueChanged', {value: value});
		},

		//Sliderのmaxの属性値を指定する
		_setMax: function(max) {
			var slider = this.$find('#slider');
			slider.attr({'max': max});
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
			slider.val(value).change();
		},

		//現在のvalueを取得
		getValue: function() {
			var slider = this.$find('#slider');
			var value = slider.val();
			return value;
		},

		initSlider: function(max) {
			this._setMax(max);
			this.setValue(0);
		}
	};

	//コントローラを公開
	h5.core.expose(SliderController);

})(jQuery);
