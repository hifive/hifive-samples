(function() {
	/**
	 * Googleマップに指すピンのアイコンURL
	 */
	var URL_MARKER = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=P|FF0000|000000';

	/**
	 * 位置情報取得でタイムアウトする時間(ミリ秒)
	 */
	var TIMEOUT_TIME = 5000;

	/**
	 * OVER_QUERY_LIMITを回避するためのフラグ
	 */
	var isQuerying = false;

	/**
	 * 指定された緯度と経度から、座標オブジェクトを生成します。
	 *
	 * @param {String} lat 緯度
	 * @param {String} lng 経度
	 * @returns {LatLng} 座標オブジェクト
	 */
	function createLatLng(lat, lng) {
		var lt = lat;
		var lg = lng;
		var LAT = '35.454771';
		var LNG = '139.629192';

		if (arguments.length !== 2) {
			lt = LAT;
			lg = LNG;
		}
		return new google.maps.LatLng(lt, lg);
	}

	/**
	 * 指定された緯度・経度から、住所を取得をします。
	 *
	 * @param {Object} latlang.latitude 緯度
	 * @param {Object} latlang.longitude 経度
	 * @returns {Promise} promise
	 */
	function getAddressByLatLng(latlang) {
		var dfd = h5.async.deferred();
		if (isQuerying) {
			// 問合せ中なら500ms後に再度問い合わせる
			setTimeout(function() {
				getAddressByLatLng(latlang).done(function() {
					dfd.resolve.call(dfd, arguments);
				}).fail(function() {
					dfd.reject.call(dfd, arguments);
				});
			}, 500);
			return dfd.promise();
		}
		isQuerying = true;
		var latitude = latlang.latitude;
		var longitude = latlang.longitude;
		if (!latitude || !longitude) {
			return dfd.reject().promise();
		}

		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(latitude, longitude);

		geocoder.geocode({
			location: latLng
		}, function(results, status) {
			isQuerying = false;
			if (status == google.maps.GeocoderStatus.OK) {
				dfd.resolve(results[0].formatted_address);
			} else {
				// OVER_QUERY_LIMITなら再度取得する
				dfd.reject();
			}
		});
		return dfd.promise();
	}

	var mapController = {
		__name: 'app.controller.MapController',

		_map: null,

		_marker: null,

		/**
		 * @memberOf app.controller.MapController
		 */
		__ready: function(context) {
			var $mapBaseDiv = this.$find('.gmap');
			// 操作不能なら透明なオーバレイをかぶせる
			if (context.args && context.args.disabled) {
				var $blockDiv = $('<div></div>');
				$blockDiv.css({
					position: 'absolute',
					top: $mapBaseDiv.offset().top,
					left: $mapBaseDiv.offset().left,
					height: $mapBaseDiv.height(),
					width: $mapBaseDiv.width()
				});

				$mapBaseDiv.after($blockDiv);
			}

			// 位置情報を取得
			var getPositionPromise = null;
			if (context.args && context.args.defaultPos) {
				// 位置が指定されているならその位置がデフォルト位置
				var pos = context.args.defaultPos;
				var lat = pos.slice(0, pos.indexOf(','));
				var lon = pos.slice(pos.indexOf(',') + 1);
				getPositionPromise = h5.async.deferred().resolve({
					coords: {
						latitude: lat,
						longitude: lon
					}
				}).promise();
			} else {
				// 位置が指定されていないなら現在位置を取得
				getPositionPromise = h5.api.geo.getCurrentPosition({
					timeout: TIMEOUT_TIME
				});
			}

			this.indicator({
				target: $mapBaseDiv,
				message: '地図をロードしています',
				promises: getPositionPromise
			}).show();

			getPositionPromise.always(this.own(function(result) {
				var coords = result.coords;
				// 失敗したらデフォルトの場所
				var defaultPos = coords ? createLatLng(coords.latitude, coords.longitude)
						: createLatLng();

				// 地図のロード
				var map = new google.maps.Map($mapBaseDiv[0], {
					zoom: 14,
					center: defaultPos,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true
				});
				this._map = map;

				// デフォルトマーカーの設置
				var marker = new google.maps.Marker({
					map: map,
					position: defaultPos,
					draggable: true,
					icon: {
						url: URL_MARKER
					}
				});
				this._marker = marker;

				var dragendHandler = this.own(function() {
					var currentLoc = marker.getPosition();
					this._setPosition({
						latitude: currentLoc.lat(),
						longitude: currentLoc.lng()
					});
				});
				var clickHandler = this.own(function() {
					marker.setMap(null);
					marker = null;
					this._setPosition(null);
				});
				google.maps.event.addListener(marker, 'dragend', dragendHandler);
				google.maps.event.addListenerOnce(marker, 'click', clickHandler);
				google.maps.event.trigger(marker, 'dragend');

				// クリック時の動作設定
				google.maps.event.addListener(map, 'click', this.own(function(e) {
					if (marker != null) {
						marker.setPosition(e.latLng);
					} else {
						marker = new google.maps.Marker({
							map: map,
							position: e.latLng,
							draggable: true,
							icon: {
								url: URL_MARKER
							}
						});
						google.maps.event.addListener(marker, 'dragend', this.own(function() {
							var currentLoc = marker.getPosition();
							this._setPosition({
								latitude: currentLoc.lat(),
								longitude: currentLoc.lng()
							});
						}));
						google.maps.event.addListener(marker, 'dragend', dragendHandler);
						google.maps.event.addListenerOnce(marker, 'click', clickHandler);
					}

					var loc = marker.getPosition();
					this._setPosition({
						latitude: loc.lat(),
						longitude: loc.lng()
					});

				}));
			}));
		},

		/**
		 * @memberOf app.controller.MapController
		 * @param coords
		 */
		move: function(coords) {
			if (!this._map) {
				return;
			}
			var c = createLatLng(coords.latitude, coords.longitude);
			this._map.setCenter(c);
			this._marker.setPosition(c);
			this._map.setZoom(14);
			google.maps.event.trigger(this._marker, 'dragend');
		},

		/**
		 * @memberOf app.controller.MapController
		 * @param {Float|String} latlang.latitude 緯度
		 * @param {Float|String} latlang.longitude 経度
		 */
		_setPosition: function(latlang) {
			this.trigger('setCoords', {
				coords: latlang
			});

			getAddressByLatLng(latlang).done(this.own(function(address) {
				this.trigger('setAddress', {
					address: address
				});
			})).fail(function() {
				this.trigger('setAddress', {
					address: '住所情報を取得できませんでした',
					error: true
				});
			});
		}
	};
	h5.core.expose(mapController);
})();