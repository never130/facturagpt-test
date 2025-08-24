const { Router } = require("express");
const { authenticateToken } = require('../middlewares/auth/auth');
const { 
    saveTemplate, 
    loadTemplates, 
    loadTemplate, 
    deleteTemplate, 
    executeTemplate,
    performVisualScraping
} = require("../services/meet/scraping");

const scrapingRouter = Router();

scrapingRouter.post("/visual", authenticateToken, async (req, res) => {
    try {
        const { websiteUrl, userId, agentId, chatId } = req.body;
        
        if (!websiteUrl) {
            return res.status(400).json({
                success: false,
                error: "URL del sitio web es requerida"
            });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const token = req.headers.authorization?.split(' ')[1];
        
        await performVisualScraping({
            res,
            token,
            websiteUrl,
            userId: userId || req.user.id,
            agentId,
            chatId,
            conf: {
                streaming: true,
                userId: userId || req.user.id
            }
        });

    } catch (error) {
        console.error('Error in visual scraping:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});


scrapingRouter.post("/template/save", authenticateToken, async (req, res) => {
    try {
        const { template } = req.body;
        const userId = req.user.id;
        
        if (!template) {
            return res.status(400).json({
                success: false,
                error: "Template es requerido"
            });
        }
        
        const result = await saveTemplate(userId, template);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

scrapingRouter.get("/templates", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await loadTemplates(userId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error loading templates:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

scrapingRouter.get("/templates/:templateId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { templateId } = req.params;
        
        const result = await loadTemplate(userId, templateId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error loading template:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

scrapingRouter.delete("/templates/:templateId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { templateId } = req.params;
        
        const result = await deleteTemplate(userId, templateId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

scrapingRouter.post("/execute", authenticateToken, async (req, res) => {
    try {
        const { template, userId, agentId, chatId } = req.body;
        
        if (!template) {
            return res.status(400).json({
                success: false,
                error: "Template es requerido"
            });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const token = req.headers.authorization?.split(' ')[1];
        
        await executeTemplate({
            res,
            token,
            template,
            userId: userId || req.user.id,
            agentId,
            chatId,
            conf: {
                streaming: true,
                userId: userId || req.user.id
            }
        });

    } catch (error) {
        console.error('Error executing template:', error);
        
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

module.exports = scrapingRouter;