import os
import sqlite3
from flask import Flask, jsonify, request, render_template_string
from threading import Thread
from werkzeug.serving import make_server

# Inicializa o Flask
app = Flask(__name__)

# Caminho para o banco
BASE_DIR = os.getcwd()
DB_FILE = os.path.join(BASE_DIR, "chatbot_cabeleireiro.db")

# Criação e povoamento do banco de dados
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pergunta TEXT NOT NULL UNIQUE,
            resposta TEXT NOT NULL
        )
    ''')
    exemplos = [
        ("olá", "Olá! Bem-vindo(a) ao nosso salão! Como posso ajudar você hoje? 💇‍♀️"),
        ("quais são os serviços oferecidos?", """Oferecemos os seguintes serviços e preços:

💇‍♀️ CORTES:
• Corte Feminino - R$ 50,00
• Corte Masculino - R$ 30,00
• Corte Infantil - R$ 25,00

🎨 COLORAÇÃO:
• Coloração Simples - R$ 120,00
• Coloração com Luzes - R$ 180,00
• Retoque de Raiz - R$ 80,00
• Pintura Total - R$ 150,00

💆‍♀️ TRATAMENTOS:
• Hidratação Simples - R$ 60,00
• Hidratação Profunda - R$ 90,00
• Reconstrução Capilar - R$ 120,00
• Botox Capilar - R$ 150,00

✨ PENTEADOS:
• Escova Simples - R$ 40,00
• Escova Progressiva - R$ 180,00
• Escova Definitiva - R$ 200,00
• Chapinha - R$ 30,00

💅 UNHAS:
• Manicure - R$ 35,00
• Pedicure - R$ 35,00
• Unhas em Gel - R$ 80,00
• Unhas em Acrílico - R$ 100,00

* Preços podem variar de acordo com o comprimento e tipo do cabelo.
* Agende seu horário pelo WhatsApp (11) 99999-9999 💅"""),
        ("qual o horário de funcionamento?", "Nosso salão funciona de segunda a sábado, das 9h às 19h. Aos domingos estamos fechados."),
        ("como faço para agendar?", "Você pode agendar pelo WhatsApp (11) 99999-9999 ou diretamente em nosso salão. Também aceitamos agendamentos online pelo nosso site!"),
        ("quais são os preços?", "Nossos preços variam de acordo com o serviço. Corte feminino a partir de R$ 50,00, masculino R$ 30,00, coloração a partir de R$ 120,00. Entre em contato para mais informações!"),
        ("vocês trabalham com cabelos afro?", "Sim! Temos profissionais especializados em cabelos afro e oferecemos diversos tratamentos específicos para seu tipo de cabelo. ✨"),
        ("ajuda", "Claro! Pergunte algo ou clique em um dos botões para começar. Estou aqui para ajudar! 💇‍♀️"),
    ]
    for pergunta, resposta in exemplos:
        try:
            c.execute("INSERT INTO chat (pergunta, resposta) VALUES (?, ?)", (pergunta, resposta))
        except sqlite3.IntegrityError:
            continue
    conn.commit()
    conn.close()

init_db()

# HTML do site com o chatbot embutido
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Salão de Beleza - Seu Estilo, Nossa Paixão</title>
<style>
    body { font-family: 'Segoe UI', sans-serif; background: #fff5f5; margin: 0; }
    header, footer { background-color: #ff69b4; color: white; text-align: center; padding: 20px; }
    main { padding: 40px; max-width: 800px; margin: auto; }
    h1 { color: #ff69b4; }
    #chatbot-toggle {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 60px; height: 60px;
        border-radius: 50%;
        background: #ff69b4;
        display: flex; justify-content: center; align-items: center;
        cursor: pointer;
        z-index: 999;
    }
    #chatbot-toggle svg { width: 30px; height: 30px; fill: white; }

    #chatbot-box {
        position: fixed;
        bottom: 100px;
        right: 25px;
        width: 350px;
        max-height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
    }
    #chatbot-header {
        background: #ff69b4;
        color: white;
        padding: 12px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
    }
    #chat-log {
        padding: 10px;
        overflow-y: auto;
        flex-grow: 1;
        background: #fff5f5;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .message {
        max-width: 80%;
        padding: 10px;
        border-radius: 12px;
        font-size: 14px;
    }
    .user { align-self: flex-end; background: #ff69b4; color: white; }
    .bot { align-self: flex-start; background: #ffe4e1; }

    #input-area {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ccc;
        background: #fff;
    }
    #user-input {
        flex-grow: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 20px;
        font-size: 14px;
    }
    .send-btn {
        margin-left: 10px;
        padding: 8px 14px;
        background: #ff69b4;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
    }
    #quick-questions {
        padding: 8px;
        text-align: center;
    }
    #quick-questions button {
        margin: 5px;
        padding: 5px 10px;
        border-radius: 15px;
        border: none;
        background: #ff69b4;
        color: white;
        cursor: pointer;
        font-size: 13px;
    }
    #quick-questions button.end-chat {
        background: #ff4444;
    }
    .menu-options {
        display: none;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;
    }
    .menu-options button {
        width: 100%;
        text-align: left;
        padding: 8px 12px;
        background: #fff;
        border: 1px solid #ff69b4;
        border-radius: 8px;
        color: #ff69b4;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .menu-options button:hover {
        background: #ff69b4;
        color: white;
    }
    .menu-message button {
        margin: 0;
        padding: 10px 15px;
        border-radius: 25px;
        border: none;
        background: #FF69B4;
        color: white;
        cursor: pointer;
        font-size: 15px;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-bottom: 8px;
    }
    .menu-message button:hover {
        background: #D83A7E;
        transform: translateY(-2px);
    }
</style>
</head>
<body>

<header>Salão de Beleza - Seu Estilo, Nossa Paixão</header>
<main>
    <h1>Bem-vindo ao nosso Salão</h1>
    <p>Oferecemos os melhores serviços de beleza com profissionais qualificados e produtos de alta qualidade.</p>
    <p>Use o chatbot no canto inferior direito para tirar suas dúvidas!</p>
</main>
<footer>&copy; 2024 Salão de Beleza</footer>

<div id="chatbot-toggle" onclick="toggleChatbot()">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="#ff69b4"/>
        <rect x="18" y="24" width="8" height="8" rx="2" fill="#fff"/>
        <rect x="38" y="24" width="8" height="8" rx="2" fill="#fff"/>
    </svg>
</div>

<div id="chatbot-box">
    <div id="chatbot-header">
        Chatbot 💇‍♀️
        <button onclick="toggleChatbot()">×</button>
    </div>
    <div id="chat-log"></div>
    <div id="input-area">
        <input type="text" id="user-input" placeholder="Digite sua pergunta..." />
        <button class="send-btn" onclick="sendMessage()">Enviar</button>
    </div>
    <div id="quick-questions">
        <button onclick="sendQuick('olá')">Olá</button>
        <button onclick="sendQuick('quais são os serviços oferecidos?')">Serviços</button>
        <button onclick="sendQuick('como faço para agendar?')">Agendamento</button>
        <button onclick="endChat()">Encerrar Chat</button>
    </div>
</div>

<script>
    const chatbotBox = document.getElementById('chatbot-box');
    let lastMessage = '';

    function toggleChatbot() {
        chatbotBox.style.display = chatbotBox.style.display === 'flex' ? 'none' : 'flex';
    }

    function showMenuOptions() {
        const log = document.getElementById('chat-log');
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-options';
        menuDiv.style.display = 'flex';
        
        const menuOptions = [
            { text: 'Nossos Serviços', value: 'quais são os serviços oferecidos?' },
            { text: 'Horário de Funcionamento', value: 'qual o horário de funcionamento?' },
            { text: 'Como Agendar', value: 'como faço para agendar?' },
            { text: 'Cabelos Afro', value: 'vocês trabalham com cabelos afro?' },
            { text: 'Falar com o Salão', value: 'falar com o salão' },
        ];
        
        menuOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => sendQuick(option.value);
            menuDiv.appendChild(button);
        });
        
        log.appendChild(menuDiv);
        log.scrollTop = log.scrollHeight;
    }

    function sendMessage() {
        const input = document.getElementById('user-input');
        const msg = input.value.trim();
        if (!msg) return;

        appendMessage(msg, 'user');
        input.value = '';
        lastMessage = msg;

        fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pergunta: msg })
        })
        .then(res => res.json())
        .then(data => {
            appendMessage(data.resposta, 'bot');
            if (lastMessage.toLowerCase() === 'olá') {
                showMenuOptions();
            }
        });
    }

    function appendMessage(text, sender) {
        const log = document.getElementById('chat-log');
        const div = document.createElement('div');
        div.className = 'message ' + sender;
        div.innerText = text;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    }

    function sendQuick(msg) {
        document.getElementById('user-input').value = msg;
        sendMessage();
    }

    function endChat() {
        const log = document.getElementById('chat-log');
        log.innerHTML = '';
        appendMessage('Atendimento encerrado. Obrigado por conversar conosco! 👋', 'bot');
        setTimeout(() => {
            toggleChatbot();
        }, 2000);
    }
</script>

</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/chat', methods=['POST'])
def chat():
    pergunta = request.json.get("pergunta", "").lower().strip()
    resposta = "Desculpe, não entendi sua pergunta. 🤔"
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT resposta FROM chat WHERE LOWER(pergunta)=?", (pergunta,))
    row = c.fetchone()
    if row:
        resposta = row[0]
    conn.close()
    return jsonify({"resposta": resposta})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True) 