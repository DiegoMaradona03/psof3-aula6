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
            <span>${turma.nome}</span>
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
            if (!novoNome) return;

            const response = await fetch(`http://localhost:3765/turmas/${turma.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: novoNome })
            });

            if (response.ok) {
                carregarTurmas();
            } else {
                const result = await response.json();
                alert(result.error || 'Erro ao atualizar a turma.');
            }
        });

        li.querySelector('.excluir').addEventListener('click', async () => {
            const confirmar = confirm('Tem certeza que deseja excluir esta turma?');
            if (!confirmar) return;
            const resp = await fetch(`http://localhost:3765/turmas/${turma.id}`, { method: 'DELETE' });
            if (resp.ok) {
                alert('Turma excluída com sucesso!');
                carregarTurmas();
            } else {
                const result = await resp.json();
                alert(result.error || 'Erro ao excluir turma.');
            }
        });
    });
}

btnNovaTurma.addEventListener('click', async () => {
    const nome = prompt('Digite o nome da nova turma:');
    if (!nome) return;
    await fetch('http://localhost:3765/turmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, professorId: usuario.id })
    });
    carregarTurmas();
});

carregarTurmas();