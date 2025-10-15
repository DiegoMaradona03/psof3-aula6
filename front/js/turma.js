import './verificacao.js';

const usuario = JSON.parse(localStorage.getItem('professor'));
const lista = document.getElementById('listaTurmas');
const btnNovaTurma = document.getElementById('btnNovaTurma');

async function carregarTurmas() {
    lista.innerHTML = '';
    const resp = await fetch(`http://localhost:3765/turmas/professor/${usuario.id}`);
    const turmas = await resp.json();

    turmas.forEach(turma => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="nome-turma">${turma.nome}</span>
            <button class="ver">Ver</button>
            <button class="editar">Editar</button>
            <button class="excluir">Excluir</button>
        `;
        lista.appendChild(li);

        const btnVer = li.querySelector('.ver');
        const btnEditar = li.querySelector('.editar');
        const btnExcluir = li.querySelector('.excluir');
        const spanNome = li.querySelector('.nome-turma');

        btnVer.addEventListener('click', () => {
            localStorage.setItem('turmaSelecionada', JSON.stringify({ id: turma.id, nome: turma.nome }));
            window.location.href = './atividade.html';
        });

        btnEditar.addEventListener('click', async () => {
            const novoNome = prompt('Digite o novo nome da turma:', turma.nome);
            if (!novoNome || novoNome.trim() === '') return;

            try {
                const response = await fetch(`http://localhost:3765/turmas/${turma.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: novoNome })
                });

                if (response.ok) {
                    spanNome.textContent = novoNome;

                    const stored = localStorage.getItem('turmaSelecionada');
                    if (stored) {
                        const sel = JSON.parse(stored);
                        if (sel.id === turma.id) {
                            sel.nome = novoNome;
                            localStorage.setItem('turmaSelecionada', JSON.stringify(sel));
                        }
                    }

                    turma.nome = novoNome;

                    alert('Turma atualizada com sucesso!');
                } else {
                    const result = await response.json().catch(() => ({}));
                    alert(result.error || 'Erro ao atualizar turma.');
                }
            } catch (err) {
                console.error('Erro ao atualizar turma:', err);
                alert('Erro de conexão ao atualizar turma.');
            }
        });

        btnExcluir.addEventListener('click', async () => {
            const confirmar = confirm('Tem certeza que deseja excluir esta turma?');
            if (!confirmar) return;

            try {
                const respDel = await fetch(`http://localhost:3765/turmas/${turma.id}`, { method: 'DELETE' });
                if (respDel.ok) {
                    alert('Turma excluída com sucesso!');
                    li.remove();
                } else {
                    const result = await respDel.json().catch(() => ({}));
                    alert(result.error || 'Erro ao excluir turma.');
                }
            } catch (err) {
                console.error('Erro ao excluir turma:', err);
                alert('Erro de conexão ao excluir turma.');
            }
        });
    });
}

btnNovaTurma.addEventListener('click', async () => {
    const nome = prompt('Digite o nome da nova turma:');
    if (!nome || nome.trim() === '') return;

    try {
        const resp = await fetch('http://localhost:3765/turmas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, professorId: usuario.id })
        });

        if (resp.ok) {
            await carregarTurmas();
        } else {
            const result = await resp.json().catch(() => ({}));
            alert(result.error || 'Erro ao adicionar turma.');
        }
    } catch (err) {
        console.error('Erro ao criar turma:', err);
        alert('Erro de conexão ao criar turma.');
    }
});

carregarTurmas();