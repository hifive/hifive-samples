(function() {
	//------------------------------------
	// ダミーデータ
	//------------------------------------
	var NUM_OF_WORKFLOW_DATAS = 500;
	var purchaseDatas = null;
	var treeDatas = null;
	var dummyMassDatas = null;
	var statuses = ['new', 'investigation', 'approved', 'closed', 'rejected'];
	var priorities = [0, 1, 2, 3];
	var applicants = ['satoshi', 'takeshi', 'kasumi', 'haruka'];
	var prices = [];
	for (var i = 1; i <= 200; i++) {
		prices.push(i * 100);
	}

	function formatYMD(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		m = m < 10 ? '0' + m : m;
		d = d < 10 ? '0' + d : d;
		return y + '/' + m + '/' + d;
	}

	function createPurchaseDatas(nums, isMassDummy) {
		var dueDates = [];
		var currentDateTime = new Date().getTime();
		var dateTime = 86400000;
		for (var i = -5; i < 30; i++) {
			dueDates.push(formatYMD(new Date(currentDateTime + i * dateTime)));
		}
		var applicationDates = [];
		for (var i = -80; i < -5; i++) {
			applicationDates.push(formatYMD(new Date(currentDateTime + i * dateTime)));
		}
		var items = ['○○○', '△△△', '□□□', '☆☆☆', '◇◇◇', '●●●', '▲▲▲', '◆◆◆', '■■■', '★★★'];
		var reasons = ['○○○○○が×××××であり△△△△△なので□□□□□して☆☆☆☆☆するため',
				'○○○○○が×××××であり△△△△△なので□□□□□して★★★★★するため', '○○○○○が×××××であり△△△△△なので■■■■■して☆☆☆☆☆するため',
				'○○○○○が×××××であり△△△△△なので■■■■■して★★★★★するため', '○○○○○が×××××であり▲▲▲▲▲なので□□□□□して☆☆☆☆☆するため',
				'○○○○○が×××××であり▲▲▲▲▲なので□□□□□して★★★★★するため', '○○○○○が×××××であり▲▲▲▲▲なので■■■■■して☆☆☆☆☆するため',
				'○○○○○が×××××であり▲▲▲▲▲なので■■■■■して★★★★★するため', '●●●●●が×××××であり△△△△△なので□□□□□して☆☆☆☆☆するため',
				'●●●●●が×××××であり△△△△△なので□□□□□して★★★★★するため', '●●●●●が×××××であり△△△△△なので■■■■■して☆☆☆☆☆するため',
				'●●●●●が×××××であり△△△△△なので■■■■■して★★★★★するため', '●●●●●が×××××であり▲▲▲▲▲なので□□□□□して☆☆☆☆☆するため',
				'●●●●●が×××××であり▲▲▲▲▲なので□□□□□して★★★★★するため', '●●●●●が×××××であり▲▲▲▲▲なので■■■■■して☆☆☆☆☆するため',
				'●●●●●が×××××であり▲▲▲▲▲なので■■■■■して★★★★★するため', ];

		purchaseDatas = [];
		function randomValue(array) {
			return array[parseInt(Math.random() * array.length)];
		}
		var idPrefix = isMassDummy ? '_' : '';
		for (var i = 1; i <= nums; i++) {
			purchaseDatas.push({
				id: idPrefix + i,
				priority: randomValue(priorities),
				status: randomValue(statuses),
				dueDate: randomValue(dueDates),
				applicationDate: randomValue(applicationDates),
				item: randomValue(items),
				applicant: randomValue(applicants),
				reason: randomValue(reasons),
				price: randomValue(prices)
			});
		}
		return purchaseDatas;
	}

	function createDummyMassDatas() {
		var bu = purchaseDatas;
		dummyMassDatas = createPurchaseDatas(10000, true);
		purchaseDatas = bu;
		return dummyMassDatas;
	}

	function createTreeDatas() {
		treeDatas = [{
			id: 'all',
			parent: '#',
			icon: 'jstree-file',
			text: '全て'
		}, {
			id: 'applicant',
			parent: '#',
			text: '申請者別',
			state: {
				opened: true
			}
		}, {
			id: 'status',
			parent: '#',
			text: 'ステータス別',
			state: {
				opened: true
			}
		}, {
			id: '10000*100',
			parent: '#',
			text: '10000×100',
			icon: 'jstree-file'
		}, {
			id: '10000*10000',
			parent: '#',
			text: '10000×10000',
			icon: 'jstree-file'
		}];

		// 申請者別
		for (var i = 0, l = applicants.length; i < l; i++) {
			var applicant = applicants[i];
			treeDatas.push({
				id: 'applicant.' + applicant,
				parent: 'applicant',
				icon: 'jstree-file',
				text: applicant
			});
		}
		// ステータス別
		for (var i = 0, l = statuses.length; i < l; i++) {
			var status = statuses[i];
			var text = sample.util.statusTextMap[status];
			treeDatas.push({
				id: 'status.' + status,
				parent: 'status',
				icon: 'jstree-file',
				text: text
			});
		}
		return treeDatas;
	}

	/**
	 * 定数
	 *
	 * @name sample.const
	 */
	h5.u.obj.expose('sample.consts', {
		url: {
			FILE_TREE: 'filetree',
			SEARCH_WORKFLOW: 'search',
			WORKFLOW: 'purchase',
			CONFIRM: 'confirm'
		}
	});

	/**
	 * 共通関数
	 *
	 * @name sample.const
	 */
	h5.u.obj.expose('sample.util', {
		//--------------------------------------------
		// メンバ
		//--------------------------------------------
		statusTextMap: {
			'new': '新規',
			investigation: '検討中',
			approved: '承認済',
			closed: '完了',
			rejected: '棄却'
		},

		priorityTextMap: ['低め', '通常', '高め', '急いで'],
		//--------------------------------------------
		// publicメソッド
		//--------------------------------------------
		/**
		 * コントローラのデフォルトビューを設定
		 * <p>
		 * コントローラ名と同じテンプレートIDがあることが前提
		 * </p>
		 *
		 * @memberOf sample.util
		 */
		createDefaultControllerView: function(ctrl, param) {
			ctrl.view.update(ctrl.rootElement, ctrl.__name, param);
		},

		/**
		 * サーバからデータを取得して返す関数を想定した、ダミーデータを非同期で返す関数
		 *
		 * @memberOf sample.util
		 * @returns {Promise}
		 */
		ajax: function(url, data) {
			// ダミーデータを返す
			var ret = null;
			url = url.url || url;
			switch (url) {
			case sample.consts.url.FILE_TREE:
				ret = treeDatas || createTreeDatas();
				ret = ret.slice(0);
				break;
			case sample.consts.url.SEARCH_WORKFLOW:
				if (data && data.mass) {
					ret = (dummyMassDatas || createDummyMassDatas()).slice(0);
				} else {
					var datas = (purchaseDatas || createPurchaseDatas(NUM_OF_WORKFLOW_DATAS))
							.slice(0);
					// 全データの中から検索に一致するものだけ返す
					if (data) {
						ret = [];
						for (var i = 0, l = datas.length; i < l; i++) {
							var isMatch = true;
							for ( var p in data) {
								if (data[p] !== datas[i][p]) {
									isMatch = false;
									break;
								}
							}
							if (isMatch) {
								ret.push(datas[i]);
							}
						}
					} else {
						ret = datas;
					}
				}
				break;
			}
			var dfd = h5.async.deferred();
			setTimeout(function() {
				dfd.resolve(ret);
			}, 0);
			return dfd.promise();
		},

		formatInt: function(num) {
			return ('' + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

		}

	//--------------------------------------------
	// privateメソッド
	//--------------------------------------------
	});
})();