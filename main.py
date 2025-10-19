
import json
import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

# --- Configurações --- #
DATA_FILE = 'data.json'
STATIC_FOLDER = 'static'
TEMPLATE_FOLDER = 'templates'

app = Flask(__name__, static_folder=STATIC_FOLDER, template_folder=TEMPLATE_FOLDER)
CORS(app)

# --- Classe de Lógica de Negócios (MecanicaGoelzer) --- #
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
            'despesasGerais': [],
            'orcamentos': [],
            'movimentacoes_estoque': [],
            'logs': [],
            'contas_a_receber': []
        }
        self._carregar_dados()

    def _carregar_dados(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self._inicializar_dados_exemplo()
        print('✅ Dados carregados com sucesso!')

    def _salvar_dados(self):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=4, ensure_ascii=False)
        print('✅ Dados salvos com sucesso!')

    def _inicializar_dados_exemplo(self):
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

    def _get_next_id(self, entity_name):
        # Garante que a lista exista e não esteja vazia
        if not self.data.get(entity_name):
            return 1
        return max([item.get('id', 0) for item in self.data[entity_name]] + [0]) + 1

    def adicionar_item(self, entity_name, item):
        item['id'] = self._get_next_id(entity_name)
        self.data[entity_name].append(item)
        self._salvar_dados()
        return item

    def listar_itens(self, entity_name, filters=None):
        itens = self.data.get(entity_name, [])
        if filters:
            for key, value in filters.items():
                itens = [item for item in itens if str(item.get(key)) == str(value)]
        return itens

    def buscar_item_por_id(self, entity_name, item_id):
        for item in self.data.get(entity_name, []):
            if item.get('id') == item_id:
                return item
        return None

    def atualizar_item(self, entity_name, item_id, novos_dados):
        for i, item in enumerate(self.data.get(entity_name, [])):
            if item.get('id') == item_id:
                self.data[entity_name][i].update(novos_dados)
                self._salvar_dados()
                return self.data[entity_name][i]
        return None

    def remover_item(self, entity_name, item_id):
        initial_len = len(self.data.get(entity_name, []))
        self.data[entity_name] = [item for item in self.data.get(entity_name, []) if item.get('id') != item_id]
        if len(self.data[entity_name]) < initial_len:
            self._salvar_dados()
            return True
        return False

    def calcular_total_ordem(self, ordem_id):
        ordem = self.buscar_item_por_id('ordens', ordem_id)
        if not ordem:
            return 0.0

        total = 0.0
        for servico_id in ordem.get('servicos_ids', []):
            servico = self.buscar_item_por_id('servicos', servico_id)
            if servico:
                total += servico['valorMaoObra']
        
        for peca_info in ordem.get('pecas_usadas', []):
            peca = self.buscar_item_por_id('pecas', peca_info['peca_id'])
            if peca:
                total += peca['precoVenda'] * peca_info['quantidade']

        desconto = ordem.get('desconto', 0.0)
        total -= desconto

        return max(0.0, total)

    def atualizar_dashboard(self):
        total_clientes = len(self.data['clientes'])
        total_veiculos = len(self.data['veiculos'])
        os_abertas = len([os for os in self.data['ordens'] if os['status'] in ['Aberta', 'Em Execução']])

        hoje = datetime.now()
        mes_atual_str = hoje.strftime('%Y-%m')
        ano_atual_str = hoje.strftime('%Y')

        receita_mensal = 0.0
        despesa_mensal = 0.0

        for mov in self.data['movimentacoes']:
            if mov.get('data', '').startswith(mes_atual_str):
                if mov['tipo'] == 'receita':
                    receita_mensal += mov['valor']
                elif mov['tipo'] == 'despesa':
                    despesa_mensal += mov['valor']
        
        for despesa in self.data['despesasGerais']:
            if despesa.get('data', '').startswith(mes_atual_str):
                despesa_mensal += despesa['valor']

        lucro_mensal = receita_mensal - despesa_mensal

        dashboard_data = {
            'totalClientes': total_clientes,
            'totalVeiculos': total_veiculos,
            'osAbertas': os_abertas,
            'receitaMensal': receita_mensal,
            'despesaMensal': despesa_mensal,
            'lucroMensal': lucro_mensal
        }
        return dashboard_data

    def calcular_margem_lucro(self, peca_id):
        peca = self.buscar_item_por_id('pecas', peca_id)
        if not peca or peca.get('custoUnitario', 0) == 0:
            return 0.0

        custo = peca['custoUnitario']
        preco = peca['precoVenda']

        margem = ((preco - custo) / custo) * 100
        return margem
    
    def gerar_relatorio_financeiro_anual(self, ano):
        receita_anual = 0.0
        despesa_anual = 0.0

        for mov in self.data['movimentacoes']:
            if mov.get('data', '').startswith(str(ano)):
                if mov['tipo'] == 'receita':
                    receita_anual += mov['valor']
                elif mov['tipo'] == 'despesa':
                    despesa_anual += mov['valor']
        
        for despesa in self.data['despesasGerais']:
            if despesa.get('data', '').startswith(str(ano)):
                despesa_anual += despesa['valor']

        lucro_anual = receita_anual - despesa_anual

        relatorio = {
            'ano': ano,
            'receitaAnual': receita_anual,
            'despesaAnual': despesa_anual,
            'lucroAnual': lucro_anual
        }
        return relatorio

    def gerar_relatorio_financeiro_mensal(self, ano, mes):
        receita_mensal = 0.0
        despesa_mensal = 0.0
        mes_str = f"{ano}-{str(mes).zfill(2)}"

        for mov in self.data['movimentacoes']:
            if mov.get('data', '').startswith(mes_str):
                if mov['tipo'] == 'receita':
                    receita_mensal += mov['valor']
                elif mov['tipo'] == 'despesa':
                    despesa_mensal += mov['valor']
        
        for despesa in self.data['despesasGerais']:
            if despesa.get('data', '').startswith(mes_str):
                despesa_mensal += despesa['valor']

        lucro_mensal = receita_mensal - despesa_mensal

        relatorio = {
            'ano': ano,
            'mes': mes,
            'receitaMensal': receita_mensal,
            'despesaMensal': despesa_mensal,
            'lucroMensal': lucro_mensal
        }
        return relatorio

    def gerar_proximo_numero_os(self):
        ano_atual = datetime.now().year
        ordens_do_ano = [o for o in self.data['ordens'] if datetime.strptime(o['data_abertura'], '%Y-%m-%d').year == ano_atual]
        proximo_numero = len(ordens_do_ano) + 1
        return f"{ano_atual}-{str(proximo_numero).zfill(4)}"

    def gerar_proximo_numero_orcamento(self):
        ano_atual = datetime.now().year
        orcamentos_do_ano = [o for o in self.data['orcamentos'] if datetime.strptime(o['data_emissao'], '%Y-%m-%d').year == ano_atual]
        proximo_numero = len(orcamentos_do_ano) + 1
        return f"ORC-{ano_atual}-{str(proximo_numero).zfill(4)}"

    def registrar_log(self, acao, detalhes):
        log_entry = {
            'id': self._get_next_id('logs'),
            'timestamp': datetime.now().isoformat(),
            'acao': acao,
            'detalhes': detalhes
        }
        self.data['logs'].append(log_entry)
        self._salvar_dados()
        return log_entry

    def atualizar_estoque_automatico(self, ordem_id):
        ordem = self.buscar_item_por_id('ordens', ordem_id)
        if not ordem or not ordem.get('pecas_usadas'):
            return False
        
        for p_usada in ordem['pecas_usadas']:
            peca = self.buscar_item_por_id('pecas', p_usada['peca_id'])
            if peca:
                peca['quantidadeEstoque'] -= p_usada['quantidade']
                self.atualizar_item('pecas', peca['id'], peca)
                self.adicionar_item('movimentacoes_estoque', {
                    'peca_id': peca['id'],
                    'quantidade': p_usada['quantidade'],
                    'tipo': 'saida',
                    'motivo': f"OS {ordem_id}",
                    'timestamp': datetime.now().isoformat()
                })
        self._salvar_dados()
        return True

    def registrar_movimentacao_financeira(self, ordem_id, tipo):
        ordem = self.buscar_item_por_id('ordens', ordem_id)
        if not ordem:
            return False

        if tipo == 'receita':
            cliente = self.buscar_item_por_id('clientes', ordem['cliente_id'])
            self.adicionar_item('movimentacoes', {
                'tipo': 'receita',
                'descricao': f"OS {ordem['id']} - {cliente['nome'] if cliente else 'Cliente'}",
                'valor': ordem['valor_total'],
                'categoria': 'Serviços',
                'data': ordem.get('data_fechamento', datetime.now().isoformat().split('T')[0]),
                'ordem_id': ordem['id'],
                'forma_pagamento': ordem.get('forma_pagamento', 'Dinheiro')
            })
        elif tipo == 'despesa' and ordem.get('pecas_usadas'):
            for p_usada in ordem['pecas_usadas']:
                peca = self.buscar_item_por_id('pecas', p_usada['peca_id'])
                if peca:
                    self.adicionar_item('movimentacoes', {
                        'tipo': 'despesa',
                        'descricao': f"Peça: {peca['descricao']} - OS {ordem['id']}",
                        'valor': peca['custoUnitario'] * p_usada['quantidade'],
                        'categoria': 'Peças',
                        'data': ordem.get('data_fechamento', datetime.now().isoformat().split('T')[0]),
                        'ordem_id': ordem['id']
                    })
        self._salvar_dados()
        return True
    
    def adicionar_conta_receber(self, ordem_id):
        ordem = self.buscar_item_por_id('ordens', ordem_id)
        if not ordem or not ordem.get('forma_pagamento') or 'prazo' not in ordem['forma_pagamento'].lower():
            return False
        
        nova_conta = {
            'ordem_id': ordem['id'],
            'cliente_id': ordem['cliente_id'],
            'descricao': f"OS {ordem['id']}",
            'valor_total': ordem['valor_total'],
            'valor_pago': 0,
            'data_vencimento': (datetime.now() + timedelta(days=30)).isoformat().split('T')[0],
            'status': 'Pendente',
            'parcelas': []
        }
        return self.adicionar_item('contas_a_receber', nova_conta)

    def registrar_pagamento_conta(self, conta_id, valor_pago):
        conta = self.buscar_item_por_id('contas_a_receber', conta_id)
        if not conta:
            return False
        
        conta['valor_pago'] += valor_pago
        if conta['valor_pago'] >= conta['valor_total']:
            conta['status'] = 'Pago'
        else:
            conta['status'] = 'Parcial'
        
        conta['parcelas'].append({
            'valor': valor_pago,
            'data': datetime.now().isoformat().split('T')[0],
            'forma_pagamento': 'Dinheiro' # Assumindo dinheiro por enquanto
        })
        self.atualizar_item('contas_a_receber', conta_id, conta)
        return True

    def backup_data(self):
        return self.data

    def restore_data(self, backup_data):
        # Validação básica da estrutura do backup
        required_keys = ['clientes', 'veiculos', 'servicos', 'pecas', 'ordens']
        if not all(key in backup_data for key in required_keys):
            raise ValueError("Dados de backup inválidos: chaves essenciais faltando.")
        
        self.data.update(backup_data)
        self._salvar_dados()
        return True


