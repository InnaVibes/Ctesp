import { io } from "socket.io-client";

// Create socket instance using the proxy (no need for full URL)
const socket = io();

export const initSocket = () => {
    console.log("Initializando socket...");

    // Check if socket is connected
    if (socket.connected) {
        console.log("Estou conectado");
    } else {
        console.log("Tentando conectar...");
    }

    // Listen for connection events
    socket.on('connect', () => {
        console.log('Conectado ao servidor:', socket.id);
    });
    
    socket.on('disconnect', () => {
        console.log('Desconectado do servidor');
    });
    
    return socket;
};

export const socketAddListener = (listener = "", callback = () => {}) => {
    socket.on(listener, callback);
};

export const socketRemoveListener = (listener = "", callback = () => {}) => {
    socket.off(listener, callback);
};