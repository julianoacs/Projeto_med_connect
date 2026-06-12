import { restoreSession } from "./auth"

export async function requiredSession() {
  try {
    const data = await restoreSession()

    if (!data.success) {
      return {
        authenticated: false,
        usuario: null,
      }
    }

    return {
      authenticated: true,
      usuario: data.usuario,
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)

    return {
      authenticated: false,
      usuario: null,
    }
  }
}