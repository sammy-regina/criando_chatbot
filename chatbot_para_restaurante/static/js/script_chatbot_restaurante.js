document.addEventListener('DOMContentLoaded', function() {
    // Garante que o código JavaScript seja executado somente após o carregamento completo da estrutura HTML (DOM - Document Object Model).
    // Isso é importante para evitar erros ao tentar acessar elementos HTML que ainda não foram carregados.

    const chatbotIconFlutuante = document.querySelector('.chatbot-icon');
    // Seleciona o primeiro elemento HTML com a classe 'chatbot-icon' e armazena na constante 'chatbotIconFlutuante'.
    // Este é o ícone flutuante que o usuário clica para interagir com o chatbot.

    const chatbotDialog = document.querySelector('.chatbot-dialog');
    // Seleciona o primeiro elemento HTML com a classe 'chatbot-dialog' e armazena na constante 'chatbotDialog'.
    // Esta é a caixa de diálogo do chatbot, onde as mensagens são exibidas.

    const chatLog = document.querySelector('.chat-log');
    // Seleciona o primeiro elemento HTML com a classe 'chat-log' e armazena na constante 'chatLog'.
    // Este é o elemento dentro da caixa de diálogo que contém o histórico da conversa.

    const userInput = document.getElementById('user-input');
    // Seleciona o elemento HTML com o ID 'user-input' e armazena na constante 'userInput'.
    // Este é o campo de entrada de texto onde o usuário digita suas mensagens.

    const sendButton = document.getElementById('send-button');
    // Seleciona o elemento HTML com o ID 'send-button' e armazena na constante 'sendButton'.
    // Este é o botão que o usuário clica para enviar sua mensagem.

    const closeChatbotButton = document.getElementById('close-chatbot-button');
    // Seleciona o elemento HTML com o ID 'close-chatbot-button' e armazena na constante 'closeChatbotButton'.
    // Este é o botão que o usuário clica para fechar a caixa de diálogo do chatbot.

    const dataHoraAberturaDiv = document.getElementById('data-hora-abertura');
    // Seleciona o elemento HTML com o ID 'data-hora-abertura' e armazena na constante 'dataHoraAberturaDiv'.
    // Este é o elemento onde a data e a hora em que o chat foi aberto são exibidas.

    // Define o horário de funcionamento do restaurante para cada dia da semana.
    // As horas são representadas em formato de 24 horas (ex: 10 para 10:00, 23 para 23:00).
    const horarioFuncionamento = {
        segunda: { abre: 10, fecha: 23 },
        terca: { abre: 10, fecha: 23 },
        quarta: { abre: 10, fecha: 23 },
        quinta: { abre: 10, fecha: 23 },
        sexta: { abre: 10, fecha: 23 },
        sabado: { abre: 10, fecha: 23 },
        domingo: { abre: 10, fecha: 14 }
    };

    // Array com os nomes dos dias da semana em português, na ordem em que são retornados pelo método `getDay()` do objeto Date (0 para Domingo, 1 para Segunda, etc.).
    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

    // Função para formatar a data e a hora no formato desejado para exibição.
    function formatarDataHora() {
        const agora = new Date(); // Cria um novo objeto Date com a data e hora atuais.
        const data = agora.toLocaleDateString(); // Obtém a data formatada de acordo com as convenções locais (ex: DD/MM/AAAA no Brasil).
        const hora = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtém a hora formatada com horas e minutos, garantindo que tenham dois dígitos (ex: 09:05).
        return `${data} às ${hora}`; // Retorna uma string que combina a data e a hora formatadas (ex: "10/05/2024 às 15:30").
    }

    // Função para verificar se o restaurante está aberto no momento atual.
    function restauranteAberto() {
        const agora = new Date(); // Obtém a data e hora atuais.
        const diaSemana = diasSemana[agora.getDay()]; // Obtém o nome do dia da semana atual usando o índice retornado por `getDay()` (0-6).
        const horaAtual = agora.getHours(); // Obtém a hora atual (0-23).
        const minutoAtual = agora.getMinutes(); // Obtém os minutos atuais (0-59).
        const horaDecimalAtual = horaAtual + minutoAtual / 60; // Converte a hora e os minutos para um formato decimal (ex: 10:30 se torna 10.5) para facilitar a comparação.

        // Verifica se o dia da semana atual está presente no objeto `horarioFuncionamento`.
        if (horarioFuncionamento.hasOwnProperty(diaSemana)) {
            const horarioDia = horarioFuncionamento[diaSemana]; // Obtém o horário de funcionamento para o dia atual.
            return horaDecimalAtual >= horarioDia.abre && horaDecimalAtual < horarioDia.fecha; // Retorna `true` se a hora atual estiver dentro do horário de abertura e fechamento, `false` caso contrário.
        } else {
            return false; // Se o dia da semana não estiver definido no objeto (o que seria inesperado, ou poderia representar um feriado), retorna `false` (fechado).
        }
    }

    // Função para exibir a mensagem de horário de funcionamento quando o restaurante está fechado.
    function exibirMensagemHorario() {
        let mensagem = `No momento estamos fechados, nosso horário de funcionamento é:\n`; // Inicia a string da mensagem.
        mensagem += `<ul>`; // Inicia uma lista não ordenada (<ul>) para formatar o horário de cada dia.
        mensagem += `<li>Segunda-feira: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de segunda-feira como um item da lista (<li>).
        mensagem += `<li>Terça-feira: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de terça-feira.
        mensagem += `<li>Quarta-feira: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de quarta-feira.
        mensagem += `<li>Quinta-feira: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de quinta-feira.
        mensagem += `<li>Sexta-feira: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de sexta-feira.
        mensagem += `<li>Sábado: das 10:00 às 23:00 horas</li>`; // Adiciona o horário de sábado.
        mensagem += `<li>Domingo: das 10:00 às 14:00 horas</li>`; // Adiciona o horário de domingo.
        mensagem += `</ul>`; // Fecha a lista não ordenada.
        mensagem += `Não temos atendimento aos feriados.<br><br>Obrigada pela compreensão.<br>Volte sempre.`; // Adiciona a mensagem final. `<br>` insere uma quebra de linha.
        adicionarMensagem(mensagem); // Chama a função `adicionarMensagem` para exibir a mensagem no chat.
    }

    // Função para adicionar uma mensagem à área de exibição do chat (chat log).
    function adicionarMensagem(mensagem, isUsuario = false) {
        const mensagemDiv = document.createElement('div'); // Cria um novo elemento <div> para conter a mensagem.
        mensagemDiv.classList.add(isUsuario ? 'user-message' : 'chatbot-message'); // Adiciona uma classe à div para estilizar a mensagem (diferente para usuário e chatbot).
        mensagemDiv.innerHTML = mensagem; // Define o conteúdo HTML da div com a mensagem. Usar `innerHTML` permite renderizar HTML (como a lista do horário de funcionamento).
        chatLog.appendChild(mensagemDiv); // Adiciona a div da mensagem ao final da área de exibição do chat.
        chatLog.scrollTop = chatLog.scrollHeight; // Faz com que a barra de rolagem da área de exibição do chat role para baixo, mostrando a mensagem mais recente.
    }

    // Evento que é disparado quando o usuário clica no ícone flutuante do chatbot.
    chatbotIconFlutuante.addEventListener('click', function() {
        const dataHoraAtual = formatarDataHora(); // Obtém a data e hora atuais formatadas.
        dataHoraAberturaDiv.textContent = `Aberto em ${dataHoraAtual}`; // Exibe a data e hora de abertura no elemento correspondente.
        chatbotDialog.classList.add('active'); // Adiciona a classe 'active' à caixa de diálogo para torná-la visível (controlado por CSS).
        chatbotIconFlutuante.style.display = 'none'; // Oculta o ícone flutuante.
        chatbotIconFlutuante.style.animationPlayState = 'paused'; // Pausa qualquer animação que esteja rodando no ícone flutuante.

        // Verifica se o restaurante está aberto no momento atual.
        if (restauranteAberto()) {
            adicionarMensagem("Digite o número da opção desejada:\n1. Ver Cardápio\n2. Fazer um Pedido\n3. Ver Promoções"); // Se estiver aberto, exibe a mensagem de boas-vindas e o menu de opções.
        } else {
            exibirMensagemHorario(); // Se estiver fechado, exibe a mensagem de horário de funcionamento.
        }
    });

    // Evento que é disparado quando o usuário clica no botão para fechar a caixa de diálogo do chatbot.
    closeChatbotButton.addEventListener('click', function() {
        chatbotDialog.classList.remove('active'); // Remove a classe 'active' da caixa de diálogo para ocultá-la.
        dataHoraAberturaDiv.textContent = ''; // Limpa o conteúdo do elemento de data e hora de abertura.
        chatbotIconFlutuante.style.display = 'flex'; // Exibe novamente o ícone flutuante.
        chatbotIconFlutuante.style.animationPlayState = 'running'; // Reinicia qualquer animação que estava rodando no ícone flutuante (opcional, pode ser removido se não quiser reanimar ao fechar).
    });

    // Função para enviar a mensagem digitada pelo usuário para o servidor (Flask).
    function enviarMensagem() {
        const mensagem = userInput.value.trim(); // Obtém o texto do campo de entrada, removendo espaços em branco no início e no final.
        if (mensagem) { // Verifica se a mensagem não está vazia.
            adicionarMensagem(mensagem, true); // Adiciona a mensagem do usuário à área de exibição do chat, marcando-a como mensagem do usuário.
            userInput.value = ''; // Limpa o campo de entrada de texto.

            fetch('/chatbot', { // Faz uma requisição HTTP POST para a rota '/chatbot' no servidor.
                method: 'POST', // Especifica o método HTTP como POST (para enviar dados).
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Define o cabeçalho para indicar que os dados estão sendo enviados como um formulário.
                },
                body: `mensagem=${encodeURIComponent(mensagem)}`, // Codifica a mensagem para que possa ser enviada na URL (substitui caracteres especiais).
            })
            .then(response => response.json()) // Quando a resposta do servidor chega, converte-a para JSON.
            .then(data => {
                adicionarMensagem(data.resposta); // Exibe a resposta do chatbot na área de exibição do chat.
            })
            .catch(error => { // Se ocorrer um erro durante a requisição, exibe uma mensagem de erro.
                console.error('Erro ao enviar mensagem para o chatbot:', error);
                adicionarMensagem('Desculpe, ocorreu um erro ao processar sua mensagem.');
            });
        }
    }

    // Evento que é disparado quando o usuário clica no botão de enviar mensagem.
    sendButton.addEventListener('click', enviarMensagem);
    // Quando o botão de enviar for clicado, a função 'enviarMensagem' será executada.

    // Evento que é disparado quando o usuário pressiona uma tecla no campo de entrada de mensagem.
    userInput.addEventListener('keypress', function(event) {
        // Adiciona um listener de evento para a tecla pressionada no campo de entrada.
        if (event.key === 'Enter') { // Verifica se a tecla pressionada foi a tecla 'Enter'.
            enviarMensagem(); // Se foi 'Enter', a função 'enviarMensagem' é executada, enviando a mensagem do usuário.
        }
    });
});