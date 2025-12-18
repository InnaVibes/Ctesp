const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Índice composto para buscar mensagens de uma conversa rapidamente
MessageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = model('Message', MessageSchema);

module.exports = { Message };