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
	 * 日付を表示するinputのコントローラ
	 */
	var DateController = {

		__name: 'geo.DateController',

		setDate: function(date) {
			var $root = $(this.rootElement);
			$root.val(date);
		},

		'{rootElement} change': function(context, $el) {
			var value = $el.val();
			this.trigger('dateChanged', {date: value});
		}
	};

	h5.core.expose(DateController);
})(jQuery);