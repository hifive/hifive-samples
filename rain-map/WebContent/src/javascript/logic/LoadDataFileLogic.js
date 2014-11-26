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
	 * データファイルを読み込むためのロジック
	 * 単にファイルの内容を文字列として取得
	 */
	var LoadDataLogic = {

		__name: 'geo.LoadDataLogic',

		loadData: function(url) {
			var request = new XMLHttpRequest();
			request.open("GET", url, false);
			request.send();

			var text = request.responseText;
			return text;
		}
	};

	h5.core.expose(LoadDataLogic);

})(jQuery);