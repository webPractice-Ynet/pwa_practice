// manifestのlinkタグを生成
function setManifest(path) {
	const manifest = document.createElement('link');
	manifest.rel = 'manifest';
	manifest.href = path;
	document.head.appendChild(manifest);
}

// OSに応じて読み込むmanifestを変更
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf("iphone") > 0 || userAgent.indexOf("ipad") > 0) {
	setManifest('manifest_ios.json')
} else {
	setManifest('manifest.json')
}