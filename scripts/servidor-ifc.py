import json
import tempfile
from http.server import BaseHTTPRequestHandler, HTTPServer

import sys
sys.path.insert(0, ".")
from ifc_a_kernel import extraer

PUERTO = 8788


class ManejadorIFC(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != "/extracto":
            self.send_response(404)
            self._cors()
            self.end_headers()
            return
        longitud = int(self.headers.get("Content-Length", 0))
        datos = self.rfile.read(longitud)
        with tempfile.NamedTemporaryFile(suffix=".ifc", delete=False) as tmp:
            tmp.write(datos)
            ruta = tmp.name
        try:
            salida = f"{ruta}.json"
            extraer(ruta, None, salida)
            with open(salida, encoding="utf-8") as f:
                extracto = json.load(f)
            cuerpo = json.dumps(extracto).encode("utf-8")
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", len(cuerpo))
            self.end_headers()
            self.wfile.write(cuerpo)
            print(f"extraido: {extracto['fuente']['ifc']}")
        except Exception as e:
            cuerpo = json.dumps({"error": str(e)}).encode("utf-8")
            self.send_response(422)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", len(cuerpo))
            self.end_headers()
            self.wfile.write(cuerpo)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    print(f"Sidecar IFC escuchando en http://localhost:{PUERTO}")
    HTTPServer(("127.0.0.1", PUERTO), ManejadorIFC).serve_forever()
