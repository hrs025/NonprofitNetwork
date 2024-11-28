const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// LangChain route to fetch campaign status
router.post('/langchain/campaign_status', async (req, res) => {
  const { campaign_name } = req.body;

  exec(`python ../langchain/agents/langchain_agent.py ${campaign_name}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send('Error executing LangChain');
    }
    res.send(stdout);
  });
});

module.exports = router;
