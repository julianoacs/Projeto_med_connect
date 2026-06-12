function toggleCard(card) {
    card.classList.toggle("ativo");
}

function toggleEditDados() {
    const view = document.getElementById("viewDados");
    const edit = document.getElementById("editDados");
    if (edit.style.display === "none") {
        view.style.display = "none";
        edit.style.display = "block";
    } else {
        edit.style.display = "none";
        view.style.display = "block";
    }
}

function filtrarLista(inputId, listaId) {
    const termo = document.getElementById(inputId).value.toLowerCase();
    const itens = document.querySelectorAll('#' + listaId + ' .filtro-item');

    const mapaResultado = {
        'filtroPacientes':       'semResultadoPacientes',
        'filtroMedicos':         'semResultadoMedicos',
        'filtroHistorico':       'semResultadoHistorico',
        'filtroExames':          'semResultadoExames',
        'filtroGerenciarExames': 'semResultadoGerenciarExames',
        'filtroGerenciarEsp':    'semResultadoGerenciarEsp'
    };
    const semResultadoId = mapaResultado[inputId];
    let visiveis = 0;

    itens.forEach(item => {
        const texto = item.innerText.toLowerCase();
        if (texto.includes(termo)) {
            item.style.display = '';
            visiveis++;
        } else {
            item.style.display = 'none';
        }
    });

    const semResultado = document.getElementById(semResultadoId);
    if (semResultado) semResultado.style.display = visiveis === 0 && termo !== '' ? 'block' : 'none';
}

function irParaAba(aba) {
    window.location.href = "/profile?aba=" + aba;
}

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const aba = params.get("aba") || "dados";

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    document.getElementById(aba)?.classList.add('active');

    document.querySelectorAll('.menu-item').forEach(m => {
        if (m.innerText.toLowerCase().includes(aba.toLowerCase())) {
            m.classList.add('active');
        }
    });
};