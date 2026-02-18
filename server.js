const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// CONFIGURAÇÕES EXTRAÍDAS DO SEU ARQUIVO
const TG_TOKEN = "8427077212:AAEiL_3_D_-fukuaR95V3FqoYYyHvdCHmEI"; //
const TG_CHAT_ID = "-1003355965894"; //
const LINK_CORRETORA = "https://track.deriv.com/_S_W1N_"; //

app.post('/api/telegram', async (req, res) => {
    const { mensagem, comBotao } = req.body;
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
    
    const payload = { 
        chat_id: TG_CHAT_ID, 
        text: mensagem, 
        parse_mode: 'Markdown' 
    };

    // Aqui o botão usa o link da corretora que estava no seu arquivo
    if (comBotao) {
        payload.reply_markup = { 
            inline_keyboard: [[{ text: "📲 ACESSAR CORRETORA", url: LINK_CORRETORA }]] 
        };
    }

    try {
        await axios.post(url, payload);
        res.sendStatus(200);
    } catch (e) { 
        res.sendStatus(500); 
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor KCM ativo na porta ${PORT}`));
