from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging import configure_logging
from app.core.config import settings

from app.routers.legacy import router as legacy_router
from app.routers.users import router as users_router
from app.routers.candidates import router as candidates_router
from app.routers.jobs import router as jobs_router
from app.routers.recommendations import router as recommendations_router

configure_logging()
app = FastAPI(title=f"{settings.app_name} Career Agent API", version="0.3.0")

app.include_router(legacy_router)
app.include_router(users_router)
app.include_router(candidates_router)
app.include_router(jobs_router)
app.include_router(recommendations_router)

# The Next.js frontend runs on localhost:3000 during local development and
# calls the API on localhost:8000. Allow only the local development origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health(): return {"status": "ok", "env": settings.app_env}
