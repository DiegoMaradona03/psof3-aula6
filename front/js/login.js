import axios from "https://cdn.skypack.dev/axios";

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    try {
        const resp = await axios.post('http://localhost:3765/login', { email, senha });

        if (resp.data) {
            localStorage.setItem('professor', JSON.stringify(resp.data));

            window.location.href = './turma.html';
        }
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.error || 'Usuário ou senha inválidos');
    }
});