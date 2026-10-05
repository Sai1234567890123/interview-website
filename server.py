import os
import sys
import json
import http.server
import socketserver
from pathlib import Path

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

PORT = 8080
DIRECTORY = Path(__file__).resolve().parent

class FAANGStudioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for high performance
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/interview-chat":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode("utf-8"))
                user_msg = payload.get("message", "")
                company = payload.get("company", "google")
                problem_title = payload.get("problem", "Container With Most Water")

                # Return smart interviewer evaluation
                response_data = {
                    "status": "success",
                    "interviewer": f"Evaluation for {company.title()} candidate on {problem_title}",
                    "reply": f"Understood. Your reasoning on '{user_msg}' shows solid grasp of the invariant. How would you handle duplicate values or negative boundaries?"
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), FAANGStudioHandler) as httpd:
        print("=" * 70)
        print(f"🚀 FAANGPrep Studio Live Server Running!")
        print(f"🌐 Local URL:  http://localhost:{PORT}")
        print(f"📂 Directory:  {DIRECTORY}")
        print(f"⚡ Press Ctrl+C to terminate server")
        print("=" * 70)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
