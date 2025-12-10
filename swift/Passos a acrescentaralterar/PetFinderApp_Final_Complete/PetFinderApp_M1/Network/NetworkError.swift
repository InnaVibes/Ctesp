import Foundation

enum NetworkError: Error, LocalizedError {
    case missingCredentials
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case httpError(Int)
    case noData
    case decodingError(Error)
    case apiError(String)
    case petNotFound
    
    var errorDescription: String? {
        switch self {
        case .missingCredentials:
            return "Credenciais da API não configuradas. Configure API Key e Shelter ID nas Definições."
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
