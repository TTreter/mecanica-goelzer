# Mecânica Goelzer - Sistema de Gestão (Python)

Este é um sistema de gestão simplificado para uma oficina mecânica, refatorado do JavaScript original para Python. Ele gerencia clientes, veículos, serviços, peças, agendamentos, ordens de serviço, compras, movimentações financeiras e despesas gerais.

## Funcionalidades

- **Gestão de Clientes**: Adicionar, listar, buscar, atualizar e remover clientes.
- **Gestão de Veículos**: Adicionar, listar, buscar, atualizar e remover veículos, associados a clientes.
- **Gestão de Serviços**: Catálogo de serviços com descrição, categoria, valor de mão de obra e tempo estimado.
- **Gestão de Peças**: Catálogo de peças com código, descrição, fornecedor, custo, preço de venda, quantidade em estoque e estoque mínimo.
- **Gestão de Ordens de Serviço (OS)**: Criação de OS com serviços e peças, cálculo automático do total.
- **Gestão Financeira**: Registro de receitas, despesas e despesas gerais.
- **Dashboard**: Exibição de totais de clientes, veículos, OS abertas, receita, despesa e lucro mensal.
- **Cálculos**: Cálculo de total de OS e margem de lucro de peças.
- **Relatórios**: Geração de relatórios financeiros anuais.
- **Persistência de Dados**: Os dados são salvos e carregados de um arquivo `data.json`.

## Como Executar

1.  **Pré-requisitos**:
    *   Python 3.x instalado.

2.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/mecanica-goelzer.git
    cd mecanica-goelzer
    ```

3.  **Execute o script**:
    ```bash
    python3 main.py
    ```

    Ao executar o script, ele irá:
    *   Carregar os dados existentes do `data.json` ou inicializar com dados de exemplo se o arquivo não existir.
    *   Demonstrar a adição de clientes e veículos.
    *   Demonstrar a criação de uma ordem de serviço.
    *   Demonstrar a adição de movimentações financeiras.
    *   Calcular e exibir o total de uma ordem de serviço.
    *   Atualizar e exibir os dados do dashboard.
    *   Calcular e exibir a margem de lucro de uma peça.
    *   Gerar e exibir um relatório financeiro anual.
    *   Demonstrar a atualização de um cliente.

## Estrutura do Projeto

-   `main.py`: O script principal que contém a lógica do sistema, classes e funções.
-   `data.json`: Arquivo onde os dados do sistema são persistidos em formato JSON.
-   `README.md`: Este arquivo, explicando o projeto e como executá-lo.

## Observações

Este sistema é uma refatoração do sistema original em JavaScript e foi adaptado para ser executado como um script Python de linha de comando. A interface gráfica do usuário (GUI) presente na versão JavaScript não foi replicada aqui, focando na lógica de negócios e persistência de dados.

