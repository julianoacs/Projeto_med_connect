export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"


export async function restoreSession() {
  const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: "GET",
    credentials: "include",
  })

  const data = await response.json()

  return data
}

export async function sendActivity() {
  const response = await fetch(`${API_BASE_URL}/api/auth/activity`, {
    method: "POST",
    credentials: "include",
  })

  const data = await response.json()

  return data
}

export async function getAccessStatus() {
  const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
    method: "GET",
    credentials: "include",
  })

  const data = await response.json()

  return data
}

export async function uploadProfileAvatar(file: File) {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  const data = await response.json()

  return data
}

export async function logoutSession() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  const data = await response.json()

  return data
}

export async function getHomeData() {
  const response = await fetch(`${API_BASE_URL}/api/home`, {
    method: "GET",
    credentials: "include",
  })

  const data = await response.json()

  return data
}

export async function getProfileData() {
     const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "GET",
        credentials: "include",
    })

    return response.json()
}

export async function updateProfileData(profileInfo: {
  nome: string
  email: string
  phone: string
  city: string
  cpf: string
  dataNascimento: string
}) 
{
  
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: profileInfo.nome,
      email: profileInfo.email,
      phone: profileInfo.phone,
      cpf: profileInfo.cpf,
      city: profileInfo.city,
      dataNascimento: profileInfo.dataNascimento,
    }),
  })

  const data = await response.json()

  return data
}

export async function getMedicos(especialidade?: string) {
  const url = especialidade
    ? `${API_BASE_URL}/api/medicos?especialidade=${encodeURIComponent(especialidade)}`
    : `${API_BASE_URL}/api/medicos`

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  })

  return response.json()
}

export type ConsultaMinha = {
  id: number
  pacienteId: number
  medicoId: number
  medicoNome: string
  pacienteNome: string
  pacienteEmail: string
  especialidade: string
  motivo: string
  data: string
  hora: string
  tipoConsulta: string
  local: string
  status: string
}

export async function getMinhasConsultas() {
  const response = await fetch(`${API_BASE_URL}/api/consultas/minhas`, {
    method: "GET",
    credentials: "include",
  })

  return response.json()
}

export type ExamsG = {
  id: number
  nome: string
  descricao: string
  categoria: string
  tipo: string
  ativo: boolean
}

export async function searchExamsG(search: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/exames-globais?search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  const data = await response.json()

  return data
}

export async function enviarExamePaciente(data: {
  pedidoExameId: number
  exameGlobalId: number
  consultaId: number
  arquivo: File
}) {
  const formData = new FormData()

  formData.append("pedidoExameId", String(data.pedidoExameId))
  formData.append("exameGlobalId", String(data.exameGlobalId))
  formData.append("consultaId", String(data.consultaId))
  formData.append("arquivo", data.arquivo)

  const response = await fetch(`${API_BASE_URL}/api/exames-envios`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  return response.json()
}

export type PedidoExamePaciente = {
  id: number
  pacienteId: number
  medicoId: number
  consultaId: number
  exameGlobalId: number
  nome: string
  descricao: string
  categoria: string
  tipo: string
  status: string
  criadoEm: string
}

export async function getPedidosExamesDaConsulta(consultaId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/exames-pedidos/consulta/${consultaId}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  return response.json()
}

export async function criarPedidoExame(pedido: {
  exameGlobalId: number
  consultaId: number
}) {
  const response = await fetch(`${API_BASE_URL}/api/exames-pedidos`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      exameGlobalId: pedido.exameGlobalId,
      consultaId: pedido.consultaId,
    }),
  })

  return response.json()
}

export async function getExamesDaConsulta(consultaId: number) {
  const response = await fetch(`${API_BASE_URL}/api/exams/consulta/${consultaId}`, {
    method: "GET",
    credentials: "include",
  })

  return response.json()
}

export function getArquivoUrl(path?: string | null) {
  if (!path) return "#"

  if (path.startsWith("http")) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

export async function getConsultaPacienteContexto(consultaId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/consultas-room/${consultaId}/contexto-paciente`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  return response.json()
}

export type ConsultaRoomPaciente = {
  id: number
  nome: string
  email: string
  avatar: string | null
  idade: number | null
  sexo: string | null
  dataNascimento?: string | null
}

export type ConsultaRoomConsulta = {
  id: number
  pacienteId: number
  medicoId: number
  medicoNome: string
  pacienteNome: string
  especialidade: string
  motivo: string
  data: string
  hora: string
  status: string
  tipoConsulta: string
  local: string
  medicoTipoRegistro: string | null
  medicoNumeroRegistro: string | null
  medicoRegistro: string | null
}

export type ConsultaRoomAnotacao = {
  id: number
  data: string
  medicoNome: string
  resumo: string
}

export type ConsultaRoomConsultaAnterior = {
  id: number
  data: string
  motivo: string
  tipoConsulta: string
  status: string
}

export type ConsultaRoomContexto = {
  paciente: ConsultaRoomPaciente
  consulta: ConsultaRoomConsulta
  room: ConsultaRoomRegistro
  anotacoesOutrosMedicos: ConsultaRoomAnotacao[]
  consultasAnteriores: ConsultaRoomConsultaAnterior[]
}

export async function getConsultaRoomContexto(consultaId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/consulta-room/${consultaId}/contexto-paciente`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  return response.json()
}

export async function salvarConsultaRoom(data: {
  consultaId: number
  notasMedicas: string
  observacoes: string
  conduta: string
  medicamentos: string
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/consulta-room/${data.consultaId}/salvar`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notasMedicas: data.notasMedicas,
        observacoes: data.observacoes,
        conduta: data.conduta,
        medicamentos: data.medicamentos,
      }),
    }
  )

  return response.json()
}

export async function finalizarConsultaRoom(consultaId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/consulta-room/${consultaId}/finalizar`,
    {
      method: "POST",
      credentials: "include",
    }
  )

  return response.json()
}

export async function salvarRegistroConsulta(
    consultaId: number,
    payload: {
        resultadoConsulta: string
        observacoes: string
        conduta: string
        receita: string
    }
) {
    const response = await fetch(`${API_BASE_URL}/api/consultas/${consultaId}/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    })

    return response.json()
}

export async function finalizarConsulta(
    consultaId: number,
    payload: {
        resultadoConsulta: string
        observacoes: string
        conduta: string
        receita: string
    }
) {
    const response = await fetch(`${API_BASE_URL}/api/consultas/${consultaId}/finalizar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    })

    return response.json()
}

export async function iniciarConsultaRoom(consultaId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/consulta-room/${consultaId}/iniciar`,
    {
      method: "POST",
      credentials: "include",
    }
  )

  return response.json()
}

export async function checkConsultasFinalizadas() {
  const response = await fetch(`${API_BASE_URL}/api/finish/check`, {
    method: "GET",
    credentials: "include",
  })

  return response.json()
}

export type ConsultaRoomRegistro = {
  id: number
  consultaId: number
  pacienteId: number
  medicoId: number
  notasMedicas: string | null
  observacoes: string | null
  conduta: string | null
  medicamentos: string | null
  status: string
  criadoEm: string
  atualizadoEm: string | null
}