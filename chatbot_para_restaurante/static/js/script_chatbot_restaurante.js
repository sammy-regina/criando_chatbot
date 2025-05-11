document.addEventListener('DOMContentLoaded', function() {
    const chatbotIconFlutuante = document.querySelector('.chatbot-icon');
    const chatbotDialog = document.querySelector('.chatbot-dialog');
    const closeChatbotButton = document.getElementById('close-chatbot-button');

    // Função para alternar a visibilidade do diálogo do chatbot e controlar a visibilidade do ícone flutuante
    chatbotIconFlutuante.addEventListener('click', function() {
        chatbotDialog.classList.toggle('active');
        chatbotIconFlutuante.style.display = 'none'; // Oculta o ícone flutuante ao abrir
        chatbotIconFlutuante.style.animationPlayState = 'paused'; // Pausa a animação ao clicar
    });

    // Evento de clique no botão de fechar
    closeChatbotButton.addEventListener('click', function() {
        chatbotDialog.classList.remove('active'); // Remove a classe 'active' para ocultar o chat
        chatbotIconFlutuante.style.display = 'flex'; // Exibe o ícone flutuante ao fechar
        chatbotIconFlutuante.style.animationPlayState = 'running'; // Reinicia a animação ao fechar (opcional)
    });

    // Função para adicionar uma mensagem ao chat log
    function adicionarMensagem(mensagem, isUsuario = false) {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.classList.add(isUsuario ? 'user-message' : 'chatbot-message');
        mensagemDiv.textContent = mensagem;
        chatLog.appendChild(mensagemDiv);
        chatLog.scrollTop = chatLog.scrollHeight; // Mantém a última mensagem visível
    }

    // Função para enviar a mensagem do usuário para o servidor Flask
    function enviarMensagem() {
        const mensagem = userInput.value.trim();
        if (mensagem) {
            adicionarMensagem(mensagem, true); // Adiciona a mensagem do usuário ao chat
            userInput.value = ''; // Limpa o campo de entrada

            // Envia a mensagem para o servidor Flask usando fetch API
            fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `mensagem=${encodeURIComponent(mensagem)}`,
            })
            .then(response => response.json())
            .then(data => {
                adicionarMensagem(data.resposta); // Adiciona a resposta do chatbot ao chat
            })
            .catch(error => {
                console.error('Erro ao enviar mensagem para o chatbot:', error);
                adicionarMensagem('Desculpe, ocorreu um erro ao processar sua mensagem.');
            });
        }
    }

    // Evento de clique no botão de enviar
    sendButton.addEventListener('click', enviarMensagem);

    // Evento de pressionar Enter no campo de entrada
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            enviarMensagem();
        }
    });
});