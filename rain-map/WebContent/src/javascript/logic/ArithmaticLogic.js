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
	
	ArithmaticLogic = {
		
		__name: 'geo.ArithmaticLogic',
		
		//valueをmin～maxに収まるように整形する
		range: function(min, max, value) {
			
			if (value < min) {
				return min;
			}

			if (max < value) {
				return max;
			}

			return value;
		}
	};

	h5.core.expose(ArithmaticLogic);

})(jQuery);