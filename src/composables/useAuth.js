import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase'

// Mantemos o user fora da função para que ele funcione como um Singleton (Estado Global)
// Assim, todos os componentes que usarem useAuth compartilharão o mesmo usuário.
const user = ref(null)
const loading = ref(false)
const error = ref(null)
const sessionRestored = ref(false) // Flag para indicar se a sessão foi restaurada

export function useAuth() {
  
  const isAuthenticated = computed(() => !!user.value)
  
  // Computada para facilitar pegar o nome salvo no metadata do Supabase
  const userName = computed(() => user.value?.user_metadata?.full_name || 'Usuário')
  
  // Computada para pegar apenas o primeiro nome
  const firstName = computed(() => {
    const fullName = user.value?.user_metadata?.full_name || 'Usuário'
    return fullName.split(" ")[0]
  })

  const signUp = async (email, password, fullName) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // O Supabase salva o nome dentro de uma coluna especial chamada raw_user_meta_data
          data: {
            full_name: fullName 
          }
        }
      })
      if (err) throw err
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      user.value = null
      sessionRestored.value = false
      // Limpar dados salvos
      localStorage.removeItem('skin_saved_credentials')
      localStorage.removeItem('skin_user')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    loading.value = true
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
      return currentUser
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Método para atualizar e-mail ou senha
  const updateCredentials = async (newEmail, newPassword) => {
    loading.value = true
    error.value = null
    try {
      const updateData = {}
      if (newEmail) updateData.email = newEmail
      if (newPassword) updateData.password = newPassword

      const { data, error: err } = await supabase.auth.updateUser(updateData)
      if (err) throw err
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Restaurar sessão persistida
  const restoreSession = async () => {
    if (sessionRestored.value) return // Já foi restaurada
    
    loading.value = true
    try {
      // Primeiro, tenta obter o usuário atual da sessão do Supabase
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        // Se existe sessão válida no Supabase, usar
        user.value = currentUser
        sessionRestored.value = true
        return
      }
      
      // Se não há sessão, tentar restaurar das credenciais salvas
      const savedCreds = JSON.parse(localStorage.getItem('skin_saved_credentials') || 'null')
      if (savedCreds && savedCreds.email && savedCreds.password) {
        try {
          await signIn(savedCreds.email, savedCreds.password)
          sessionRestored.value = true
        } catch (err) {
          console.log('Falha ao restaurar sessão com credenciais salvas:', err.message)
          // Limpar credenciais inválidas
          localStorage.removeItem('skin_saved_credentials')
          sessionRestored.value = true
        }
      } else {
        sessionRestored.value = true
      }
    } catch (err) {
      console.error('Erro ao restaurar sessão:', err.message)
      sessionRestored.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userName, // Exportando o nome já formatado
    firstName, // Exportando apenas o primeiro nome
    loading,
    error,
    isAuthenticated,
    sessionRestored, // Flag para indicar se a sessão foi restaurada
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    restoreSession, // Novo método para restaurar sessão persistida
    updateCredentials
  }
}