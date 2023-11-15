const cds = require('@sap/cds')
module.exports = cds.service.impl(function () {
    this.on('hdbprocedure', async () => {
        try {
            let dbQuery = ' CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."hdbprocedure"()'
            let result = await cds.run(dbQuery, {})
            console.log(result)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    })

    this.on('deletesingle', async (req) => {
        try {
            const { clientkey } = req.data;
            let dbQuery = ` CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."deletesingle"(
                CLIENTKEY => '${clientkey}'/*<NVARCHAR(50)>*/
            ) `
            let result = await cds.run(dbQuery, {})
            console.log(result)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    })

    this.on('deleteclient', async (req) => {
        try {
            const { clientkey } = req.data;
            let dbQuery = ` CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."deleteclient"(
                   CLIENTKEY => '${clientkey}'/*<NVARCHAR(50)>*/
              ) `
            let result = await cds.run(dbQuery, {})
            console.log(result)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    })
    /* GET INPUT VIEW (HYPOTHESIS LIST) */
    this.on('getInput', async (req) => {
        try {
            const { clientkey } = req.data;
            let dbQuery = `SELECT * FROM "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."DB_INPUT_VIEW"`
            let result = await cds.run(dbQuery, {})
            console.log(result)
            return result
        } catch (error) {
            console.error(error)
            return false
        }
    }),

        /* GET FINAL VIEW */ //Duyen
        this.on('getFinal', async (req) => {
            try {
                const { clientkey } = req.data;
                let dbQuery = `SELECT * FROM "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."DB_FINAL" WHERE "CLIENT" = '${clientkey}' `
                let result = await cds.run(dbQuery, {})
                console.log(result)
                return result
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        /* GET SIGNIFICANT LIST WITH CONDITION */
        this.on('getSignificant', async (req) => {
            try {
                const { clientkey } = req.data;
                //const { clientitem } = req.data;

                let dbQuery = `SELECT * FROM "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."DB_SIGNIFICANT" WHERE "VALID_HYPO_FLG" = 'O' AND "CLIENT" = '${clientkey}' `
                let result = await cds.run(dbQuery, {})
                console.log(result)
                return result
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        /*UPLOAD TO INPUT VIEW TABLE*/
        this.on('upload', async (req) => {
            try {
                let body = req.data.uploadData
                let result = await this.run(INSERT.into('INPUT_VIEW', body))
                console.log(result)
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        /* UPLOAD TO FINAL TABLE */
        this.on('upload_final', async (req) => {
            try {

                let body = req.data.finalData
                let result = await this.run(INSERT.into('FINAL_VIEW', body))
                console.log(result)
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        /* DELETE FINAL TABLE BASED ON CLIENT */
        this.on('deletefinal', async (req) => {
            try {
                const { clientkey } = req.data;
                //const { clientitem } = req.data
                // let dbQuery = ` CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."deletefinal"(
                //     CLIENT => '${clientkey}'/*<NVARCHAR(50)>*/,
                //     CLIENTITEM => '${clientitem}'/*<NVARCHAR(50)>*/
                // ) `
                let dbQuery = ` CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."deletefinal"(
                    CLIENTKEY => '${clientkey}'/*<NVARCHAR(50)>*/ 
                ) `

                let result = await cds.run(dbQuery, {})
                console.log(result)
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        }),
        
        //Duyen start
        /* DELETE INPUT_VIEW TABLE BASED ON CLIENT */
         this.on('deleteInput', async (req) => {
            try {
                const { clientkey } = req.data;
                let dbQuery = ` CALL "GRAPH_HDI_GRAPH_DB_DEPLOYER_1"."deleteInput"(
                    CLIENTKEY => '${clientkey}'/*<NVARCHAR(50)>*/ 
                ) `

                let result = await cds.run(dbQuery, {})
                console.log(result)
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        
        this.on('get_client_from_inputview', async (req) => {
            try {
                let dbQuery_tmp = {
                    SELECT: {
                        distinct: true,
                        from: { ref: ["DB_INPUT_VIEW"] },
                        columns: [
                            { ref: ["CLIENT"] }
                        ]
                    }
                }
                let result = await cds.run(dbQuery_tmp, {});
                // const { client } = req.data;
                // // let dbQuery = ` SELECT * FROM "APP_INTERACTIONS_INPUT_SAMPLE_MATRIX" WHERE CLIENT='${client}'`
                // let dbQuery = {
                //     SELECT: {
                //         from: { ref: ["DB_CLIENT_VIEW"] },
                //         where: [{ ref: ["CLIENTKEY"] }, "=", { val: client }]
                //     }
                // }
                // let result = await cds.run(dbQuery)
                return result

            } catch (error) {
                console.error(error)
                return false
            }

        }),
        //End

        this.on('get_client', async (req) => {
            // Duyen comment
            // try { 
            //     let client = req.data.client;
            //     let result = await cds.run(SELECT.from('DB_CLIENT_VIEW'))
            //     return result
            // } catch (error) {
            //     console.error(error)
            //     return false
            // }

            try {
                let client = req.data.client
                dbQuery = {
                    SELECT: {
                        from: { ref: ["DB_CLIENT_VIEW"] },
                        where: [{ ref: ["CLIENTKEY"] }, "=", { val: client }]
                    }
                }
                let result = await cds.run(dbQuery, {})
                return result
            } catch (error) {
                console.error(error)
                return false
            }
        }),

        this.on('post_client', async (req) => {
            try {
                let client = req.data.client
                let result = await this.run(INSERT.into('DB_INPUT_VIEW', client))
                return result
            } catch (error) {
                console.error(error)
                return false
            }
        })
})

