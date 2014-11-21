/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 *
	 *
	 *  parse後のデータは次の形式とする。
	 *  {
	 *  	date1: {MapKey1: value1, MapKey2: value2,....}
	 *  	date2: {MapKey1: ...
	 *  }
	 */
	var PageController = {

		__name: 'geo.PageController',

		//子コントローラ
		MapController: geo.MapController,
		SliderController: geo.SliderController,
		DateController: geo.DateController,
		PlayerButtonController: geo.PlayerButtonController,
		CameraResetButtonController: geo.CameraResetButtonController,
		SpeedController: geo.SpeedController,

		__meta: {
			MapController: {
				rootElement: '#map'
			},
			SliderController: {
				rootElement: '#sliderContainer'
			},
			DateController: {
				rootElement: '#date'
			},
			CameraResetButtonController: {
				rootElement: '#cameraResetButton'
			},
			PlayerButtonController: {
				rootElement: '#playerButtonContainer'
			},
			SpeedController: {
				rootElement: '#speedControls'
			}
		},

		//ロジック
		_LoadDataFileLogic: geo.LoadDataLogic,
		_ParseDataFileLogic: null,

		//読み込んだデータ
		_data: null,

		//Sliderの値と、dateを対応付ける配列
		_indexDateArray: null,

		//再生タイマーのID
		_playID: null,


		__ready: function(context) {

			var params = context.args;
			if (!params.geoDataURL) {
				console.log('geoDataURL is not defined');
				return;
			}

			if (!params.dataURL) {
				console.log('dataURL is not defined');
				return;
			}

			if (!params.ParseDataFileLogic) {
				console.log('ParseDataFileLogic is not defined');
				return;
			}

			this.loadDataFile(params.ParseDataFileLogic, params.dataURL, params.jsonURL);
		},

		//logic: dataURLのファイルから取得するデータをparseするロジック
		//jsonURL:MapKeyとDataKeyの対応を表すJSONのURL
		loadDataFile: function(logic, dataURL, jsonURL) {

			//ParseDataFileLogicをロジック化して保持
			this._ParseDataFileLogic = h5.core.logic(logic);

			//ファイルを読む
			var fileText = this._LoadDataFileLogic.loadData(dataURL);
			this._ParseDataFileLogic.getParsedData(fileText).done(this.own(function(data) {
				this._data = data;
				this._indexDateArray = Object.keys(this._data);
				this.SliderController.initSlider(this._indexDateArray.length - 1);

				console.log('Load data successfully.');
			})).fail(function() {
				console.log('Load data - failed');
			});
		},

		//Sliderの値が変化した際に呼ばれるイベント
		'#sliderContainer sliderValueInput': function(context) {
			//子コントローラから投げられた値を取得しdateに変換
			var value = context.evArg.value;
			var date = this._indexDateArray[value];

			//div#dateに日付を表示
			this.DateController.setDate(date);

			//MapControllerにデータを渡して棒グラフを変化させる
			var data = this._data[date];
			this.MapController.updateBars(data);
		},

		'#sliderContainer sliderValueChanged': function(context) {

			var value = context.evArg.value;
			var date = this._indexDateArray[value];

			this.DateController.setDate(date);
			var data = this._data[date];
			this.MapController.updateBars(data);


		},

		//カメラの位置と向きをリセット
		'#cameraResetButton cameraResetClicked': function() {
			this.MapController.resetCamera();
		},

		//プレイヤーのボタン
		'#playerButtonContainer playerClicked': function() {
			if (this._playID === null) {
				var speed = this.SpeedController.getSpeed();
				var interval = 1000 / speed;
				this.play(interval);
			}
			else {
				this.pause();
			}
		},

		//dateが入力されたとき呼ばれる
		'#date dateChanged': function(context) {
			//入力されたテキストをvalueとしてindexDateArrayからindexを計算
			var text = context.evArg.date;
			var index = this._indexDateArray.indexOf(text);
			if (index !== -1) {
				this.SliderController.setValue(index);
			} else {
				alert('invalid date');
			}
		},

		//Speedが変化した際に呼ばれる
		'#speedControls speedChanged': function(context) {

			if (this._playID === null) {
				return;
			}

			var speed = context.evArg.speed;
			var interval = 1000 / speed;
			this.pause();
			this.play(interval);
		},

		//時系列データを再生する
		play: function(interval) {

			//現在のmaxとvalueを取得
			var value = parseInt(this.SliderController.getValue());
			var max = parseInt(this.SliderController.getMax());

			//既に再生しきっている場合は、0から再生
			if (max <= value) {
				value = 0;
				this.SliderController.setValue(value);
			}

			var that = this;
			var f = function() {

				if (max <= value) {
					that.own(that.pause(that._playID));
					return;
				}

				that.SliderController.setValue(++value);
			};

			this.PlayerButtonController.switchButtonImage(true);
			this._playID = setInterval(f, interval);

		},

		//停止
		pause: function() {
			this.PlayerButtonController.switchButtonImage(false);
			clearInterval(this._playID);
			this._playID = null;
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
		ParseDataFileLogic: geo.ParseDataFileLogic
	};
	h5.core.controller('#mapControl', geo.PageController, params);
});