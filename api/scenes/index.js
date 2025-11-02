import jwt from 'jsonwebtoken'
import { supabase } from '../../lib/supabase.js'

const authenticate = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('Token required')
  return jwt.verify(token, process.env.JWT_SECRET)
}

export default async function handler(req, res) {
  try {
    const user = authenticate(req)

    if (req.method === 'POST') {
      // Criar cena
      const { name, description, campaignId, gridSize = 50, width = 1920, height = 1080 } = req.body

      // Verificar se é mestre da campanha
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('master_id')
        .eq('id', campaignId)
        .single()

      if (campaign?.master_id !== user.userId) {
        return res.status(403).json({ error: 'Apenas o mestre pode criar cenas' })
      }

      const { data: scene, error } = await supabase
        .from('scenes')
        .insert({
          name,
          description,
          campaign_id: campaignId,
          grid_size: gridSize,
          grid_color: '#ffffff',
          grid_opacity: 0.3,
          width,
          height
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json({
        success: true,
        data: scene,
        message: 'Cena criada com sucesso!'
      })
    }
  } catch (error) {
    if (error.message === 'Token required') {
      return res.status(401).json({ error: 'Token de acesso requerido' })
    }
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}