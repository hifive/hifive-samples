(function() {
	var controller = {
		__name: 'sample.AppPurchaseManagerLogic',

		getShortcutTree: function() {
			return sample.util.ajax(sample.consts.url.FILE_TREE);
		}
	};
	h5.core.expose(controller);
})();