# --- Instância da Lógica de Negócios --- #
sistema_mecanica = MecanicaGoelzer()

# --- Rotas do Frontend --- #
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# --- Rotas da API (CRUD Genérico) --- #
@app.route('/api/<entity_name>', methods=['GET'])
def listar_entidade(entity_name):
    filters = {k: v for k, v in request.args.items() if k not in ['mes', 'ano', 'data_abertura', 'servico_id']}
    
    # Filtros específicos para ordens
    if entity_name == 'ordens':
        if 'mes' in request.args and 'ano' in request.args:
            mes_str = f"{request.args['ano']}-{request.args['mes'].zfill(2)}"
            itens = [item for item in sistema_mecanica.data.get(entity_name, []) if item.get('data_abertura', '').startswith(mes_str)]
        elif 'ano' in request.args:
            ano_str = request.args['ano']
            itens = [item for item in sistema_mecanica.data.get(entity_name, []) if item.get('data_abertura', '').startswith(ano_str)]
        elif 'data_abertura' in request.args:
            data_str = request.args['data_abertura']
            itens = [item for item in sistema_mecanica.data.get(entity_name, []) if item.get('data_abertura', '') == data_str]
        elif 'servico_id' in request.args:
            servico_id = int(request.args['servico_id'])
            itens = [item for item in sistema_mecanica.data.get(entity_name, []) if servico_id in item.get('servicos_ids', [])]
        else:
            itens = sistema_mecanica.listar_itens(entity_name, filters)
    else:
        itens = sistema_mecanica.listar_itens(entity_name, filters)

    return jsonify(itens)

