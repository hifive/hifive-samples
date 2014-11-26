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

	var TRANSLATE0 = -2370;
	var TRANSLATE1= 670;
	var SCALE = 1000;

	//生成するgeometryの厚み
	var AMOUNT = 1;

	var path = function(feature) {
		//地図の設定
		//記法はメルカトル
		var mercator = d3.geo.mercator();
		var translate = mercator.translate();
		translate[0] = TRANSLATE0;
		translate[1] = TRANSLATE1;
		mercator.scale(SCALE);
		mercator.translate(translate);

		var pathFunction = d3.geo.path().projection(mercator);
		return pathFunction(feature);
	};

	/**
	 * 日本地図のmeshを作成するロジック
	 * 引数でGeoJSONのURLを渡す。
	 */
	var MapCreateLogic = {

		__name: 'geo.MapCreateLogic',

		//引数で指定したプロパティとともにmeshを生成します。
		//keyPropsに指定したプロパティを_で連結したものをkeyとして
		//key=>meshのハッシュ形式で読み込みます。
		//またpropの値が同じ要素を同じ色のメッシュにします。
		loadMapData: function(url, keyProps, prop, indicatorItem) {

			var deferred = this.deferred();

			//データの読み込み
			jQuery.getJSON(url,	this.own(function(geoDataObject) {
				var features = geoDataObject.features;
				var meshHashMap = this._makeMeshHashMap(features, keyProps, prop, indicatorItem);
				deferred.resolve(meshHashMap);
			}))

			//読み込み失敗時の処理
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.log('load data - failed');
				deferred.resolve(null);
			});

			return deferred.promise();
		},


		//key=>geometryの連想配列にする場合
		//keyはGeoJSON中のprefecture_area
		//propで指定したプロパティの値が同じものを同じ色のメッシュにする
		_makeMeshHashMap: function(features, keyProps, prop, indicatorItem) {

			//prefectureを元に県のリスト一覧を作成
			var propertyValueList = this._makePropertyValueList(features, prop);

			var meshHashMap = new Object();
			for (var i = 0; i < features.length; i++) {

				//Indicatorの値を更新
				var percentage = Math.round(30 * i / features.length);
				indicatorItem.set('percent', percentage);

				//featureを取得してmeshに変換
				var feature = features[i];
				var propValue = feature.properties[prop];
				var index = propertyValueList.indexOf(propValue);
				var mesh = this._fromFeatureToMesh(feature, index);
				mesh.rotation.x = -Math.PI;

				//keyはnum_areaの形式
				var mapKey = this._makeMapKey(feature, keyProps, i);
				meshHashMap[mapKey] = mesh;
			}

			return meshHashMap;
		},

		//featureとkeyにしたいプロパティ名を渡すことで
		//_で連結した文字列をキーとして作成します。
		_makeMapKey: function(feature, keyProps, featureIndex) {

			var key;
			if (typeof keyProps === 'string') {
				key = feature.properties[keyProps];
			}

			else if (typeof keyProps === 'object') {
				key = feature.properties[keyProps[0]] || '';

				for (var i = 1; i < keyProps.length; i++) {
					var prop = (!feature.properties[keyProps[i]]) ? '_' : '_' + feature.properties[keyProps[i]];
					key += prop;
				}
			}

			else {
				key = featureIndex;
			}

			return key;
		},

		//指定したプロパティの値一覧を作成
		_makePropertyValueList: function(features, property) {

			var propertyValueList = new Array();
			for (var i = 0; i < features.length; i++) {
				var value = features[i].properties[property];
				if (propertyValueList.indexOf(value) === -1) {
					propertyValueList.push(value);
				}
			}

			return propertyValueList;
		},


		//GeoJSONのfeature1つからmeshを生成
		_fromFeatureToMesh: function(feature, index) {

			//d3.jsを用いてGeoJSONのfeaturesからSVG Pathを生成
			var svgPath = path(feature);

			//d3-threeD.jsを用いてSVG Pathからshapeを生成
			var shapes = $d3g.transformSVGPath(svgPath);

			//feature単位でGeometryをマージする。
			var geometry = new THREE.ExtrudeGeometry(shapes, {amount: AMOUNT, bevelEnabled: false});

			//meshを作成
			var material = this._selectMaterial(index);
			var mesh = new THREE.Mesh(geometry, material);
			return mesh;
		},

		_selectMaterial: function(index) {

			var material;

			switch (index % 6) {
				case 0:
					material = new THREE.PointCloudMaterial({color: 0xCAFFA8, overdraw: true});
					break;
				case 1:
					material = new THREE.PointCloudMaterial({color: 0xA8FFBB, overdraw: true});
					break;
				case 2:
					material = new THREE.PointCloudMaterial({color: 0xA8FFEB, overdraw: true});
					break;
				case 3:
					material = new THREE.PointCloudMaterial({color: 0xA8E3FF, overdraw: true});
					break;
				case 4:
					material = new THREE.PointCloudMaterial({color: 0xA8B7FF, overdraw: true});
					break;
				case 5:
					material = new THREE.PointCloudMaterial({color: 0xC8A8FF, overdraw: true});
					break;
				default:
					material = new THREE.PointCloudMaterial({color: 0xCAFFA8, overdraw: true});
					break;
			}

			return material;
		}



	};

	//ロジックを公開する
	h5.core.expose(MapCreateLogic);

})(jQuery);
