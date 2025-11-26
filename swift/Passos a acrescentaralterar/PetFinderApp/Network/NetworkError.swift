import Foundation

/// Enumeração de erros que podem ocorrer durante requisições de rede
enum NetworkError: Error, LocalizedError {
    /// Credenciais da API não configuradas
    case missingCredentials
    
    /// URL inválido ou malformado
    case invalidURL
    
    /// Erro de conexão de rede
    case networkError(Error)
    
    /// Resposta inválida do servidor
    case invalidResponse
    
    /// Erro HTTP (código de status)
    case httpError(Int)
    
    /// Nenhum dado recebido
    case noData
    
    /// Erro ao decodificar JSON
    case decodingError(Error)
    
    /// Erro retornado pela API
    case apiError(String)
    
    /// Animal não encontrado
    case petNotFound
    
    // MARK: - LocalizedError
    
    var errorDescription: String? {
        switch self {
        case .missingCredentials:
            return "Credenciais da API não configuradas. Por favor, configure a API Key e Shelter ID nas Definições."
        case .invalidURL:
            return "URL inválido"
        case .networkError(let error):
            return "Erro de rede: \(error.localizedDescription)"
        case .invalidResponse:
            return "Resposta inválida do servidor"
        case .httpError(let code):
            return "Erro HTTP \(code)"
        case .noData:
            return "Nenhum dado recebido"
        case .decodingError(let error):
            return "Erro ao processar dados: \(error.localizedDescription)"
        case .apiError(let message):
            return "Erro da API: \(message)"
        case .petNotFound:
            return "Animal não encontrado"
        }
    }
}
