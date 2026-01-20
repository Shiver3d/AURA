import { supabase } from './supabase'

/**
 * Obter todos os produtos
 */
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    return []
  }
}

/**
 * Obter produtos por categoria
 */
export async function getProductsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    return []
  }
}

/**
 * Buscar produtos por query (name ou description)
 */
export async function searchProducts(query) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar produtos:', err)
    return []
  }
}

/**
 * Obter um produto específico pelo ID
 */
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
    return null
  }
}

/**
 * Upload de imagem de produto
 */
export async function uploadProductImage(file) {
  try {
    if (!file) throw new Error('Arquivo não fornecido')
    
    const fileExt = file.name.split('.').pop()
    const fileName = `product-${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (err) {
    console.error('Erro ao fazer upload:', err)
    return null
  }
}

/**
 * Criar novo produto (admin)
 */
export async function createProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
    
    if (error) throw error
    return data?.[0] || null
  } catch (err) {
    console.error('Erro ao criar produto:', err)
    return null
  }
}

/**
 * Atualizar produto (admin)
 */
export async function updateProduct(id, productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data?.[0] || null
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    return null
  }
}

/**
 * Deletar produto (admin)
 */
export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (err) {
    console.error('Erro ao deletar produto:', err)
    return false
  }
}
