const exameSelect    = document.getElementById('exameSelect');
const medicoSelect   = document.getElementById('medicoSelect');
const tipoSelect     = document.getElementById('tipoSelect');
const tipoWrapper    = document.getElementById('tipoWrapper');
const localSelect    = document.getElementById('localSelect');
const localWrapper   = document.getElementById('localWrapper');
const telefoneWrapper = document.getElementById('telefoneWrapper');
const telefoneInput  = document.getElementById('telefoneInput');

// Filtrar médicos por exame
exameSelect.addEventListener('change', () => {
    const exameEscolhido = exameSelect.value;
    medicoSelect.querySelectorAll('option').forEach(opt => {
        if (opt.value === '') return;
        const examesDoMedico = opt.dataset.exames ? opt.dataset.exames.split(',') : [];
        opt.style.display = examesDoMedico.includes(exameEscolhido) ? 'block' : 'none';
    });
    medicoSelect.value = '';
    resetTipo();
});

// Ao selecionar médico — mostra tipo de consulta
medicoSelect.addEventListener('change', () => {
    if (medicoSelect.value) {
        tipoWrapper.style.display = 'block';
    } else {
        tipoWrapper.style.display = 'none';
    }
    resetTipo();
});

// Ao selecionar tipo de consulta
tipoSelect.addEventListener('change', () => {
    const tipo = tipoSelect.value;

    // Esconde tudo primeiro
    localWrapper.style.display   = 'none';
    telefoneWrapper.style.display = 'none';
    localSelect.innerHTML = '<option value="">-- Selecione o local --</option>';
    telefoneInput.required = false;
    localSelect.required   = false;

    if (tipo === 'Online') {
        telefoneWrapper.style.display = 'block';
        telefoneInput.required = true;

    } else if (tipo === 'Presencial') {
        const optSelecionada = medicoSelect.options[medicoSelect.selectedIndex];
        const locaisRaw = optSelecionada?.dataset?.locais || '';

        if (locaisRaw && locaisRaw.trim() !== '') {
            const locais = locaisRaw.split(';').filter(l => l.trim() !== '');
            locais.forEach(l => {
                const [nome, endereco] = l.split('|');
                const opt = document.createElement('option');
                opt.value = nome + (endereco ? ' — ' + endereco : '');
                opt.textContent = nome + (endereco ? ' — ' + endereco : '');
                localSelect.appendChild(opt);
            });
            localWrapper.style.display = 'block';
            localSelect.required = true;
        } else {
            localWrapper.style.display = 'block';
            localSelect.innerHTML = '<option value="">Médico sem local cadastrado</option>';
        }
    }
});

function resetTipo() {
    tipoSelect.value = '';
    localWrapper.style.display    = 'none';
    telefoneWrapper.style.display = 'none';
    localSelect.innerHTML = '<option value="">-- Selecione o local --</option>';
    telefoneInput.required = false;
    localSelect.required   = false;
}

// Validar formulário
function validarForm() {
    if (!medicoSelect.value) {
        alert('Selecione um médico disponível para o exame escolhido!');
        return false;
    }
    if (!tipoSelect.value) {
        alert('Selecione o tipo de consulta (Online ou Presencial)!');
        return false;
    }
    return true;
}
