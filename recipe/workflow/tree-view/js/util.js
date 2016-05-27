(function() {
	var treeDatas = null;
	var applicants = ['satoshi', 'takeshi', 'kasumi', 'haruka'];
	var statuses = ['new', 'investigation', 'approved', 'closed', 'rejected'];
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
	
	h5.u.obj.expose('sample.consts', {
		url: {
			FILE_TREE: 'filetree'
		}
	});
	
	 h5.u.obj.expose('sample.util', {
		statusTextMap: {
			'new': '新規',
			investigation: '検討中',
			approved: '承認済',
			closed: '完了',
			rejected: '棄却'
		},
		
		createDefaultControllerView: function(ctrl, param) {
			ctrl.view.update(ctrl.rootElement, ctrl.__name, param);
		},

		ajax: function(url, data) {
			// ダミーデータを返す
			var ret = null;
			url = url.url || url;
			switch (url) {
			case sample.consts.url.FILE_TREE:
				ret = treeDatas || createTreeDatas();
				ret = ret.slice(0);
				break;
			}
			var dfd = h5.async.deferred();
			setTimeout(function() {
				dfd.resolve(ret);
			}, 0);
			return dfd.promise();
		},

	});
})();