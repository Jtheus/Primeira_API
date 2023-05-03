//const baseURL = ''
const baseURL = ''


let tarefas = []
let editando = false
let tarefa_id

function configurar_formulario() {

  const form = document.getElementById("task-form");

  form.onsubmit = async function(event){
    event.preventDefault()

    const descricao = form.elements.descricao.value;
    const responsavel = form.elements.responsavel.value;
    const nivel = Number(form.elements.nivel.value);
    const prioridade = Number(form.elements.prioridade.value);
    const situacao = form.elements.situacao.value;

    const tarefa = {descricao, responsavel, nivel, prioridade, situacao}
    
    console.log('Submeteu!!!')


          let url = baseURL
          let method = 'POST'
          let mensagem_ok = 'Tarefa Adicionada!'
          let mensagem_erro = 'Não foi possível adicionar'
          let response_status = 201

          if (editando){
              url = baseURL+'/'+ tarefa_id;
              method = 'PUT'
              mensagem_ok = 'tarefa Atualizado com sucesso!'
              mensagem_erro = 'Não foi possível editar'
              response_status = 200
          }

          const opcoes = {
              method: method, 
              body: JSON.stringify(tarefa),
              headers: {
                  'Content-Type': 'application/json'
              }
          }
          
          const response = await fetch(url, opcoes)
      
          if (response.status === response_status ){
              alert(mensagem_ok)
              carregar_tarefas()
              resetar_formulario()
          }else{
              alert(mensagem_erro)
          }
          voltar()
  }
};

function resetar_formulario() {
  const form_task = document.getElementById('task-form');
  form_task.reset()
  editando = false
}

function atualizar_tela(){

  const tabela = document.getElementById('table-task');
  const form_task = document.getElementById('task-form');
  tabela.innerHTML = []
  
  for(let tarefa of tarefas ) {

    const tr = document.createElement('tr');
    const th = document.createElement('th');
    const td_editar = document.createElement('td');
    const td_atualizar = document.createElement('td');
    const td_remover = document.createElement('td');
    const a_editar = document.createElement('a');
    const a_atualizar = document.createElement('a');
    const a_remover = document.createElement('a');
    const img_editar = document.createElement('img');
    const img_atualizar = document.createElement("img");
    const img_remover = document.createElement("img");


    tr.classList.add('linhaIcones')


    tr.id = 'row-table'


    a_editar.href='#'
    a_editar.onclick = (event) => {
      event.preventDefault()
      form_task.style.display = 'block'
      preencher_formulario(tarefa)
      editando = true
      tarefa_id = tarefa.id
    }
    

    a_atualizar.href='#'
    a_atualizar.onclick = (event) => {
      alert('Atualizando')
      check_situacao(tarefa)
    }



    a_remover.href='#'
    a_remover.onclick = async (event) => {
      event.preventDefault()
      const confirmou = confirm(`Deseja mesmo remover a tarefa "${tarefa.descricao}"`)

      if (!confirmou){
          return
      }

      const response = await fetch(baseURL+'/'+tarefa.id, {method: 'DELETE'})

      if (response.ok){
          alert('Tarefa removido com sucesso!')
          carregar_tarefas()
      }
    }

    //configurando imagens
    img_editar.src = 'Imagens/Botão de Editar.png'
    img_atualizar.src = 'Imagens/Botão de atualizar.png'
    img_remover.src = 'Imagens/Botão de Lixo.png'
    

    th.innerHTML = `<a href="#" class="linkVisualizar">${tarefa.descricao}</a>`;
    tr.appendChild(th);
    tr.appendChild(td_editar);
    tr.appendChild(td_atualizar);
    tr.appendChild(td_remover);
    td_editar.appendChild(a_editar);
    td_atualizar.appendChild(a_atualizar);
    td_remover.appendChild(a_remover);
    a_editar.appendChild(img_editar);
    a_atualizar.appendChild(img_atualizar);
    a_atualizar.appendChild(img_atualizar);
    a_remover.appendChild(img_remover);

    tabela.appendChild(tr);

    const linksVisualizar = document.querySelectorAll('.linkVisualizar');
    const field = document.getElementById('field1')
    for (let i = 0; i < linksVisualizar.length; i++) {
      linksVisualizar[i].addEventListener('click', async (event) => {
        event.preventDefault();


        const tarefa = tarefas[i];
        const response = await fetch(`${baseURL}/${tarefa.id}`, { method: 'GET' });
        const data = await response.json();

        const voltar_ = document.createElement('a')
        const visualizacao = document.createElement('fieldset');
        const h = document.createElement('h3')
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const p3 = document.createElement('p');
        const p4 = document.createElement('p');
        const p5 = document.createElement('p');
        visualizacao.classList.add('visualizacao')
        voltar_.href = '#'
        voltar_.id = 'sair'
        voltar_.classList.add('voltar')
        voltar_.innerText = 'Voltar'
        voltar_.onclick = () => {
          voltar()
        }
        h.innerText = `Codigo da tarefa: ${data.id} `
        p1.innerText = `Descrição: ${data.descricao}`;
        p2.innerText = `Responsavel: ${data.responsavel}`;
        p3.innerText = `Nivel: ${data.nivel}`;
        p4.innerText = `Prioridade: ${data.prioridade}`;
        p5.innerText = `Situação: ${data.situacao}`;

        visualizacao.appendChild(h);
        visualizacao.appendChild(p1);
        visualizacao.appendChild(p2);
        visualizacao.appendChild(p3);
        visualizacao.appendChild(p4);
        visualizacao.appendChild(p5);
        visualizacao.appendChild(voltar_);

        field.replaceWith(visualizacao);
      }
    )}
}
}

