# ============================================================
# Stage 1 — build the React/Vite frontend
# ============================================================
FROM node:20-slim AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/bun.lock* frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
# VITE_API_BASE_URL is left empty at build time: the SPA is served from the
# same origin as the API in production, so relative /api and /auth calls work.
RUN npm run build

# ============================================================
# Stage 2 — Python/Flask backend, serving the built frontend
# ============================================================
FROM python:3.11-slim
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /app/requirements.txt

RUN useradd --create-home --shell /bin/bash appuser \
    && mkdir -p /app/static/uploads /app/static/outputs /app/static/tmp \
    && chown -R appuser:appuser /app

COPY --chown=appuser:appuser backend/ /app/
COPY --chown=appuser:appuser --from=frontend-build /frontend/dist /app/frontend_dist

EXPOSE 5000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://localhost:{os.getenv(\"PORT\", \"5000\")}/', timeout=5)" || exit 1

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-5000} --workers 2"]
