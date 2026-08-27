const pool = require("../../config/pool_conexoes");

const tarefasModel = {

    findAll: async (offset = null, qtde = null) => {
        try {
            if(offset != null && qtde != null){
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 1 limit ?,? ",[offset, qtde]);
            }else{
                var [linhas] = await pool.query("select * from tarefas where status_tarefa = 1");
            }
            
            return linhas;
        } catch (erro) {
            return erro;
        }
    },
    
    findById: async (id) => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and id_tarefa = ?",
                [id]);
            return linhas;
        } catch (erro) {
            return erro;
        }
    },

    create: async (dados) => {
      
        try {
            const [resultInsert] = await pool.query(
                "insert into tarefas(`nome_tarefa`,`prazo_tarefa`, " +
                "`situacao_tarefa`) values(?,?,?)",
                [dados.nome, dados.prazo, dados.situacao]);
            return resultInsert;
        } catch (erro) {
            return erro;
        }

    },

   
    update: async (dados) => {
 
        try {
            const [resulUpdate] = await pool.query(
                "update tarefas set `nome_tarefa`= ?,`prazo_tarefa`= ?,  " +
                "`situacao_tarefa`= ? where id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]);
            return resulUpdate;
        } catch (erro) {
            return erro;
        }
    },


    deleteLogico: async (id) => {
        try {
            const [resultUpdate] = await pool.query(
                "update tarefas set `status_tarefa` = 0 where id_tarefa = ?",
                [id]);
            return resultUpdate;
        } catch (erro) {
            return erro;
        }
    },

 
    deleteFisico: async (id) => {
        try {
            const [resultDelete] = await pool.query(
                "delete from tarefas where id_tarefa = ?",
                [id]);
            return resultDelete;
        } catch (erro) {
            return erro;
        }
    },

    totRegistros: async ()=>{
        try{
            const [linhas] = await pool.query("SELECT count(*) as total FROM `lista-tarefas`.tarefas");
            return linhas[0].total;
        }catch(erro){
            return erro;
        }

    }
}



module.exports = { tarefasModel }
