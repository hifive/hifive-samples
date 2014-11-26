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

	var IndicatorController = {

		__name: 'geo.IndicatorController',
		indicatorItem: null,
		_indicatorHandler: null,

		__ready: function(context) {

			this._indicatorHandler = this.indicator({});
			var $root = $(this.rootElement);


			//アイテムの生成
			var id = '#' + $root[0].id;
			this.indicatorItem = geo.IndicatorManager.models.IndicatorModel.create( {
				id: id
			});

			var controller = this;
			this.indicatorItem.addEventListener('change', function(ev) {
				var newValue = ev.props['percent'].newValue;
				controller.updateIndicator(newValue);
			});

		},

		showIndicator: function() {
			this._indicatorHandler.show();
		},

		updateIndicator: function(value) {
			this._indicatorHandler.percent(value);
			if (value >= 100) {
				this._indicatorHandler.hide();
			}
		}

	}

	h5.core.expose(IndicatorController);

})(jQuery);