@app.route('/api/<entity_name>/<int:item_id>', methods=['GET'])
def buscar_entidade(entity_name, item_id):
    item = sistema_mecanica.buscar_item_por_id(entity_name, item_id)
    if item:
        return jsonify(item)
    return jsonify({'message': f'{entity_name.capitalize()} não encontrado'}), 404

@app.route('/api/<entity_name>', methods=['POST'])
def adicionar_entidade(entity_name):
    novo_item = request.json
    item_adicionado = sistema_mecanica.adicionar_item(entity_name, novo_item)
    return jsonify(item_adicionado), 201

@app.route('/api/<entity_name>/<int:item_id>', methods=['PUT'])
def atualizar_entidade(entity_name, item_id):
    dados_atualizados = request.json
    item_atualizado = sistema_mecanica.atualizar_item(entity_name, item_id, dados_atualizados)
    if item_atualizado:
        return jsonify(item_atualizado)
    return jsonify({'message': f'{entity_name.capitalize()} não encontrado'}), 404

@app.route('/api/<entity_name>/<int:item_id>', methods=['DELETE'])
def remover_entidade(entity_name, item_id):
    if sistema_mecanica.remover_item(entity_name, item_id):
        return jsonify({'message': f'{entity_name.capitalize()} removido com sucesso'}), 204
    return jsonify({'message': f'{entity_name.capitalize()} não encontrado'}), 404

