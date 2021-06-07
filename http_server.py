#!/usr/bin/env python3

from http.server import HTTPServer, SimpleHTTPRequestHandler

# 公開するIPアドレス/ポートを変更する場合はこれらを書き換える
address = '127.0.0.1'
port = 8000

# 一部のWebブラウザではJavaScriptファイルのContent-Typeが
# 「application/javascript」でないと動作しないため、
# 明示的に設定を行う
handler = SimpleHTTPRequestHandler
handler.extensions_map[".js"] = "application/javascript"

httpd = HTTPServer((address, port), handler)
print('listen on {}:{}'.format(address, port))
httpd.serve_forever()

