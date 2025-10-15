const professor = JSON.parse(localStorage.getItem('professor'));

if (!professor) {
    localStorage.removeItem('professor');
    window.location.href = 'login.html';
}

const btnSair = document.querySelector('.logout');
if (btnSair) {
    btnSair.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('professor');
        window.location.href = 'login.html';
    });
}