var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var { Cu, Ci } = require('chrome');
var tag = "#chinadigitaltimes";

var button = buttons.ActionButton({
	id : "cdt",
	label : "中国数字时代",
	icon : {
		"32" : "./icon32.png",
		"128" : "./icon128.png"
	},
	onClick : handleClick
});

function handleClick(state) {
	tabs.open("https://az844805.vo.msecnd.net/chinese/");
}

Cu.import('resource://gre/modules/Services.jsm');
var redirectPattern = new RegExp('^(http|https):\/\/az844805\.vo\.msecnd\.net\.*');
var frontingPattern = new RegExp('^(http|https):\/\/swx\.cdn\.skype\.com\.*');
var httpRequestObserver = {	
	observe : function(subject, topic, data) {
		if (topic == "http-on-modify-request") {
			var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
			var requestURL = httpChannel.URI.spec;

			if (redirectPattern.test(requestURL)) {
				var newRequestURL = requestURL.replace("az844805.vo.msecnd.net",
						"swx.cdn.skype.com") + tag;
				httpChannel.redirectTo(Services.io.newURI(newRequestURL, null, null));
			} else if (frontingPattern.test(requestURL)) {
				if (requestURL.indexOf(tag, requestURL.length - tag.length) !== -1) {
					httpChannel.setRequestHeader("Host", "az844805.vo.msecnd.net", false);
				} else {
					httpChannel.setRequestHeader("Cache-Control", "no-cache", false);
				}
			}
			return;
		}
		// clean up
		if (topic == "quit-application") {
			Services.obs.removeObserver(this, "http-on-modify-request", false);
			Services.obs.removeObserver(this, "quit-application", false);
		}
	},
};
Services.obs.addObserver(httpRequestObserver, "http-on-modify-request", false);
Services.obs.addObserver(httpRequestObserver, "quit-application", false);

exports.onUnload = function (reason) {
	Services.obs.removeObserver(httpRequestObserver, "http-on-modify-request", false);
	Services.obs.removeObserver(httpRequestObserver, "quit-application", false);
};

