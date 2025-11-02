module.exports = async function handler(req, res) {
  res.json({ 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString(),
    method: req.method 
  })
}