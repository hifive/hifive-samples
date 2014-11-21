/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 * データファイルをparseしてデータを整形するロジック
	 * これを作成することで、任意のデータを読み込めるようになっている
	 * JSONファイルで対応表をつくる
	 * {
	 * 	DataKey: MapKey,
	 * 	...
	 *  }
	 *  が並ぶオブジェクトとする。
	 *
	 *  parse後のデータは次の形式とする。
	 *  {
	 *  	date1: {MapKey1: value1, MapKey2: value2,....}
	 *  	date2: {MapKey1: ...
	 *  }
	 */
	var ParseDataFileLogic = {

		__name: 'geo.ParseDataFileLogic',

		//引数fileに与えたテキストをパース
		getParsedData: function(dataText) {

			var deferred = this.deferred();

			this._makeCorrespondenceTable().done(this.own(function(correspondenceTable) {
				var data = this._parse(dataText, correspondenceTable);
				deferred.resolve(data);
			}))

			.fail(function(jqXHR, textStatus, errorThrown) {
				console.log('load data - failed');
				deferred.resolve(null);
			});

			return deferred.promise();

		},

		_parse: function(dataText, correspondenceTable) {

			//ファイル中のデータを行に分割
			var lines = dataText.split("\n");

			//dataKeyリストの取得
			var dataKeyList = lines[0].split(',');
			dataKeyList.shift();

			//MapKeyListに変換
			var mapKeyList = this._toMapKeyList(dataKeyList, correspondenceTable);

			//returnするオブジェクトをこれに詰める
			var retData = new Object();
			for (var i = 1; i < lines.length; i++) {

				//セルに分割し0番目の要素をdateとして取り出す
				var line = lines[i].split(',');
				var date = line.shift();

				if (!date) {
					continue;
				}

				var mapKeyValueHashMap = new Object();
				for (var j = 0; j < line.length; j++) {
					mapKeyValueHashMap[mapKeyList[j]] = line[j];
				}
				retData[date] = mapKeyValueHashMap;
			}

			return retData;
		},

		//dataKeyListをMapKeyListに変換
		_toMapKeyList: function(dataKeyList, correspondenceTable) {

			var mapKeyList = new Array();
			for (var i = 0; i < dataKeyList.length; i++) {
				var dataKey = dataKeyList[i];
				var mapKey = (!correspondenceTable[dataKey]) ? 'undefined' : correspondenceTable[dataKey];
				mapKeyList.push(mapKey);
			}
			return mapKeyList;
		},

		//dataKeyとMapKeyの対応表を作成する
		_makeCorrespondenceTable: function() {

			var deferred = this.deferred();

			jQuery.getJSON('res/data/map/jpn.json', function(data) {
				var features = data.features;
				var correspondenceTable = new Object();
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
		}

	};

	h5.core.expose(ParseDataFileLogic);

})(jQuery);

