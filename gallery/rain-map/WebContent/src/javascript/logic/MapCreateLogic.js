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
	var TRANSLATE1 = 670;
	var SCALE = 1000;

	//生成するgeometryの厚み
	var AMOUNT = 2;

	//地図データを読み込むURL
	var _url = null;
	var _keyProps = null;


	var _path = function(feature) {
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

	//featureとkeyにしたいプロパティ名を渡すことで
	//_で連結した文字列をキーとして作成します。
	var _makeMapKey = function(feature, keyProps) {

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

		return key;
	};

	//GeoJSONのfeature1つからmeshを生成
	var _fromFeatureToMesh = function(feature) {

		//d3.jsを用いてGeoJSONのfeaturesからSVG Pathを生成
		var svgPath = _path(feature);

		//d3-threeD.jsを用いてSVG Pathからshapeを生成
		var shapes = $d3g.transformSVGPath(svgPath);

		//feature単位でGeometryをマージする。
		var geometry = new THREE.ExtrudeGeometry(shapes, {
			amount: AMOUNT,
			bevelEnabled: false
		});

		//meshを作成
		var material = new THREE.MeshPhongMaterial({
			color: 0xA7CB85, 
			overdraw: false
		});
		var mesh = new THREE.Mesh(geometry, material);
		return mesh;
	};

	//key=>geometryの連想配列にする場合
	//keyはGeoJSON中のprefecture_area
	//propで指定したプロパティの値が同じものを同じ色のメッシュにする
	var _makeMeshHashMap = function(features, keyProps) {

		var meshHashMap = {};
		for (var i = 0; i < features.length; i++) {

			//featureを取得してmeshに変換
			var feature = features[i];
			var mesh = _fromFeatureToMesh(feature);
			mesh.rotation.x = -Math.PI;

			//keyはnum_areaの形式
			var mapKey = _makeMapKey(feature, keyProps);
			meshHashMap[mapKey] = mesh;
		}
		return meshHashMap;
	};


	/**
	 * 日本地図のmeshを作成するロジック 引数でGeoJSONのURLを渡す。
	 */
	var MapCreateLogic = {

		__name: 'geo.MapCreateLogic',


		setMapParams: function(url, keyProps) {
			_url = url;
			_keyProps = keyProps;
		}, 

		//引数で指定したプロパティとともにmeshを生成します。
		//keyPropsに指定したプロパティを_で連結したものをkeyとして
		//key=>meshのハッシュ形式で読み込みます。
		loadMapData: function() {

			var deferred = this.deferred();

			//データの読み込み
			jQuery.getJSON(_url, this.own(function(geoDataObject) {
				var features = geoDataObject.features;
				var meshHashMap = _makeMeshHashMap(features, _keyProps);
				deferred.resolve(meshHashMap);
			}))
			//読み込み失敗時の処理
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.error('Load Data - Failed');
				deferred.reject(errorThrown);
			});

			return deferred.promise();
		}, 

		
	};

	//ロジックを公開する
	h5.core.expose(MapCreateLogic);

})(jQuery);
