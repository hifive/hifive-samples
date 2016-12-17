/*
 * Copyright (C) 2013 NS Solutions Corporation, All Rights Reserved.
 */
(function() {
	/**
	 * @namespace app
	 */
	/**
	 * @namespace app.utils
	 */

	var LOCAL_STORAGE_KEY_PREFIX = '__reportApp-';
	var SUFFIX_LOGIN_USER_INFO = 'login-user-info__';

	h5.u.obj.expose('app.utils', {
		/**
		 * URLのパラメータをオブジェクトにシリアライズします
		 *
		 * @returns {キー名:値}のオブジェクトに変換されたパラメータ
		 * @memberOf app.utils
		 */
		getParameters: function() {
			var ret = {};
			var params = location.href.match(/\?(.+)/);

			if (params != null && params.length > 0) {
				params = params[1].split('&');

				for ( var i = 0, len = params.length; i < len; i++) {
					var pair = params[i].split('=');

					if (pair.legth === 0) {
						continue;
					}

					var dencodeParam = pair[1];
					ret[pair[0]] = decodeURIComponent(dencodeParam.replace(/\+/g, '%20'));
				}
			}

			return ret;
		},

		/**
		 * ログインしているユーザ情報を取得します。<br>
		 * 未ログイン時は、このメソッドはnullを返します。
		 *
		 * @function
		 * @name getLoginUserInfo
		 * @memberOf app.utils
		 * @returns {Object} ログインしているユーザ情報。次のプロパティを持ちます。
		 *          <ul>
		 *          <li>userId : ユーザID
		 *          <li>userName：ユーザ名
		 *          <li>realName：ユーザの実名
		 *          </ul>
		 */
		getLoginUserInfo: function() {
			var userInfo = h5.api.storage.local.getItem(LOCAL_STORAGE_KEY_PREFIX
					+ SUFFIX_LOGIN_USER_INFO);
			return userInfo;
		},

		/**
		 * ログインしているユーザ情報をローカルストレージに保存します。<br>
		 *
		 */
		saveLoginUserInfo: function() {
			var savedUserInfo = app.utils.getLoginUserInfo();
			var dfd = h5.async.deferred();
			if (savedUserInfo) {
				dfd.resolve(savedUserInfo);
			} else {
				h5.ajax({
					url: app.constant.URL_BASE_APP + 'api/userinfo'
				}).done(function(userInfo) {
					h5.api.storage.local.setItem(LOCAL_STORAGE_KEY_PREFIX + SUFFIX_LOGIN_USER_INFO, userInfo);
					dfd.resolve(userInfo);
				}).fail(function(jqXhr, status, errorThrown) {
					dfd.reject(jqXhr, status, errorThrown);
				});
			}

			return dfd.promise();
		},

		clearUserInfo: function() {
			h5.api.storage.local.setItem(LOCAL_STORAGE_KEY_PREFIX + SUFFIX_LOGIN_USER_INFO, null);
		},

		/**
		 * ファイルをアップロードします。
		 *
		 * @param target input type="file"のDOM要素
		 * @returns Promiseオブジェクト
		 * @memberOf app.utils
		 */
		uploadFile: function(target) {
			var files = $(target)[0].files;
			var uploadList = {};

			for ( var i = 0, len = files.length; i < len; i++) {
				var file = files[i];
				var fullPath = file.name;
				var fileName = fullPath.substring(fullPath.lastIndexOf("\\") + 1);

				uploadList[fileName] = file;
			}

			var df = h5.async.deferred();
			var fd = new FormData();

			for ( var fileName in uploadList) {
				fd.append('file', uploadList[fileName]);
			}

			h5.ajax({
				url: app.constant.URL_MULTIPART_UPLOAD,
				type: 'post',
				processData: false,
				contentType: false,
				cache: false,
				data: fd,
				xhr: function() {
					var xhr = $.ajaxSettings.xhr();

					if (xhr.upload) {
						xhr.upload.addEventListener('progress', function(ev) {
							df.notify(ev);
						});
					}

					return xhr;
				}
			}).done(function(ev) {
				df.resolve(ev);
			}).fail(function(xhr, status, message) {
				df.reject(xhr, status, message);
			});

			return df.promise();
		},

		/**
		 * ファイルをアップロードします。
		 *
		 * @param urlList
		 * @returns Promiseオブジェクト
		 * @memberOf app.utils
		 */
		deleteFile: function(urlList) {
			var dfd = h5.async.deferred();
			// TODO
			return dfd.promise().resolve();
		},

		/**
		 * 日付をyyyy-mm-ddにフォーマット
		 *
		 * @memberOf app.utils
		 * @param date
		 * @returns
		 */
		dateHyphenFormat: function(date) {
			date = date instanceof Date ? date : new Date(date);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? '0' + d : d;
			return h5.u.str.format('{0}-{1}-{2}', y, m, d);
		},

		/**
		 * 日付をyyyy/mm/ddにフォーマット
		 *
		 * @memberOf app.utils
		 * @param date
		 * @returns
		 */
		dateSlashFormat: function(date) {
			return app.utils.dateHyphenFormat(date).replace(/-/g, '/');
		},

		/**
		 * 時刻をhh:mmにフォーマット
		 * @memberOf app.utils
		 * @param {Date} date
		 * @returns
		 */
		formatTime: function(date){
			var h = date.getHours();
			var m = date.getMinutes();
			return (h < 10? '0': '') + h + ':' + (m < 10 ? '0' : '') + m;
		}
	});
})();