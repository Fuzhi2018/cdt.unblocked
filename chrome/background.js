var tag = "#chinadigitaltimes";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({
		'url' : "https://az844805.vo.msecnd.net/chinese/"
	});
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	return {
		redirectUrl : details.url.replace("az844805.vo.msecnd.net",
				"ajax.aspnetcdn.com")
				+ tag
	};
}, {
	urls : [ "*://az844805.vo.msecnd.net/*" ]
}, [ "blocking" ]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
	console.log(details.url);
	if (details.url.indexOf(tag, details.url.length - tag.length) !== -1) {
		headers.push({
			name : 'Host',
			value : 'az844805.vo.msecnd.net'
		});
	} else {
		headers.push({
			name : 'Cache-Control',
			value : 'no-cache'
		})
	}
	return {
		requestHeaders : headers
	};
}, {
	urls : [ "*://ajax.aspnetcdn.com/*" ]
}, [ 'requestHeaders', 'blocking' ]);
