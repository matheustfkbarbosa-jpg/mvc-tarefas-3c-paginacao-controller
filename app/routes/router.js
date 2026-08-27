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



router.post("/cadastro", tarefasController.validarFormCad,
    async (req, res) => {
        tarefasController.salvarTarefa(req, res);
    });



router.get("/excluir", async (req, res) => {
    tarefasController.excluirTarefa(req, res);
});






module.exports = router;