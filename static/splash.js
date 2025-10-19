// ========================================
// TELA DE INICIALIZAÇÃO (SPLASH SCREEN)
// Mecânica Göelzer
// ========================================
// Este arquivo não precisa de adaptação para a API, pois ele lida apenas com a exibição da tela de carregamento no frontend.

/**
 * Função para criar e exibir a tela de inicialização
 * Mostra o logo da empresa e barra de progresso
 */
function criarSplashScreen() {
    // Criar elemento da splash screen
    const splash = document.createElement('div');
    splash.id = 'splashScreen';
    
    // HTML da splash screen
    splash.innerHTML = `
        <!-- Container do Logo -->
        <div class="splash-logo-container">
            <img src="/static/logo.png" alt="Mecânica Göelzer" class="splash-logo">
        </div>
        
        <!-- Nome da Empresa -->
        <h1 class="splash-title">Mecânica Göelzer</h1>
        
        <!-- Subtítulo -->
        <p class="splash-subtitle">Sistema de Gestão Completo</p>
        
        <!-- Loading -->
        <div class="splash-loading">
            <!-- Barra de Progresso -->
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            
            <!-- Texto de Loading -->
            <p class="loading-text">Carregando sistema...</p>
        </div>
        
        <!-- Versão -->
        <div class="splash-version">Versão 2.0 - Sistema Completo com Segurança</div>
    `;
    
    // Adicionar ao body
    document.body.insertBefore(splash, document.body.firstChild);
    
    // Esconder o conteúdo principal enquanto carrega
    document.getElementById('app').style.display = 'none';
}

/**
 * Função para esconder a splash screen após o carregamento
 * Usa animação suave de fade out
 */
function esconderSplashScreen() {
    const splash = document.getElementById('splashScreen');
    
    if (splash) {
        // Adicionar classe de fade out
        splash.classList.add('hidden');
        
        // Mostrar o conteúdo principal
        document.getElementById('app').style.display = 'block';
        
        // Remover splash screen após animação (500ms)
        setTimeout(() => {
            splash.remove();
        }, 500);
    }
}

/**
 * Inicialização da Splash Screen
 * Executa ANTES do DOM carregar completamente
 */
(function() {
    // Criar splash screen imediatamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', criarSplashScreen);
    } else {
        criarSplashScreen();
    }
})();

/**
 * Esconder splash screen após tudo carregar
 * Tempo mínimo: 2 segundos (para mostrar o logo)
 */
window.addEventListener('load', function() {
    // Aguardar no mínimo 2 segundos para mostrar o logo
    setTimeout(() => {
        esconderSplashScreen();
    }, 2000);
});

// ========================================
// FIM DA SPLASH SCREEN
// ========================================

