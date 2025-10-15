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
            <span class="desc-atividade">#${a.id} - ${a.descricao}</span>
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;
        lista.appendChild(li);

        const btnEditar = li.querySelector('.editar');
        const btnExcluir = li.querySelector('.excluir');
        const spanDesc = li.querySelector('.desc-atividade');

        btnEditar.addEventListener('click', async () => {
            const novaDesc = prompt('Digite a nova descrição da atividade:', a.descricao);
            if (!novaDesc || novaDesc.trim() === '') return;

            try {
                const response = await fetch(`http://localhost:3765/atividades/${a.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descricao: novaDesc })
                });

                if (response.ok) {
                    spanDesc.textContent = `#${a.id} - ${novaDesc}`;
                    a.descricao = novaDesc;
                    alert('Atividade atualizada com sucesso!');
                } else {
                    const result = await response.json().catch(() => ({}));
                    alert(result.error || 'Erro ao atualizar a atividade.');
                }
            } catch (err) {
                console.error('Erro ao atualizar atividade:', err);
                alert('Erro de conexão ao atualizar atividade.');
            }
        });

        btnExcluir.addEventListener('click', async () => {
            const confirmar = confirm('Tem certeza que deseja excluir esta atividade?');
            if (!confirmar) return;

            try {
                const respDel = await fetch(`http://localhost:3765/atividades/${a.id}`, { method: 'DELETE' });
                if (respDel.ok) {
                    alert('Atividade excluída com sucesso!');
                    li.remove();
                } else {
                    const result = await respDel.json().catch(() => ({}));
                    alert(result.error || 'Erro ao excluir atividade.');
                }
            } catch (err) {
                console.error('Erro ao excluir atividade:', err);
                alert('Erro de conexão ao excluir atividade.');
            }
        });
    });
}

btnVoltar.addEventListener('click', () => window.location.href = './turma.html');

btnNovaAtividade.addEventListener('click', async () => {
    const descricao = prompt('Digite a descrição da atividade:');
    if (!descricao || descricao.trim() === '') return;

    try {
        const resp = await fetch('http://localhost:3765/atividades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao, turmaId: turma.id })
        });

        if (resp.ok) {
            await carregarAtividades();
        } else {
            const result = await resp.json().catch(() => ({}));
            alert(result.error || 'Erro ao adicionar atividade.');
        }
    } catch (err) {
        console.error('Erro ao criar atividade:', err);
        alert('Erro de conexão ao criar atividade.');
    }
});

carregarAtividades();