function check_situacao(tarefa) {
  const form = document.getElementById('task-form')
  const checkbox = document.createElement('form');
  checkbox.id = 'div-checkbox';
  console.log(tarefa.situacao)
  let sit 

  if (tarefa.situacao === 'NOVA'){
    checkbox.innerHTML = `
      <div class="radio-group">
        <label>
          <input type="radio" id="emAndamento" name="situacao" value="EM ANDAMENTO">
          Em andamento
        </label>
        <label>
          <input type="radio" id="pendente" name="situacao" value="PENDENTE">
          Pendente
        </label>
        <label>
          <input type="radio" id="cancelada1" name="situacao" value="CANCELADA">
          Cancelada
        </label>
      </div>
      <input type="submit" id="adicionar" value="Adicionar">
      <a href="#" type="button" id="cancelar" onclick="voltar()">Voltar</a>
    ` ;
  } else if (tarefa.situacao === 'PENDENTE'){
    checkbox.innerHTML = `
      <div class="radio-group">
      <label>
          <input type="radio" id="emAndamento" name="situacao" value="EM ANDAMENTO"${tarefa.situacao === 'EM ANDAMENTO' ? 'checked' : ''}>
          Em andamento
        </label>
        <label>
          <input type="radio" id="cancelada" name="situacao" value="CANCELADA"${tarefa.situacao === 'CANCELADA' ? 'checked' : ''}>
          Cancelada
        </label>
      </div>
      <input type="submit" id="adicionar" value="Adicionar">
      <a href="#" type="button" id="cancelar" onclick="voltar()">Voltar</a>
    `;
  } else if (tarefa.situacao === 'EM ANDAMENTO'){
    checkbox.innerHTML = `
      <div class="radio-group">
        <label>
          <input type="radio" id="pendente" name="situacao" value="PENDENTE">
          Pendente
        </label>
        <label>
          <input type="radio" id="resolvida" name="situacao" value="RESOLVIDA">
          Resolvida
        </label>
        <label>
          <input type="radio" id="cancelada" name="situacao" value="CANCELADA">
          Cancelada
        </label>
      </div>
      <input type="submit" id="adicionar" value="Adicionar">
      <a href="#" type="button" id="cancelar" onclick="voltar()">Voltar</a>
    `;
  }else if (tarefa.situacao === 'RESOLVIDA'){
    checkbox.innerHTML = `
    <div class="alerta">
      <p>Sua tarefa já está ${tarefa.situacao}!</p>
    </div>
    <a href="#" type="button" id="sair" onclick="voltar()">Voltar</a>
    `
  } else if(tarefa.situacao === 'CANCELADA'){
    checkbox.innerHTML = `
    <div class="alertaCancelada">
      <p>Sua tarefa está ${tarefa.situacao}!</p>
    </div>
    <a href="#" type="button" id="sair" onclick="voltar()">Voltar</a>
    `
  }
  
  console.log('deu certo')
  form.replaceWith(checkbox);
  if(tarefa.situacao === 'NOVA' || tarefa.situacao === 'PENDENTE' || tarefa.situacao === 'EM ANDAMENTO'){
  const btnAdicionar = document.getElementById('adicionar');
  btnAdicionar.onclick = async (event) => {
    event.preventDefault()
    alert('clicou')
    console.log(checkbox.elements.situacao.value)
    const response = await fetch(`${baseURL}/${tarefa.id}/?situacao=${checkbox.elements.situacao.value} `, {method: 'PUT'})


      if (response.ok){
          alert(`Alteração de situação de ${tarefa.situacao} para ${checkbox.elements.situacao.value}!`)
          carregar_tarefas()
          voltar()
      }
    }
  }
}
  

