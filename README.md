# Mecânica Goelzer - Sistema de Gestão

Este é um sistema de gestão para oficinas mecânicas, refatorado para utilizar um backend em Python (Flask) e um frontend em HTML, CSS e JavaScript. O sistema permite gerenciar clientes, veículos, serviços, peças, agendamentos, ordens de serviço, finanças e relatórios.

## Funcionalidades Principais

*   **Gestão de Clientes e Veículos**: Cadastro, edição e exclusão.
*   **Gestão de Serviços e Peças**: Cadastro de itens com custos e preços de venda.
*   **Ordens de Serviço**: Criação, acompanhamento e cálculo de totais.
*   **Gestão Financeira**: Receitas, despesas, contas a receber e relatórios.
*   **Controle de Estoque**: Atualização automática de peças em ordens de serviço.
*   **Relatórios e Dashboard**: Visão geral do negócio e relatórios financeiros.
*   **Backup e Restauração**: Funcionalidades para salvar e carregar dados.

## Como Executar Localmente

Siga os passos abaixo para configurar e executar o sistema em seu computador.

### Pré-requisitos

Certifique-se de ter o Python 3.x e o `pip` (gerenciador de pacotes do Python) instalados em seu sistema.

### 1. Clonar o Repositório

Abra o terminal ou prompt de comando e clone o repositório do GitHub:

```bash
git clone https://github.com/TTreter/mecanica-goelzer.git
cd mecanica-goelzer
```

### 2. Instalar Dependências

Instale as bibliotecas Python necessárias (Flask e Flask-CORS):

```bash
pip install Flask Flask-CORS
```

### 3. Executar o Sistema

Execute o script principal do Python. Isso iniciará o servidor web Flask, que servirá tanto o frontend quanto o backend da aplicação:

```bash
python3 main.py
```

**Observação:** O sistema agora está configurado para que a navegação entre as seções (Clientes, Veículos, etc.) seja feita corretamente.

### 4. Acessar a Aplicação

Abra seu navegador web e acesse o endereço:

[http://127.0.0.1:5000/](http://127.0.0.1:5000/)

Você verá a interface do sistema Mecânica Goelzer. Todos os dados serão persistidos localmente em um arquivo `data.json` na mesma pasta do `main.py`.

## Estrutura do Projeto

*   `main.py`: Contém a lógica do backend (Flask) e as APIs, além de servir os arquivos estáticos do frontend.
*   `data.json`: Arquivo JSON onde todos os dados do sistema são armazenados.
*   `templates/`: Contém os arquivos HTML do frontend (ex: `index.html`).
*   `static/`: Contém os arquivos CSS, JavaScript e imagens do frontend.
    *   `static/app.js`: Lógica principal do frontend, adaptada para consumir as APIs do backend e gerenciar a navegação.
    *   Outros arquivos `.js`: Scripts específicos para diferentes funcionalidades (cálculos, edição, exportação, etc.).
    *   `static/styles.css`: Estilos CSS da aplicação.

## Observações

*   O sistema inicia com alguns dados de exemplo (peças e serviços) se o arquivo `data.json` não existir.
*   O modo `debug=False` foi definido para evitar reinícios inesperados do servidor durante o uso. Para desenvolvimento, você pode alterar para `debug=True` no `main.py`.
*   O sistema foi projetado para uso local e persistência de dados em arquivo. Para ambientes de produção ou multiusuário, seria necessário integrar um banco de dados e um sistema de autenticação mais robusto.

