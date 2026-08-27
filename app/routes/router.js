var express = require("express");
var router = express.Router();

const moment = require("moment");
moment.locale('pt-br');

const { body, validationResult } = require("express-validator");

const {tarefasController} = require("../controllers/tarefasController");


router.get("/", async function (req, res) {
   tarefasController.listarTarefas(req, res);
});


router.get("/cadastro", (req, res) => {
    tarefasController.exibirCadastro(req, res);
});


router.get("/alterar", async (req, res) => {
    tarefasController.exibirAlteracao(req, res);
});


// adicionar validação de dados com o express-validator
// nome - 5 a 45 caracteres
// prazo data válida e hoje ou no futuro
// situação - inteiro de 0 a 4 
router.post("/cadastro", tarefasController.validarFormCad,
    async (req, res) => {
        tarefasController.salvarTarefa(req, res);
    });


// exclusão lógica (soft delete) - marca status_tarefa = 0
router.get("/excluir", async (req, res) => {
    tarefasController.excluirTarefa(req, res);
});






module.exports = router;