async function carregar_tarefas(){
  const response = await fetch(baseURL)

  tarefas = await response.json()

  atualizar_tela()
}

function preencher_formulario(tarefa){
  const form_task = document.getElementById('task-form');

  form_task.elements.descricao.value = tarefa.descricao;
  form_task.elements.responsavel.value = tarefa.responsavel;
  form_task.elements.nivel.value = tarefa.nivel;
  form_task.elements.prioridade.value = tarefa.prioridade;
  form_task.elements.situacao.value = tarefa.situacao;

}

function btn_mais(){
  const form_task = document.getElementById('task-form');
  form_task.style.display ='block'
}

function filtrarTarefa(){
  const tabela = document.getElementById('tabela');
  const filtro_form = document.createElement('form');
  filtro_form.id = 'filtro-form'
    filtro_form.innerHTML = `
    <label for="filtrar" id="labelFiltro">Filtrar</label><br>
    <select name="filtro" id="filtrar">
    <option value="nenhum">Nenhum</option>
    <option value="todas">Todas</option>
    <option value="nivel">Nível</option>
    <option value="prioridade">Prioridade</option>
    <option value="situacao">Situação</option>
    </select><br><br>
    <a href="#" id="btn-filtrar">confirmar</a>`
    tabela.replaceWith(filtro_form);
    const btn_ok = document.getElementById('btn-filtrar')
    btn_ok.onclick = ()=>{
      alert('clicou')
      if(filtro_form.elements.filtrar.value === 'nenhum'){
        voltar()
      }else if(filtro_form.elements.filtrar.value === 'todas'){
        console.log(filtro_form.elements.filtrar.value)
        const filtro_todas = document.createElement('form');
        const input_take = document.createElement('input');
        const input_skip = document.createElement('input');
        const btn_persquisar = document.createElement('input');
        const voltar = document.createElement('input');
        
      }else if(filtro_form.elements.filtrar.value === 'nivel'){
        console.log(filtro_form.elements.filtrar.value)
      }else if(filtro_form.elements.filtrar.value === 'prioridade'){
        console.log(filtro_form.elements.filtrar.value)
      }else if(filtro_form.elements.filtrar.value === 'situacao'){
        console.log(filtro_form.elements.filtrar.value)
      }
    }
  
  
}


function voltar(){
  window.location.href = "/";
}

function iniciar_app(){
  configurar_formulario()
  carregar_tarefas()
}

iniciar_app()


