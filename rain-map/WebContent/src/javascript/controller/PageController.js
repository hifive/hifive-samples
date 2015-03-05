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

	//privateプロパティ
	var _data = null;
	var _indexDateArray = null;
	var _playID = null;

	//時系列データを再生する
	var _play = function() {

		//Speedを取得
		var speed = this.SpeedController.getSpeed();
		var interval = 1000 / speed;

		//現在のmaxとvalueを取得
		var value = parseInt(this.SliderController.getValue());
		var max = parseInt(this.SliderController.getMax());

		//既に再生しきっている場合は、0から再生
		if (max <= value) {
			value = 0;
			this.SliderController.setValue(value);
		}

		var f = this.own(function() {

			if (max <= value) {
				_pause(_playID);
				return;
			}

			this.SliderController.setValue(++value);
		});

		this.PlayerButtonController.switchButtonImage(true);
		_playID = setInterval(f, interval);

	};

	//停止
	var _pause = function() {
		this.PlayerButtonController.switchButtonImage(false);
		clearInterval(_playID);
		_playID = null;
	};

	/**
	 * parse後のデータは次の形式とする。 { date1: {MapKey1: value1, MapKey2: value2,....} date2: {MapKey1: ... }
	 */
	var PageController = {

		__name: 'geo.PageController',

		__meta: {
			MapController: {
				rootElement: '#map'
			},
			SliderController: {
				rootElement: '#slider-container'
			},
			DateController: {
				rootElement: '#date'
			},
			CameraResetButtonController: {
				rootElement: '#camera-reset-button'
			},
			PlayerButtonController: {
				rootElement: '#play-button-container'
			},
			SpeedController: {
				rootElement: '#speed-controls'
			}
		},
		
		//子コントローラ
		MapController: geo.MapController,
		SliderController: geo.SliderController,
		DateController: geo.DateController,
		PlayerButtonController: geo.PlayerButtonController,
		CameraResetButtonController: geo.CameraResetButtonController,
		SpeedController: geo.SpeedController,

		__ready: function(context) {

			var params = context.args;
			if (!params.geoDataURL) {
				console.error('geoDataURL is not defined');
				return;
			}

			if (!params.dataURL) {
				console.error('dataURL is not defined');
				return;
			}

			if (!params.parseCSVDataLogic) {
				console.error('ParseCSVDataLogic is not defined');
				return;
			}

			this.loadDataFile(params.parseCSVDataLogic, params.dataURL);
		},

		//logic: dataURLのファイルから取得するデータをparseするロジック
		//jsonURL:MapKeyとDataKeyの対応を表すJSONのURL
		loadDataFile: function(logic, dataURL) {

			//ParseDataFileLogicをロジック化して保持
			var parseCSVDataLogic = h5.core.logic(logic);

			//ファイルを読む
			$.ajax({
				async: true,
				url: dataURL,
				success: this.own(function(rowTextData, dataType) {

					parseCSVDataLogic.getParsedData(rowTextData)
					.done(this.own(function(parsedData) {
							
						if (!parsedData['dateArray'] || !parsedData['areaValueObjectArray']) {
							console.error('Invalid Data Format');
							return;
						}

						_indexDateArray = parsedData.dateArray;
						_data = parsedData.areaValueObjectArray;
						if (_indexDateArray) {
							this.SliderController.initSlider(_indexDateArray.length - 1);
						}	


					})).fail(function() {
						console.error('Load Data - Failed');
					});

				}), 
				error: function(xhr, error) {
					console.error(error);
				}
			});
		},

		//Sliderの値が変化した際に呼ばれるイベント
		'#slider-container SliderValueInput': function(context) {
			//子コントローラから投げられた値を取得しdateに変換
			var value = Number(context.evArg.value);
			
			//div#dateに日付を表示
			var date = _indexDateArray[value];			
			this.DateController.setDate(date);

			//MapControllerにデータを渡して棒グラフを変化させる
			var areaValueData =_data[value];
			this.MapController.updateBars(areaValueData);
		},

		//カメラの位置と向きをリセット
		'#camera-reset-button click': function() {
			this.MapController.resetCamera();
		},

		//プレイヤーのボタン
		'#play-button-container playerClicked': function() {
			if (_playID === null) {
				this.own(_play)();
			} else {
				this.own(_pause)();
			}
		},

		//dateが入力されたとき呼ばれる
		'#date dateChanged': function(context) {
			//入力されたテキストをvalueとしてindexDateArrayからindexを計算
			var text = context.evArg.date;
			var index = _indexDateArray.indexOf(text);
			if (index !== -1) {
				this.SliderController.setValue(index);
			} else {
				alert('invalid date');
			}
		},

		//Speedが変化した際に呼ばれる
		'#speed-controls speedChanged': function(context) {

			if (_playID === null) {
				return;
			}

			this.own(_pause)();
			this.own(_play)();
		},

		//Mapのセットアップ完了時に呼ばれる．スライダを初期化する
		'#map MapSetUpCompleted': function() {
			if (_indexDateArray) {
				this.SliderController.initSlider(_indexDateArray.length - 1);
			}	
		}



	};

	//コントローラを公開
	h5.core.expose(PageController);

})(jQuery);


$(function() {
	var params = {
		geoDataURL: 'res/data/map/jpn.json',
		dataURL: 'res/data/precipitation/precipitation_jpn.csv',
		mapKeyProps: ['prefecture', 'area'],
		parseCSVDataLogic: geo.ParseCSVDataLogic
	};
	h5.core.controller('#map-control', geo.PageController, params);
});