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

        li.querySelector('.editar').addEventListener('click', async () => {
            const novaDesc = prompt('Digite a nova descrição da atividade:', a.descricao);
            if (!novaDesc || novaDesc.trim() === '') return;

            try {
                const response = await fetch(`http://localhost:3765/atividades/${a.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descricao: novaDesc })
                });

                if (response.ok) {
                    li.querySelector('.desc-atividade').textContent = `#${a.id} - ${novaDesc}`;
                    a.descricao = novaDesc;
                } else {
                    await response.json().catch(() => {});
                }
            } catch (err) {
                console.error('Erro ao atualizar atividade:', err);
            }
        });

        li.querySelector('.excluir').addEventListener('click', async () => {
            const confirmar = confirm('Tem certeza que deseja excluir esta atividade?');
            if (!confirmar) return;

            try {
                const respDel = await fetch(`http://localhost:3765/atividades/${a.id}`, { method: 'DELETE' });
                if (respDel.ok) {
                    li.remove();
                } else {
                    await respDel.json().catch(() => {});
                }
            } catch (err) {
                console.error('Erro ao excluir atividade:', err);
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
            await resp.json().catch(() => {});
        }
    } catch (err) {
        console.error('Erro ao criar atividade:', err);
    }
});

carregarAtividades();