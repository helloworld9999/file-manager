print("Hello World")
import sys
print("Python version:", sys.version)

try:
    import fastapi
    print("FastAPI imported successfully")
except ImportError as e:
    print("FastAPI import error:", e)

try:
    from app.main import app
    print("App imported successfully")
except ImportError as e:
    print("App import error:", e)
except Exception as e:
    print("Other error:", e)
