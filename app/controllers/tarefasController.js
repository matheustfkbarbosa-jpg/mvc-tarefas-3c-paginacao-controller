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
        //recuperar a página solicitada caso não exista será a página 1
        let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
        //definir a qtde de registros por página
        let qtdePagina = 5;
        //definir o offset em relação a pagina atual
        let offset = (paginaAtual - 1) * qtdePagina;
        //definir o número de páginas de resultados
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
        //recuperar o id da queryString
        const id = req.query.id;

        try {
            const tarefa = await tarefasModel.findById(id);

            if (!tarefa || tarefa.length == 0) {
                //id não encontrado (ou já excluído) -> volta para a listagem
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


    // trata o post do form de cadastro/alteração, faz a validação
    // e decide entre inclusão (create) ou alteração (update)
    salvarTarefa: async function (req, res) {
        res.locals.moment = moment;
        let listaErros = validationResult(req);

        if (listaErros.isEmpty()) {
            // vazio == sem erros
            const objJson = {
                id: req.body.id,
                nome: req.body.tarefa,
                prazo: req.body.prazo,
                situacao: req.body.situacao
            }

            try {
                if (objJson.id == 0) {
                    // sem id -> inclusão
                    var result = await tarefasModel.create(objJson);
                } else {
                    // com id -> alteração
                    var result = await tarefasModel.update(objJson);
                }
                res.redirect("/");
            } catch (erro) {
                console.log(erro);
                res.redirect("/");
            }
        } else {
            // há erros de validação -> volta para o form mostrando as mensagens
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


    // exclusão lógica: apenas marca status_tarefa = 0
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