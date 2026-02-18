const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// CONFIGURAÇÕES PRIVADAS (Protegidas no servidor)
const TG_TOKEN = "8427077212:AAEiL_3_D_-fukuaR95V3FqoYYyHvdCHmEI"; //
const TG_CHAT_ID = "-1003355965894"; //
const LINK_CORRETORA = "https://track.deriv.com/_S_W1N_"; //

// Rota para processar notificações do Telegram
app.post('/api/telegram', async (req, res) => {
    const { mensagem, comBotao } = req.body;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TG_CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown'
    };

    if (comBotao) {
        payload.reply_markup = {
            inline_keyboard: [[{ text: "📲 ACESSAR CORRETORA", url: LINK_CORRETORA }]]
        };
    }

    try {
        await axios.post(url, payload);
        
        // Salva log de operações em um arquivo local
        const logMsg = `[${new Date().toLocaleString()}] ${mensagem}\n---\n`;
        fs.appendFileSync('historico_operacoes.txt', logMsg);
        
        res.status(200).send({ success: true });
    } catch (error) {
        console.error("Erro Telegram:", error.message);
        res.status(500).send({ error: "Falha no envio" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 SERVIDOR KCM ONLINE: http://localhost:${PORT}`);
    console.log(`🛡️  TOKENS PROTEGIDOS PELO BACK-END`);
    console.log(`======================================\n`);
});
