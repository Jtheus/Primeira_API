from pydantic import BaseModel

class Task(BaseModel):
    id: int | str | None
    descricao: str
    responsavel: str | None
    nivel: int
    situacao: str | None
    prioridade: int


    class Config:
        orm_mode = True

    @classmethod
    def fromDict(cls, task):
        _task = Task(id=str(task['_id']),
                       descricao=task['descricao'],
                       responsavel=task['responsavel'],
                       nivel=task['nivel'],
                       situacao=task['situacao'],
                       prioridade=task['prioridade'])
        return _task

    def toDict(self):
        return {
            "descricao": self.descricao,
            "responsavel": self.responsavel,
            "nivel": self.nivel,
            "situacao": self.situacao,
            "prioridade": self.prioridade
        }
