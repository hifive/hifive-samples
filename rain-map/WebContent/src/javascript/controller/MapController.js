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
	 * バインドした要素にMapを描画するコントローラ パラメータは次の通り { geoDataURL: GeoJSONファイルのURL, }
	 */
	var MapController = {

		__name: 'geo.MapController',

		/**
		 * 使用するロジック
		 */
		// meshの作成に利用するロジック
		MapCreateLogic: geo.MapCreateLogic,

		// 棒グラフの作成に利用するロジック
		BarMeshCreateLogic: geo.BarMeshCreateLogic,

		/**
		 * コントローラ
		 */
		// インジケータを操作するコントローラ
		IndicatorController: geo.IndicatorController,

		/**
		 * プロパティ
		 */
		// デフォルトのカメラの位置と向き
		DEFAULTCAMERAPOS: new THREE.Vector3(10, -120, 150),
		DEFAULTCAMERALOOKAT: new THREE.Vector3(0, 0, 0),

		// 各種描画に必要なコンポーネント
		scene: null,
		camera: null,
		renderer: null,
		controls: null,

		// 読み込んだ地図情報
		_mapData: null,

		//MapKey
		_mapKeyProps: null,

		// 棒グラフの情報
		_barData: null,

		/**
		 * メソッド
		 */
		_trackballControls: THREE.TrackballControls,

		__ready: function(context) {

			// MapDataのURLがなけれ終了
			var geoDataURL = context.args.geoDataURL;
			if (!geoDataURL) {
				return;
			}

			//MapKeyの指定がなければ終了
			this._mapKeyProps = context.args.mapKeyProps;
			if (!this._mapKeyProps) {
				return;
			}

			// インジケータの初期化
			this.IndicatorController.showIndicator();
			this.IndicatorController.indicatorItem.set('percent', 0);

			// 地図のセットアップ
			this._init(geoDataURL);
		},

		// scene, camera, renderer, lightの初期化
		_init: function(url) {

			// ここでルートエレメントを保存しておく
			var $root = $(this.rootElement);

			// シーンの作成
			this.scene = new THREE.Scene();

			// カメラの初期化
			this._initCamera();

			// ライトの初期化
			this._initLight();

			// レンダラの初期化
			this._initRenderer();

			// 地図を読み込んで描画
			this.loadMapData(url, this._mapKeyProps, 'prefecture');

			//レンダリング
			this._render();
		},

		// カメラの初期設定
		_initCamera: function() {

			// 表示領域の横と縦はバインドされた要素の大きさとする
			var $root = $(this.rootElement);
			var width = $root.width();
			var height = $root.height();

			// cameraの設定
			// 視野の広さ(縦)
			var fieldOfView = 70;
			// 撮影領域の縦横比
			var aspect = width / height;
			// 撮影する距離の下限
			var near = 10;
			// 撮影する距離の上限
			var far = 10000;
			this.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);

			// デフォルトの位置に設定
			this.camera.position.set(this.DEFAULTCAMERAPOS.x, this.DEFAULTCAMERAPOS.y,
					this.DEFAULTCAMERAPOS.z);

			// デフォルトの撮影方向(デフォルトでは原点に向ける)
			this.camera.lookAt(this.DEFAULTCAMERALOOKAT);

			// トラックコントロールできるようにする
			this.controls = new this._trackballControls(this.camera, this.rootElement);
		},

		// ライトの初期設定
		/**
		 * @memberOf _
		 */
		_initLight: function() {
			var directionLight = new THREE.DirectionalLight(0xffffff, 2);
			directionLight.position.set(200, -200, 200).normalize();
			this.scene.add(directionLight);
		},

		// レンダラの初期化
		_initRenderer: function() {

			var $root = $(this.rootElement);
			var width = $root.width();
			var height = $root.height();

			if (THREE.WebGLRenderer) {
				this.renderer = new THREE.WebGLRenderer({
					antialias: true
				});
			} else {
				this.renderer = new THREE.CanvasRenderer();
			}

			// 背景を白くする
			this.renderer.setClearColor(new THREE.Color(0xffffff));
			// 描画領域のサイズはバインドされた要素のサイズ
			this.renderer.setSize(width, height);
			// バインドされた要素にcanvasを追加
			$root.append(this.renderer.domElement);
		},

		// GeoJSONを指定したurlから読み込んでフィールドにセット
		loadMapData: function(url, keyProps, colorGroupingProp) {

			// GeoJSONを読む
			// keyで指定した要素をキーとした連想配列を返す
			// keyが空ならgeometryの配列を返す
			this.MapCreateLogic.loadMapData(url, keyProps, colorGroupingProp,
					this.IndicatorController.indicatorItem)

			// 取得に成功した場合
			.done(this.own(function(mapData) {

				this.IndicatorController.indicatorItem.set('percent', 20);

				// mapのmeshデータを保持
				this._mapData = mapData;


				this.IndicatorController.indicatorItem.set('percent', 80);

				// 棒グラフのmeshデータを保持
				this._barData = this._makeBarData();


				this.IndicatorController.indicatorItem.set('percent', 90);

				// MapとBarのデータをsceneに追加
				this._addMap();
				this._addBars();

				// レンダーする
				this._renderAuto();
				this.IndicatorController.indicatorItem.set('percent', 100);
			}))

			// 取得に失敗した場合
			.fail(function() {
				console.log('load data -failed');
			});
		},

		// 棒グラフのメッシュデータを作成
		_makeBarData: function() {

			var barData = {};
			for ( var key in this._mapData) {

				// areaがnullかislandのものはスキップ
				var area = key.split('_')[1];
				if (!area || area === 'null' || area === 'island') {
					continue;
				}

				var mapMesh = this._mapData[key];
				var sidelength = 2;
				barData[key] = this.BarMeshCreateLogic.createBarMesh(5, mapMesh, sidelength);
			}

			return barData;
		},

		// 地図のメッシュをsceneに追加
		_addMap: function() {

			// meshを作成しsceneに配置
			for ( var key in this._mapData) {
				var mesh = this._mapData[key];
				this.scene.add(mesh);
			}
		},

		// 棒グラフのメッシュをsceneに追加
		_addBars: function() {
			for ( var key in this._barData) {
				this.scene.add(this._barData[key]);
			}
		},

		// データを渡して棒グラフを更新する
		// データの形式はmapKey => valueのHashMap
		updateBars: function(data) {
			for ( var key in this._barData) {

				var barMesh = this._barData[key];
				var newValue = data[key] || 0;

				this.scene.remove(barMesh);

				if (0 < newValue) {
					var newBarMesh = this.BarMeshCreateLogic.updateBarMesh(newValue, barMesh);
					this._barData[key] = newBarMesh;
					this.scene.add(newBarMesh);
				}

			}
			this._render();
		},

		// 準備が整ったときに一回だけ呼ぶ
		_renderAuto: function() {

			var that = this;
			var f = function() {
				that._render();
				requestAnimationFrame(f);
			};

			f();
		},

		// レンダリングするメソッド
		_render: function() {
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		},

		//カメラをデフォルトの位置と向きに戻す
		resetCamera: function() {
			this._initCamera();
		}

	};

	// コントローラを公開
	h5.core.expose(MapController);

})(jQuery);
