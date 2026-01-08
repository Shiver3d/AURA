import { ref } from 'vue'
import api from '../services/api'

export function useApi() {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const get = async (url, config = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(url, config)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao buscar dados'
      throw err
    } finally {
      loading.value = false
    }
  }

  const post = async (url, payload, config = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(url, payload, config)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao enviar dados'
      throw err
    } finally {
      loading.value = false
    }
  }

  const put = async (url, payload, config = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(url, payload, config)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar dados'
      throw err
    } finally {
      loading.value = false
    }
  }

  const del = async (url, config = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(url, config)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Erro ao deletar dados'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: del
  }
}
