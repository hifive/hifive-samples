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
	
	ArrayUtilityLogic = {
		
		__name: 'geo.ArrayUtilityLogic',
		
		//オブジェクトから値のみの配列を取り出す
		values: function(obj) {
			
			if (typeof obj !== 'object' || !obj) {
				return null;
			}

			var retArray = [];
			for (var key in obj) {
				retArray.push(obj[key]);
			}

			return retArray;
		}
	};

	h5.core.expose(ArrayUtilityLogic);

})(jQuery);