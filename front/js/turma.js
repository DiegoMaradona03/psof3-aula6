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

        li.querySelector('.ver').addEventListener('click', () => {
            localStorage.setItem('turmaSelecionada', JSON.stringify({ id: turma.id, nome: turma.nome }));
            window.location.href = './atividade.html';
        });

        li.querySelector('.editar').addEventListener('click', async () => {
            const novoNome = prompt('Digite o novo nome da turma:', turma.nome);
            if (!novoNome || novoNome.trim() === '') return;

            try {
                const response = await fetch(`http://localhost:3765/turmas/${turma.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: novoNome })
                });

                if (response.ok) {
                    li.querySelector('.nome-turma').textContent = novoNome;

                    const stored = localStorage.getItem('turmaSelecionada');
                    if (stored) {
                        const sel = JSON.parse(stored);
                        if (sel.id === turma.id) {
                            sel.nome = novoNome;
                            localStorage.setItem('turmaSelecionada', JSON.stringify(sel));
                        }
                    }

                    turma.nome = novoNome;
                } else {
                    await response.json().catch(() => {});
                }
            } catch (err) {
                console.error('Erro ao atualizar turma:', err);
            }
        });

        li.querySelector('.excluir').addEventListener('click', async () => {
            const confirmar = confirm('Tem certeza que deseja excluir esta turma?');
            if (!confirmar) return;

            try {
                const respDel = await fetch(`http://localhost:3765/turmas/${turma.id}`, { method: 'DELETE' });
                if (respDel.ok) {
                    li.remove();
                } else {
                    await respDel.json().catch(() => {});
                }
            } catch (err) {
                console.error('Erro ao excluir turma:', err);
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
            await resp.json().catch(() => {});
        }
    } catch (err) {
        console.error('Erro ao criar turma:', err);
    }
});

carregarTurmas();