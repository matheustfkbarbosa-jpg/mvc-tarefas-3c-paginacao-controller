const { tarefasModel } = require("../models/tarefasModel");

const { body, validationResult } = require("express-validator");

const moment = require("moment");
moment.locale('pt-br');

const tarefasController = {


    validarFormCad:[
         body("tarefa").isLength({ min: 5, max: 45 }).withMessage("Nome da tarefa deve ter de 5 a 45 caracteres!"),
            body("situacao").isInt({ min: 0, max: 4 }).withMessage("Situação deve ser um inteiro de 0 a 4"),
            body("prazo").isISO8601().withMessage("A data deve ser válida!"),
            body("prazo").custom((value) => {
                let hoje = moment().format("L");
                let prazo = moment(value).format("L");
                if (moment(prazo).isSameOrAfter(hoje)) {
                    return true;
                } else {
                    throw new Error("A data deve ser hoje ou no futuro!");
                }
        
            }),
    ],

    listarTarefas: async function (req, res) {
        res.locals.moment = moment;
        let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
        let qtdePagina = 5;
        let offset = (paginaAtual - 1) * qtdePagina;
        let totalPaginas = Math.ceil(await tarefasModel.totRegistros() / qtdePagina);

        if (totalPaginas > 1) {
            var paginador = { "paginaAtual": paginaAtual, "totalPaginas": totalPaginas }
        } else {
            var paginador = null
        }


        try {
            const linhas = await tarefasModel.findAll(offset, qtdePagina);
            res.render("pages/index", { linhasTabela: linhas, "notificador": paginador });
        } catch (erro) {
            console.log(erro);
        }
    },


    exibirCadastro: (req, res) => {
        res.locals.moment = moment;
        res.render("pages/cadastro", {
            "listaErros": null,
            tituloAba: "Cadastro de tarefa", tituloPagina: "Nova Tarefa",
            tarefa: { id_tarefa: 0, nome_tarefa: "", prazo_tarefa: "", situacao_tarefa: 1 }
        });
    },


  
    exibirAlteracao: async function (req, res) {
        res.locals.moment = moment;
    
        const id = req.query.id;

        try {
            const tarefa = await tarefasModel.findById(id);

            if (!tarefa || tarefa.length == 0) {
        
                res.redirect("/");
                return;
            }

            res.render("pages/cadastro", {
                "listaErros": null,
                tituloAba: "Edição de tarefa", tituloPagina: "Alterar Tarefa",
                tarefa: tarefa[0]
            });
        } catch (erro) {
            console.log(erro);
            res.redirect("/");
        }
    },


    salvarTarefa: async function (req, res) {
        res.locals.moment = moment;
        let listaErros = validationResult(req);

        if (listaErros.isEmpty()) {
 
            const objJson = {
                id: req.body.id,
                nome: req.body.tarefa,
                prazo: req.body.prazo,
                situacao: req.body.situacao
            }

            try {
                if (objJson.id == 0) {
                  
                    var result = await tarefasModel.create(objJson);
                } else {
                 
                    var result = await tarefasModel.update(objJson);
                }
                res.redirect("/");
            } catch (erro) {
                console.log(erro);
                res.redirect("/");
            }
        } else {
        
            let tituloAba, tituloPagina;

            if (req.body.id == 0) {
                tituloAba = "Cadastro de tarefa";
                tituloPagina = "Nova Tarefa";
            } else {
                tituloAba = "Edição de tarefa";
                tituloPagina = "Alterar Tarefa";
            }

            res.render("pages/cadastro", {
                "listaErros": listaErros,
                "tituloAba": tituloAba, "tituloPagina": tituloPagina,
                tarefa: {
                    id_tarefa: req.body.id,
                    nome_tarefa: req.body.tarefa,
                    prazo_tarefa: req.body.prazo,
                    situacao_tarefa: req.body.situacao
                }
            });
        }
    },


  
    excluirTarefa: async function (req, res) {
        const id = req.query.id;

        try {
            await tarefasModel.deleteLogico(id);
            res.redirect("/");
        } catch (erro) {
            console.log(erro);
            res.redirect("/");
        }
    }


}


module.exports = { tarefasController }