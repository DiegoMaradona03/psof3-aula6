const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const professor = await prisma.professor.findFirst({
            where: { email, senha }
        });

        if (!professor) {
            return res.status(400).json({ error: 'Usuário ou senha inválidos' });
        }
        return res.json(professor);
    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { login };