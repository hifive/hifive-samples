(function() {
	var SESSION_STORAGE_KEY_PREFIX = '__QandA-';
	var SUFFIX_LOGIN_USER_INFO = 'login-user-info__';
	var SUFFIX_QUESTION_SET = 'selected-question-set__';
	var SUFFIX_CURRENT_QUESTION_HISTORY_ID = 'current-question-history-id__';
	var SERVER_URL = '/';

	h5.u.obj.expose('app.constant', {
		STORAGE_KEY_LOGIN_USER_INFO: SESSION_STORAGE_KEY_PREFIX + SUFFIX_LOGIN_USER_INFO,
		STORAGE_KEY_SELECTED_QUESTION_SET: SESSION_STORAGE_KEY_PREFIX + SUFFIX_QUESTION_SET,
		STORAGE_KEY_CURRENT_QUESTION_HISTORY_ID: SESSION_STORAGE_KEY_PREFIX
				+ SUFFIX_CURRENT_QUESTION_HISTORY_ID,
		URL_BASE_REPORT: SERVER_URL + 'handson/app/resources/',
		URL_REPORT: '../report/index.html',
		URL_MONTHLY: '../monthly/index.html',
		URL_BASE_IMG: SERVER_URL + 'handson/',
		URL_BASE_REPORT: SERVER_URL + 'handson/app/resources/',
		URL_MULTIPART_UPLOAD: '/handson/app/api/multipartupload'
	});
})();