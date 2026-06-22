"""Genera js/config.js a partir de variables de entorno.
Ejecutado por .github/workflows/deploy.yml durante el despliegue.
"""
import json
import os

required = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_MEASUREMENT_ID",
    "GROQ_API_KEY",
]

missing = [v for v in required if not os.environ.get(v)]
if missing:
    raise SystemExit(f"ERROR: faltan las siguientes variables de entorno: {', '.join(missing)}")

cfg = {
    "firebase": {
        "apiKey":            os.environ["FIREBASE_API_KEY"],
        "authDomain":        os.environ["FIREBASE_AUTH_DOMAIN"],
        "projectId":         os.environ["FIREBASE_PROJECT_ID"],
        "storageBucket":     os.environ["FIREBASE_STORAGE_BUCKET"],
        "messagingSenderId": os.environ["FIREBASE_MESSAGING_SENDER_ID"],
        "appId":             os.environ["FIREBASE_APP_ID"],
        "measurementId":     os.environ["FIREBASE_MEASUREMENT_ID"],
    },
    "groqApiKey": os.environ["GROQ_API_KEY"],
}

output = "window.APP_CONFIG = " + json.dumps(cfg, indent=4) + ";\n"

with open("js/config.js", "w", encoding="utf-8") as f:
    f.write(output)

print("config.js generado correctamente.")
print(f"  Firebase project: {cfg['firebase']['projectId']}")
