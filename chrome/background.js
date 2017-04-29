var tag = "#chinadigitaltimes";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({
		'url' : "https://duycx87h4wztb.cloudfront.net/chinese/"
	});
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	return {
		redirectUrl : details.url.replace("duycx87h4wztb.cloudfront.net",
				"a0.awsstatic.com")
				+ tag
	};
}, {
	urls : [ "*://duycx87h4wztb.cloudfront.net/*" ]
}, [ "blocking" ]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
	console.log(details.url);
	if (details.url.indexOf(tag, details.url.length - tag.length) !== -1) {
		headers.push({
			name : 'Host',
			value : 'duycx87h4wztb.cloudfront.net'
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
	urls : [ "*://a0.awsstatic.com/*" ]
}, [ 'requestHeaders', 'blocking' ]);
