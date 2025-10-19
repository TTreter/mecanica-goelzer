
import json
import os
from datetime import datetime

DATA_FILE = 'data.json'

class MecanicaGoelzer:
    def __init__(self):
        self.data = {
            'clientes': [],
            'veiculos': [],
            'servicos': [],
            'pecas': [],
            'ferramentas': [],
            'agendamentos': [],
            'ordens': [],
            'compras': [],
            'movimentacoes': [],
            'despesasGerais': []
        }
        self._carregar_dados()

    def _carregar_dados(self):
        # Carrega os dados do arquivo JSON, simulando o localStorage
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self._inicializar_dados_exemplo()
        print('✅ Dados carregados com sucesso!')

    def _salvar_dados(self):
        # Salva os dados no arquivo JSON
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=4, ensure_ascii=False)
        print('✅ Dados salvos com sucesso!')

    def _inicializar_dados_exemplo(self):
        # Inicializa com dados de exemplo se o arquivo não existir
        self.data['servicos'] = [
            {'id': 1, 'descricao': 'Troca de Óleo', 'categoria': 'Manutenção', 'valorMaoObra': 50.00, 'tempoEstimado': '30 min'},
            {'id': 2, 'descricao': 'Alinhamento', 'categoria': 'Suspensão', 'valorMaoObra': 80.00, 'tempoEstimado': '1 hora'},
            {'id': 3, 'descricao': 'Balanceamento', 'categoria': 'Suspensão', 'valorMaoObra': 60.00, 'tempoEstimado': '45 min'},
            {'id': 4, 'descricao': 'Troca de Pastilhas de Freio', 'categoria': 'Freios', 'valorMaoObra': 120.00, 'tempoEstimado': '1.5 horas'},
            {'id': 5, 'descricao': 'Revisão Completa', 'categoria': 'Manutenção', 'valorMaoObra': 200.00, 'tempoEstimado': '3 horas'}
        ]
        self.data['pecas'] = [
            {'id': 1, 'codigo': 'P001', 'descricao': 'Óleo 5W30', 'fornecedor': 'Petrobras', 'custoUnitario': 25.00, 'precoVenda': 45.00, 'quantidadeEstoque': 50, 'estoqueMinimo': 10},
            {'id': 2, 'codigo': 'P002', 'descricao': 'Filtro de Óleo', 'fornecedor': 'Mann', 'custoUnitario': 15.00, 'precoVenda': 30.00, 'quantidadeEstoque': 30, 'estoqueMinimo': 5},
            {'id': 3, 'codigo': 'P003', 'descricao': 'Pastilha de Freio', 'fornecedor': 'Bosch', 'custoUnitario': 80.00, 'precoVenda': 150.00, 'quantidadeEstoque': 20, 'estoqueMinimo': 5},
            {'id': 4, 'codigo': 'P004', 'descricao': 'Disco de Freio', 'fornecedor': 'Bosch', 'custoUnitario': 120.00, 'precoVenda': 220.00, 'quantidadeEstoque': 15, 'estoqueMinimo': 3}
        ]
        self._salvar_dados()

    # ========== CRUD Genérico ==========
    def _get_next_id(self, entity_name):
        # Retorna o próximo ID disponível para uma entidade
        return max([item['id'] for item in self.data[entity_name]] + [0]) + 1

    def adicionar_item(self, entity_name, item):
        item['id'] = self._get_next_id(entity_name)
        self.data[entity_name].append(item)
        self._salvar_dados()
        print(f'✅ {entity_name.capitalize()} adicionado(a) com sucesso!')

    def listar_itens(self, entity_name):
        # Lista todos os itens de uma entidade
        return self.data[entity_name]

    def buscar_item_por_id(self, entity_name, item_id):
        # Busca um item pelo ID
        for item in self.data[entity_name]:
            if item['id'] == item_id:
                return item
        return None

    def atualizar_item(self, entity_name, item_id, novos_dados):
        # Atualiza um item existente
        for i, item in enumerate(self.data[entity_name]):
            if item['id'] == item_id:
                self.data[entity_name][i].update(novos_dados)
                self._salvar_dados()
                print(f'✅ {entity_name.capitalize()} atualizado(a) com sucesso!')
                return True
        print(f'❌ {entity_name.capitalize()} com ID {item_id} não encontrado(a).')
        return False

    def remover_item(self, entity_name, item_id):
        # Remove um item
        self.data[entity_name] = [item for item in self.data[entity_name] if item['id'] != item_id]
        self._salvar_dados()
        print(f'✅ {entity_name.capitalize()} com ID {item_id} removido(a) com sucesso!')

    # ========== Funções Específicas de Cálculos ==========
    def calcular_total_ordem(self, ordem_id):
        # Calcula o total de uma ordem de serviço específica
        ordem = self.buscar_item_por_id('ordens', ordem_id)
        if not ordem:
            return 0.0

        total = 0.0
        # Somar serviços
        for servico_id in ordem.get('servicos_ids', []):
            servico = self.buscar_item_por_id('servicos', servico_id)
            if servico:
                total += servico['valorMaoObra']
        
        # Somar peças
        for peca_info in ordem.get('pecas_usadas', []):
            peca = self.buscar_item_por_id('pecas', peca_info['id'])
            if peca:
                total += peca['precoVenda'] * peca_info['quantidade']

        # Subtrair desconto
        desconto = ordem.get('desconto', 0.0)
        total -= desconto

        return max(0.0, total)

    def atualizar_dashboard(self):
        # Simula a atualização do dashboard com dados financeiros e de contagem
        print('📊 Atualizando dashboard...')

        total_clientes = len(self.data['clientes'])
        total_veiculos = len(self.data['veiculos'])
        os_abertas = len([os for os in self.data['ordens'] if os['status'] in ['Aberta', 'Em Execução']])

        mes_atual = datetime.now().strftime('%Y-%m')
        receita_mes = 0.0
        despesa_mes = 0.0

        for mov in self.data['movimentacoes']:
            if mov['data'].startswith(mes_atual):
                if mov['tipo'] == 'receita':
                    receita_mes += mov['valor']
                elif mov['tipo'] == 'despesa':
                    despesa_mes += mov['valor']
        
        # Adiciona despesas gerais
        for despesa in self.data['despesasGerais']:
            if despesa['data'].startswith(mes_atual):
                despesa_mes += despesa['valor']

        lucro_mes = receita_mes - despesa_mes

        dashboard_data = {
            'totalClientes': total_clientes,
            'totalVeiculos': total_veiculos,
            'osAbertas': os_abertas,
            'receitaMensal': receita_mes,
            'despesaMensal': despesa_mes,
            'lucroMensal': lucro_mes
        }

        print('✅ Dashboard atualizado!')
        print(f"   Clientes: {total_clientes}")
        print(f"   Veículos: {total_veiculos}")
        print(f"   OS Abertas: {os_abertas}")
        print(f"   Receita: R$ {receita_mes:.2f}")
        print(f"   Despesa: R$ {despesa_mes:.2f}")
        print(f"   Lucro: R$ {lucro_mes:.2f}")
        return dashboard_data

    def calcular_margem_lucro(self, peca_id):
        # Calcula a margem de lucro de uma peça
        peca = self.buscar_item_por_id('pecas', peca_id)
        if not peca or peca['custoUnitario'] == 0:
            return 0.0

        custo = peca['custoUnitario']
        preco = peca['precoVenda']

        margem = ((preco - custo) / custo) * 100
        return margem

    # ========== Funções de Relatórios (Exemplo) ==========
    def gerar_relatorio_financeiro_anual(self, ano):
        # Gera um relatório financeiro anual simples
        print(f'📈 Gerando relatório financeiro para o ano {ano}...')
        receita_anual = 0.0
        despesa_anual = 0.0

        for mov in self.data['movimentacoes']:
            if mov['data'].startswith(str(ano)):
                if mov['tipo'] == 'receita':
                    receita_anual += mov['valor']
                elif mov['tipo'] == 'despesa':
                    despesa_anual += mov['valor']
        
        for despesa in self.data['despesasGerais']:
            if despesa['data'].startswith(str(ano)):
                despesa_anual += despesa['valor']

        lucro_anual = receita_anual - despesa_anual

        relatorio = {
            'ano': ano,
            'receitaAnual': receita_anual,
            'despesaAnual': despesa_anual,
            'lucroAnual': lucro_anual
        }
        print(f'✅ Relatório financeiro anual para {ano} gerado.')
        return relatorio


