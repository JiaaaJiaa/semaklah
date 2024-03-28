require('dotenv').config()

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY // use the service key in backend
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase