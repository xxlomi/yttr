export const DEPLOYMENT_DOCS = `# YouTube Transcriber: GitHub -> Railway Deployment

## 1. Project Structure
\`\`\`text
/app
  ├── main.py            # FastAPI app (Web Service)
  ├── tasks.py           # Celery worker logic (Worker Service)
  ├── requirements.txt   # Python dependencies
  ├── Dockerfile         # Build instructions
  ├── .env               # Local env vars (gitignored)
  └── .gitignore
\`\`\`

## 2. Dependencies (\`requirements.txt\`)
\`\`\`text
fastapi==0.104.1
uvicorn==0.24.0
gunicorn==21.2.0
yt-dlp==2023.11.16
celery==5.3.4
redis==5.0.1
boto3==1.34.0
requests==2.31.0
\`\`\`

## 3. Dockerfile (Railway Optimized)
Railway builds this automatically. Ensures \`ffmpeg\` is present.

\`\`\`dockerfile
FROM python:3.10-slim

# Install ffmpeg and system deps
RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    git \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Default command (overridden by Railway services)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## 4. Railway Configuration

### A. Redis Setup
1.  Go to Railway Project -> New -> Database -> Redis.
2.  Wait for deployment.
3.  Copy \`REDIS_URL\` variable from Redis service variables.

### B. Web Service (API)
1.  New -> GitHub Repo -> Select Repo.
2.  **Settings -> Build**:
    *   Start Command: \`gunicorn main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT\`
3.  **Settings -> Variables**:
    *   \`REDIS_URL\`: (Paste from Redis service)
    *   \`SERVICE_TYPE\`: \`web\`
4.  **Networking**: Enable Public Network (generates domain).

### C. Worker Service (Celery)
1.  New -> GitHub Repo -> Select **Same Repo**.
2.  **Settings -> Build**:
    *   Start Command: \`celery -A tasks.celery worker --loglevel=info --concurrency=4\`
3.  **Settings -> Variables**:
    *   \`REDIS_URL\`: (Paste from Redis service)
    *   \`SERVICE_TYPE\`: \`worker\`
4.  **Networking**: Disable Public Network (internal only).

## 5. Technical Implementation Details

### \`main.py\` (Web Endpoint)
\`\`\`python
from fastapi import FastAPI, BackgroundTasks
from tasks import process_transcription
import uuid

app = FastAPI()

@app.post("/transcribe")
async def create_task(url: str):
    job_id = str(uuid.uuid4())
    # Push to Celery via Redis
    process_transcription.delay(job_id, url)
    return {"job_id": job_id, "status": "processing"}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    # Query DB/Redis for status
    pass
\`\`\`

### \`tasks.py\` (Worker Logic)
\`\`\`python
from celery import Celery
import os
import yt_dlp

celery = Celery('worker', broker=os.getenv('REDIS_URL'))

@celery.task
def process_transcription(job_id: str, url: str):
    opts = {
        'skip_download': True,
        'writeautomaticsub': True,
        'writesubtitles': True,
        'subtitleslangs': ['en'],
        'convertsubtitles': 'srt',
        'outtmpl': f'/tmp/{job_id}.%(ext)s',
    }
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.extract_info(url, download=True)
        # Upload result to S3/DB here
        # Update job status to COMPLETED
    except Exception as e:
        # Update job status to FAILED
        pass
\`\`\`

## 6. Environment Variables (Railway Dashboard)
Set these in **both** Web and Worker services:
*   \`REDIS_URL\`: \`redis://default:password@host:port\` (Auto-provided by Railway Redis)
*   \`AWS_ACCESS_KEY_ID\`: (For S3 storage)
*   \`AWS_SECRET_ACCESS_KEY\`: (For S3 storage)
*   \`S3_BUCKET\`: (Target bucket name)

## 7. Deployment Workflow
1.  Push code to GitHub \`main\` branch.
2.  Railway auto-detects commit -> Triggers build for both services.
3.  Verify **Deployments** tab for success.
4.  Test endpoint: \`curl -X POST https://your-railway-app.up.railway.app/transcribe?url=...\`
`;
