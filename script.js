document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const mensagem = document.getElementById('mensagem');
    const formUsuario = document.getElementById('formUsuario');
    const formRecurso = document.getElementById('formRecurso');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const listaRecursos = document.getElementById('listaRecursos');
    const recursoId = document.getElementById('recursoId');
    const descricaoInput = document.getElementById('descricao');
    const tipoRecursoInput = document.getElementById('tipoRecurso');
    const usuarioId = document.getElementById('usuarioId');
    const nomeInput = document.getElementById('nome');
    const senhaInput = document.getElementById('senha');
    const tipoUsuarioInput = document.getElementById('tipoUsuario');

    function carregarDados() {
        return fetch('data.json')
            .then(response => response.json());
    }

    function autenticarUsuario(nome, senha) {
        return carregarDados().then(data => {
            const usuario = data.usuarios.find(u => u.nome === nome && u.senha === senha);
            if (usuario) {
                localStorage.setItem('usuario', JSON.stringify(usuario));
            }
            return usuario;
        });
    }

    function redirecionarUsuario(tipo) {
        switch (tipo) {
            case 'funcionario':
                window.location.href = 'index.html';
                break;
            case 'gerente':
                window.location.href = 'usuarios.html';
                break;
            case 'administrador':
                window.location.href = 'recursos.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = nomeInput.value;
            const senha = senhaInput.value;
            
            autenticarUsuario(nome, senha).then(usuario => {
                if (usuario) {
                    redirecionarUsuario(usuario.tipo);
                } else {
                    mensagem.textContent = 'Nome ou senha incorretos!';
                    mensagem.style.color = 'red';
                }
            });
        });
    }

    function atualizarListas() {
        carregarDados().then(data => {
            if (listaUsuarios) {
                listaUsuarios.innerHTML = data.usuarios.map(usuario =>
                    `<div>
                        ${usuario.nome} (${usuario.tipo})
                        <button onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button onclick="removerUsuario(${usuario.id})">Remover</button>
                    </div>`
                ).join('');
            }

            if (listaRecursos) {
                listaRecursos.innerHTML = data.recursos.map(recurso =>
                    `<div>
                        ${recurso.descricao} (${recurso.tipo})
                        <button onclick="editarRecurso(${recurso.id})">Editar</button>
                        <button onclick="removerRecurso(${recurso.id})">Remover</button>
                    </div>`
                ).join('');
            }
        });
    }

    function adicionarUsuario() {
        carregarDados().then(data => {
            const nome = nomeInput.value;
            const senha = senhaInput.value;
            const tipoUsuario = tipoUsuarioInput.value;
            const id = usuarioId.value ? parseInt(usuarioId.value) : data.usuarios.length + 1;

            const usuarioExistente = data.usuarios.find(u => u.id === id);
            if (usuarioExistente) {
                usuarioExistente.nome = nome;
                usuarioExistente.senha = senha;
                usuarioExistente.tipo = tipoUsuario;
            } else {
                const novoUsuario = { id, nome, senha, tipo: tipoUsuario };
                data.usuarios.push(novoUsuario);
            }

            nomeInput.value = '';
            senhaInput.value = '';
            tipoUsuarioInput.value = 'funcionario';
            usuarioId.value = '';
            atualizarListas();
        });
    }

    function removerUsuario(id) {
        carregarDados().then(data => {
            data.usuarios = data.usuarios.filter(u => u.id !== id);
            atualizarListas();
        });
    }

    function editarUsuario(id) {
        carregarDados().then(data => {
            const usuario = data.usuarios.find(u => u.id === id);
            if (usuario) {
                nomeInput.value = usuario.nome;
                senhaInput.value = usuario.senha;
                tipoUsuarioInput.value = usuario.tipo;
                usuarioId.value = usuario.id;
            }
        });
    }

    function adicionarRecurso() {
        carregarDados().then(data => {
            const descricao = descricaoInput.value;
            const tipoRecurso = tipoRecursoInput.value;
            const id = recursoId.value ? parseInt(recursoId.value) : data.recursos.length + 1;

            const recursoExistente = data.recursos.find(r => r.id === id);
            if (recursoExistente) {
                recursoExistente.descricao = descricao;
                recursoExistente.tipo = tipoRecurso;
            } else {
                const novoRecurso = { id, descricao, tipo: tipoRecurso };
                data.recursos.push(novoRecurso);
            }

            descricaoInput.value = '';
            tipoRecursoInput.value = 'equipamento';
            recursoId.value = '';
            atualizarListas();
        });
    }

    function removerRecurso(id) {
        carregarDados().then(data => {
            data.recursos = data.recursos.filter(r => r.id !== id);
            atualizarListas();
        });
    }

    function editarRecurso(id) {
        carregarDados().then(data => {
            const recurso = data.recursos.find(r => r.id === id);
            if (recurso) {
                descricaoInput.value = recurso.descricao;
                tipoRecursoInput.value = recurso.tipo;
                recursoId.value = recurso.id;
            }
        });
    }

    if (formUsuario) {
        formUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            adicionarUsuario();
        });

        atualizarListas();
    }

    if (formRecurso) {
        formRecurso.addEventListener('submit', function(e) {
            e.preventDefault();
            adicionarRecurso();
        });

        atualizarListas();
    }

    
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        
        const page = window.location.pathname.split('/').pop();
        if ((page === 'usuarios.html' && usuario.tipo !== 'gerente') ||
            (page === 'recursos.html' && usuario.tipo !== 'administrador')) {
            alert('Acesso negado. Você não tem permissão para acessar esta página.');
            window.location.href = 'index.html';
        }
    } else if (window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }

   
    window.editarUsuario = editarUsuario;
    window.removerUsuario = removerUsuario;
    window.editarRecurso = editarRecurso;
    window.removerRecurso = removerRecurso;
});
