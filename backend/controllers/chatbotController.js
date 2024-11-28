const handleUserMessage = async (message) => {
    // Basic intent recognition
    const lowerMessage = message.toLowerCase();
    
    // Event related intents
    if (lowerMessage.includes('event') || lowerMessage.includes('events')) {
        if (lowerMessage.includes('register') || lowerMessage.includes('join')) {
            return {
                response: "To register for an event, please visit our Events page and click on the event you're interested in. You'll find a registration button there.",
                intent: "event_registration"
            };
        }
        if (lowerMessage.includes('create')) {
            return {
                response: "To create an event, you need admin privileges. If you're an admin, you can create events from the Events page.",
                intent: "event_creation"
            };
        }
        return {
            response: "You can view all our upcoming events on our Events page. Would you like me to direct you there?",
            intent: "event_info"
        };
    }

    // Donation related intents
    if (lowerMessage.includes('donat') || lowerMessage.includes('give')) {
        return {
            response: "We appreciate your interest in donating! You can make a donation through our secure donation system. Would you like to know more about our donation process?",
            intent: "donation_info"
        };
    }

    // Support related intents
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return {
            response: "I'm here to help! You can ask me about:\n• Events and registration\n• Donation process\n• Account issues\n• General platform information\nWhat would you like to know more about?",
            intent: "support"
        };
    }

    // Account related intents
    if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('sign')) {
        if (lowerMessage.includes('create') || lowerMessage.includes('sign up')) {
            return {
                response: "You can create a new account by clicking the 'Sign Up' button in the top right corner. Would you like me to guide you through the process?",
                intent: "account_creation"
            };
        }
        return {
            response: "For account-related assistance, you can:\n1. Login using the button in the top right\n2. Reset your password if needed\n3. Contact support for specific issues\nWhat would you like to do?",
            intent: "account_help"
        };
    }

    // Default response
    return {
        response: "I understand you're asking about '" + message + "'. Could you please provide more details about what you'd like to know? I can help with events, donations, account issues, and general platform information.",
        intent: "unclear"
    };
};

exports.processMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await handleUserMessage(message);
        res.json(response);
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Error processing message' });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process the file based on type
        const fileType = req.file.mimetype;
        let response;

        if (fileType.startsWith('image/')) {
            response = {
                response: "I've received your image. How can I help you with this image?",
                intent: "file_upload_image"
            };
        } else if (fileType === 'application/pdf') {
            response = {
                response: "I've received your PDF document. What would you like me to help you with regarding this document?",
                intent: "file_upload_pdf"
            };
        } else {
            response = {
                response: "I've received your file. Please let me know what you'd like me to do with it.",
                intent: "file_upload_generic"
            };
        }

        res.json(response);
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: 'Error processing file upload' });
    }
};
