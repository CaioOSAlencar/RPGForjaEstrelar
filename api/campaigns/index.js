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

    if (req.method === 'GET') {
      // Listar campanhas do usuário
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          master:users!campaigns_master_id_fkey(id, name),
          campaign_users(
            role,
            user:users(id, name)
          )
        `)
        .or(`master_id.eq.${user.userId},campaign_users.user_id.eq.${user.userId}`)

      if (error) throw error

      res.json({ success: true, data: campaigns })
    }

    if (req.method === 'POST') {
      // Criar campanha
      const { name, system, description } = req.body
      
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          name,
          system,
          description,
          master_id: user.userId,
          room_code: roomCode
        })
        .select(`
          *,
          master:users!campaigns_master_id_fkey(id, name, email)
        `)
        .single()

      if (error) throw error

      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campanha criada com sucesso!'
      })
    }
  } catch (error) {
    if (error.message === 'Token required') {
      return res.status(401).json({ error: 'Token de acesso requerido' })
    }
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}