// ========== SISTEMA DE NOTIFICAÇÕES TOAST ==========
// Versão 1.0 - Notificações profissionais
// Este arquivo não precisa de adaptação para a API, pois ele lida apenas com a exibição de notificações no frontend.

console.log('📢 Sistema de notificações carregado!');

// Função principal de notificação
window.mostrarNotificacao = function(mensagem, tipo = 'success', duracao = 3000) {
    // Remover notificação anterior se existir
    const anterior = document.querySelector('.toast-notification');
    if (anterior) {
        anterior.remove();
    }
    
    // Definir ícone e cor baseado no tipo
    let icone, cor;
    switch(tipo) {
        case 'success':
            icone = '✅';
            cor = '#4CAF50';
            break;
        case 'error':
            icone = '❌';
            cor = '#f44336';
            break;
        case 'warning':
            icone = '⚠️';
            cor = '#ff9800';
            break;
        case 'info':
            icone = 'ℹ️';
            cor = '#2196F3';
            break;
        default:
            icone = '📢';
            cor = '#9c27b0';
    }
    
    // Criar elemento de notificação
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    toast.innerHTML = `
        <div class="toast-icon">${icone}</div>
        <div class="toast-message">${mensagem}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Adicionar ao body
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);
    
    // Auto-remover após duração
    if (duracao > 0) {
        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duracao);
    }
};

// Atalhos para tipos específicos
window.notificarSucesso = function(mensagem, duracao) {
    mostrarNotificacao(mensagem, 'success', duracao);
};

window.notificarErro = function(mensagem, duracao) {
    mostrarNotificacao(mensagem, 'error', duracao);
};

window.notificarAviso = function(mensagem, duracao) {
    mostrarNotificacao(mensagem, 'warning', duracao);
};

window.notificarInfo = function(mensagem, duracao) {
    mostrarNotificacao(mensagem, 'info', duracao);
};

console.log('✅ Funções de notificação disponíveis: mostrarNotificacao(), notificarSucesso(), notificarErro(), notificarAviso(), notificarInfo()');

