# Chatbot para Salão de Beleza

Este é um chatbot simples desenvolvido para um salão de beleza, que ajuda a responder perguntas frequentes dos clientes.

## Funcionalidades

- Interface amigável e responsiva
- Respostas automáticas para perguntas comuns
- Botões de acesso rápido para perguntas frequentes
- Design moderno e atraente
- Cores personalizadas para o tema do salão
- Menu de opções após a saudação
- Botões de serviços e agendamento sempre visíveis

## Requisitos

Para executar o chatbot, você precisa ter instalado:

- Python 3.6 ou superior
- Flask
- SQLite3 (já vem com Python)

## Instalação

1. Clone este repositório ou baixe os arquivos
2. Instale as dependências:
```bash
pip install flask
```

## Como Executar

1. Navegue até a pasta do projeto
2. Execute o arquivo Python:
```bash
python salao_cabeleireiro.py
```
3. Abra seu navegador e acesse: http://localhost:5003

## Como Usar o Chatbot

1. Clique no ícone do chatbot no canto inferior direito da tela
2. Você verá três botões de acesso rápido:
   - Olá: Inicia a conversa e mostra o menu de opções
   - Serviços: Mostra os serviços oferecidos pelo salão
   - Agendamento: Informa como fazer um agendamento

3. Ao clicar em "Olá", além da saudação, aparecerá um menu com as seguintes opções:
   - Quais são os serviços oferecidos?
   - Qual o horário de funcionamento?
   - Vocês trabalham com cabelos afro?
   - Ajuda

4. Você também pode digitar suas perguntas diretamente no campo de texto

## Perguntas que o Chatbot Responde

- Olá
- Quais são os serviços oferecidos?
- Qual o horário de funcionamento?
- Como faço para agendar?
- Quais são os preços?
- Vocês trabalham com cabelos afro?
- Ajuda

## Personalização

Você pode personalizar o chatbot editando:

1. As respostas no banco de dados (função `init_db()`)
2. As cores e estilos no arquivo HTML (variável `HTML_TEMPLATE`)
3. Os botões de acesso rápido no HTML
4. As opções do menu após a saudação

## Suporte

Para adicionar novas perguntas e respostas, edite a lista `exemplos` na função `init_db()`.

## Licença

Este projeto está sob a licença MIT. 