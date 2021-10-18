const GERRIT_HEADER = 'https://chromium-review.googlesource.com';
const GOOGLE_GIT_HEADER = 'https://chromium.googlesource.com';
const CODE_REVIEWS_HEADER = 'https://codereview.chromium.org';
const WEBDIFF_HEADER = 'http://localhost';

class GerritHandler {
	// https://chromium-review.googlesource.com/c/chromium/src/+/3086892/10/chrome/browser/sync/test/integration/two_client_web_apps_bmo_sync_test.cc#646
	constructor(url, tabTitle) {
		this.url = url;
		url = url.split('/+/')[1];
		if (!url) return;

		// Get the file path
		const chunk = url.split('#')[0];
		
		const SEARCH_TERM = '/';
		let indexOfFirst = chunk.indexOf(SEARCH_TERM);
		const NOT_FIND = -1;
		if (indexOfFirst == NOT_FIND) {
			console.log('First index of' + SEARCH_TERM + ' not find!');
			return;
		}
		let indexOfSecond = chunk.indexOf(SEARCH_TERM, indexOfFirst + 1);
		if (indexOfSecond == NOT_FIND) {
			console.log('Second index of' + SEARCH_TERM + ' not find!');
			return;
		}
		
		let file = chunk.substr(indexOfSecond + 1);
		if (!file) return;

		// Get the line number.
		let line = url.split('#')[1];
		if (line) {
			// If chose from left diff view on Gerrit, there will be a 'b' in 
			// the line number which should get removed.
			line = line.replace('b', '');
		} else {
			// Default to open and locate at the first line.
			line = '1';
		}

		this.file = file;
		this.line = line;
		this.success = true;
	}
}

class GoogleGitHandler {
	// https://chromium.googlesource.com/chromium/src/+/HEAD/chrome/browser/extensions/app_process_apitest.cc#291
	constructor(url, tabTitle) {
		this.url = url;
		url = url.split('/+/')[1];
		if (!url) return;

		// Get the file path
		const chunk = url.split('#')[0];

		const SEARCH_TERM = '/';
		let indexOfFirst = chunk.indexOf(SEARCH_TERM);
		const NOT_FIND = -1;
		if (indexOfFirst == NOT_FIND) {
			console.log('First index of' + SEARCH_TERM + ' not find!');
			return;
		}

		let file = chunk.substr(indexOfFirst + 1);
		if (!file) return;

		// Get the line number.
		let line = url.split('#')[1];
		if (!line)
			line = '1';

		this.file = file;
		this.line = line;
		this.success = true;
	}
}

class CodeReviewsHandler {
	// https://chromiumcodereview.appspot.com/2433563002/diff/100001/components/sync/protocol/proto_value_conversions.cc
	constructor(url, tabTitle) {
		this.url = url;
		if (!tabTitle) {
			console.error('Cannot get current Tab Title!');
			return;
		}

		// Get the file path.
		var file = tabTitle.split(' ')[0];
		if (!file) {
			console.error('Cannot get file path!');
			return;
		}
		this.file = file;

		// Get the line number.
		// Default to the first line.
		this.line = '1';

		this.success = true;

		console.log('Tab Title: ', tabTitle);
	}
}

class WebdiffHandler {
	// http://localhost:52789/tools/chrome_extensions/open_my_editor/README.md
	constructor(url, tabTitle) {
		this.url = url;
		url = url.split(':')[2];
		if (!url) return;

		// Get the file path
		const chunk = url;

		const SEARCH_TERM = '/';
		let indexOfFirst = chunk.indexOf(SEARCH_TERM);
		const NOT_FIND = -1;
		if (indexOfFirst == NOT_FIND) {
			console.log('First index of' + SEARCH_TERM + ' not find!');
			return;
		}

		let file = chunk.substr(indexOfFirst + 1);
		if (!file) return;

		// Get the line number.
		// Default to the first line.
		let line = '1';

		this.file = file;
		this.line = line;
		this.success = true;
	}
}

function GetHandler(url)  {
	if (url.startsWith(GERRIT_HEADER)) {
		return GerritHandler;
	}
	
	if (url.startsWith(GOOGLE_GIT_HEADER)) {
		return GoogleGitHandler;
	}

	if (url.startsWith(CODE_REVIEWS_HEADER)) {
		return CodeReviewsHandler;
	}

	if (url.startsWith(WEBDIFF_HEADER)) {
		return WebdiffHandler;
	}

	console.log('Not support website: ' + url);
	return null;
}

function Json2Get(json){
	let str = `${json.file};l=${json.line}`;
	return str;
}

function RequestOpen(url, tabTitle) {
	let handlerClass = GetHandler(url);

	if (!handlerClass) return;

	let handler = new handlerClass(url, tabTitle);

	if (!handler || !handler.success) return;
	console.log('send', handler);
	let param = Json2Get(handler);
	console.log(param);
	let reqUrl = 'https://source.chromium.org/chromium/chromium/src/+/main:' + param;
	chrome.tabs.create({ url: reqUrl });
	fetch(reqUrl)
	.then((response) => {
		console.log('Response: ', response);
	})
	.catch((error) => {
		console.log('Error: ', error);
	});
};

function handleContextMenusClick(info, tab) {
	switch (info.menuItemId) {
		case 'chromium_code_search':
			let url = info.linkUrl;
			if (url == undefined) {
				url = info.pageUrl;
			}
			if (url) {
				console.log(url, "start open");
				RequestOpen(url, tab.title);
			}
			console.log(info);
			console.log(tab);
			break;
	};
}

chrome.runtime.onInstalled.addListener((_) => {
	chrome.contextMenus.create({
		id: 'chromium_code_search',
		title: 'Chromium Code Search',
		contexts: ['link', 'selection']
	});

	// This will get triggered when service worker is active. [fast]
	chrome.contextMenus.onClicked.addListener(handleContextMenusClick);
});

// This will get triggered when service worker is inactive. [slow]
chrome.contextMenus.onClicked.addListener(handleContextMenusClick);
