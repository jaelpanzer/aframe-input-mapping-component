import http.server, ssl

# server_address = ('localhost', 4443)
server_address = ('desktop-qtjmq92.am.trimblecorp.net', 4443)
# server_address = ('10.1.219.142', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               keyfile="./bin/key.pem",
                               certfile='./bin/cert.pem',
                               ssl_version=ssl.PROTOCOL_TLSv1)
httpd.serve_forever()