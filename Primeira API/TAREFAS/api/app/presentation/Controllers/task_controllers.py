from fastapi import APIRouter, HTTPException, response, status
from ..viewmodel import Task
from app.persistence.repositoris.task_repository_mongodb import TaskmongoDBRepository
from app.persistence.repositoris.task_repository import TaskInMemory

print('Task Controller ✅')
routes = APIRouter()
prefix = '/tarefas'

task_repository = TaskmongoDBRepository()

@routes.post('/', status_code=status.HTTP_201_CREATED)
def adicionar_tarefa(task: Task):
    task_ = task_repository.adicionar(task)
    return task_

@routes.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def remover_tarefa(task_id: int | str):
    remove_task = task_repository.remover(task_id)
    
    return response('Tarefa deletada')

@routes.get('/')
def listar_tarefa(skip: int | None=0, take: int | None=0, situacao: str | None = None, nivel: int | None = None, prioridade: int | None = None):
    exibir_tasks = task_repository.listar(skip, take, situacao, nivel, prioridade)
    return exibir_tasks

@routes.get('/{task_id}')
def detalhes_tarefa(task_id: int | str):
    task_detail = task_repository.detalhar(task_id)
    if not task_detail:
        raise HTTPException(404, detail='Tarefa não existe.')
    
    return task_detail

@routes.put('/{task_id}')
def atualizar_situacao_tarefa(task_id: int | str, situacao: str | None = None, task: Task | None = None):
    updated_task = task_repository.atualizar(task_id, situacao, task)
    if not updated_task:
        raise HTTPException(404,detail = "Tarefa não encontrada, id não existe.")
    return updated_task
    