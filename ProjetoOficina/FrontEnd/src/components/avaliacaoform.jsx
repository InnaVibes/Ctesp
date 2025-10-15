import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const AvaliacaoForm = ({ catalogoServicoId, onAvaliacaoEnviada, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Por favor, selecione uma avaliação');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/api/avaliacoes', {
                catalogoServicoId,
                rating,
                comment: comment.trim()
            });
            
            onAvaliacaoEnviada(response.data);
        } catch (error) {
            const message = error.response?.data?.message || 'Erro ao enviar avaliação';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliar Serviço</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avaliação por Estrelas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua Avaliação *
                    </label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((estrela) => (
                            <button
                                key={estrela}
                                type="button"
                                onClick={() => setRating(estrela)}
                                onMouseEnter={() => setHoverRating(estrela)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="text-2xl transition-colors focus:outline-none"
                            >
                                <FaStar
                                    className={
                                        estrela <= (hoverRating || rating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }
                                />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {rating > 0 && (
                                <>
                                    {rating} de 5 estrelas
                                    {rating === 1 && ' - Muito ruim'}
                                    {rating === 2 && ' - Ruim'}
                                    {rating === 3 && ' - Regular'}
                                    {rating === 4 && ' - Bom'}
                                    {rating === 5 && ' - Excelente'}
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Comentário */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentário (opcional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Conte-nos sobre sua experiência com este serviço..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                        maxLength={500}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {comment.length}/500 caracteres
                    </div>
                </div>

                {/* Botões */}
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={loading || rating === 0}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            
            <div className="mt-4 text-xs text-gray-500">
                * Sua avaliação será moderada antes de aparecer publicamente
            </div>
        </div>
    );
};

export default AvaliacaoForm;