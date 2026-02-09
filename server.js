const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Habilita conexões do seu HTML local
app.use(cors());
app.use(express.json());

// --- DADOS INICIAIS (Caso o arquivo não exista) ---
const initialData = [
    { id: 'C01', date: '09/02', type: 'Carrossel', title: 'BBB 26: O Paredão que ninguém quer', status: 'Pendente', 
      script: 'Slides:\n1. Capa: BBB 26 - o Paredão que ninguém quer\n2. Ficar doente e ter que cruzar a fronteira\n3. Você é estudante no PY? Isso é bem real\n4. Cansaço + plantão + prova = imunidade baixa\n5. A solução: atendimento online 24h no bolso\n6. Sem perrengue. Sem burocracia.\n7. Quer o acesso? Chama na DM: SAUDE', 
      caption: 'Se no BBB o Paredão é tensão, na vida real é cruzar a fronteira doente. A Cotech PY lança plataforma pra estudantes. Comenta SAUDE.' },
    { id: 'R01', date: '09/02', type: 'Reels', title: 'POV: Atendimento 24h na fronteira', status: 'Pendente', 
      script: 'Hook: POV: você tá no Paraguai e o corpo avisa na hora errada.\nCenas: 1. Cara de "não agora". 2. Olhando fronteira no Maps (desespero). 3. Abre app Cotech. 4. Alívio.\nCTA: Chama na DM: 24H', 
      caption: 'Aquele momento que você percebe que não precisa atravessar a ponte. #MedicinaPY' },
    { id: 'C11', date: '19/02', type: 'Carrossel', title: 'LANÇAMENTO OFICIAL PLATAFORMA', status: 'Agendado', 
      script: 'Slides:\n1. Chegou: a plataforma Cotech PY\n2. Feita pra estudantes BR de Medicina no PY\n3. Atendimento online quando precisar\n4. Sem atravessar fronteira p/ o básico\n5. Menos tempo perdido, mais foco\n6. Suporte pra seguir evoluindo\n7. Link na bio + DM: QUERO', 
      caption: 'É OFICIAL. Cotech PY lançou. Atendimento online do jeito certo. DM: QUERO.' },
    { id: 'S01', date: '19/02', type: 'Estático', title: 'Lançou. Simples assim. (Link Bio)', status: 'Agendado', 
      script: 'Texto Imagem: LANÇOU. Saúde no PY sem perrengue de fronteira. Link na bio.', 
      caption: 'Link na bio agora. Não deixa pra depois.' },
    { id: 'IC01', date: 'Setup', type: 'Institucional', title: 'Comece Aqui (Manifesto)', status: 'Produzido',
      script: '1. Comece Aqui.\n2. Estuda Med no PY?\n3. Saúde aperta = logística.\n4. Cotech facilita acesso.\n5. Atendimento online s/ burocracia.\n6. Menos perrengue, mais foco.\n7. DM QUERO.',
      caption: 'Comece por aqui. Entenda nosso manifesto.'}
];

// --- SISTEMA DE LOGIN ---
const USERS = {
    'clacaon': { pass: 'Casasantos1116', role: 'admin' },
    'cotech': { pass: 'cotech0902', role: 'client' }
};

// --- FUNÇÕES AUXILIARES ---
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- ROTAS DA API ---

// 1. Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS[username];
    
    if (user && user.pass === password) {
        res.json({ success: true, role: user.role, username: username });
    } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
});

// 2. Pegar Posts
app.get('/api/posts', (req, res) => {
    const data = readDB();
    // Ordenar naturalmente por ID (C01, C02...)
    const sorted = data.sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
    res.json(sorted);
});

// 3. Atualizar Status
app.post('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    let data = readDB();
    const itemIndex = data.findIndex(p => p.id === id);

    if (itemIndex > -1) {
        data[itemIndex].status = status;
        saveDB(data);
        res.json({ success: true, item: data[itemIndex] });
        console.log(`[ATUALIZADO] Post ${id} mudou para ${status}`);
    } else {
        res.status(404).json({ success: false, message: 'Post não encontrado' });
    }
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Cotech rodando em http://localhost:${PORT}`);
    console.log(`📂 Os dados serão salvos em: ${DB_FILE}`);
});