# Exemplo de uso (simulando a execução do script)
if __name__ == "__main__":
    sistema = MecanicaGoelzer()
    print("\n--- Exemplo de Uso do Sistema ---")

    # Adicionar um cliente
    sistema.adicionar_item('clientes', {'nome': 'João Silva', 'cpfCnpj': '123.456.789-00', 'telefone': '9999-8888', 'email': 'joao@example.com'})
    sistema.adicionar_item('clientes', {'nome': 'Maria Souza', 'cpfCnpj': '987.654.321-00', 'telefone': '7777-6666', 'email': 'maria@example.com'})

    # Listar clientes
    print("\nClientes:", sistema.listar_itens('clientes'))

    # Adicionar um veículo para João Silva (assumindo ID 1 para João)
    joao = sistema.buscar_item_por_id('clientes', 1)
    if joao:
        sistema.adicionar_item('veiculos', {'cliente_id': joao['id'], 'placa': 'ABC-1234', 'marca': 'Fiat', 'modelo': 'Uno', 'ano': 2010, 'km': 150000})

    # Adicionar uma ordem de serviço
    sistema.adicionar_item('ordens', {
        'cliente_id': 1,
        'veiculo_id': 1,
        'data_abertura': datetime.now().strftime('%Y-%m-%d'),
        'status': 'Aberta',
        'servicos_ids': [1, 2], # Troca de Óleo, Alinhamento
        'pecas_usadas': [{'id': 1, 'quantidade': 1}], # Óleo 5W30
        'desconto': 5.00
    })

    # Adicionar movimentações financeiras
    sistema.adicionar_item('movimentacoes', {'data': datetime.now().strftime('%Y-%m-%d'), 'tipo': 'receita', 'valor': 300.00, 'descricao': 'Pagamento OS 1'})
    sistema.adicionar_item('movimentacoes', {'data': datetime.now().strftime('%Y-%m-%d'), 'tipo': 'despesa', 'valor': 120.00, 'descricao': 'Aluguel'})
    sistema.adicionar_item('despesasGerais', {'data': datetime.now().strftime('%Y-%m-%d'), 'valor': 50.00, 'descricao': 'Material de Limpeza'})

    # Calcular total da ordem de serviço (assumindo ID 1 para a OS)
    total_os = sistema.calcular_total_ordem(1)
    print(f"\nTotal da Ordem de Serviço 1: R$ {total_os:.2f}")

    # Atualizar e exibir dashboard
    dashboard = sistema.atualizar_dashboard()
    print("\nDados do Dashboard:", dashboard)

    # Calcular margem de lucro de uma peça (assumindo ID 1 para Óleo 5W30)
    margem_peca = sistema.calcular_margem_lucro(1)
    print(f"\nMargem de Lucro da Peça 1: {margem_peca:.2f}%")

    # Gerar relatório financeiro anual
    relatorio_anual = sistema.gerar_relatorio_financeiro_anual(datetime.now().year)
    print("\nRelatório Financeiro Anual:", relatorio_anual)

    # Exemplo de atualização de cliente
    sistema.atualizar_item('clientes', 1, {'email': 'joao.silva@example.com'})
    print("\nClientes após atualização:", sistema.listar_itens('clientes'))

    # Exemplo de remoção de cliente
    # sistema.remover_item('clientes', 2)
    # print("\nClientes após remoção:", sistema.listar_itens('clientes'))


