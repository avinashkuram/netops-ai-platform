FROM python:3.11-slim

WORKDIR /app

COPY backend/ /app/backend/
COPY index.html styles.css app.js /app/

RUN pip install --no-cache-dir fastapi uvicorn pydantic requests pyyaml

EXPOSE 8000

CMD ["python", "backend/main.py"]
