"""Local dev convenience: `python run.py` starts uvicorn with autoreload.
In production the Dockerfile runs `gunicorn -k uvicorn.workers.UvicornWorker app.main:app` instead."""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=5000, reload=True)
