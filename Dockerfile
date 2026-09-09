# ---- Stage 1: build the React/Vite frontend -------------------------------
FROM node:20-slim AS frontend-build
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig.json metadata.json ./
COPY src ./src
RUN npm run build   # outputs to /frontend/dist

# ---- Stage 2: Python backend + ffmpeg --------------------------------------
FROM python:3.11-slim
WORKDIR /srv

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend
COPY --from=frontend-build /frontend/dist ./dist

WORKDIR /srv/backend
ENV PYTHONUNBUFFERED=1
EXPOSE 5000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "2", "-b", "0.0.0.0:5000", "app.main:app"]
