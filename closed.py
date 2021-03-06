import SimpleHTTPServer
import SocketServer
import sys

class myHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
   def do_GET(self):
       print self.path
       self.send_response(302)
       new_path = '%s%s'%('https://hackmit.org', self.path)
       self.send_header('Location', new_path)
       self.end_headers()

PORT = 3000 if len(sys.argv) < 2 else int(sys.argv[1])
handler = SocketServer.TCPServer(("", PORT), myHandler)
print "serving at port %d" % PORT
handler.serve_forever()
