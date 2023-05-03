
situacao_tarefa = ['NOVA', 'EM ANDAMENTO', 'PENDENTE', 'RESOLVIDA', 'CANCELADA']

class TaskInMemory():

    def __init__(self):
        self.tasks = []
        self.proximo_id = 0

        try:
            print('memory 💖')
        except Exception:
            print('Deu erro!')
        

    def listar(self, skip, take, situacao, nivel, prioridade):
        inicio = skip
        if skip and take:
            fim = skip + take
        else:
            fim = None

        filtro_tarefas = self.tasks

        if situacao:
            filtro_tarefas = [task for task in filtro_tarefas if task.situacao == situacao.upper()]

        if nivel:
            filtro_tarefas = [task for task in filtro_tarefas if task.nivel == nivel]

        if prioridade:
            filtro_tarefas = [task for task in filtro_tarefas if task.prioridade == prioridade]

        return filtro_tarefas[inicio:fim]

    def adicionar(self, task):
        global proximo_id
        self.proximo_id += 1
        task.id = self.proximo_id
        task.situacao = situacao_tarefa[0]
        self.tasks.append(task)
        return task

    def detalhar(self, task_id):
        for task in self.tasks:
            if task.id == task_id:
                return task

    def remover(self,task_id):
        for tarefa_atual in self.tasks:
            if tarefa_atual.id == task_id:
                self.tasks.remove(tarefa_atual)
                return 'Sua tarefa foi deletada.'

    def atualizar(self, task_id, situacao, task):
        if task is not None:
        # Testa se a tarefa não é nula para prosseguir neste escopo
            formatacao = task.situacao.upper()
            for tarefa in self.tasks:
                if tarefa.id == task_id:
                    task.id = task_id
                    task.situacao = formatacao
                    if formatacao in situacao_tarefa:
                        self.tasks[self.tasks.index(tarefa)] = task
                        return task
        else:
            for task in self.tasks:
                if task.id == task_id:
                    if situacao.upper() not in situacao_tarefa:
                        return 'Situação inválida'
                    
                    index = situacao_tarefa.index(situacao.upper())

                    if situacao_tarefa.index(task.situacao) == 3 or situacao_tarefa.index(task.situacao) == 4:
                        return f'Não é posível alterar tarefa {task.situacao}'         
                    elif index == 4:
                        task.situacao = situacao.upper()
                        return task
                    elif index == 1 or index == 2:
                        task.situacao = situacao.upper()
                        return task
                    elif index == 3 and situacao_tarefa.index(task.situacao) != 2 and situacao_tarefa.index(task.situacao) != 0:
                        task.situacao = situacao.upper()
                        return task
                    else:
                        if situacao.upper() == situacao_tarefa[3]:
                            return f'Não é posível pular situação de {task.situacao} para {situacao.upper()}.'
                        elif task.situacao == situacao.upper():
                            return f'A situação atual é {task.situacao}, não é posivel repetir.'
                        else:
                             return f'A situação atual é {task.situacao}, não é posivel retornar para {situacao.upper()}.'