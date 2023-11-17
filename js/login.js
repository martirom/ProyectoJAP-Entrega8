const registerBtn = document.getElementById('registerBtn');
const showPassword = document.getElementById("show-password");
const passwordField = document.getElementById("password");

showPassword.addEventListener("click", function () {
    this.classList.toggle("fa-eye-slash");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type)
})

registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    if (username === '' || email === '' || password === '') {
        alert('Todos los campos deben estar llenos');
    } else if (!email.includes('@')) {
        alert('El campo de correo electrónico debe contener "@"');
    } else if (password.length < 6) {
        alert('La constraseña debe contener al menos 6 caracteres')
    } else {
        localStorage.setItem('loggedUser', username);
        localStorage.setItem('email', email);
        window.location.href = 'index.html';
    }
    // Función para guardar el perfil en el almacenamiento local
    function guardarPerfil() {
        // Obtener los valores de los campos
        var nombre = document.getElementById('nombre').value;
        var correo = document.getElementById('correo').value;
        var contrasena = document.getElementById('contrasena').value;

        // Crear un objeto con los datos del usuario
        var perfil = {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena
        };


        localStorage.setItem('perfilUsuario', JSON.stringify(perfil));

        alert('Perfil guardado exitosamente');
    }


    window.onload = function () {
        // Obtener el perfil almacenado en localStorage
        var perfilGuardado = localStorage.getItem('perfilUsuario');


        if (perfilGuardado) {
            var perfil = JSON.parse(perfilGuardado);
            document.getElementById('nombre').value = perfil.nombre;
            document.getElementById('correo').value = perfil.correo;
            document.getElementById('contrasena').value = perfil.contrasena;
        }
    };
});
