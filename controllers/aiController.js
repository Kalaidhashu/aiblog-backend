// const { callOllama } = require('../config/ollama');
const { callGemini } =
require('../config/gemini');

// @desc    Generate blog using AI
// @route   POST /api/ai/generate-blog
// @access  Private
const generateBlog = async (req, res) => {
    try {
        const { topic, keywords, style } = req.body;
        
        console.log('📝 Generating blog for topic:', topic);
        
        if (!topic) {
            return res.status(400).json({ message: 'Topic is required' });
        }
        
        // Simplified prompt for better success rate
        const prompt = `Write a blog post about "${topic}".
        
        Format your response as JSON with these fields:
        - title: A catchy title
        - introduction: Opening paragraph
        - content: Main content with HTML formatting (use <h2> for subheadings, <p> for paragraphs)
        - conclusion: Closing paragraph
        - tags: 3-5 relevant tags as an array
        
        Keep it concise but informative.`;
        
        console.log('🔄 Calling Gemini...');
        const aiResponse = await callGemini(prompt);
        console.log('✅ Received AI response');
        
        // Parse the response
        let blogData;
        try {
            // Try to extract JSON
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                blogData = JSON.parse(jsonMatch[0]);
            } else {
                // Fallback: create structured data from text
                blogData = {
                    title: `Complete Guide to ${topic}`,
                    introduction: aiResponse.substring(0, 300),
                    content: `<p>${aiResponse.replace(/\n/g, '</p><p>')}</p>`,
                    conclusion: aiResponse.substring(aiResponse.length - 300),
                    tags: [topic.toLowerCase().replace(/\s/g, '-'), 'guide'],
                };
            }
        } catch (parseError) {
            console.error('Parse error:', parseError);
            // Fallback response
            blogData = {
                title: `Understanding ${topic}`,
                introduction: `This article explores ${topic} in detail.`,
                content: `<p>${aiResponse}</p>`,
                conclusion: `Thank you for reading about ${topic}.`,
                tags: [topic.toLowerCase().replace(/\s/g, '-')],
            };
        }
        
        res.json(blogData);
    } catch (error) {
        console.error('❌ Generate blog error:', error);
        res.status(500).json({ 
            message: 'Failed to generate blog', 
            error: error.message 
        });
    }
};

// @desc    Correct grammar using AI
// @route   POST /api/ai/grammar-correct
// @access  Private
const correctGrammar = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }
        
        console.log('📝 Correcting grammar for text length:', text.length);
        
        const prompt = `Fix the grammar and improve this text. Return only the corrected version, no explanations:\n\n${text}`;
        
        const correctedText = await callGemini(prompt);
        
        res.json({ 
            original: text,
            corrected: correctedText.trim(),
            improvements: ['Grammar corrected', 'Readability improved']
        });
    } catch (error) {
        console.error('❌ Grammar correction error:', error);
        res.status(500).json({ 
            message: 'Failed to correct grammar', 
            error: error.message 
        });
    }
};

// @desc    Chat with AI assistant
// @route   POST /api/ai/chatbot
// @access  Private
const chatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        
        console.log('💬 Chat message:', message);
        
        const prompt = `You are a helpful assistant for bloggers. Answer this question concisely:\n\n${message}`;
        
        const response = await callGemini(prompt);
        
        res.json({ 
            response: response.trim(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chatbot error:', error);
        res.status(500).json({ 
            message: 'Failed to get AI response', 
            error: error.message 
        });
    }
};

// @desc    Generate image prompt
// @route   POST /api/ai/generate-image-prompt
// @access  Private
const generateImagePrompt = async (req, res) => {
    try {
        const { description, style, mood } = req.body;
        
        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        
        const prompt = `Create a detailed image generation prompt for: "${description}"
        Style: ${style || 'realistic'}
        Mood: ${mood || 'neutral'}
        
        Return only the prompt text.`;
        
        const imagePrompt = await callGemini(prompt);
        
        res.json({ 
            prompt: imagePrompt.trim(),
            originalDescription: description
        });
    } catch (error) {
        console.error('❌ Image prompt error:', error);
        res.status(500).json({ 
            message: 'Failed to generate image prompt', 
            error: error.message 
        });
    }
};

module.exports = {
    generateBlog,
    correctGrammar,
    chatWithAI,
    generateImagePrompt,
};