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
	
	//dataKeyとMapKeyの対応表を作成する
	var _getCorrespondenceTable = function() {

		var deferred = this.deferred();

		jQuery.getJSON('res/data/map/jpn.json', function(data) {
				
			var features = data.features;
			var correspondenceTable = {};
				
			for (var i = 0; i < features.length; i++) {
				var feature = features[i];
				var prefecture = feature.properties.prefecture;
				var area = feature.properties.area;

				if (area && area !== 'island' && area !== 'null') {
					correspondenceTable[area] = prefecture + '_' + area;
				}
			}
			deferred.resolve(correspondenceTable);
		});

		return deferred.promise();
	};


	//dataKeyListをMapKeyListに変換
	var _toMapKeyList = function(dataKeyList, correspondenceTable) {

		var mapKeyList = [];
		for (var i = 0; i < dataKeyList.length; i++) {
			var dataKey = dataKeyList[i];
			var mapKey = (!correspondenceTable[dataKey]) ? 'undefined' : correspondenceTable[dataKey];
			mapKeyList.push(mapKey);
		}
		return mapKeyList;
	};


	var _parse = function(dataText, correspondenceTable) {

		//ファイル中のデータを行に分割
		var lines = dataText.split("\n");

		//dataKeyリストの取得
		var dataKeyList = lines[0].split(',');
		dataKeyList.shift();

		//MapKeyListに変換
		var mapKeyList = _toMapKeyList(dataKeyList, correspondenceTable);

		//returnするオブジェクトをこれに詰める
		var dateArray = [];
		var areaValueObjectArray = [];
		for (var i = 1; i < lines.length; i++) {

			//セルに分割し0番目の要素をdateとして取り出す
			var line = lines[i].split(',');
			var date = line.shift();

			if (!date) {
				continue;
			}

			var areaValueObject = {};
			for (var j = 0; j < line.length; j++) {
				areaValueObject[mapKeyList[j]] = line[j];
			}
			dateArray.push(date);
			areaValueObjectArray.push(areaValueObject);
		}

		return {'dateArray': dateArray, 'areaValueObjectArray': areaValueObjectArray};
	};

	
	/**
	 * データファイルをparseしてデータを整形するロジック これを作成することで、任意のデータを読み込めるようになっている JSONファイルで対応表をつくる { DataKey:
	 * MapKey, ... } が並ぶオブジェクトとする。 parse後のデータは次の形式とする。 { date1: {MapKey1: value1, MapKey2:
	 * value2,....} date2: {MapKey1: ... }
	 */
	var ParseCSVDataLogic = {

		__name: 'geo.ParseCSVDataLogic',

		//引数fileに与えたテキストをパース
		getParsedData: function(dataText) {

			var deferred = this.deferred();

			this.own(_getCorrespondenceTable)()
			.done(this.own(function(correspondenceTable) {
				var data = _parse(dataText, correspondenceTable);
				deferred.resolve(data);
			}))
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error('Load Data - Failed');
				deferred.reject();
			});

			return deferred.promise();
		}
	};

	h5.core.expose(ParseCSVDataLogic);

})(jQuery);
