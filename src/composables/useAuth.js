import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase'

// Mantemos o user fora da função para que ele funcione como um Singleton (Estado Global)
// Assim, todos os componentes que usarem useAuth compartilharão o mesmo usuário.
const user = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  
  const isAuthenticated = computed(() => !!user.value)
  
  // Computada para facilitar pegar o nome salvo no metadata do Supabase
  const userName = computed(() => user.value?.user_metadata?.full_name || 'Usuário')

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

  // Novo: Método para atualizar e-mail ou senha
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

  return {
    user,
    userName, // Exportando o nome já formatado
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    updateCredentials
  }
}