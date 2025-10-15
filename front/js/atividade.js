import './verificacao.js';

const usuario = JSON.parse(localStorage.getItem('professor'));
const turma = JSON.parse(localStorage.getItem('turmaSelecionada'));

const lista = document.getElementById('listaAtividades');
const titulo = document.getElementById('tituloTurma');
const btnVoltar = document.getElementById('btnVoltar');
const btnNovaAtividade = document.getElementById('btnNovaAtividade');

titulo.textContent = `Atividades da Turma: ${turma.nome}`;

async function carregarAtividades() {
    lista.innerHTML = '';
    const resp = await fetch(`http://localhost:3765/atividades/turma/${turma.id}`);
    const atividades = await resp.json();

    atividades.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>#${a.id} - ${a.descricao}</span>
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;
        lista.appendChild(li);

        li.querySelector('.editar').addEventListener('click', async () => {
            const novaDesc = prompt('Digite a nova descrição da atividade:', a.descricao);
            if (!novaDesc) return;
            await fetch(`http://localhost:3765/atividades/${a.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: novaDesc })
            });
            carregarAtividades();
        });

        li.querySelector('.editar').addEventListener('click', async () => {
            const novaDesc = prompt('Digite a nova descrição da atividade:', a.descricao);
            if (!novaDesc) return;

            const response = await fetch(`http://localhost:3765/atividades/${a.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: novaDesc })
            });

            if (response.ok) {
                carregarAtividades();
            } else {
                const result = await response.json();
                alert(result.error || 'Erro ao atualizar a atividade.');
            }
        });

    });
}

btnVoltar.addEventListener('click', () => window.location.href = './turma.html');

btnNovaAtividade.addEventListener('click', async () => {
    const descricao = prompt('Digite a descrição da atividade:');
    if (!descricao) return;
    await fetch('http://localhost:3765/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, turmaId: turma.id })
    });
    carregarAtividades();
});

carregarAtividades();