# --- Rotas da API (Cálculos e Relatórios) --- #
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    data = sistema_mecanica.atualizar_dashboard()
    return jsonify(data)

@app.route('/api/ordens/<int:ordem_id>/total', methods=['GET'])
def get_total_ordem(ordem_id):
    total = sistema_mecanica.calcular_total_ordem(ordem_id)
    return jsonify({'total': total})

@app.route('/api/pecas/<int:peca_id>/margem-lucro', methods=['GET'])
def get_margem_lucro_peca(peca_id):
    margem = sistema_mecanica.calcular_margem_lucro(peca_id)
    return jsonify({'margemLucro': margem})

@app.route('/api/relatorios/financeiro-anual/<int:ano>', methods=['GET'])
def get_relatorio_financeiro_anual(ano):
    relatorio = sistema_mecanica.gerar_relatorio_financeiro_anual(ano)
    return jsonify(relatorio)

@app.route('/api/relatorios/financeiro-mensal/<int:ano>/<int:mes>', methods=['GET'])
def get_relatorio_financeiro_mensal(ano, mes):
    relatorio = sistema_mecanica.gerar_relatorio_financeiro_mensal(ano, mes)
    return jsonify(relatorio)

@app.route('/api/ordens/proximo_numero', methods=['GET'])
def get_proximo_numero_os():
    proximo_numero = sistema_mecanica.gerar_proximo_numero_os()
    return jsonify({'proximo_numero': proximo_numero})

@app.route('/api/orcamentos/proximo_numero', methods=['GET'])
def get_proximo_numero_orcamento():
    proximo_numero = sistema_mecanica.gerar_proximo_numero_orcamento()
    return jsonify({'proximo_numero': proximo_numero})

@app.route('/api/logs', methods=['POST'])
def add_log():
    log_data = request.json
    log_entry = sistema_mecanica.registrar_log(log_data.get('acao'), log_data.get('detalhes'))
    return jsonify(log_entry), 201

@app.route('/api/movimentacoes_estoque', methods=['POST'])
def add_movimentacao_estoque():
    data = request.json
    # A lógica de movimentação de estoque já está em atualizar_estoque_automatico
    # Este endpoint pode ser usado para movimentações manuais ou outras integrações
    mov = sistema_mecanica.adicionar_item('movimentacoes_estoque', data)
    return jsonify(mov), 201

@app.route('/api/ordens/<int:ordem_id>/atualizar_estoque', methods=['POST'])
def api_atualizar_estoque_automatico(ordem_id):
    if sistema_mecanica.atualizar_estoque_automatico(ordem_id):
        return jsonify({'message': 'Estoque atualizado com sucesso'}), 200
    return jsonify({'message': 'Erro ao atualizar estoque ou ordem não encontrada'}), 404

@app.route('/api/ordens/<int:ordem_id>/registrar_movimentacao_financeira/<string:tipo>', methods=['POST'])
def api_registrar_movimentacao_financeira(ordem_id, tipo):
    if sistema_mecanica.registrar_movimentacao_financeira(ordem_id, tipo):
        return jsonify({'message': f'Movimentação financeira de {tipo} registrada com sucesso'}), 200
    return jsonify({'message': 'Erro ao registrar movimentação financeira ou ordem não encontrada'}), 404

@app.route('/api/contas_a_receber', methods=['POST'])
def adicionar_conta_receber_api():
    data = request.json
    ordem_id = data.get('ordem_id')
    if ordem_id:
        conta = sistema_mecanica.adicionar_conta_receber(ordem_id)
        if conta:
            return jsonify(conta), 201
    return jsonify({'message': 'Erro ao adicionar conta a receber'}), 400

@app.route('/api/contas_a_receber/<int:conta_id>/pagar', methods=['POST'])
def registrar_pagamento_conta_api(conta_id):
    data = request.json
    valor_pago = data.get('valor_pago')
    if valor_pago is not None:
        if sistema_mecanica.registrar_pagamento_conta(conta_id, valor_pago):
            return jsonify({'message': 'Pagamento registrado com sucesso'}), 200
    return jsonify({'message': 'Erro ao registrar pagamento ou conta não encontrada'}), 400

@app.route('/api/backup', methods=['GET'])
def get_backup():
    backup_data = sistema_mecanica.backup_data()
    return jsonify(backup_data)

@app.route('/api/restore', methods=['POST'])
def post_restore():
    backup_data = request.json
    try:
        sistema_mecanica.restore_data(backup_data)
        return jsonify({'message': 'Dados restaurados com sucesso'}), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': f'Erro interno ao restaurar dados: {str(e)}'}), 500

# --- Execução do Servidor --- #
if __name__ == '__main__':
    from datetime import timedelta # Importar timedelta aqui para evitar circular import
    app.run(host='0.0.0.0', port=5000, debug=False)
