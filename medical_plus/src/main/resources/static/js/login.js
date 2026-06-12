window.addEventListener("pageshow", function () {
        document.querySelectorAll("input").forEach(input => input.value = "");
    });

function toggleSenha(inputId, btn) {
    const input = document.getElementById(inputId);
    const eyeOn  = btn.querySelector('.icon-eye');
    const eyeOff = btn.querySelector('.icon-eye-off');
    if (input.type === 'password') {
        input.type = 'text';
        eyeOn.style.display  = 'none';
        eyeOff.style.display = 'block';
    } else {
        input.type = 'password';
        eyeOn.style.display  = 'block';
        eyeOff.style.display = 'none';
    }
}
