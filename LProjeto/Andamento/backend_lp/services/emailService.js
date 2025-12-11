module.exports = {
    sendWelcome: async (email, name) => { console.log('Email sent to', email); },
    sendPromotion: async (email, title, description) => { console.log('Promotion sent to', email); }
};
