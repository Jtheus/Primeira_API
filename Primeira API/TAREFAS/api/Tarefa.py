from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.presentation.Controllers import task_controller

app = FastAPI()

origins = [''
           'http://127.0.0.1:8000/tarefas']
app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

app.include_router(task_controller.routes, prefix=task_controller.prefix)
