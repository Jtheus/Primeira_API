from typing import TypedDict
from decouple import config
from bson.objectid import ObjectId
from pymongo import MongoClient
from app.presentation.viewmodel import Task

situacao_tarefa = ['NOVA', 'EM ANDAMENTO', 'PENDENTE', 'RESOLVIDA', 'CANCELADA']

class TaskMongo(TypedDict):
    _id: ObjectId
    descricao: str
    responsavel: str | None
    nivel: int
    situacao: str | None
    prioridade: int

class TaskmongoDBRepository:

    def __init__(self):
        # Connect to MongoDB
        uri = config('MONGODB_URL')
        client = MongoClient(uri)
        db = client['tasksapp']
        self.tasks = db['task']
        try:
            print('MongoDB 💖')
        except Exception:
            print('Deu erro!')

    def adicionar(self, task):
        _id = self.tasks.insert_one(task.toDict()).inserted_id
        task.id = str(_id)
        task.situacao = situacao_tarefa[0]
        return task

    def remover(self, task_id):
        filtro = {"_id": ObjectId(task_id)}
        self.tasks.delete_one(filtro)

    def listar(self, skip, take, situacao, nivel, prioridade):
        tasks_ = self.tasks.find().skip(skip).limit(take)
        filter_task = list(map(Task.fromDict, tasks_))
        if situacao:
            filter_task = [task for task in filter_task if task.situacao == situacao.upper()]
        if nivel:
            filter_task = [task for task in filter_task if task.nivel == nivel]
        if prioridade:
            filter_task = [task for task in filter_task if task.prioridade == prioridade]
        return filter_task

    def detalhar(self, task_id):
        filtro = {"_id": ObjectId(task_id)}
        task_found = self.tasks.find_one(filtro)
        return Task.fromDict(task_found) if task_found else None
            
    def atualizar(self, task_id, situacao, task):
        filtro = {"_id": ObjectId(task_id)}
        if task:
            formatacao = task.situacao.upper()
            task.situacao = formatacao
            self.tasks.update_one(filtro, {'$set': task.toDict()})
            task.id = task_id
            print(self.tasks)
            return task
        elif situacao:
            situacao = situacao.upper()
            self.tasks.update_one(filtro,{'$set':{'situacao': situacao}})
            return 'situacao atualizada'
