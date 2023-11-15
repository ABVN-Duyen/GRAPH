// const { getInfoForComponents } = require("@sap/hdi-deploy/lib/info");

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/microchart/ComparisonMicroChart",
	"sap/suite/ui/microchart/ComparisonMicroChartData",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
	function (Controller, JSONModel, ComparisonMicroChart, ComparisonMicroChartData, MessageBox, MessageToast, Spreadsheet, Fragment, Filter, FilterOperator) {
		var oModel = new JSONModel(sap.ui.require.toUrl("project1/graph.json"));
		let isFinal;
		let isAnalysed; // Store value to indicate that whether graph is analysed or not (true/false)
		var oInput;
		var oSigInput;
		var oFinal;
		var searchFlag;
		var oInputTmp;
		var oCInput;
		var addRowFlg = 0;
		var clickFlg = 0;
		var delFlg = 0;
		var searchText;
		var dbOdata;
		var lineIndex;
		var indexTable;
		var linesModel = oModel.oData.input;
		var linesTmp;
		var graphOModel;
		var color = "Standard";
		var clientEmpty = '';
		var clientData = '';
		var clientItem = 'TESTING';
		var clientExist = 0;
		var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
		var oPageController = Controller.extend("project1.view.NetworkGraph", {

			onInit: function () {

				isFinal = " "
				isAnalysed = false
				graphOModel = this.getOwnerComponent().getModel();
				// console.log(oModel);
				this.getView().setModel(oModel);
				oModel.setSizeLimit(2000);

				//Trinh code --------------------------------------
				this._oModelSettings = new JSONModel({
					source: "atomicCircle",
					orientation: "LeftRight",
					arrowPosition: "End",
					arrowOrientation: "ParentOf",
					nodeSpacing: 55,
					mergeEdges: false
				});

				this.getView().setModel(this._oModelSettings, "settings");
				var sURL = '/graph/getInput()';

				$.ajax({

					url: sURL,

					type: "GET",

					method: "GET",

					success: function (oData, oStatus, oResponse) {
						oInput = oData.value
						// console.log(oInput.concat("in ra dum"))
						// this._drawGraph(oInput)
						// for (var i = 0; i < oInput.length; i++) {
						// 	oModel.oData.input.push({ SOURCE: oInput[i].SOURCE, INDSOURCE: oInput[i].INDSOURCE, DESTINATION: oInput[i].DESTINATION, INDDEST: oInput[i].INDDEST, RELATIONSHIP: oInput[i].RELATIONSHIP, AREA: oInput[i].AREA, DESAREA: oInput[i].DESAREA});
						// }
						console.log(oData);
						oModel.refresh();

						if (oInput.length < 1) {
							MessageBox.error('Client has no data');
						}
					}.bind(this),

					error: function (oError) {

						console.log(oError)

						errMes = 1

					}.bind(this),

				});

				this.get_client_from_inputview(); //Duyen
				// //Duyen start comment
				// var cURL = '/graph/CLIENT_VIEW';
				// $.ajax({

				// 	url: cURL,

				// 	type: "GET",

				// 	method: "GET",

				// 	success: function (oData, oStatus, oResponse) {
				// 		oCInput = oData.value
				// 		// console.log(oCInput)
				// 		for (var i = 0; i < oCInput.length; i++) {
				// 			oModel.oData.client.push({ CLIENTKEY: oCInput[i].CLIENTKEY, CLIENT_ITEM: oCInput[i].CLIENT_ITEM, TITLE: oCInput[i].TITLE });
				// 		}
				// 		// console.log(oModel.oData);
				// 		oModel.refresh();
				// 	}.bind(this),

				// 	error: function (oError) {

				// 		console.log(oError)

				// 		errMes = 1

				// 	}.bind(this),

				// }); 
				// //Duyen end comment


				// var sigURL = `/graph/getSignificant()`;

				// $.ajax({

				// 	url: sigURL,

				// 	type: "GET",

				// 	method: "GET",

				// 	success: function (oData, oStatus, oResponse) {
				// 		oSigInput = oData.value
				// 		// console.log(oInput.concat("in ra dum"))
				// 		// this._drawGraph(oInput)
				// 		// for (var i = 0; i < oInput.length; i++) {
				// 		// 	oModel.oData.input.push({ SOURCE: oInput[i].SOURCE, INDSOURCE: oInput[i].INDSOURCE, DESTINATION: oInput[i].DESTINATION, INDDEST: oInput[i].INDDEST, RELATIONSHIP: oInput[i].RELATIONSHIP, AREA: oInput[i].AREA, DESAREA: oInput[i].DESAREA});
				// 		// }
				// 		console.log(oData);
				// 		oModel.refresh();
				// 	}.bind(this),

				// 	error: function (oError) {

				// 		console.log(oError)

				// 		errMes = 1

				// 	}.bind(this),

				// });
			},

			get_client: function (sClient) {
				let oModel = this.getView().getModel()
				// if ( sClient.length < 1) {
				// 	sClient =  oModel.oData.client
				// }
				for (var i = 0; i < sClient.length; i++) {
					var sURL = `/graph/get_client(client='${sClient[i].CLIENT}')`;
					let that = this
					$.ajax({

						url: sURL,
						type: "GET",
						method: "GET",

						success: function (oData, oStatus, oResponse) {
							oCInput = oData.value
							console.log(oCInput)

							for (var i = 0; i < oCInput.length; i++) {
								oModel.oData.client.push({
									CLIENTKEY: oCInput[i].CLIENTKEY,
									//CLIENT_ITEM: oCInput[i].CLIENT_ITEM, 
									MATRIX: oCInput[i].MATRIX,
									CHART: oCInput[i].MATRIX,
									TITLE: oCInput[i].TITLE
								});
							}
							// console.log(oModel.oData);

						}.bind(this),

						error: function (oError) {
							console.log(oError)
							errMes = 1
						}.bind(this),

					})
					oModel.refresh()
				}
			},

			get_client_from_inputview: function () {

				let oModel = this.getView().getModel()
				var sURL = '/graph/get_client_from_inputview()';
				let that = this
				$.ajax({
					url: sURL,
					type: "GET",
					method: "GET",
					success: function (oData, oStatus, oResponse) {
						// oInput = oData.value //Thai command
						oCInput = oData.value
						// oModel.oData.input = oData.value //Thai command
						//oModel.oData.client = oData.value
						// this.get_client(oInput); //Thai command
						that.get_client(oCInput); //Thai add
						console.log(oData);
					}.bind(this),

					error: function (oError) {
						console.log(oError)
						errMes = 1
					}.bind(this),
				})
				oModel.refresh()
			},

			fetchClients: function () {
				let oModel = this.getView().getModel()
				var sURL = '/graph/getInput()';
				let that = this
				$.ajax({

					url: sURL,
					type: "GET",
					method: "GET",

					success: function (oData, oStatus, oResponse) {
						oInput = oData.value
						console.log(oData);
					}.bind(this),

					error: function (oError) {

						console.log(oError)

						errMes = 1

					}.bind(this),
				})
				oModel.refresh()
			},

			onValueHelpRequest: function (oEvent) {
				oModel.oData.input = [];
				oModel.oData.groups = [];
				oModel.oData.lines = [];
				oModel.oData.nodes = [];

				isAnalysed = false
				isFinal = ""
				var sInputValue = oEvent.getSource().getValue();
				oView = this.getView();


				if (!this._pValueHelpDialog) {
					this._pValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "project1.view.ValueHelpDialog",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialog.then(function (oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("CLIENTKEY", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("CLIENTKEY", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpClose: function (oEvent) {
				isAnalysed = false
				isFinal = ""
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				this.byId("clientInput").setValue(oSelectedItem.getTitle());
				clientData = oSelectedItem.getTitle();

				for (let i = 0; i < oModel.oData.client.length; i++) {
					if (clientData == oModel.oData.client[i].CLIENTKEY) {
						//clientItem = oModel.oData.client[i].CLIENT_ITEM;
					}
				}
				this.drawClientData(oSelectedItem.getTitle());

			},

			getInputF4: function (oEvent) {
				//Only Display Hypothesis List 
				isAnalysed = false
				isFinal = ""
				var clientObj = [];
				var clientText = 'Client '
				clientData = oEvent.getParameter("value");
				if (clientData == "") {
					oModel.oData.input = [];
					oModel.oData.groups = [];
					oModel.oData.lines = [];
					oModel.oData.nodes = [];
				}
				this.drawClientData(clientData);

			},

			drawClientData: function (client) {
				oModel.oData.input = [];
				for (var i = 0; i < oInput.length; i++) {
					if (oInput[i].CLIENT == client) {
						oModel.oData.input.push({
							SOURCE: oInput[i].SOURCE, INDSOURCE: oInput[i].INDSOURCE, DESTINATION: oInput[i].DESTINATION, INDDEST: oInput[i].INDDEST, CLIENT: oInput[i].CLIENT,
							//CLIENT_ITEM: oInput[i].CLIENT_ITEM, 
							RELATIONSHIP: '', AREA: oInput[i].AREA, DESAREA: oInput[i].DESAREA,
							editable: false
						});
					}
				}

				if (oModel.oData.input.length != 0) {
					oModel.refresh();
					this._drawGraph(oModel.oData.input);
					isAnalysed = false
				} else {
					if (client != "") {
						MessageBox.error('Client has no data');
						oModel.oData.input = [];
					}
					//clientEmpty = true;
					oModel.refresh();
					isAnalysed = false
					// this._drawGraph(oModel.oData.input);
				}
			},

			onBeforeRendering: function () {
				this.byId('ins').setModel(this.jModel);
			},

			onAfterRendering: function () {
				this.byId("graphWrapper").$().css("overflow-y", "auto");
			},
			mergeChanged: function (oEvent) {
				this._oModelSettings.setProperty("/mergeEdges", !!Number(oEvent.getSource().getProperty("selectedKey")));
			},
			spacingChanged: function (oEvent) {
				this._oModelSettings.setProperty("/nodeSpacing", Number(oEvent.getSource().getProperty("selectedKey")));
			},
			addRow: function (oEvent) {
				addRowFlg = 1; //Duyen add
				if (searchText != undefined) {
					oModel.oData.input = [];
					addRowFlg = 1; //Duyen commnent
				}
				// oModel.oData.input.push({ AREA: '', SOURCE: '', INDSOURCE: '', DESAREA: '', DESTINATION: '', INDDEST: '', RELATIONSHIP: '', });
				if (isFinal == "") {
					oModel.oData.input.unshift({ AREA: '', SOURCE: '', INDSOURCE: '', DESAREA: '', DESTINATION: '', INDDEST: '', RELATIONSHIP: "", editable: false, CLIENT: clientData });
				} else {
					oModel.oData.input.unshift({ AREA: '', SOURCE: '', INDSOURCE: '', DESAREA: '', DESTINATION: '', INDDEST: '', RELATIONSHIP: "", editable: true, CLIENT: clientData });
				}
				oModel.refresh();//which will add the new record
			},

			inputInit: function (oData) {
				var input = oData.value;

				oModel.refresh();

				var dataSet = new Set();
				var indicatorSet = new Set();
				var ind = 'Indicator ';
				var nde = 'Node ';
				var grp = 'Hypothesis ';

				// oModel.oData.input = this.uniqBy(oModel.oData.input, JSON.stringify);
				// console.log(oModel.oData.input);

				oModel.oData.groups = [];
				oModel.oData.lines = [];
				oModel.oData.nodes = [];
				var lines = {} //Verified existence of lines
				// console.log(oModel.oData.lines);
				for (var i = 0; i < input.length; i++) {

					//Trinh code start-------------------------------------
					var source = input[i].SOURCE.toUpperCase()
					var sourceIn = input[i].INDSOURCE
					var destination = input[i].DESTINATION.toUpperCase()
					var destinationIn = input[i].INDDEST
					var relationship = input[i].RELATIONSHIP

					if (source != "" && destination != "") {
						if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: color, lineType: "Solid" })) {
							// console.log("omg")
						}
						console.log(lines.entries)
						//Add line
						if (relationship) {
							relationship = relationship.toLowerCase()
							switch (relationship) {
								case 'o': color = "Success"
									break
								case 'x': color = "Standard"
									break
							}

							// if (!lines.has([source, destination])) {
							// 	oModel.oData.lines.push({
							// 		SOURCE: source, DESTINATION: destination,
							// 		status: color, lineType: "Solid"
							// 	});
							// } else {
							for (var index = 0; index < oModel.oData.lines.length; index++) {
								if (oModel.oData.lines[index].SOURCE == source && oModel.oData.lines[index].DESTINATION == destination) {
									// console.log(oModel.oData.lines)
									oModel.oData.lines.splice(index, 1)
									oModel.oData.input.splice(index, 1)
									break;
								}
							}
							// console.log('dang else')
							// if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: color, lineType: "Solid" })) {
							// 	// console.log("omg")
							// }
							oModel.oData.lines.push({
								SOURCE: source, DESTINATION: destination,
								status: color, lineType: "Solid"
							});
							// }
							// }
							// lines.add([source, destination])
						}
						//Add source node
						if (!dataSet.has(source)) {
							oModel.oData.groups.push({ key: source, title: grp.concat(source) })
							oModel.oData.nodes.push({ key: source, title: source, status: 'Information', shape: "Box", group: source })
						}
						if (!dataSet.has(destination)) {
							oModel.oData.groups.push({ key: destination, title: grp.concat(destination) })
							oModel.oData.nodes.push({ key: destination, title: destination, status: 'Information', shape: "Box", group: destination })
						}
						// Add indicator node 
						if (sourceIn != '' && !indicatorSet.has(sourceIn)) {
							oModel.oData.nodes.push({ key: sourceIn, title: sourceIn, status: '', shape: "Box", group: source })
						}
						if (destinationIn != '' && !indicatorSet.has(destinationIn)) {
							oModel.oData.nodes.push({ key: destinationIn, destinationIn, status: '', shape: "Box", group: destination })
						}
						if (source == "" && destination != "") {
							oModel.oData.lines.push({
								SOURCE: destination, DESTINATION: destination,
								status: color, lineType: "Solid"
							});
						}

						if (source != "" && destination == "") {
							oModel.oData.lines.push({
								SOURCE: source, DESTINATION: source,
								status: color, lineType: "Solid"
							});
						}

						dataSet.add(source);
						dataSet.add(destination);
						indicatorSet.add(sourceIn)
						indicatorSet.add(destinationIn)
					}

					if (source == "" || destination == "") {
						if (source != "" && !dataSet.has(source)) {
							oModel.oData.groups.push({ key: source, title: grp.concat(source) })
							oModel.oData.nodes.push({ key: source, title: source, status: 'Information', shape: "Box", group: source })
						}

						if (destination != "" && !dataSet.has(destination)) {
							oModel.oData.groups.push({ key: destination, title: grp.concat(destination) })
							oModel.oData.nodes.push({ key: destination, title: destination, status: 'Information', shape: "Box", group: destination })
						}

						if (sourceIn != '' && !indicatorSet.has(sourceIn)) {
							oModel.oData.nodes.push({ key: sourceIn, title: sourceIn, status: '', shape: "Box", group: source })
						}
						if (destinationIn != '' && !indicatorSet.has(destinationIn)) {
							oModel.oData.nodes.push({ key: destinationIn, title: destinationIn, status: '', shape: "Box", group: destination })
						}

						dataSet.add(source);
						dataSet.add(destination);
						indicatorSet.add(sourceIn)
						indicatorSet.add(destinationIn)
					}
				}
				// console.log(oModel.oData.nodes)

				oModel.refresh();
				// console.log(oModel);
			},

			inputFromChange: function () {
				/* If user searching for Lines, and change the data */
				if ((searchFlag == 1 || clickFlg == 2) && delFlg == 0 && addRowFlg == 0) {
					if (oInputTmp == undefined) {
						oInputTmp = oModel.oData.input;
					} else {
						var indexTmp = indexTable[0];
						oInputTmp[indexTmp].SOURCE = oModel.oData.input[0].SOURCE;
						oInputTmp[indexTmp].DESTINATION = oModel.oData.input[0].DESTINATION;
						oInputTmp[indexTmp].INDSOURCE = oModel.oData.input[0].INDSOURCE;
						oInputTmp[indexTmp].INDDEST = oModel.oData.input[0].INDDEST;
						oInputTmp[indexTmp].AREA = oModel.oData.input[0].AREA;
						oInputTmp[indexTmp].DESAREA = oModel.oData.input[0].DESAREA;
						oInputTmp[indexTmp].RELATIONSHIP = oModel.oData.input[0].RELATIONSHIP;

						//Update final table
						if (isFinal == "X") {
							oModel.oData.final[indexTmp].SOURCE = oModel.oData.input[0].SOURCE;
							oModel.oData.final[indexTmp].DESTINATION = oModel.oData.input[0].DESTINATION;
							oModel.oData.final[indexTmp].INDSOURCE = oModel.oData.input[0].INDSOURCE;
							oModel.oData.final[indexTmp].INDDEST = oModel.oData.input[0].INDDEST;
							oModel.oData.final[indexTmp].AREA = oModel.oData.input[0].AREA;
							oModel.oData.final[indexTmp].DESAREA = oModel.oData.input[0].DESAREA;
							oModel.oData.final[indexTmp].MATCH_FLAG = oModel.oData.input[0].RELATIONSHIP;
						}
					}

					this._drawGraph(oInputTmp);

					oModel.refresh();
					// searchFlag = 0;
					return;
				}

				/* If user searching for Nodes, and change the data */
				if ((searchFlag == 2 || clickFlg == 1) && delFlg == 0 && addRowFlg == 0) {
					if (oInputTmp == undefined) {
						oInputTmp = oModel.oData.input;
					} else {
						for (var i = 0; i < oModel.oData.input.length; i++) {
							var indexTmp = indexTable[i];
							oInputTmp[indexTmp].SOURCE = oModel.oData.input[i].SOURCE;
							oInputTmp[indexTmp].DESTINATION = oModel.oData.input[i].DESTINATION;
							oInputTmp[indexTmp].INDSOURCE = oModel.oData.input[i].INDSOURCE;
							oInputTmp[indexTmp].INDDEST = oModel.oData.input[i].INDDEST;
							oInputTmp[indexTmp].AREA = oModel.oData.input[i].AREA;
							oInputTmp[indexTmp].DESAREA = oModel.oData.input[i].DESAREA;
							oInputTmp[indexTmp].RELATIONSHIP = oModel.oData.input[i].RELATIONSHIP;

							//Update final table
							if (isFinal == "X") {
								oModel.oData.final[indexTmp].SOURCE = oModel.oData.input[i].SOURCE;
								oModel.oData.final[indexTmp].DESTINATION = oModel.oData.input[i].DESTINATION;
								oModel.oData.final[indexTmp].INDSOURCE = oModel.oData.input[i].INDSOURCE;
								oModel.oData.final[indexTmp].INDDEST = oModel.oData.input[i].INDDEST;
								oModel.oData.final[indexTmp].AREA = oModel.oData.input[i].AREA;
								oModel.oData.final[indexTmp].DESAREA = oModel.oData.input[i].DESAREA;
								oModel.oData.final[indexTmp].MATCH_FLAG = oModel.oData.input[i].RELATIONSHIP;
							}
						}
					}

					this._drawGraph(oInputTmp);

					oModel.refresh();
					// searchFlag = 0;
					return;
				}

				/* If user delete row while in search */
				if (delFlg == 1) {
					if (oInputTmp == undefined) {
						oInputTmp = oModel.oData.input;
					}

					this._drawGraph(oInputTmp);

					oModel.refresh();
					delFlg = 0;
					return;
				}

				/* If user add more row while in search */
				if (addRowFlg == 1) {
					oInputTmp = oModel.oData.input
					oInputTmp = []

					//let oInputTmp_final = oModel.oData.final
					let oInputTmp_final = []
					for (var i = 0; i < oModel.oData.input.length; i++) {
						oInputTmp.push({
							SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE,
							DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST, RELATIONSHIP: oModel.oData.input[i].RELATIONSHIP, AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA, CLIENT: clientData
						});

						oInputTmp_final.push({
							SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE,
							DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST,
							MATCH_FLAG: oModel.oData.input[i].RELATIONSHIP, NEW_FLAG: "",
							AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA, CLIENT: clientData, CLIENT_ITEM: "TESTING"
						});
					}

					if (isFinal == "X") { //Add new lines to Final list

						//Remove old lines
						for (let index_ = 0; index_ < oModel.oData.final.length; index_++) {
							let curr = oModel.oData.final[index_];
							for (let fi = 0; fi < oInputTmp_final.length; fi++) {
								let curr_tmp = oInputTmp_final[fi];
								if (curr.SOURCE == curr_tmp.SOURCE && curr.INDSOURCE == curr_tmp.INDSOURCE &&
									curr.DESTINATION == curr_tmp.DESTINATION && curr.INDDEST == curr_tmp.INDDEST) {
									oInputTmp_final.splice(fi, 1);
								}
							}
						}

						//Add new lines remains
						for (let fi_tmp = 0; fi_tmp < oInputTmp_final.length; fi_tmp++) {
							oModel.oData.final.push({
								SOURCE: oInputTmp_final[fi_tmp].SOURCE, INDSOURCE: oInputTmp_final[fi_tmp].INDSOURCE,
								DESTINATION: oInputTmp_final[fi_tmp].DESTINATION, INDDEST: oInputTmp_final[fi_tmp].INDDEST,
								MATCH_FLAG: oInputTmp_final[fi_tmp].RELATIONSHIP, NEW_FLAG: "O",
								AREA: oInputTmp_final[fi_tmp].AREA, DESAREA: oInputTmp_final[fi_tmp].DESAREA, CLIENT: clientData, CLIENT_ITEM: "TESTING"
							});
						}
					}

					oModel.oData.input = [];
					oModel.oData.input = oInputTmp;

					this._drawGraph(oInputTmp);

					oModel.refresh();
					addRowFlg = 0;
					return;
				}


				//Duyen start - None of aboved cases - edit directly in input table
				if (isFinal == "X") {
					oModel.oData.final = []
					for (let ifi = 0; ifi < oModel.oData.input.length; ifi++) {
						oModel.oData.final.push({
							SOURCE: oModel.oData.input[ifi].SOURCE, INDSOURCE: oModel.oData.input[ifi].INDSOURCE,
							DESTINATION: oModel.oData.input[ifi].DESTINATION, INDDEST: oModel.oData.input[ifi].INDDEST,
							MATCH_FLAG: oModel.oData.input[ifi].RELATIONSHIP, NEW_FLAG: "",
							AREA: oModel.oData.input[ifi].AREA, DESAREA: oModel.oData.input[ifi].DESAREA, CLIENT: clientData, CLIENT_ITEM: "TESTING"
						});
					}
				}
				this._drawGraph(oModel.oData.input);

				// if (oInputTmp == undefined) {
				// 	oInputTmp = oModel.oData.input;
				// }
				//this._drawGraph(oInputTmp)

				oModel.refresh();
				return;
			},
			/**
					 * Function to draw graph from input data
					 * @param {*} oInput: input data( structure SOURCE,INDSOURCE,DESTINATION,INDDEST,RELATIONSHIP)
					 */
			_drawGraph: function (oInput) {
				oModel.refresh();
				/**
				 * Showcase only
				 */
				let JPNodesPairs = [JSON.stringify(['人的資本への取組み', '多様性の推進']),
				JSON.stringify(['多様性の推進', '多様な社員の獲得']),
				JSON.stringify(['ZERO WASTE', 'LESS WASTE & MORE RECYCLE']),
				JSON.stringify(['LESS WASTE & MORE RECYCLE', 'INCREASE OF RECYCLEING']),]

				let JPIndPairs = [JSON.stringify(['キャリア採用数', '女性管理職比率']),
				JSON.stringify(['女性管理職比率', '社員の定着率']),
				JSON.stringify(['社員の定着率', '特許出願件数']),
				JSON.stringify(['特許出願件数', 'ROE']),
				JSON.stringify(['Industrial waste recycling rate', 'Number of press releases']),
				JSON.stringify(['Number of press releases', 'Number of customers in open factory']),
				JSON.stringify(['Number of customers in open factory', 'Sales amount']),
				JSON.stringify(['Sales amount', 'PBR']),
				JSON.stringify(['Sales amount', 'ROE'])]

				var groupSet = new Set()
				var dataSet = new Set();
				var indicatorSet = new Set();
				color = "ReleventNode"

				var ind = 'Indicator ';
				var nde = 'Box ';
				var grp = 'Hypothesis ';

				var sourceGroupStatus, destGroupStatus
				var sourceGroupName, destGroupName

				let graphTab = this.getView().byId("graphWrapper");
				let tabContainer = this.getView().byId('TabContainer');

				//  oModel.oData.input = this.uniqBy(oInput, JSON.stringify);
				// console.log(oModel.oData.input);

				oModel.oData.groups = [];
				oModel.oData.lines = [];
				oModel.oData.nodes = [];
				var arraySet = [];
				var flag_solid = false;

				// console.log(oModel.oData.lines);
				oModel.oData.linetmp = [];
				for (var i = 0; i < oInput.length; i++) {

					// if (oInput[i].AREA == '') {
					// 	oInput[i].AREA = 'Effects/Impacts';

					// }

					// if (oInput[i].DESAREA == '') {
					// 	oInput[i].DESAREA = 'Effects/Impacts';
					// }

					sourceGroupName = oInput[i].AREA;
					destGroupName = oInput[i].DESAREA;
					if (sourceGroupName != '') {
						sourceGroupStatus = 'Group1'
					} else {
						sourceGroupStatus = 'Group2'
					}
					if (destGroupName != '') {
						destGroupStatus = 'Group1'
					} else {
						destGroupStatus = 'Group2'
					}

					// switch (oInput[i].AREA) {
					// 	case 'ESG Activity':
					// 		sourceGroupStatus = 'Group1'
					// 		break;
					// 	case 'Cost for ESG KPI':
					// 		sourceGroupStatus = 'Group2'
					// 		break;
					// 	case 'Effects/Impacts':
					// 		sourceGroupStatus = 'Group3'
					// 		break;
					// }

					// switch (oInput[i].DESAREA) {
					// 	case 'ESG Activity':
					// 		destGroupStatus = 'Group1'
					// 		break;
					// 	case 'Cost for ESG KPI':
					// 		destGroupStatus = 'Group2'
					// 		break;
					// 	case 'Effects/Impacts':
					// 		destGroupStatus = 'Group3'
					// 		break;
					// }



					//Trinh code start-------------------------------------
					// console.log(i);
					oInput[i].SOURCE = oInput[i].SOURCE.toUpperCase();
					oInput[i].DESTINATION = oInput[i].DESTINATION.toUpperCase();

					var source = oInput[i].SOURCE.toUpperCase()
					var sourceIn = oInput[i].INDSOURCE
					var destination = oInput[i].DESTINATION.toUpperCase()
					var destinationIn = oInput[i].INDDEST
					var relationship = oInput[i].RELATIONSHIP
					var clientInput = clientData;
					if (!destination) {
						destination = ''
					}
					if (!sourceIn) {
						sourceIn = ''
					}
					if (!destinationIn) {
						destinationIn = ''
					}
					if (sourceGroupName != '' && sourceIn != '') {
						new sap.m.MessageBox.error("Cannot set Area for Source/Destination has Indicators", {
							title: "Alert",                                      // default
							onClose: null,                                       // default
							styleClass: "",                                      // default
							actions: sap.m.MessageBox.Action.OK,                 // default
							emphasizedAction: sap.m.MessageBox.Action.OK,        // default
							initialFocus: null,                                  // default
							textDirection: sap.ui.core.TextDirection.Inherit     // default
						});
						// MessageToast.error("Cannot set Area for Source/Destination has Indicators")
						return
					}
					if (destGroupName != '' && destinationIn != '') {
						new sap.m.MessageBox.error("Cannot set Area for Source/Destination has Indicators", {
							title: "Alert",                                      // default
							onClose: null,                                       // default
							styleClass: "",                                      // default
							actions: sap.m.MessageBox.Action.OK,                 // default
							emphasizedAction: sap.m.MessageBox.Action.OK,        // default
							initialFocus: null,                                  // default
							textDirection: sap.ui.core.TextDirection.Inherit     // default
						});
						// MessageToast.error("Cannot set Area for Source/Destination has Indicators")
						return
					}

					if (source != "" && destination != "") {

						/**
						 * add connector bw source and destination
						 * (8/3/2023): No need to check relationship 
						 */
						for (var index = 0; index < oModel.oData.lines.length; index++) {
							if (oModel.oData.lines[index].SOURCE == source &&
								oModel.oData.lines[index].DESTINATION == destination) {
								// console.log(oModel.oData.lines)
								oModel.oData.lines.splice(index, 1)
								// oModel.oData.input.splice(index, 1)
								// MessageBox.error("Duplicate is not allowed");
								break;
							}
						}

						/**
						 * Showcase only - 19/4/2023
						 */
						//let check_flg = ""
						if (isFinal == "") {

							if (!JPNodesPairs.includes(JSON.stringify([source, destination]))) {
								// for (var check = 0; check < oInput.length; check++) {
								// 	if (oInput[i].SOURCE == oInput[check].SOURCE && oInput[i].DESTINATION == oInput[check].DESTINATION
								// 		&& (oInput[check].RELATIONSHIP == 'O' || oInput[check].RELATIONSHIP == 'o' || oInput[check].RELATIONSHIP == 'X' || oInput[check].RELATIONSHIP == 'x')) {
								// 		check_flg = true;
								// 		break;
								// 	}
								// }
								// if (check_flg != true) {

								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination, CLIENT: clientInput,
									status: 'customLine', lineType: "Solid"
								});

								//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source, DESTINATION: destination,
									status: "customLine", lineType: "Solid"
								});


								// } else {
								// 	if(oInput[i].RELATIONSHIP == 'O' || oInput[i].RELATIONSHIP == 'o'){
								// 		oModel.oData.lines.push({
								// 			SOURCE: source, DESTINATION: destination, CLIENT: clientInput,
								// 			status: 'DemonReleNode', lineType: "Solid"
								// 		});
								// 	}
								// }
							} else {

								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination, CLIENT: clientInput,
									status: color, lineType: "Solid"
								});

								//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source, DESTINATION: destination,
									status: color, lineType: "Solid"
								});

							}
						}


						// oModel.oData.lines.push({
						// 	SOURCE: source, DESTINATION: destination, CLIENT: clientInput,
						// 	status: color, lineType: "Solid"
						// });


						//Add source node
						if (!dataSet.has(source)) {
							// oModel.oData.groups.push({ key: source, title: grp.concat(source) })
							// oModel.oData.nodes.push({ key: source, title: nde.concat(source), status: 'Information', shape: "Box", group: source })
							// oModel.oData.groups.push({ key: source, title: sourceGroupName, status: sourceGroupStatus, client: clientInput })
							// arraySet[source] = new Set();
							// //oModel.oData.nodes.push({ key: source, title: nde.concat(source), status: 'Src_DesNode', shape: "Box", group: source, client: clientInput }) duyen
							// oModel.oData.nodes.push({ key: source, title: source, status: 'Src_DesNode', shape: "Box", group: source, client: clientInput })
							// arraySet[source].add(source);
							if (sourceGroupName != '') {
								if (!groupSet.has(sourceGroupName)) {
									oModel.oData.groups.push({ key: source, title: sourceGroupName, status: sourceGroupStatus, client: clientInput })
									groupSet.add(sourceGroupName)
								}
								//Set the node to the group with the same name as Area 
								oModel.oData.groups.forEach(group => {
									if (group.title === sourceGroupName) {
										oModel.oData.nodes.push({ key: source, title: source, status: 'Src_DesNode', shape: "Box", group: group.key, client: clientInput })
									}
								});

							} else {
								oModel.oData.groups.push({ key: source, title: sourceGroupName, status: sourceGroupStatus, client: clientInput })
								oModel.oData.nodes.push({ key: source, title: source, status: 'Src_DesNode', shape: "Box", group: source, client: clientInput })
							}
							arraySet[source] = new Set();
							//oModel.oData.nodes.push({ key: source, title: nde.concat(source), status: 'Src_DesNode', shape: "Box", group: source, client: clientInput }) duyen

							arraySet[source].add(source);
						}
						if (!dataSet.has(destination)) {
							// oModel.oData.groups.push({ key: destination, title: grp.concat(destination) })
							// oModel.oData.nodes.push({ key: destination, title: nde.concat(destination), status: 'Information', shape: "Box", group: destination })
							// oModel.oData.groups.push({ key: destination, title: destGroupName, status: destGroupStatus, client: clientInput })
							// arraySet[destination] = new Set();
							// //oModel.oData.nodes.push({ key: destination, title: nde.concat(destination), status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput }) duyen
							// oModel.oData.nodes.push({ key: destination, title: destination, status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput })
							// arraySet[destination].add(destination);
							if (destGroupName != '') {
								console.log(destGroupName)
								if (!groupSet.has(destGroupName)) {
									oModel.oData.groups.push({ key: destination, title: destGroupName, status: destGroupStatus, client: clientInput })
									groupSet.add(destGroupName)
								}
								oModel.oData.groups.forEach(group => {
									if (group.title == destGroupName) {
										console.log(group.key)
										oModel.oData.nodes.push({ key: destination, title: destination, status: 'Src_DesNode', shape: "Box", group: group.key, client: clientInput })
									}
								});

							} else {
								oModel.oData.groups.push({ key: destination, title: destGroupName, status: destGroupStatus, client: clientInput })
								//oModel.oData.nodes.push({ key: destination, title: nde.concat(destination), status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput }) duyen
								oModel.oData.nodes.push({ key: destination, title: destination, status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput })
							}
							arraySet[destination] = new Set();
							arraySet[destination].add(destination);
						}
						// Add indicator node 
						if (sourceIn != '' && !arraySet[source].has(sourceIn)) {
							//oModel.oData.nodes.push({ key: source.concat(sourceIn), title: ind.concat(sourceIn), status: 'IndNode', shape: "Box", group: source, client: clientInput }) duyen
							oModel.oData.nodes.push({ key: source.concat(sourceIn), title: sourceIn, status: 'IndNode', shape: "Box", group: source, client: clientInput })
							arraySet[source].add(sourceIn);
						}
						if (destinationIn != '' && !arraySet[destination].has(destinationIn)) {
							//oModel.oData.nodes.push({ key: destination.concat(destinationIn), title: ind.concat(destinationIn), status: 'IndNode', shape: "Box", group: destination, client: clientInput }) duyen
							oModel.oData.nodes.push({ key: destination.concat(destinationIn), title: destinationIn, status: 'IndNode', shape: "Box", group: destination, client: clientInput })
							arraySet[destination].add(destinationIn);
						}

						//DRAW LINES LOGIC 
						if (source == "" && destination != "") {
							oModel.oData.lines.push({
								SOURCE: destination, DESTINATION: destination, CLIENT: clientInput,
								status: color, lineType: "Solid"
							});
						}

						if (source != "" && destination == "") {
							oModel.oData.lines.push({
								SOURCE: source, DESTINATION: source, CLIENT: clientInput,
								status: color, lineType: "Solid"
							});
						}

						/*START - DRAW LINE LOGIC*/
						/*LOGIC FOR INDICATOR DRAWING*/
						//oModel.oData.linetmp = []; //Duyen comment 04/08
						let id_green = this.getView().byId("ID_Green").getSelected();
						let id_grey = this.getView().byId("ID_Grey").getSelected();
						let id_black = this.getView().byId("ID_Black").getSelected();
						let id_blue = this.getView().byId("ID_Blue").getSelected();

						//If line is new line 
						let new_entry = false
						if (isFinal == "X") {
							for (var final = 0; final < oModel.oData.final.length; final++) {
								let current_final = oModel.oData.final[final];
								//RED lines for new records
								if (current_final.SOURCE.toUpperCase() == source && current_final.INDSOURCE == sourceIn
									&& current_final.DESTINATION.toUpperCase() == destination && current_final.INDDEST == destinationIn
									&& current_final.NEW_FLAG.toUpperCase() == "O") {

									//RED DASHED for Indicators
									oModel.oData.lines.push({
										SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										status: "ReleventIndicator", lineType: "Dashed"
									});

									//RED Solid for Boxes 
									oModel.oData.lines.push({
										SOURCE: source, DESTINATION: destination,
										status: 'ReleventNode', lineType: "Solid"
									});
									new_entry = true
									break;
								}
							}
						}

						if (new_entry == false) {
							if (oInput[i].RELATIONSHIP == 'O' || oInput[i].RELATIONSHIP == 'o') {
								//Change Indicator color
								if (sourceIn != '' && destinationIn != '') {

									/**
									 * Showcase only
									 */
									if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
									) {
										// BLACK CONNECTOR CHECKED, 
										// ->THEN PUSH BLACK CONNECTOR TO GRAPH
										if (id_black == true) {
											oModel.oData.lines.push({
												SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
												status: "DemonReleInd", lineType: "Solid"
											});

											// PUSH BLACK CONNECTOR TO TEMPORARY MODEL FOR LATER USE
											oModel.oData.linetmp.push({
												SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
												status: "DemonReleInd", lineType: "Solid"
											});
										}

									} else {
										oModel.oData.lines.push({
											SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
											//sta vtus: 'customLineIndicator', lineType: "Dashed"
											status: "ReleventIndicator", lineType: "Solid"
										});

									}
								}

								if (source != '' && destination != '') {
									//THAI - IF GREEN CONNECTOR CHECKED, THEN PUSH GREEN CONNECTOR TO GRAPH

									//Check box GREEN is checked
									if (id_green == true) {

										flag_solid = false
										for (var igreen = 0; igreen < oModel.oData.lines.length; igreen++) {
											var currentLine_tmp = oModel.oData.lines[igreen];
											var source_tmp = currentLine_tmp.SOURCE;
											var destination_tmp = currentLine_tmp.DESTINATION;
											var lineType_tmp = currentLine_tmp.lineType;
											var status_tmp = currentLine_tmp.status;

											if (source_tmp == oInput[i].SOURCE && destination_tmp == oInput[i].DESTINATION) {
												oModel.oData.lines[igreen].status = 'DemonReleNode';
												oModel.oData.linetmp[igreen].status = 'DemonReleNode';
												flag_solid = true
												break;
											}
										}

										if (flag_solid == false) {
											oModel.oData.lines.push({
												SOURCE: source, DESTINATION: destination,
												status: 'DemonReleNode', lineType: "Solid"
											});

											// PUSH GREEN CONNECTOR TO TEMPORARY MODEL FOR LATER USE
											oModel.oData.linetmp.push({
												SOURCE: source, DESTINATION: destination,
												status: 'DemonReleNode', lineType: "Solid"
											});
										}
									}

									//Checkbox GREEN is unchecked
									//=>PUSH NORMAL CONNECTOR TO GRAPH
									else {
										flag_solid = false
										for (var igreen = 0; igreen < oModel.oData.lines.length; igreen++) {
											var currentLine_gr = oModel.oData.lines[igreen];
											var source_nor = currentLine_gr.SOURCE;
											var destination_nor = currentLine_gr.DESTINATION;
											var lineType_nor = currentLine_gr.lineType;
											var status_nor = currentLine_gr.status;
											//if LINE is GREEN
											if (source_nor == oInput[i].SOURCE && destination_nor == oInput[i].DESTINATION && status_nor == "DemonReleNode") {
												oModel.oData.lines[igreen].status = 'customLine'; //GREEN -> NORMAL 
												oModel.oData.linetmp[igreen].status = 'customLine'; //GREEN -> NORMAL
												flag_solid = true
												break;
											}
										}

										//If line is not existed
										if (flag_solid == false) {
											oModel.oData.lines.push({
												SOURCE: source, DESTINATION: destination,
												status: 'customLine', lineType: "Solid"
											});
										}
									}
								}

							} else if (oInput[i].RELATIONSHIP == 'x' || oInput[i].RELATIONSHIP == 'X') {
								if (sourceIn != '' && destinationIn != '') { //Push BLUE

									/**
									 * Showcase only
									 */
									if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))) {
										//THAI - IF BLUE CONNECTOR CHECKED, THEN PUSH CONNECTOR TO GRAPH
										if (id_blue == true) {
											oModel.oData.lines.push({
												SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
												status: "NDemonReleInd", lineType: "Dashed"
											});

											oModel.oData.linetmp.push({
												SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
												status: "NDemonReleInd", lineType: "Dashed"
											});
										}

									} else {
										oModel.oData.lines.push({
											SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
											status: 'customLineIndicator', lineType: "Solid"
										});
									}
								}

								if (source != '' && destination != '') {
									//IF GREY CONNECTOR CHECKED, 
									//-> THEN PUSH CONNECTOR TO GRAPH
									if (id_grey == true) {
										//Duyen add
										//If line already existed=> change to GREY
										flag_solid = false
										for (var igrey = 0; igrey < oModel.oData.lines.length; igrey++) {
											var currentLine_tmp_g = oModel.oData.lines[igrey];
											var source_tmp_g = currentLine_tmp_g.SOURCE;
											var destination_tmp_g = currentLine_tmp_g.DESTINATION;
											var lineType_tmp_g = currentLine_tmp_g.lineType;
											var status_tmp_g = currentLine_tmp_g.status;

											if (source_tmp_g == oInput[i].SOURCE && destination_tmp_g == oInput[i].DESTINATION) {
												oModel.oData.lines[igrey].status = 'NDemonReleNode';
												oModel.oData.linetmp[igrey].status = 'NDemonReleNode';

												oModel.oData.lines[igrey].lineType = "Dashed";
												oModel.oData.linetmp[igrey].lineType = "Dashed";
												flag_solid = true
												break;
											}

										}

										if (flag_solid == false) {
											oModel.oData.lines.push({
												SOURCE: source, DESTINATION: destination,
												status: "NDemonReleNode", lineType: "Dashed"
											});

											// PUSH GREY CONNECTOR TO TEMPORARY MODEL FOR LATER USE
											oModel.oData.linetmp.push({
												SOURCE: source, DESTINATION: destination,
												status: "NDemonReleNode", lineType: "Dashed"
											});
										}
									}

									//GREY is unchecked
									//-> ELSE PUSH NORMAL CONNECTOR TO GRAPH
									else {

										//Duyen add
										//If line already existed => change to Normal
										//Flag = Line existed
										flag_solid = false
										for (var igrey = 0; igrey < oModel.oData.lines.length; igrey++) {
											var currentLine_gno = oModel.oData.lines[igrey];
											var source_g = currentLine_gno.SOURCE;
											var destination_g = currentLine_gno.DESTINATION;
											var lineType_g = currentLine_gno.lineType;
											var status_g = currentLine_gno.status;
											if (source_g == oInput[i].SOURCE && destination_g == oInput[i].DESTINATION && status_g == "NDemonReleNode") { //&& lineType_g == "Dashed" 
												oModel.oData.lines[igrey].status = 'customLine' //CHANGE GREY TO NORMAL CONNECTOR
												oModel.oData.linetmp[igrey].status = 'customLine'

												oModel.oData.lines[igrey].lineType = "Solid"
												oModel.oData.linetmp[igrey].lineType = "Solid"
												flag_solid = true
												break;
											}
										}

										//If line does not exist
										if (flag_solid == false) {
											oModel.oData.lines.push({ //Push normal line
												SOURCE: source, DESTINATION: destination,
												status: 'customLine', lineType: 'Solid'
											});
										}
									}
								}
							} else {  //REALATIONSHIP == empty
								//"DUyen" 20/09


								//If line already exist => copy Status and LineTYpe 
								flag_solid = false
								//Push same as previous defined line if any
								for (let solid = 0; solid < oModel.oData.linetmp.length; solid++) {
									if (oModel.oData.linetmp[solid].SOURCE == source && oModel.oData.linetmp[solid].DESTINATION == destination && (oModel.oData.linetmp[solid].status != "customLine" && oModel.oData.linetmp[solid].status != "ReleventNode")) {
										oModel.oData.lines.push({
											SOURCE: source, DESTINATION: destination,
											status: oModel.oData.linetmp[solid].status, lineType: "Solid"
										});

										flag_solid = true
										break;
									}
								}
								if (isFinal == "X") {
									//If line does not exist
									if (flag_solid == false) { //Push normal line
										if (!JPNodesPairs.includes(JSON.stringify([source, destination]))) {
											oModel.oData.lines.push({
												SOURCE: source, DESTINATION: destination,
												status: 'customLine', lineType: "Solid"
											});
										} else {
											oModel.oData.lines.push({
												SOURCE: source, DESTINATION: destination, CLIENT: clientInput,
												status: color, lineType: "Solid"
											});
										}
									}
								}
							}
							/*END - DRAW LINE LOGIC*/
						}

						dataSet.add(source);
						dataSet.add(destination);
						indicatorSet.add(sourceIn)
						indicatorSet.add(destinationIn)
					}
					// console.log(oModel.oData)
					for (var y = 0; y < i; y++) {
						if (oInput[y].SOURCE == source &&
							oInput[y].DESTINATION == destination &&
							oInput[y].INDSOURCE == sourceIn &&
							oInput[y].INDDEST == destinationIn) {
							// oModel.oData.input.splice(index, 1);
							MessageBox.error("Duplicate is not allowed, index ".concat(y + 1));
							return;
						}

						if (oInput[y].SOURCE == source &&
							oInput[y].DESTINATION == destination &&
							destinationIn == '' &&
							sourceIn == '') {
							MessageBox.error("Duplicate is not allowed, index ".concat(y + 1));
							return;
						}

						if (oInput[y].SOURCE == source &&
							destination == '' &&
							destinationIn == '' &&
							oInput[y].INDSOURCE != '' &&
							oInput[y].INDSOURCE == sourceIn) {
							MessageBox.error("Duplicate indicators in 1 source is not allowed");
							return;
						}

						if (
							// source == '' && 
							oInput[y].DESTINATION == destination &&
							oInput[y].INDDEST == destinationIn &&
							oInput[y].INDDEST != '' &&
							source == '' &&
							sourceIn == ''
						) {
							MessageBox.error("Duplicate indicators in 1 Destination is not allowed");
							return;
						}
					}

					if (source == "" || destination == "") {
						if (source != "" && !dataSet.has(source)) {
							// oModel.oData.groups.push({ key: source, title: grp.concat(source) })
							// oModel.oData.nodes.push({ key: source, title: nde.concat(source), status: 'Information', shape: "Box", group: source })

							oModel.oData.groups.push({ key: source, title: sourceGroupName, status: sourceGroupStatus, client: clientInput })
							arraySet[source] = new Set();
							//oModel.oData.nodes.push({ key: source, title: nde.concat(source), status: 'Src_DesNode', shape: "Box", group: source, client: clientInput }) duyen
							oModel.oData.nodes.push({ key: source, title: source, status: 'Src_DesNode', shape: "Box", group: source, client: clientInput })
							arraySet[source].add(source);
						}

						if (destination != "" && !dataSet.has(destination)) {
							// oModel.oData.groups.push({ key: destination, title: grp.concat(destination) })
							// oModel.oData.nodes.push({ key: destination, title: nde.concat(destination), status: 'Information', shape: "Box", group: destination })

							oModel.oData.groups.push({ key: destination, title: destGroupName, status: destGroupStatus, client: clientInput })
							arraySet[destination] = new Set();
							//oModel.oData.nodes.push({ key: destination, title: nde.concat(destination), status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput }) duyen
							oModel.oData.nodes.push({ key: destination, title: destination, status: 'Src_DesNode', shape: "Box", group: destination, client: clientInput })
							arraySet[destination].add(destination);
						}

						if (sourceIn != '') {
							if (source != "" && !arraySet[source].has(sourceIn)) {
								//oModel.oData.nodes.push({ key: source.concat(sourceIn), title: ind.concat(sourceIn), status: 'IndNode', shape: "Box", group: source, client: clientInput }) duyen
								oModel.oData.nodes.push({ key: source.concat(sourceIn), title: sourceIn, status: 'IndNode', shape: "Box", group: source, client: clientInput })
								arraySet[source].add(sourceIn);
							}
							if (source == "") {
								// oModel.oData.input.splice(i, 1);
								MessageBox.error("Indicator with no Source node is not allowed");
								return
							}
						}
						if (destinationIn != '') {
							if (destination != "" && !arraySet[destination].has(destinationIn)) {
								//oModel.oData.nodes.push({ key: destination.concat(destinationIn), title: ind.concat(destinationIn), status: 'IndNode', shape: "Box", group: destination, client: clientInput })
								oModel.oData.nodes.push({ key: destination.concat(destinationIn), title: destinationIn, status: 'IndNode', shape: "Box", group: destination, client: clientInput })
								arraySet[destination].add(destinationIn);
							}
							if (destination == "") {
								// oModel.oData.input.splice(i, 1);
								MessageBox.error("Indicator with no Desination node is not allowed");
								return
							}
						}

						dataSet.add(source);
						dataSet.add(destination);
						indicatorSet.add(sourceIn)
						indicatorSet.add(destinationIn)
					}
				}

				//Adjust dashed line for GREY
				for (let col = 0; col < oModel.oData.lines.length; col++) {
					if (oModel.oData.lines[col].status == 'NDemonReleNode') {
						oModel.oData.lines[col].lineType = "Dashed"
					}
					if (oModel.oData.lines[col].status == 'customLine') {
						oModel.oData.lines[col].lineType = "Solid"
					}
				}


				console.log("aaaaaaaaaaaaaaaaaaaaaa");
				// if (isAnalysed) {
				// 	this.merge()
				// }

				// tabContainer.setVisible(true)
				// tabContainer.addItem(new sap.m.TabContainerItem({
				//     name: 'Graph Tab',
				//     content: [graphTab.setVisible(true), oModel]
				// }))
				// tabContainer.addItem(new sap.m.TabContainerItem({
				//     name: 'Freedom adjust coefficent',
				//     content: ""
				// }))

				oModel.refresh();
				console.log(oModel);
				//Trinh code end-------------------
			},
			/**
				 * Handle AfterLayouting event of Graph --> After layout algorithm of Graph executed, rearrange position of some nodes base on requirements
				 * @param {*} oEvent 
				 */
			afterLayouting: function (oEvent) {
				let oGraph = oEvent.getSource()
				//Arrange all indicator nodes vertically line up with SOURCE/DESTINATION node
				this._arrangeNodes(oGraph)
				//Bring the SOURCE/DESTINATION node to top order
				this._toTop(oGraph)
				//Adjust Line and Coordinate after position change
				this._adjustLine(oGraph)
			},
			/**
				 * Handle AfterLayouting event of Graph --> After layout algorithm of Graph executed, rearrange position of some nodes base on requirements
				 * @param {*} oEvent 
				 */
			search: function (oEvent) {
				var text = oEvent.getParameter("key");
				searchText = text;
				var count = oModel.oData.input.length;
				var output;
				var outputBox = [];
				if (text != undefined) {
					var indexStart = text.indexOf("[");
					var indexEnd = text.indexOf("]");

					/* User choosing to search for a connector (line) */
					if (indexStart != -1 && indexEnd != -1) {
						indexTable = [];
						lineIndex = text.substring(indexStart + 1, indexEnd);
						if (oModel.oData.input.length == 1) {
							oModel.oData.input = oInputTmp;
						}
						else {
							oInputTmp = oModel.oData.input;
						}
						for (var i = 0; i < oModel.oData.input.length; i++) {
							var sourceAlone = oModel.oData.input[i].SOURCE;
							var desAlone = oModel.oData.input[i].DESTINATION;
							var sourceInd = oModel.oData.input[i].SOURCE.concat(oModel.oData.input[i].INDSOURCE);
							var destInd = oModel.oData.input[i].DESTINATION.concat(oModel.oData.input[i].INDDEST);
							var lineSource = oModel.oData.lines[lineIndex].SOURCE;
							var lineDes = oModel.oData.lines[lineIndex].DESTINATION;
							var client = oModel.oData.lines[lineIndex].CLIENT;

							if (sourceAlone == lineSource && desAlone == lineDes) {
								output = oModel.oData.input[i];
								indexTable.push(i);
								break;
							}
							if (sourceInd == lineSource && destInd == lineDes) {
								output = oModel.oData.input[i];
								indexTable.push(i);
								break;
							}
						}
						// output = oModel.oData.input[lineIndex];
						oModel.oData.input = [];
						oModel.oData.input.push({ SOURCE: output.SOURCE, INDSOURCE: output.INDSOURCE, DESTINATION: output.DESTINATION, INDDEST: output.INDDEST, RELATIONSHIP: output.RELATIONSHIP, AREA: output.AREA, DESAREA: output.DESAREA, CLIENT: oInput.CLIENT });
						oModel.refresh();
						searchFlag = 1
					} else { /* User search for a box */
						// console.log(text);
						indexTable = [];
						oInputTmp = oModel.oData.input;
						for (var i = 0; i < oModel.oData.input.length; i++) {
							if (oModel.oData.input[i].SOURCE == text ||
								oModel.oData.input[i].DESTINATION == text ||
								oModel.oData.input[i].SOURCE.concat(oModel.oData.input[i].INDSOURCE) == text ||
								oModel.oData.input[i].DESTINATION.concat(oModel.oData.input[i].INDDEST) == text) {
								outputBox.push({ SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE, DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST, RELATIONSHIP: oModel.oData.input[i].RELATIONSHIP, AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA, CLIENT: oModel.oData.input[i].CLIENT });
								indexTable.push(i);
							}

							// if(oModel.oData.input[i].SOURCE.concat(oModel.oData.input[i].INDSOURCE) == text || oModel.oData.input[i].DESTINATION.concat(oModel.oData.input[i].INDDEST) == text ){
							// 	outputBox.push({ SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE, DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST, RELATIONSHIP: oModel.oData.input[i].RELATIONSHIP, AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA });
							// }
						}
						// console.log(indexTable);
						oModel.oData.input = [];
						for (var y = 0; y < outputBox.length; y++) {
							oModel.oData.input.push({ SOURCE: outputBox[y].SOURCE, INDSOURCE: outputBox[y].INDSOURCE, DESTINATION: outputBox[y].DESTINATION, INDDEST: outputBox[y].INDDEST, RELATIONSHIP: outputBox[y].RELATIONSHIP, AREA: outputBox[y].AREA, DESAREA: outputBox[y].DESAREA, CLIENT: outputBox[y].CLIENT });
						}
						oModel.refresh();
						searchFlag = 2;
					}
				} else {
					// if(searchFlag == 1){
					if (oInputTmp != undefined) {
						oModel.oData.input = oInputTmp;
						oInputTmp = undefined;
						searchText = undefined;
						searchFlag = 3;
					}
					oModel.refresh();
					// }
				}
				// }
			},
			refresh: function () {
				if (oInputTmp != undefined) {
					oModel.oData.input = oInputTmp;
					oInputTmp = undefined;
					// searchText = undefined;
					// searchFlag = 3;
				}

				this._drawGraph(oModel.oData.input)

				oModel.refresh();
			},
			/**
				 * Handle AfterLayouting event of Graph --> After layout algorithm of Graph executed, rearrange position of some nodes base on requirements
				 * @param {*} oEvent 
				 */
			pressNode: function (oEvent) {
				var text = oEvent.getParameter("id");
				// if(text != undefined){
				// 	console.log(text);
				// } else {
				// 	console.log("KHONG CO DATA");
				// }
				indexTable = [];
				var outputBox = [];
				if (text != "") {
					var index = text.substring(74, text.length);
					if (oInputTmp == undefined) {
						oInputTmp = oModel.oData.input;
					} else {
						oModel.oData.input = oInputTmp;
					}
					// oModel.oData.input = [];
					for (var i = 0; i < oModel.oData.input.length; i++) {
						if (oModel.oData.input[i].SOURCE == oModel.oData.nodes[index].key ||
							oModel.oData.input[i].SOURCE.concat(oModel.oData.input[i].INDSOURCE) == oModel.oData.nodes[index].key ||
							oModel.oData.input[i].DESTINATION == oModel.oData.nodes[index].key ||
							oModel.oData.input[i].DESTINATION.concat(oModel.oData.input[i].INDDEST) == oModel.oData.nodes[index].key) {
							outputBox.push({ SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE, DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST, RELATIONSHIP: oModel.oData.input[i].RELATIONSHIP, AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA, CLIENT: oModel.oData.input[i].CLIENT });
							indexTable.push(i);
						}
					}
					oModel.oData.input = [];

					for (var y = 0; y < outputBox.length; y++) {
						oModel.oData.input.push({ SOURCE: outputBox[y].SOURCE, INDSOURCE: outputBox[y].INDSOURCE, DESTINATION: outputBox[y].DESTINATION, INDDEST: outputBox[y].INDDEST, RELATIONSHIP: outputBox[y].RELATIONSHIP, AREA: outputBox[y].AREA, DESAREA: outputBox[y].DESAREA, CLIENT: outputBox[y].CLIENT });
					}
					oModel.refresh();
					clickFlg = 1;
				}


				// console.log(text);
				// console.log(oModel.oData.nodes);
			},
			/**
				 * Handle AfterLayouting event of Graph --> After layout algorithm of Graph executed, rearrange position of some nodes base on requirements
				 * @param {*} oEvent 
				 */
			pressLine: function (oEvent) {
				var output;
				var text = oEvent.getParameter("id");
				var lineIndex = text.substring(74, text.length);
				indexTable = [];
				if (oInputTmp == undefined) {
					oInputTmp = oModel.oData.input;
				} else {
					oModel.oData.input = oInputTmp;
				}

				for (var i = 0; i < oModel.oData.input.length; i++) {
					var sourceAlone = oModel.oData.input[i].SOURCE;
					var desAlone = oModel.oData.input[i].DESTINATION;
					var sourceInd = oModel.oData.input[i].SOURCE.concat(oModel.oData.input[i].INDSOURCE);
					var destInd = oModel.oData.input[i].DESTINATION.concat(oModel.oData.input[i].INDDEST);
					var lineSource = oModel.oData.lines[lineIndex].SOURCE;
					var lineDes = oModel.oData.lines[lineIndex].DESTINATION;
					var client = oModel.oData.lines[lineIndex].CLIENT;

					if (sourceAlone == lineSource && desAlone == lineDes) {
						output = oModel.oData.input[i];
						indexTable.push(i);
						break;
					}
					if (sourceInd == lineSource && destInd == lineDes) {
						output = oModel.oData.input[i];
						indexTable.push(i);
						break;
					}
				}
				oModel.oData.input = [];
				oModel.oData.input.push({ SOURCE: output.SOURCE, INDSOURCE: output.INDSOURCE, DESTINATION: output.DESTINATION, INDDEST: output.INDDEST, RELATIONSHIP: output.RELATIONSHIP, AREA: output.AREA, DESAREA: output.DESAREA, CLIENT: clientData });
				oModel.refresh();
				clickFlg = 2
			},
			/**
				 * Handle AfterLayouting event of Graph --> After layout algorithm of Graph executed, rearrange position of some nodes base on requirements
				 * @param {*} oEvent 
				 */
			selectChange: function (oEvent) {
				var text = oEvent.getParameters();
				// console.log(text);
				// if(clickFlg != 1){
				// 	if(oInputTmp != undefined){
				// 		oModel.oData.input = oInputTmp;
				// 		oInputTmp = undefined;
				// 		// searchText = undefined;
				// 		searchFlag = 3;
				// 	}
				// 	oModel.refresh();
				// }
			},
			_switchNodes: function (topNode, node, groupNodes) {
				//Switch location between top node and Src/Des node
				let y = topNode.getY()
				// topNode.setX(node.getX())
				topNode.setY(node.getY())
				// node.setX(x)
				node.setY(y)
			},
			/**
					 * Function to Arrange all the nodes inside group stay in 1 vertical line based on position of SOURCE/DESTINATION Node
					 * @param {*} oGraph 
					 */
			_arrangeNodes: function (oGraph) {
				let oGroup = oGraph.getGroups()
				let nodeSpacing = this.getView().getModel('settings').oData.nodeSpacing
				// console.log(oGraph)
				//Find the SOURCE/DESTINATION node --> Loop over groups' nodes and compare the key of node
				for (let i = 0; i < oGroup.length; i++) {
					let status = oGroup[i].mProperties.status
					if (status === 'Group2') {
						let groupNodes = oGroup[i].getNodes()
						let groupKey = oGroup[i].getKey()
						let node, widestNode, leftMostNode
						let maxNodeWidth = 0
						let leftMostX = Infinity
						for (var k = 0; k < groupNodes.length; k++) {
							let currentNode = groupNodes[k]
							let nodeKey = currentNode.getKey() // Current Node key
							//Get the widest node's width
							if (maxNodeWidth < currentNode._iWidth) {
								// widestNode = currentNode
								maxNodeWidth = currentNode._iWidth
							}
							// Get the left most node
							if (leftMostX > currentNode.getX()) {
								leftMostX = currentNode.getX()
								// leftMostNode = currentNode
							}
							//The node is SOURCE or DESTINATION node when its key equal to Group's key
							if (nodeKey == groupKey) {
								node = currentNode
								// console.log(currentNode)
								node.addStyleClass("BoldText")
							} else {
								currentNode.removeStyleClass("BoldText")
							}
						}
						// Move source node to the left side of group
						node.setX(leftMostX)
						let nodeX = node.getX()
						//Horizontal traslational move other nodes --> Change X coordinate
						for (let k = 0; k < groupNodes.length; k++) {
							let currentNode = groupNodes[k]
							if (currentNode != node) {
								currentNode.setX(nodeX)
							}
						}

						// oGroup[i].setX(widestNode.getX() - nodeSpacing) //Traslational move the group based on the Widest node
						oGroup[i].setX(node.getX() - nodeSpacing)
						oGroup[i]._iWidth = maxNodeWidth + nodeSpacing + 10 //Fitting the width of group 
						// oGroup[i]._iHeight += 20 
					}
				}
			},
			/**
					 * Function to bring SOURCE/DESTINATION Node to the top and adjust line coordinators also
					 * @param {*} oGraph 
					 */
			_toTop: function (oGraph) {
				let oGroup = oGraph.getGroups()
				//Looking for the Top node and SOURCE/DESTINATION Node in a group 
				// console.log(oGraph)
				for (var i = 0; i < oGroup.length; i++) {
					let group = oGroup[i]
					let status = group.mProperties.status
					if (status === 'Group2') {
						var groupNodes = group.getNodes()
						var groupKey = group.getKey()
						var topNode, node
						var lowestY = Infinity
						for (var k = 0; k < groupNodes.length; k++) {
							var currentNode = groupNodes[k]
							var y = currentNode.getY() // Y coordinate of current node
							var nodeKey = currentNode.getKey() // Current Node key
							if (y < lowestY) {
								topNode = currentNode
								lowestY = y
							}
							if (nodeKey == groupKey) {
								node = currentNode
							}
						}

						//Case Top node is not SOURCE/DESTINATION Node -> Switch top Node and SOURCE/DESTINATION Node then adjust line coordinators as well
						if (topNode != node) {
							//SwitchNode
							this._switchNodes(topNode, node, groupNodes)
							//Adjust line coordinators
						}

					}
				}

				// let oLines = oGraph.getLines()
				// for (let i = 0; i < oLines.length; i++) {
				// 	this._removeUselessCurve(groupsArea, oLines[i])
				// }

			},

			_adjustLine: function (oGraph) {
				let groupsArea = this._getGroupArea(oGraph)
				this._narrowIndGap(oGraph)
				this._adjustLineCoordinatorsAdvance(oGraph, groupsArea)
			},

			/**
			 * Function to adjust lines' coordinators
			 * @param {*} graph : current graph
			 * @param {*} groupsArea : coordinate of groups' Area
			 */
			_adjustLineCoordinatorsAdvance: function (graph, groupsArea) {
				let groups = graph.getGroups()
				groups.forEach(group => {
					let status = group.mProperties.status
					if (status === 'Group2') {
						let groupNodes = group.getNodes()
						let noOfNodes = groupNodes.length
						for (let y = 0; y < noOfNodes; y++) {
							let node = groupNodes[y]
							let groupWidth = group._iWidth // 3/3/2023 (add)
							let groupHeight = group._iHeight
							let groupX = group.getX() // 3/3/2023 (add)
							let groupY = group.getY()
							let nodeSpacing = this.getView().getModel('settings').oData.nodeSpacing
							let nodeCLines = node.getChildLines()
							let nodePLines = node.getParentLines()
							let noCLines = nodeCLines.length
							let noPLines = nodePLines.length
							let nodeX = node.getX()
							let nodeY = node.getY()
							let nodeWidth = node._iWidth
							let nodeHeight = node._iHeight
							let altNodeCLines = nodeCLines
							let altNodePLines = nodePLines
							altNodeCLines.sort((a, b) => {
								let aCoor = a.getCoordinates()[0]
								let bCoor = b.getCoordinates()[0]
								return aCoor.getY() - bCoor.getY()
							})
							for (let i = 0; i < noCLines; i++) {
								let currentLine = altNodeCLines[i]
								let distance = nodeHeight / noCLines
								let coordinates = currentLine.getCoordinates()
								let startPoint = coordinates[0]
								let endPoint = coordinates[coordinates.length - 1]
								let bends = currentLine.getBends()
								let firstBend = bends[0]

								startPoint.setX(nodeX + nodeWidth)
								startPoint.setY(nodeY + (i + 0.5) * distance)
								//traslational move the Y coordinator of first break point 
								if (firstBend) {
									//Handle case line cross the group area 3/3/2023 (add)
									let altStartPoint = new sap.suite.ui.commons.networkgraph.Coordinate({ x: groupX + groupWidth + 5, y: startPoint.getY() })
									let isLineCross = this._isLineCross(groupsArea, altStartPoint, firstBend).xLeft
									if (isLineCross == groupX) {
										firstBend.setX(groupX + groupWidth + (i + 0.5) * 5)
										firstBend.setY(startPoint.getY())
										bends[1].setX(groupX + groupWidth + (i + 0.5) * 5)

										// oCoordinate.setY(firstBend.getY())
										// currentLine.insertCoordinate(oCoordinate2, 2)
									} else if (isLineCross != false) {
										let oCoordinate1 = new sap.suite.ui.commons.networkgraph.Coordinate({ x: groupX + groupWidth + (i + 0.5) * 5, y: startPoint.getY() })
										let oCoordinate2 = new sap.suite.ui.commons.networkgraph.Coordinate({ x: groupX + groupWidth + (i + 0.5) * 5, y: firstBend.getY() })
										currentLine.insertCoordinate(oCoordinate1, 1)
										// oCoordinate.setY(firstBend.getY())
										currentLine.insertCoordinate(oCoordinate2, 2)
									} else {
										firstBend.setY(startPoint.getY())
									}

								}
								else {
									//In case before adjust position of 2 nodes, the line have no bend, then add 2 more bends to create a curve after position changed
									currentLine.addBend({ x: startPoint.getX() + nodeSpacing, y: startPoint.getY() })
									currentLine.addBend({ x: startPoint.getX() + nodeSpacing, y: endPoint.getY() })
								}
								/**
								* Handle case: indicator slide from left to right of group 
								* --> 2 bends cross group area
								*/
								bends = currentLine.getBends()
								for (let c = 0; c < bends.length - 1; c++) {
									if (bends[c].getX() == bends[c + 1].getX()) { // thẳng hàng
										let isLineCross = this._isLineCross(groupsArea, bends[c], bends[c + 1])
										if (isLineCross) { //2 bends cross group area due to expand in size to the right after arrange node
											bends[c].setX(isLineCross.xRight + nodeSpacing)
											bends[c + 1].setX(bends[c].getX())
										}
									}

								}
							}
							altNodePLines.sort((a, b) => {
								let aCoor = a.getCoordinates()
								let bCoor = b.getCoordinates()
								return aCoor[aCoor.length - 1].getY() - bCoor[bCoor.length - 1].getY()
							})
							for (let i = 0; i < noPLines; i++) {
								let currentLine = altNodePLines[i]
								let bends = currentLine.getBends()
								let distance = nodeHeight / noPLines
								let coordinates = currentLine.getCoordinates()
								let startPoint = coordinates[0]
								let endPoint = coordinates[coordinates.length - 1]
								let y = endPoint.getY()
								let lastBend = bends[bends.length - 1]
								endPoint.setX(nodeX)
								endPoint.setY(nodeY + (i + 0.5) * distance)
								if (lastBend) {
									//Handle case line cross the group area due to position changing between dest and topNote 3/3/2023 (add)
									let altEndpoint = new sap.suite.ui.commons.networkgraph.Coordinate({ x: groupX - 5, y: endPoint.getY() })
									let isLineCross = this._isLineCross(groupsArea, altEndpoint, lastBend).xLeft
									if (isLineCross == groupX) {
										lastBend.setX(groupX - (i + 0.5) * 5)
										lastBend.setY(endPoint.getY())
										bends[bends.length - 2].setX(lastBend.getX())
									} else if (isLineCross != false) {
										currentLine.addBend({ x: groupX - (i + 0.5) * 5, y: lastBend.getY() })
										currentLine.addBend({ x: groupX - (i + 0.5) * 5, y: endPoint.getY() })
									}
									else {
										lastBend.setY(endPoint.getY())
									}
								}
								else {
									//In case before adjust position of 2 nodes, the line have no bend, then and 2 more bends to create a curve after position changed
									currentLine.addBend({ x: groupX - (i + 0.5) * 5, y: startPoint.getY() })
									currentLine.addBend({ x: groupX - (i + 0.5) * 5, y: endPoint.getY() })
								}
								// Remove useless curse
								this._removeUselessBends(currentLine, groupsArea)
							}
						}
					}
				});
			},

			/**
			 * Take 3 continueous bends of a line to check if it create a useless curse or not
			 * If yes: Replace these 3 bends with 1 new coordinate
			 * @param {*} oLine 
			 * @param {*} aGroupArea 
			 */
			_removeUselessBends: function (oLine, aGroupArea) {
				let i = 0
				let aBends = oLine.getBends()
				//Take 3 bends at a time to verify whether its useless or not
				while (aBends.length > 3 && i <= aBends.length - 3) {
					let bend1 = aBends[i]
					let bend2 = aBends[i + 1]
					let bend3 = aBends[i + 2]
					let newBend
					if (bend1.getX() == bend2.getX()) {
						newBend = new sap.suite.ui.commons.networkgraph.Coordinate({ x: bend3.getX(), y: bend1.getY() })
					} else {
						newBend = new sap.suite.ui.commons.networkgraph.Coordinate({ x: bend1.getX(), y: bend3.getY() })
					}
					let isLineCross1 = this._isLineCross(aGroupArea, bend1, newBend)
					let isLineCross2 = this._isLineCross(aGroupArea, bend3, newBend)
					if (isLineCross1 || isLineCross2) {
						i = i + 1
					} else {
						oLine.removeCoordinate(i + 1)
						oLine.removeCoordinate(i + 1)
						oLine.removeCoordinate(i + 1)
						oLine.insertCoordinate(newBend, i + 1)
						aBends = oLine.getBends()
					}
				}
			},

			/**
			 * function to get the area of groups in Graph
			 * @param {*} graph 
			 * return array of group Area Object{x,y,x1,y1}
			 */
			_getGroupArea: function (graph) {
				let groups = graph.getGroups()
				let groupsArea = []
				groups.forEach(group => {
					let groupArea = {}
					let groupX = group.getX()
					let groupY = group.getY()
					groupArea.xLeft = group.getX()
					groupArea.yLeft = group.getY()
					groupArea.xRight = groupX + group._iWidth
					groupArea.yRight = groupY + group._iHeight
					groupsArea.push(groupArea)
				});
				return groupsArea
			},

			/**
			 * Function to check whether the line between 2point cross any group Area
			 * @param {*} groupsArea : coordinates of Groups' Area in graph 
			 * @param {*} p1 : first point
			 * @param {*} p2 : second point
			 * @returns 
			 */
			_isLineCross: function (groupsArea, p1, p2) {
				let noGroups = groupsArea.length
				let x1 = p1.getX()
				let x2 = p2.getX()
				let y1 = p1.getY()
				let y2 = p2.getY()
				//left and right limitation of line
				let yLeft = (y1 < y2) ? y1 : y2
				let yRight = (y1 > y2) ? y1 : y2
				let xLeft = (x1 < x2) ? x1 : x2
				let xRight = (x1 > x2) ? x1 : x2

				for (let k = 0; k < noGroups; k++) {
					let currentGroup = groupsArea[k]
					//1 rectangle on the left of other
					if (currentGroup.xLeft > xRight || xLeft > currentGroup.xRight) {
						continue
					}
					//1 rectangle on top of other
					if (currentGroup.yLeft > yRight || yLeft > currentGroup.yRight) {
						continue
					}
					return currentGroup
				}
				return false
			},


			/**
			 * Narrow the gap between Indicator in case no connector between indicator
			 * @param {*} oGroup - Single group in graph
			 */
			_narrowIndGap: function (graph) {
				let groups = graph.getGroups()
				groups.forEach(group => {
					let groupNodes = group.getNodes()
					let status = group.mProperties.status
					if (status === 'Group2') {
						let altGroupNodes = groupNodes
						if (altGroupNodes.length > 1) {
							let nodeHeight = altGroupNodes[0]._iHeight
							altGroupNodes.sort((a, b) => {
								return a.getY() - b.getY()
							})
							// gap between src/dest and ind is 40px

							altGroupNodes[1].setY(altGroupNodes[0].getY() + nodeHeight + 20)

							//gap between indicator is 20
							for (let i = 2; i < altGroupNodes.length; i++) {
								altGroupNodes[i].setY(altGroupNodes[i - 1].getY() + nodeHeight + 5)
							}
							//Set new height for Group
							group._iHeight = altGroupNodes[altGroupNodes.length - 1].getY() + nodeHeight + 30 - group.getY()
						}
					}
				});

			},





			/**
			 * Confirm Dialog with message only
			 * @param {*} message: Message display inside Dialog Box
			 */
			_confirmDialog: function (message) {

				// if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: sap.m.DialogType.Message,
					title: "Confirm",
					content: new sap.m.Text({ text: message }),
					draggable: true,
					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: "Confirm",
						press: function () {
							// MessageToast.show("Submit pressed!");
							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
				this.oApproveDialog.open();
			},

			/**
			 * Confirm Dialog with data review in table format
			 * @param {*} title: title of Dialog Box
			 */
			_confirmDialogWithDetail: function (title) {
				console.log(this.getView().getModel())
				// if (!this.oApproveDialog) {
				this.oApproveDialogWithDetail = new Dialog({
					type: sap.m.DialogType.Message,
					title: title,
					draggable: true,
					resizable: true,
					content: new sap.ui.table.Table({
						selectionMode: 'None',
						// visibleRowCount: 20,
						rows: "{/input}",
						columns: [
							new sap.ui.table.Column(
								{
									label: 'SOURCE',
									template: new sap.m.Text({
										text: "{SOURCE}"
									})
								}),
							new sap.ui.table.Column(
								{
									label: ' Indicator of SOURCE',
									template: new sap.m.Text({
										text: "{INDSOURCE}"
									})
								}),
							new sap.ui.table.Column(
								{
									label: 'DESTINATION',
									template: new sap.m.Text({
										text: "{DESTINATION}"
									})
								}),
							new sap.ui.table.Column(
								{
									label: 'Indicator of DESTINATION',
									template: new sap.m.Text({
										text: "{INDDEST}"
									})
								}),
							new sap.ui.table.Column(
								{
									label: 'RELATIONSHIP',
									template: new sap.m.Text({
										text: "{RELATIONSHIP}"
									})
								})
						],
					}),

					beginButton: new sap.m.Button({
						type: sap.m.ButtonType.Emphasized,
						text: "Confirm",
						press: function () {
							// MessageToast.show("Submit pressed!");
							this.oApproveDialogWithDetail.close();
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialogWithDetail.close();
						}.bind(this)
					})

				});
				this.getView().addDependent(this.oApproveDialogWithDetail);
				this.oApproveDialogWithDetail.open();
			},

			inputToChange: function (oArg) {
				// console.log(oModel.oData.input)
			},

			deleteRow: function (oArg) {
				var deleteRecord = oArg.getSource().getBindingContext().getObject();
				delFlg = 1;

				//If not search and delete directly in input table
				if (searchText != undefined) {
					for (var i = 0; i < oModel.oData.input.length; i++) {
						if (oModel.oData.input[i] == deleteRecord) {
							// console.log(oModel.oData.input[i]);
							oModel.oData.input.splice(i, 1); //removing 1 record from i th index.
							oModel.oData.lines.splice(i, 1);
						}

					}

					for (var y = 0; y < oInputTmp.length; y++) {
						if (oInputTmp[y].SOURCE == deleteRecord.SOURCE &&
							oInputTmp[y].INDSOURCE == deleteRecord.INDSOURCE &&
							oInputTmp[y].DESTINATION == deleteRecord.DESTINATION &&
							oInputTmp[y].INDDEST == deleteRecord.INDDEST &&
							oInputTmp[y].AREA == deleteRecord.AREA &&
							oInputTmp[y].DESAREA == deleteRecord.DESAREA
							// && oInputTmp[y].RELATIONSHIP == deleteRecord.RELATIONSHIP
						) {
							// console.log(oModel.oData.input[i]);
							oInputTmp.splice(y, 1);
						}
					}

					if (isFinal == "X") {
						for (var f = 0; f < oModel.oData.final.length; f++) {
							if (oModel.oData.final[f].SOURCE == deleteRecord.SOURCE &&
								oModel.oData.final[f].INDSOURCE == deleteRecord.INDSOURCE &&
								oModel.oData.final[f].DESTINATION == deleteRecord.DESTINATION &&
								oModel.oData.final[f].INDDEST == deleteRecord.INDDEST &&
								//oModel.oData.final[f].AREA == deleteRecord.AREA &&
								//oModel.oData.final[f].DESAREA == deleteRecord.DESAREA &&
								oModel.oData.final[f].MATCH_FLAG == deleteRecord.RELATIONSHIP &&
								oModel.oData.final[f].CLIENT == deleteRecord.CLIENT) {

								oModel.oData.final.splice(f, 1);
							}
						}
					}

					this.inputFromChange();
					return;

				}

				//If do searching and delete
				for (var i = 0; i < oModel.oData.input.length; i++) {
					if (oModel.oData.input[i] == deleteRecord) {
						console.log(oModel.oData.input[i]);
						oModel.oData.input.splice(i, 1); //removing 1 record from i th index.
						oModel.oData.lines.splice(i, 1);
					}

				}

				if (isFinal == "X") {
					for (var f = 0; f < oModel.oData.final.length; f++) {
						if (oModel.oData.final[f].SOURCE == deleteRecord.SOURCE &&
							oModel.oData.final[f].INDSOURCE == deleteRecord.INDSOURCE &&
							oModel.oData.final[f].DESTINATION == deleteRecord.DESTINATION &&
							oModel.oData.final[f].INDDEST == deleteRecord.INDDEST &&
							//oModel.oData.final[f].AREA == deleteRecord.AREA &&
							//oModel.oData.final[f].DESAREA == deleteRecord.DESAREA &&
							//oModel.oData.final[f].MATCH_FLAG == deleteRecord.RELATIONSHIP &&
							oModel.oData.final[f].CLIENT == deleteRecord.CLIENT) {
							oModel.oData.final.splice(f, 1);
						}
					}
				}

				for (var y = 0; y < oInput.length; y++) {
					if (oInput[y].SOURCE == deleteRecord.SOURCE &&
						oInput[y].INDSOURCE == deleteRecord.INDSOURCE &&
						oInput[y].DESTINATION == deleteRecord.DESTINATION &&
						oInput[y].INDDEST == deleteRecord.INDDEST &&
						oInput[y].AREA == deleteRecord.AREA &&
						oInput[y].DESAREA == deleteRecord.DESAREA &&
						//oInput[y].RELATIONSHIP == deleteRecord.RELATIONSHIP &&
						oInput[y].CLIENT == deleteRecord.CLIENT) {

						oInput.splice(y, 1);
					}
					this.inputFromChange();
				}
			},

			thanos: function (oArg) {
				color = "Standard"
				var index;
				for (var i = 0; i < oInput.length; i++) {
					index = i;
					if (oInput[i].CLIENT == clientData) {
						oInput.splice(i, 1);
						i = index - 1;
					}
				}

				for (var y = 0; y < oModel.oData.input.length; y++) {
					index = y;
					if (oModel.oData.input[y].CLIENT == clientData) {
						oModel.oData.input.splice(y, 1);
						y = index - 1;
					}
				}
				// oModel.oData.input = [];
				// oModel.oData.nodes = [];
				// oModel.oData.lines = [];
				// oModel.oData.groups = [];
				this.inputFromChange()
			},

			merge: function () {
				/**
				 * showcase only
				 */
				let JPIndPairs = [JSON.stringify(['キャリア採用数', '女性管理職比率']),
				JSON.stringify(['女性管理職比率', '社員の定着率']),
				JSON.stringify(['社員の定着率', '特許出願件数']),
				JSON.stringify(['特許出願件数', 'ROE']),
				JSON.stringify(['Industrial waste recycling rate', 'Number of press releases']),
				JSON.stringify(['Number of press releases', 'Number of customers in open factory']),
				JSON.stringify(['Number of customers in open factory', 'Sales amount']),
				JSON.stringify(['Sales amount', 'PBR']),
				JSON.stringify(['Sales amount', 'ROE'])]
				isAnalysed = true
				errMes = 0

				oModel.oData.linetmp = [];
				if (isFinal != "X") {
					oModel.oData.final = [];

					let id_green = this.getView().byId("ID_Green").getSelected();
					let id_grey = this.getView().byId("ID_Grey").getSelected();
					let id_black = this.getView().byId("ID_Black").getSelected();
					let id_blue = this.getView().byId("ID_Blue").getSelected();

					// for (var i = 0; i < oModel.oData.lines.length; i++) {
					// 	if (oModel.oData.lines[i].DESTINATION == 'LAB1')
					// 		oModel.oData.lines[i].status = 'Success'

					// 	if (oModel.oData.lines[i].DESTINATION == 'LAB2')
					// 		oModel.oData.lines[i].status = 'Error'

					// 	if (oModel.oData.lines[i].DESTINATION == 'LAB3')
					// 		oModel.oData.lines[i].status = 'Warning'
					// }

					// for (var i = 0; i < oModel.oData.nodes.length; i++) {
					// 	if (oModel.oData.nodes[i].key == 'LAB1')
					// 		oModel.oData.nodes[i].status = 'Success'

					// 	if (oModel.oData.nodes[i].key == 'LAB2')
					// 		oModel.oData.nodes[i].status = 'Error'

					// 	if (oModel.oData.nodes[i].key == 'LAB3')
					// 		oModel.oData.nodes[i].status = 'Warning'
					// }
					var that = this
					//var sigURL = `/graph/getSignificant()`;
					var sigURL = `/graph/getSignificant(clientkey='${clientData}')`;
					let oSigInput;
					$.ajax({

						url: sigURL,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {
							oSigInput = oData.value

							if (oSigInput.length < 1) {
								MessageBox.show('Client does not have Significant data to do Analysing', { title: 'Analysing Failed' })
								errMes = 1
								return;
							}
							// console.log(oInput.concat("in ra dum"))
							// this._drawGraph(oInput)
							// for (var i = 0; i < oInput.length; i++) {
							// 	oModel.oData.input.push({ SOURCE: oInput[i].SOURCE, INDSOURCE: oInput[i].INDSOURCE, DESTINATION: oInput[i].DESTINATION, INDDEST: oInput[i].INDDEST, RELATIONSHIP: oInput[i].RELATIONSHIP, AREA: oInput[i].AREA, DESAREA: oInput[i].DESAREA});
							// }

							let oInput = oModel.oData.input
							let inputLength = oInput.length
							let sigLength = oSigInput.length

							for (let x = 0; x < inputLength; x++) {
								oModel.oData.final.push({
									CLIENT: clientData,
									CLIENT_ITEM: clientItem, //oInput[x].CLIENT_ITEM, 
									SOURCE: oInput[x].SOURCE, INDSOURCE: oInput[x].INDSOURCE,
									DESTINATION: oInput[x].DESTINATION, INDDEST: oInput[x].INDDEST,
									MATCH_FLAG: '',
									NEW_FLAG: '',
									AREA: oInput[x].AREA,
									DESAREA: oInput[x].DESAREA
								})
							}

							for (let i = 0; i < inputLength; i++) {
								let currentLine = oInput[i]
								let source = currentLine.SOURCE.toUpperCase()
								let sourceIn = currentLine.INDSOURCE
								let destination = currentLine.DESTINATION.toUpperCase()
								let destinationIn = currentLine.INDDEST
								let relationship = currentLine.RELATIONSHIP
								let client = currentLine.CLIENT.toUpperCase()
								//let clientitem = currentLine.CLIENT_ITEM.toUpperCase()
								let sourceGroupName = currentLine.AREA;
								let destGroupName = currentLine.DESAREA;

								// if (relationship) {
								for (let y = 0; y < sigLength; y++) {
									if (
										sourceIn == oSigInput[y].INDSOURCE &&

										destinationIn == oSigInput[y].INDDEST &&

										client == oSigInput[y].CLIENT.toUpperCase() &&

										//clientItem == oSigInput[y].CLIENT_ITEM.toUpperCase() &&

										//Duyen add
										sourceIn != '' && destinationIn != ''

									) {

										for (var index = 0; index < oModel.oData.lines.length; index++) {
											if (oModel.oData.lines[index].SOURCE.toUpperCase() == source.concat(sourceIn).toUpperCase() && oModel.oData.lines[index].DESTINATION.toUpperCase() == destination.concat(destinationIn).toUpperCase()) {
												// console.log(oModel.oData.lines)
												oModel.oData.lines.splice(index, 1)
												break;
											}
										}
										for (var index_n = 0; index_n < oModel.oData.lines.length; index_n++) {
											if (oModel.oData.lines[index_n].SOURCE.toUpperCase() == source.toUpperCase() && oModel.oData.lines[index_n].DESTINATION.toUpperCase() == destination.toUpperCase()) {
												oModel.oData.lines.splice(index_n, 1)
												break;
											}
										}

										for (var index_f = 0; index_f < oModel.oData.final.length; index_f++) {
											if (
												oModel.oData.final[index_f].INDSOURCE.toUpperCase() == oSigInput[y].INDSOURCE.toUpperCase() &&

												oModel.oData.final[index_f].INDDEST.toUpperCase() == oSigInput[y].INDDEST.toUpperCase() &&

												oModel.oData.final[index_f].CLIENT.toUpperCase() == oSigInput[y].CLIENT.toUpperCase()

												// && oModel.oData.final[index_f].CLIENT_ITEM.toUpperCase() == oSigInput[y].CLIENT_ITEM.toUpperCase()

											) {

												oModel.oData.final[index_f].MATCH_FLAG = oSigInput[y].CORR_MATCH_FLG;
												oModel.oData.input[i].RELATIONSHIP = oSigInput[y].CORR_MATCH_FLG;
											}
										}

										//<<Duyen add 07/11/2023
										isFinal = "X"
										this._drawGraph(oModel.oData.input);
										isFinal = ""
										//>>Duyen add 07/11/2023

										//<< commented 07/11/2023
										//Relevant case
										// if (oSigInput[y].CORR_MATCH_FLG == 'O' || oSigInput[y].CORR_MATCH_FLG == 'o') {
										// 	//Change Indicator color
										// 	if (sourceIn != '' && destinationIn != '') {

										// 		/**
										// 		 * Showcase only
										// 		 */
										// 		if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
										// 		) {
										// 			//THAI - IF BLACK CONNECTOR CHECKED, THEN PUSH BLACK CONNECTOR TO GRAPH
										// 			if (id_black == true) {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 					status: "DemonReleInd", lineType: "Solid"
										// 				});
										// 			}
										// 			//THAI - PUSH BLACK CONNECTOR TO TEMPORARY MODEL FOR LATER USE
										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				status: "DemonReleInd", lineType: "Solid"
										// 			});

										// 		} else {
										// 			oModel.oData.lines.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				//status: 'customLineIndicator', lineType: "Dashed"
										// 				status: "ReleventIndicator", lineType: "Solid"
										// 			});

										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				//status: 'customLineIndicator', lineType: "Dashed"
										// 				status: "ReleventIndicator", lineType: "Dashed"
										// 			});
										// 		}

										// 		// oModel.oData.lines.push({
										// 		// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 		// 	status: "ReleventIndicator", lineType: "Dashed"
										// 		// });
										// 	}

										// 	if (source != '' && destination != '') {
										// 		//THAI - IF GREEN CONNECTOR CHECKED, THEN PUSH GREEN CONNECTOR TO GRAPH
										// 		if (id_green == true) {
										// 			if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'DemonReleNode', lineType: "Solid" })) {
										// 				// console.log("omg")
										// 			} else {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source, DESTINATION: destination,
										// 					status: 'DemonReleNode', lineType: "Solid"
										// 				});
										// 			}
										// 		} else { //ELSE PUSH NORMAL CONNECTOR TO GRAPH
										// 			if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'customLine', lineType: "Solid" })) {
										// 				// console.log("omg")
										// 			} else {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source, DESTINATION: destination,
										// 					status: 'customLine', lineType: "Solid"
										// 				});
										// 			}
										// 		}
										// 		if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'DemonReleNode', lineType: "Solid" })) {
										// 			// console.log("omg")
										// 		} else {
										// 			//THAI - PUSH GREEN CONNECTOR TO TEMPORARY MODEL FOR LATER USE
										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source, DESTINATION: destination,
										// 				status: 'DemonReleNode', lineType: "Solid"
										// 			});
										// 		}

										// 	}


										// } else if (oSigInput[y].CORR_MATCH_FLG == 'X' || oSigInput[y].CORR_MATCH_FLG == 'x') {
										// 	if (sourceIn != '' && destinationIn != '') {

										// 		/**
										// 		 * Showcase only
										// 		 */
										// 		if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
										// 		) {
										// 			//THAI - IF BLUE CONNECTOR CHECKED, THEN PUSH CONNECTOR TO GRAPH
										// 			if (id_blue == true) {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 					status: "NDemonReleInd", lineType: "Dashed"
										// 				});
										// 			}
										// 			//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				status: "NDemonReleInd", lineType: "Dashed"
										// 			});

										// 		} else {

										// 			oModel.oData.lines.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				status: 'customLineIndicator', lineType: "Solid"

										// 			});
										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 				status: 'customLineIndicator', lineType: "Solid"

										// 			});
										// 		}

										// 		// oModel.oData.lines.push({
										// 		// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										// 		// 	status: "ReleventIndicator", lineType: "Dashed"
										// 		// });
										// 	}

										// 	if (source != '' && destination != '') {
										// 		//THAI - IF GREY CONNECTOR CHECKED, THEN PUSH CONNECTOR TO GRAPH
										// 		if (id_grey == true) {
										// 			if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'NDemonReleNode', lineType: "Dashed" })) {
										// 				// console.log("omg")
										// 			} else {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source, DESTINATION: destination,
										// 					status: 'NDemonReleNode', lineType: "Dashed"
										// 				});
										// 			}
										// 		} else { //ELSE PUSH NORMAL CONNECTOR TO GRAPH
										// 			if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'customLine', lineType: "Solid" })) {
										// 				// console.log("omg")
										// 			} else {
										// 				oModel.oData.lines.push({
										// 					SOURCE: source, DESTINATION: destination,
										// 					status: 'customLine', lineType: "Solid"
										// 				});
										// 			}
										// 		}
										// 		if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: "NDemonReleNode", lineType: "Dashed" })) {
										// 			// console.log("omg")
										// 		} else {
										// 			//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
										// 			oModel.oData.linetmp.push({
										// 				SOURCE: source, DESTINATION: destination,
										// 				status: "NDemonReleNode", lineType: "Dashed"
										// 			});
										// 		}
										// 	}
										// } 
										//>> commented 07/11/2023
									}

								}
								// if (sourceIn != '' && destinationIn != '') {
								// 	for (var index = 0; index < oModel.oData.lines.length; index++) {
								// 		if (oModel.oData.lines[index].SOURCE == source.concat(sourceIn) && oModel.oData.lines[index].DESTINATION == destination.concat(destinationIn)) {
								// 			// console.log(oModel.oData.lines)
								// 			oModel.oData.lines.splice(index, 1)
								// 			break;
								// 		}
								// 	}

								// /**
								//  * Showcase only
								//  */
								// if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
								// ) {
								// oModel.oData.lines.push({
								// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
								// 	status: 'customLineIndicator', lineType: "Dashed"
								// });
								// } else {
								// 	oModel.oData.lines.push({
								// 		SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
								// 		status: "ReleventIndicator", lineType: "Dashed"
								// 	});
								// }

								// oModel.oData.lines.push({
								// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
								// 	status: "ReleventIndicator", lineType: "Dashed"
								// });
								// }
							}
							oModel.refresh();
							console.log(oModel);
							oModel.refresh();
						}.bind(this),

						error: function (oError) {

							console.log(oError)
							errMes = 1

						}.bind(this),



					});
					if (errMes == 1) {
						return;
					}

				}
				console.log(oModel.oData.final);

				var sURL = `/graph/deletefinal(clientkey='${clientData}')`;

				$.ajax({

					url: sURL,

					type: "GET",

					method: "GET",

					success: function (oData, oStatus, oResponse) {
						console.log('success delete final')
						// console.log(oData)

					}.bind(this),

					error: function (oError) {

						console.log(oError)

						// console.log(JSON.stringify(oEntry))

						errMes = 1

					}.bind(this),

				});

				$.ajax({
					url: '/graph/FINAL_VIEW',
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
						xhr.setRequestHeader("Content-Type", "application/atom+xml");
						xhr.setRequestHeader("DataServiceVersion", "2.0");
						xhr.setRequestHeader("X-CSRF-Token", "Fetch");
					},

					success: function (oData, oStatus, XMLHttpRequest) {
						
						var header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
						let headers
						if (header_token != null || header_token != undefined) {
							headers = {
								"X-CSRF-Token": header_token,
								"Content-Type": 'application/json'// File type
							}
						} else {
							headers = {
								"Content-Type": 'application/json'// File type}
							}
						}
						let finalData = Object.assign([], oModel.oData.final) // copy data of input into variable

						// for (let i = 0; i < uploadData.length; i++) {
						// 	uploadData[i].CLIENT = clientData;
						// 	uploadData[i].CLIENT_ITEM = clientItem;
						// }
						// console.log(clientData, uploadData)
						//Call custom action 
						$.ajax({
							type: "POST",
							url: '/graph/upload_final',
							data: JSON.stringify({ finalData: finalData }),
							headers: headers,
							cache: false,
							success: function (data) {
								console.log('Success upload final', data)
								// view.setBusy(false)
								// MessageBox.show('Success', { title: 'Upload Completed' })
							}, //succes
							error: function (data) {
								console.log('error', data)
								// view.setBusy(false)
								// MessageBox.show('Server is busy now, please try again', { title: 'Upload Failed' })
							}//error
						})
					}.bind(this),
					error: function (oError) {
						//view.setBusy(false)
						console.log(oError)

						errMes = 1

					}.bind(this)
				})
				// let oInput = oModel.oData.input
				// oFinal = oModel.oData.input
				// let inputLength = oInput.length
				// let sigLength = oSigInput.length

				// for (let i = 0; i < inputLength; i++) {
				// 	let currentLine = oInput[i]
				// 	let source = currentLine.SOURCE.toUpperCase()
				// 	let sourceIn = currentLine.INDSOURCE
				// 	let destination = currentLine.DESTINATION.toUpperCase()
				// 	let destinationIn = currentLine.INDDEST
				// 	let relationship = currentLine.RELATIONSHIP
				// 	let client = currentLine.CLIENT
				// 	let clientitem = currentLine.CLIENT_ITEM
				// 	let sourceGroupName = currentLine.AREA;
				// 	let destGroupName = currentLine.DESAREA;

				// 	if (relationship) {
				// 		for(let y = 0; y < sigLength; y++){
				// 			if ( source == oSigInput[y].SOURCE.toUpperCase() &&
				// 			     sourceIn == oSigInput[y].INDSOURCE &&
				// 				 destination == oSigInput[y].DESTINATION.toUpperCase() &&
				// 				 destinationIn == oSigInput[y].INDDEST &&
				// 				 client == oSigInput[y].CLIENT &&
				// 				 clientitem == oSigInput[y].CLIENT_ITEM ) {

				// 					for (var index = 0; index < oModel.oData.lines.length; index++) {
				// 						if (oModel.oData.lines[index].SOURCE == source.concat(sourceIn) && oModel.oData.lines[index].DESTINATION == destination.concat(destinationIn)) {
				// 							// console.log(oModel.oData.lines)
				// 							oModel.oData.lines.splice(index, 1)
				// 							break;
				// 						}
				// 					}
				// 					for (var index_n = 0; index_n < oModel.oData.lines.length; index_n++) {			
				// 						if (oModel.oData.lines[index_n].SOURCE == source && oModel.oData.lines[index_n].DESTINATION == destination) {
				// 							oModel.oData.lines.splice(index_n, 1)
				// 							break;
				// 						}
				// 					}
				// 					//Relevant case
				// 					if (oSigInput[y].CORR_MATCH_FLG == 'O') {
				// 						//Change Indicator color
				// 						if (sourceIn != '' && destinationIn != '') {

				// 							/**
				// 							 * Showcase only
				// 							 */
				// 							if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
				// 							) {
				// 								oModel.oData.lines.push({
				// 									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 									status: 'customLineIndicator', lineType: "Dashed"
				// 								});
				// 							} else {
				// 								oModel.oData.lines.push({
				// 									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 									status: "DemonReleInd", lineType: "Dashed"
				// 								});
				// 							}

				// 							// oModel.oData.lines.push({
				// 							// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 							// 	status: "ReleventIndicator", lineType: "Dashed"
				// 							// });
				// 						}

				// 						if (source != '' && destination != '') {
				// 							oModel.oData.lines.push({
				// 								SOURCE: source, DESTINATION: destination,
				// 								status: 'DemonReleNode', lineType: "Solid"
				// 							});
				// 						}
				// 					} else {
				// 						if (sourceIn != '' && destinationIn != '') {

				// 							/**
				// 							 * Showcase only
				// 							 */
				// 							if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
				// 							) {
				// 								oModel.oData.lines.push({
				// 									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 									status: 'customLineIndicator', lineType: "Dashed"
				// 								});
				// 							} else {
				// 								oModel.oData.lines.push({
				// 									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 									status: "NDemonReleInd", lineType: "Dashed"
				// 								});
				// 							}

				// 							// oModel.oData.lines.push({
				// 							// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 							// 	status: "ReleventIndicator", lineType: "Dashed"
				// 							// });
				// 						}

				// 						if (source != '' && destination != '') {
				// 							oModel.oData.lines.push({
				// 								SOURCE: source, DESTINATION: destination,
				// 								status: 'NDemonReleNode', lineType: "Solid"
				// 							});
				// 						}
				// 					}
				// 				}

				// 		}
				// 		// if (sourceIn != '' && destinationIn != '') {
				// 		// 	for (var index = 0; index < oModel.oData.lines.length; index++) {
				// 		// 		if (oModel.oData.lines[index].SOURCE == source.concat(sourceIn) && oModel.oData.lines[index].DESTINATION == destination.concat(destinationIn)) {
				// 		// 			// console.log(oModel.oData.lines)
				// 		// 			oModel.oData.lines.splice(index, 1)
				// 		// 			break;
				// 		// 		}
				// 		// 	}

				// 		// 	/**
				// 		// 	 * Showcase only
				// 		// 	 */
				// 		// 	if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
				// 		// 	) {
				// 		// 		oModel.oData.lines.push({
				// 		// 			SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 		// 			status: 'customLineIndicator', lineType: "Dashed"
				// 		// 		});
				// 		// 	} else {
				// 		// 		oModel.oData.lines.push({
				// 		// 			SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 		// 			status: "ReleventIndicator", lineType: "Dashed"
				// 		// 		});
				// 		// 	}

				// 			// oModel.oData.lines.push({
				// 			// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
				// 			// 	status: "ReleventIndicator", lineType: "Dashed"
				// 			// });
				// 		}
				// 	}

				// oModel.refresh();
			},


			upload: function () {
				let requestDone = 0
				var oNodes = oModel.oData.nodes;
				var oLines = oModel.oData.lines;
				var oInputSave = oModel.oData.input;
				// console.log(oNodes);
				var oEntry = {};
				var oGroup = {};
				var oInputSave = {};

				if (oInputSave.length == 0) {
					return;
				}
				let view = this.getView()
				view.setBusy(true)

				let that = this;

				// for (var i = 0; i < oModel.oData.nodes.length; i++) {
				// 	oEntry.NODEKEY = oNodes[i].key;
				// 	oEntry.NODETITLE = oNodes[i].title;
				// 	oEntry.NODESTATUS = oNodes[i].status;
				// 	oEntry.NODESHAPE = oNodes[i].shape;
				// 	oEntry.NODEGROUP = oNodes[i].group;
				// 	oEntry.CLIENT = oNodes[i].client;

				// 	var sURL = '/graph/NODES_VIEW';

				// 	$.ajax({

				// 		url: sURL,

				// 		data: JSON.stringify(oEntry), //user input file

				// 		headers: {

				// 			"Content-Type": 'application/json'// File type
				// 		},

				// 		type: "POST",

				// 		method: "POST",

				// 		success: function (oData, oStatus, oResponse) {

				// 			console.log(oData)

				// 		}.bind(this),

				// 		error: function (oError) {

				// 			console.log(oError)

				// 			console.log(JSON.stringify(oEntry))

				// 			errMes = 1

				// 		}.bind(this),

				// 	});

				// 	oGroup.GROUPKEY = oNodes[i].group;
				// 	oGroup.TITLE = oNodes[i].group;
				// 	oGroup.CLIENT = oNodes[i].client;

				// 	sURL = '/graph/GROUP_VIEW';
				// 	$.ajax({

				// 		url: sURL,

				// 		data: JSON.stringify(oGroup), //user input file

				// 		headers: {

				// 			"Content-Type": 'application/json'// File type
				// 		},

				// 		type: "POST",

				// 		method: "POST",

				// 		success: function (oData, oStatus, oResponse) {

				// 			console.log(oData)

				// 		}.bind(this),

				// 		error: function (oError) {

				// 			console.log(oError)

				// 			console.log(JSON.stringify(oGroup))

				// 			errMes = 1

				// 		}.bind(this),

				// 	});
				// }

				// oEntry = {};
				// for (var i = 0; i < oModel.oData.lines.length; i++) {
				// 	oEntry.LINEFROM = oLines[i].SOURCE;
				// 	oEntry.LINETO = oLines[i].DESTINATION;
				// 	oEntry.LINESTATUS = oLines[i].status;
				// 	oEntry.LINETYPE = oLines[i].lineType;
				// 	oEntry.CLIENT = oLines[i].CLIENT;

				// 	var sURL = '/graph/LINES_VIEW';

				// 	$.ajax({

				// 		url: sURL,

				// 		data: JSON.stringify(oEntry), //user input file

				// 		headers: {

				// 			"Content-Type": 'application/json'// File type
				// 		},

				// 		type: "POST",

				// 		method: "POST",

				// 		success: function (oData, oStatus, oResponse) {

				// 			console.log(oData)

				// 		}.bind(this),

				// 		error: function (oError) {

				// 			console.log(oError)

				// 			console.log(JSON.stringify(oEntry))

				// 			errMes = 1

				// 		}.bind(this),

				// 	});
				// }

				//If Client is existed, delete then add
				if (clientExist != 0) {
					var sURL_up = `/graph/deleteInput(clientkey='${clientData}')`;

					$.ajax({

						url: sURL_up,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {
							console.log('success delete Input view')
						}.bind(this),

						error: function (oError) {

							console.log(oError)

							errMes = 1

						}.bind(this),
					});
				}

				var index;
				var count = 0;

				for (var x = 0; x < oInput.length; x++) {
					index = x;
					if (oInput[x].CLIENT == clientData) {
						oInput.splice(x, 1);
						x = index - 1;
					}
				}

				//Convert to structure of DB
				for (var i_convert = 0; i_convert < oModel.oData.input.length; i_convert++) {

					oModel.oData.input[i_convert].RELATIONSHIP = ''

					if (oModel.oData.input[i_convert].AREA == undefined) {
						oModel.oData.input[i_convert].AREA = ''
					}
					if (oModel.oData.input[i_convert].DESAREA == undefined) {
						oModel.oData.input[i_convert].DESAREA = ''
					}
				}

				let oInput_tmp = oModel.oData.input;
				oInput_tmp = []
				for (var i = 0; i < oModel.oData.input.length; i++) {
					oInput_tmp.push({
						SOURCE: oModel.oData.input[i].SOURCE, INDSOURCE: oModel.oData.input[i].INDSOURCE,
						DESTINATION: oModel.oData.input[i].DESTINATION, INDDEST: oModel.oData.input[i].INDDEST,
						RELATIONSHIP: oModel.oData.input[i].RELATIONSHIP,
						AREA: oModel.oData.input[i].AREA, DESAREA: oModel.oData.input[i].DESAREA,
						CLIENT: clientData
					});
				}
				oModel.oData.input = []
				oModel.oData.input = oInput_tmp

				$.ajax({
					url: '/graph/INPUT_VIEW',
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
						xhr.setRequestHeader("Content-Type", "application/atom+xml");
						xhr.setRequestHeader("DataServiceVersion", "2.0");
						xhr.setRequestHeader("X-CSRF-Token", "Fetch");
					},

					success: function (oData, oStatus, XMLHttpRequest) {
						var header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
						let headers
						if (header_token != null || header_token != undefined) {
							headers = {
								"X-CSRF-Token": header_token,
								"Content-Type": 'application/json'// File type
							}
						} else {
							headers = {
								"Content-Type": 'application/json'// File type}
							}
						}
						let uploadData = Object.assign([], oModel.oData.input) // copy data of input into variable

						for (let i = 0; i < uploadData.length; i++) {
							uploadData[i].CLIENT = clientData;
							if (uploadData[i].RELATIONSHIP == undefined) {
								uploadData[i].RELATIONSHIP = ''
							}

							if (uploadData[i].AREA == undefined) {
								uploadData[i].AREA = ''
							}
							if (uploadData[i].DESAREA == undefined) {
								uploadData[i].DESAREA = ''
							}
						}
						console.log(clientData, uploadData)

						//Call custom action 
						$.ajax({
							type: "POST",
							url: '/graph/upload',
							data: JSON.stringify({ uploadData: uploadData }),
							headers: headers,
							cache: false,
							success: function (data) {
								console.log('success', data)
								view.setBusy(false)
								MessageBox.show('Success', { title: 'Upload Completed' })
								that.fetchClients()
							}, //succes
							error: function (data) {
								console.log('error', data)
								view.setBusy(false)
								MessageBox.show('Server is busy now, please try again', { title: 'Upload Failed' })
							}//error
						})
					}.bind(this),
					error: function (oError) {
						view.setBusy(false)
						console.log(oError)

						errMes = 1

					}.bind(this)
				})


				// for (var i = 0; i < oModel.oData.input.length; i++) {
				// 	oInputSave = {};
				// 	oInputSave.SOURCE = oModel.oData.input[i].SOURCE;
				// 	oInputSave.INDSOURCE = oModel.oData.input[i].INDSOURCE;
				// 	oInputSave.DESTINATION = oModel.oData.input[i].DESTINATION;
				// 	oInputSave.INDDEST = oModel.oData.input[i].INDDEST;
				// 	oInputSave.RELATIONSHIP = oModel.oData.input[i].RELATIONSHIP;
				// 	oInputSave.AREA = oModel.oData.input[i].AREA;
				// 	oInputSave.DESAREA = oModel.oData.input[i].DESAREA;
				// 	oInputSave.CLIENT = clientData;

				// 	oInput.push({ SOURCE: oInputSave.SOURCE, INDSOURCE: oInputSave.INDSOURCE, DESTINATION: oInputSave.DESTINATION, INDDEST: oInputSave.INDDEST, CLIENT: oInputSave.CLIENT, RELATIONSHIP: oInputSave.RELATIONSHIP, AREA: oInputSave.AREA, DESAREA: oInputSave.DESAREA });

				// 	var textError = "error "
				// 	var textSucceed = "success "


				// 	if (count <= 500) {
				// 		uploadMass(oInputSave);
				// 		count++;
				// 	} else {
				// 		// setTimeout(uploadMass(oInputSave), 2000);
				// 		sleep(2000);
				// 		uploadMass(oInputSave);
				// 		count = 0;
				// 	}

				// 	function sleep(ms) {
				// 		return new Promise(resolve => setTimeout(resolve, ms));
				// 	}

				// 	function uploadMass(oInputSave) {

				// 		var sURL = '/graph/INPUT_VIEW';
				// 		let xhr = new XMLHttpRequest();
				// 		// var header_token;

				// 		$.ajax({
				// 			url: '/graph/INPUT_VIEW',
				// 			type: "GET",
				// 			beforeSend: function (xhr) {
				// 				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				// 				xhr.setRequestHeader("Content-Type", "application/atom+xml");
				// 				xhr.setRequestHeader("DataServiceVersion", "2.0");
				// 				xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				// 			},

				// 			success: function (oData, oStatus, XMLHttpRequest) {
				// 				var header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');

				// 				if (header_token != null || header_token != undefined) {
				// 					$.ajax({
				// 						url: '/graph/INPUT_VIEW',
				// 						type: "POST",
				// 						data: JSON.stringify(oInputSave), //user input file

				// 						// beforeSend: function(xhr) { 
				// 						// 	xhr.setRequestHeader("X-CSRF-Token", header_token); 
				// 						// 	xhr.setRequestHeader("Content-Type", "application/json"); 
				// 						// },
				// 						headers: {
				// 							"X-CSRF-Token": header_token,
				// 							"Content-Type": 'application/json'// File type
				// 						},
				// 						success: function (oData, oStatus, XMLHttpRequest) {
				// 							if (++requestDone === oModel.oData.input.length) {
				// 								MessageBox.success("Successfully saved to database");
				// 								view.setBusy(false)
				// 							}
				// 							console.log(XMLHttpRequest.responseText);


				// 						}.bind(this),

				// 						error: function (oError) {
				// 							if (++requestDone === oModel.oData.input.length) {
				// 								MessageBox.success("Successfully saved to database");
				// 								view.setBusy(false)
				// 							}
				// 							console.log(oError)
				// 							console.log(oInputSave);

				// 							errMes = 1

				// 							// MessageBox.error("Cannot save to database");

				// 						}.bind(this),
				// 					});
				// 				} 
				// 				// Added in 19/4/2023 by Trịnh
				// 				else {
				// 					if (++requestDone === oModel.oData.input.length) {
				// 						// MessageBox.success("Successfully saved to database");
				// 						view.setBusy(false)
				// 					}
				// 				}
				// 			}.bind(this),

				// 			error: function (oError) {
				// 				if (++requestDone === oModel.oData.input.length) {
				// 					// MessageBox.success("Successfully saved to database");
				// 					view.setBusy(false)
				// 				}
				// 				console.log(oError)

				// 				errMes = 1

				// 			}.bind(this),

				// 		});



				// 		// $.ajax({

				// 		// 	url: sURL,

				// 		// 	async: true,

				// 		// 	data: JSON.stringify(oInputSave), //user input file

				// 		// 	headers: {
				// 		// 		// "X-CSRF-Token": xhr.getResponseHeader("X-CSRF-Token"),
				// 		// 		"Content-Type": 'application/json'// File type
				// 		// 	},

				// 		// 	type: "POST",

				// 		// 	method: "POST",

				// 		// 	success: function (oData, oStatus, oResponse) {
				// 		// 		if (++requestDone === oModel.oData.input.length) {
				// 		// 			MessageBox.success("Successfully saved to database");
				// 		// 			view.setBusy(false)
				// 		// 		}
				// 		// 		// console.log(textSucceed.concat(i));
				// 		// 		// console.log(oData)

				// 		// 	}.bind(this),

				// 		// 	error: function (oError) {

				// 		// 		// console.log(textError.concat(i));
				// 		// 		view.setBusy(false)
				// 		// 		console.log(oError);

				// 		// 		errMes = 1

				// 		// 	}.bind(this),

				// 		// });
				// 	}

				// }
				// MessageBox.success("Successfully saved to database");
				// if(errMes == 0){

				// }

			},

			fetchDataAfterUpload: function () {
				oInput = [];
				var sURL = '/graph/INPUT_VIEW';

				$.ajax({

					url: sURL,

					type: "GET",

					method: "GET",

					success: function (oData, oStatus, oResponse) {
						oInput = oData.value
						// console.log(oInput)
						// this._drawGraph(oInput)
						// for (var i = 0; i < oInput.length; i++) {
						// 	oModel.oData.input.push({ SOURCE: oInput[i].SOURCE, INDSOURCE: oInput[i].INDSOURCE, DESTINATION: oInput[i].DESTINATION, INDDEST: oInput[i].INDDEST, RELATIONSHIP: oInput[i].RELATIONSHIP, AREA: oInput[i].AREA, DESAREA: oInput[i].DESAREA});
						// }
						oModel.refresh();
					}.bind(this),

					error: function (oError) {

						console.log(oError)

						errMes = 1

					}.bind(this),

				});
			},

			uniqBy: function (a, key) {
				var seen = {};
				return a.filter(function (item) {
					var k = key(item);
					return seen.hasOwnProperty(k) ? false : (seen[k] = true);
					// if( seen.hasOwnProperty(k) == true ){
					// 	MessageBox.error("Indicator with no SOURCE or Desination node is not allowed");
					// 	return seen[k] = true;
					// }

				})
			},

			uploadWithWait: function (oEvent) {

				if (oInputTmp != undefined) {
					oModel.oData.input = oInputTmp;
					oInputTmp = undefined;
				}
				// 
				// oInputTmp = [];
				clientExist = 0;
				var that = this;

				clientData = this.byId('clientInput').getValue();

				if (clientData == "") {
					MessageBox.error('Please choose existing client or create new');
					return;
				}

				if (clientData != "") {
					if (oModel.oData.client.length != 0) {
						for (var i = 0; i < oModel.oData.client.length; i++) {
							if (oModel.oData.client[i].CLIENTKEY == clientData) {
								clientExist = 1;
								break;
							}
						}
					}


					if (clientExist == 0) {
						MessageBox.warning(
							"Client does not exist! \n Do you want to create new client and save data?",
							{
								icon: MessageBox.Icon.WARNING,
								title: "No Client found",
								actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
								onClose: function (oAction) {
									that.fnCallbackConfirm(oAction);
								},
								emphasizedAction: MessageBox.Action.OK,
								initialFocus: MessageBox.Action.CANCEL,
								styleClass: sResponsivePaddingClasses
							}
						);
						return;
					} else {

						MessageBox.warning(
							"Do you want to upload to current client ? ".concat(clientData),
							{
								icon: MessageBox.Icon.WARNING,
								title: "Warning",
								actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
								onClose: function (oAction) {

									//that.uploadWithClient(oAction);
									that.fnCallbackConfirm(oAction);

								},
								emphasizedAction: MessageBox.Action.OK,
								initialFocus: MessageBox.Action.CANCEL,
								styleClass: sResponsivePaddingClasses
							}
						)

					}

				}

				if (clientData == '' &&
					oModel.oData.input.length == 0 &&
					oModel.oData.nodes.length == 0 &&
					oModel.oData.lines.length == 0 &&
					oModel.oData.groups.length == 0) {
					var sURL = '/graph/hdbprocedure()';

					$.ajax({

						url: sURL,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {

							// console.log(oData)

						}.bind(this),

						error: function (oError) {

							console.log(oError)

							// console.log(JSON.stringify(oEntry))

							errMes = 1

						}.bind(this),

					});
					setTimeout(this.upload.bind(this), 9000);
				}
				// setTimeout(this.upload, 3000);
				oModel.refresh();
			},

			uploadWithClient: function (oAction) {
				if (oAction == 'OK') {

					//UPLOAD FINAL With CLIENT --------------------------------------
					if (isFinal == "X") {
						var sURL = `/graph/deletefinal(clientkey='${clientData}')`;

						$.ajax({

							url: sURL,

							type: "GET",

							method: "GET",

							success: function (oData, oStatus, oResponse) {
								console.log('success delete final')
								// console.log(oData)

							}.bind(this),

							error: function (oError) {

								console.log(oError)

								errMes = 1

							}.bind(this),

						});

						console.log(oModel.oData.final);

						$.ajax({
							url: '/graph/FINAL_VIEW',
							type: "GET",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
								xhr.setRequestHeader("Content-Type", "application/atom+xml");
								xhr.setRequestHeader("DataServiceVersion", "2.0");
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");
							},

							success: function (oData, oStatus, XMLHttpRequest) {
								var header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
								let headers
								if (header_token != null || header_token != undefined) {
									headers = {
										"X-CSRF-Token": header_token,
										"Content-Type": 'application/json'// File type
									}
								} else {
									headers = {
										"Content-Type": 'application/json'// File type}
									}
								}
								let finalData = Object.assign([], oModel.oData.final) // copy data of input into variable

								//Call custom action 
								$.ajax({
									type: "POST",
									url: '/graph/upload_final',
									data: JSON.stringify({ finalData: finalData }),
									headers: headers,
									cache: false,
									success: function (data) {
										console.log('success upload final', data)
									}, //succes
									error: function (data) {
										console.log('error', data)
									}//error
								})
							}.bind(this),
							error: function (oError) {
								//view.setBusy(false)
								console.log(oError)

								errMes = 1

							}.bind(this)
						})
						isFinal = ""
					}

					//Upload INPUT with CLient-------------------------------------------------
					var sURL = `/graph/deletesingle(clientkey='${clientData}')`;
					$.ajax({

						url: sURL,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {

							console.log(oData)

						}.bind(this),

						error: function (oError) {

							console.log(oError)

							// console.log(JSON.stringify(oEntry))

							errMes = 1

						}.bind(this),

					});

					setTimeout(this.upload.bind(this), 10000);
				}
			},

			getCSRFToken: function () {
				this.on('getCSRFToken', () => {
					return "Token"
				})
			},


			fnCallbackConfirm: function (oAction) {
				var clText = 'Client ';
				var oClient = {};
				if (oAction == "OK") {
					this.getView().setBusy(true);

					clientItem = 'TESTING';

					//Create new CLIENT case
					if (clientExist == 0) {
						oCInput.push({ CLIENTKEY: clientData, CLIENT_ITEM: clientItem, TITLE: clText.concat(clientData) });
						oModel.oData.client.push({ CLIENTKEY: clientData, CLIENT_ITEM: clientItem, TITLE: clText.concat(clientData) });

						oModel.refresh();

						oClient.CLIENTKEY = clientData;
						oClient.CLIENT_ITEM = clientItem;
						oClient.TITLE = clText.concat(clientData);
						oClient.MATRIX = ""
						oClient.CHART = "O"

						//Duyen start
						var sURL = '/graph/CLIENT_VIEW';
						var header_token;

						var xhr = new XMLHttpRequest();
						$.ajax({

							/*Get token*/
							url: sURL,
							// method: "GET",
							type: "GET",
							beforeSend: function (xhr) {
								xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
								xhr.setRequestHeader("Content-Type", "application/atom+xml");
								xhr.setRequestHeader("DataServiceVersion", "2.0");
								xhr.setRequestHeader("X-CSRF-Token", "Fetch");

							},

							success: function (oData, oStatus, XMLHttpRequest) {

								header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');

								let headers
								if (header_token != null || header_token != undefined) {
									headers = {
										"X-CSRF-Token": header_token,
										"Content-Type": 'application/json'// File type
									}
								} else {
									headers = {
										"Content-Type": 'application/json'// File type}
									}
								}

								console.log(header_token);

								// if (header_token != null || header_token != undefined) {
								$.ajax({
									url: sURL,
									data: JSON.stringify(oClient), //user input file
									type: "POST",
									headers: headers,

									success: function (oData, oStatus, XMLHttpRequest) {
										console.log("Client created");
									}.bind(this),

									error: function (oError) {
										console.log(oError)
										console.log(JSON.stringify(oClient))
										errMes = 1
									}.bind(this),
								});
							}.bind(this),

							error: function (oError) {
								console.log(oError)
								errMes = 1
							}.bind(this),
						});
					}

					//Duyen add
					if (isFinal == "X") {
						var fURL = `/graph/deletefinal(clientkey='${clientData}')`;

						$.ajax({

							url: fURL,

							type: "GET",

							method: "GET",

							success: function (oData, oStatus, oResponse) {
								console.log('success delete final')
								// console.log(oData)

							}.bind(this),

							error: function (oError) {

								console.log(oError)

								// console.log(JSON.stringify(oEntry))

								errMes = 1

							}.bind(this),
						});

						var xhr_ = new XMLHttpRequest();
						$.ajax({
							url: '/graph/FINAL_VIEW',
							type: "GET",
							beforeSend: function (xhr_) {
								xhr_.setRequestHeader("X-Requested-With", "XMLHttpRequest");
								xhr_.setRequestHeader("Content-Type", "application/atom+xml");
								xhr_.setRequestHeader("DataServiceVersion", "2.0");
								xhr_.setRequestHeader("X-CSRF-Token", "Fetch");
							},

							success: function (oData, oStatus, XMLHttpRequest) {
								var header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
								let headers
								if (header_token != null || header_token != undefined) {
									headers = {
										"X-CSRF-Token": header_token,
										"Content-Type": 'application/json'// File type
									}
								} else {
									headers = {
										"Content-Type": 'application/json'// File type}
									}
								}

								for (let i = 0; i < oModel.oData.final.length; i++) {
									oModel.oData.final[i].CLIENT = clientData;
									oModel.oData.final[i].CLIENT_ITEM = clientItem;
								}
								console.log(clientData, oModel.oData.final)

								let finalData = Object.assign([], oModel.oData.final) // copy data of input into variable

								//Call custom action 
								$.ajax({
									type: "POST",
									url: '/graph/upload_final',
									data: JSON.stringify({ finalData: finalData }),
									headers: headers,
									cache: false,
									success: function (data) {
										console.log('success upload final', data)
										//that.getView().setBusy(true);
									}, //succes
									error: function (data) {
										console.log('error', data)
									}//error
								})
							}.bind(this),
							error: function (oError) {
								//this.getView().setBusy(true);
								//view.setBusy(false)
								console.log(oError)
								errMes = 1
							}.bind(this)
						})
						isFinal = ""
					}
					setTimeout(this.upload.bind(this), 9000);
				}
			},

			onChange: async function (oEvent) {
				isFinal = ""
				let oFileUploader = oEvent.getSource();
				let files = oEvent.getParameters().files
				if (files.length == 0) {
					alert("Please choose any file...");
					return;
				}
				var filename = files[0].name;
				var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
				if (extension == '.XLS' || extension == '.XLSX') {
					// alert("Please select a valid CSV file.");
					this._excelFileToJSON(files[0]);

				} else if (extension == '.CSV') {
					// alert("Please select a valid XLSX file.");
					this.handleFiles(oEvent)
					// console.log(await this._csvToJson(files[0]))

					//    let excelResult = this._csvToJson(files[0]);
					//    console.log(excelResult[1]);
					//    console.log(excelResult[0])
				} else {
					alert("Please select a valid XLSX file.");
				}
				// oFileUploader.destroyParameters()
			},

			//Get Final file - Duyen
			onChange_: async function (oEvent) {
				isFinal = "X"
				let oFileUploader = oEvent.getSource();
				let files = oEvent.getParameters().files
				if (files.length == 0) {
					alert("Please choose any file...");
					return;
				}
				var filename = files[0].name;
				var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
				if (extension == '.XLS' || extension == '.XLSX') {

					this._excelFileToJSON(files[0]);

				} else if (extension == '.CSV') {
					this.handleFiles_final(oEvent)
				} else {
					alert("Please select a valid XLSX file.");
				}
			},

			_excelFileToJSON: function (file) {
				try {
					var reader = new FileReader();
					reader.readAsBinaryString(file);
					reader.onload = function (e) {

						var data = e.target.result;
						// console.log(data)
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						var result = {};
						var header = {};
						var sheetNameArr = []
						workbook.SheetNames.forEach(function (sheetName) {
							sheetNameArr.push(sheetName)
							var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
							if (roa.length > 0) {
								result[sheetName] = roa;
								header[sheetName] = Object.keys(roa[0])
							}
						});

						return result
					}.bind(this)
				} catch (e) {
					console.error(e);
				}
			},

			handleFiles: function (oEvent) {

				clientData = this.byId('clientInput').getValue();

				// if (clientData == '') {
				// MessageBox.error('Please choose client');
				// return;
				// }
				var oFileToRead = oEvent.getParameters().files["0"];

				var reader = new FileReader();

				// Read file into memory as UTF-8

				reader.readAsText(oFileToRead);

				// Handle errors load

				reader.onload = loadHandler;

				reader.onerror = errorHandler;

				var t = this;

				function loadHandler(event) {

					console.log(event);
					var csv = event.target.result;

					processData(csv);

				}

				function processData(csv) {

					var allTextLines = csv.split(/\r\n|\n/);

					// var lines = [];
					oModel.oData.input = [];
					for (var i = 1; i < allTextLines.length - 1; i++) {

						var data = allTextLines[i].split(',');
						if (data[0] == '1') {
							data[0] = 'ESG Activity';
						}
						if (data[0] == '2') {
							data[0] = 'Cost for ESG KPI';
						}
						if (data[0] == '3') {
							data[0] = 'Effects/Impacts';
						}

						if (data[3] == '1') {
							data[3] = 'ESG Activity';
						}
						if (data[3] == '2') {
							data[3] = 'Cost for ESG KPI';
						}
						if (data[3] == '3') {
							data[3] = 'Effects/Impacts';
						}
						oModel.oData.input.push({ SOURCE: data[1], INDSOURCE: data[2], DESTINATION: data[4], INDDEST: data[5], RELATIONSHIP: data[6], AREA: data[0], DESAREA: data[3], CLIENT: clientData });
						isFinal = ""
						//oModel.oData.input.push({ SOURCE: data[1], INDSOURCE: data[2], DESTINATION: data[4], INDDEST: data[5], RELATIONSHIP: data[6], AREA: data[0], DESAREA: data[3], CLIENT: clientData, CLIENT_ITEM: clientData });
					}
					oModel.refresh();
					// console.log(oModel.oData.input);
					// t.inputFromChange();
					isAnalysed = false
					t._drawGraph(oModel.oData.input);
					oModel.refresh();

				}

				function errorHandler(evt) {

					if (evt.target.error.name == "NotReadableError") {

						alert("Cannot read file !");

					}
				}
			},

			handleFiles_final: function (oEvent) {

				clientData = this.byId('clientInput').getValue();

				var oFileToRead = oEvent.getParameters().files["0"];

				var reader = new FileReader();

				// Read file into memory as UTF-8
				reader.readAsText(oFileToRead);

				// Handle errors load
				reader.onload = loadHandler;

				reader.onerror = errorHandler;

				var t = this;

				function loadHandler(event) {

					console.log(event);
					var csv = event.target.result;

					processData(csv);

				}

				function processData(csv) {

					var allTextLines = csv.split(/\r\n|\n/);

					// var lines = [];
					oModel.oData.input = [];
					for (var i = 1; i < allTextLines.length - 1; i++) {

						var data = allTextLines[i].split(',');

						oModel.oData.input.push({
							SOURCE: data[1], INDSOURCE: data[2],
							DESTINATION: data[4], INDDEST: data[5],
							RELATIONSHIP: data[6],
							AREA: data[0], DESAREA: data[3], CLIENT: clientData
						});


						oModel.oData.final.push({
							SOURCE: data[1], INDSOURCE: data[2],
							DESTINATION: data[4], INDDEST: data[5],
							MATCH_FLAG: data[6], NEW_FLAG: data[7],
							AREA: data[0], DESAREA: data[3], CLIENT: clientData
						});

						isFinal = "X"
					}
					oModel.refresh();
					// console.log(oModel.oData.input);
					// t.inputFromChange();
					isAnalysed = false
					t._drawGraph(oModel.oData.input);
					//t.drawFinal(oModel.oData.input)
					oModel.refresh();
				}

				function errorHandler(evt) {

					if (evt.target.error.name == "NotReadableError") {

						alert("Cannot read file !");

					}
				}
			},

			handleUploadComplete: function (oEvent) {
				var oFileUploader = this.byId("fileUploader");
				oFileUploader.clear();
			},

			delClient: function () {
				if (clientData == '') {
					MessageBox.warning('Please choose client first');
					return;
				}

				var that = this;

				/* ASK IF USER WANT TO DELETE CURRENT CLIENT AND ITS DATA */
				MessageBox.warning(
					"Do you want to delete client ".concat(clientData).concat(" and its data?"),
					{
						icon: MessageBox.Icon.WARNING,
						title: "Warning",
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						onClose: function (oAction) {

							that.delClientData(oAction);

							//Duyen - Refresh the page after delete OK
							if (oAction == "OK") {
								oModel.oData.input = [];
								//oModel.oData.client = [];
								oModel.oData.nodes = [];
								oModel.oData.lines = [];
								oModel.oData.groups = [];
								oCInput = [];

								for (var i = 0; i < oCInput.length; i++) {
									if (oCInput[i].CLIENTKEY == clientData) {
										oCInput.splice(i, 1);
									}
								}

								for (var i = 0; i < oModel.oData.client.length; i++) {
									if (oModel.oData.client[i].CLIENTKEY == clientData) {
										oModel.oData.client.splice(i, 1);
									}
								}
								oModel.refresh();

								that.fetchClients();

								isAnalysed = false
								that._drawGraph(oModel.oData.input);

								MessageBox.show('Success', { title: 'Delete Completed' })
								that.getView().setBusy(false);
								oModel.refresh();

							}
						},
						emphasizedAction: MessageBox.Action.OK,
						initialFocus: MessageBox.Action.CANCEL,
						styleClass: sResponsivePaddingClasses
					}
				)
			},

			delClientData: function (oAction) {
				var clText = 'Client ';
				var oClient = {};
				let that = this;
				if (oAction == "OK") {
					this.getView().setBusy(true);

					let del_client = true;
					var oCLient_up = {};

					//Check Client is existed in MATRIX app or not
					for (let icl = 0; icl < oModel.oData.client.length; icl++) {
						let cur_client = oModel.oData.client[icl];
						if (cur_client.MATRIX == "O" && cur_client.CLIENTKEY == clientData) {
							del_client = false

							oCLient_up.CLIENTKEY = oModel.oData.client[icl].CLIENTKEY
							oCLient_up.CLIENT_ITEM = "TESTING"
							oCLient_up.TITLE = oModel.oData.client[icl].TITLE
							oCLient_up.MATRIX = oModel.oData.client[icl].MATRIX
							oCLient_up.CHART = ""  //Clear FLAG of Chart to notify relevant data is deleted

							break;
						}
					}

					/*DELETE CHOSEN CLIENT*/
					var sURL = `/graph/deleteclient(clientkey='${clientData}')`;

					$.ajax({

						url: sURL,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {
							if (del_client == false) {

								//Duyen start
								var sURL = '/graph/CLIENT_VIEW';
								var header_token;

								var xhr = new XMLHttpRequest();
								$.ajax({

									/*Get token*/
									url: sURL,
									// method: "GET",
									type: "GET",
									beforeSend: function (xhr) {
										xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
										xhr.setRequestHeader("Content-Type", "application/atom+xml");
										xhr.setRequestHeader("DataServiceVersion", "2.0");
										xhr.setRequestHeader("X-CSRF-Token", "Fetch");

									},

									success: function (oData, oStatus, XMLHttpRequest) {

										header_token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');

										let headers
										if (header_token != null || header_token != undefined) {
											headers = {
												"X-CSRF-Token": header_token,
												"Content-Type": 'application/json'// File type
											}
										} else {
											headers = {
												"Content-Type": 'application/json'// File type}
											}
										}

										console.log(header_token);

										// if (header_token != null || header_token != undefined) {
										$.ajax({
											url: sURL,
											data: JSON.stringify(oCLient_up), //user input file
											type: "POST",
											headers: headers,

											success: function (oData, oStatus, XMLHttpRequest) {
												console.log("Client updated");

												oModel.refresh();
											}.bind(this),

											error: function (oError) {
												console.log(oError)
												console.log(JSON.stringify(oCLient_up))
												errMes = 1
											}.bind(this),
										});
									}.bind(this),

									error: function (oError) {
										console.log(oError)
										errMes = 1
									}.bind(this),
								});
							}

						}.bind(this),

						error: function (oError) {

							console.log(oError)

							// console.log(JSON.stringify(oEntry))

							errMes = 1

						}.bind(this),

					});


					/*DELETE ALL RECORD OF CHOSEN CLIENT*/
					sURL = `/graph/deletesingle(clientkey='${clientData}')`;

					$.ajax({

						url: sURL,

						type: "GET",

						method: "GET",

						success: function (oData, oStatus, oResponse) {
							//07/08 cmt
							// MessageBox.success('Delete successfully!')

							// //oModel.oData.input = [];
							// oModel.oData.nodes = [];
							// oModel.oData.lines = [];
							// oModel.oData.groups = [];
							// this.byId("clientInput").setValue('');

							// for (var i = 0; i < oCInput.length; i++) {
							// 	if (oModel.oData.client[i].CLIENTKEY == clientData) {
							// 		oModel.oData.client.splice(i, 1);
							// 	}
							// }

							// oModel.refresh();
							// clientEmpty = true;
							oModel.refresh();
							this.getView().setBusy(false);

						}.bind(this),

						error: function (oError) {

							console.log(oError)

							MessageBox.success("Deletion got errors: ".concat(oError))

							// console.log(JSON.stringify(oEntry))

							errMes = 1

						}.bind(this),

					});
				}
			},

			downloadHypothesis: function (oEvent) {
				// let oTable = oEvent.getSource().getParent().getParent()

				if (oModel.oData.input.length == 0) {
					MessageBox.error('No data to download');
					return;
				}
				let fileName = "Hypothesis_List_" + clientData + ".xlsx";
				// let currentTabStrip = oTable.getParent().getName()
				let oSource = oModel.oData.input

				let aCols = []
				aCols.push({
					label: "AREA",
					property: "AREA",
					width: "5"
				})

				aCols.push({
					label: "SOURCE",
					property: "SOURCE",
					width: "5"
				})

				aCols.push({
					label: "INDSOURCE",
					property: "INDSOURCE",
					width: "5"
				})

				aCols.push({
					label: "DESAREA",
					property: "DESAREA",
					width: "5"
				})

				aCols.push({
					label: "DESTINATION",
					property: "DESTINATION",
					width: "5"
				})

				aCols.push({
					label: "INDDEST",
					property: "INDDEST",
					width: "5"
				})

				// aCols.push({
				// 	label: "CLIENT",
				// 	property: "CLIENT",
				// 	width: "5"
				// })

				// aCols.push({
				// 	label: "CLIENTITEM",
				// 	property: "CLIENT_ITEM",
				// 	width: "5"
				// })

				let oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: oSource,
					fileName: fileName
				}

				let oSheet = new Spreadsheet(oSettings)
				oSheet.build()
					.then(function () {
						MessageToast.show('Spreadsheet export has finished');
					}).finally(function () {
						oSheet.destroy();
					});
			},

			downloadFinal: function (oEvent) {
				if (oModel.oData.final.length == 0) {
					MessageBox.error('No data to download');
					return;
				}
				let fileName = "Final_List" + clientData + ".xlsx";
				// let currentTabStrip = oTable.getParent().getName()
				let oSource = oModel.oData.final

				let aCols = []
				aCols.push({
					label: "AREA",
					property: "AREA",
					width: "5"
				})

				aCols.push({
					label: "SOURCE",
					property: "SOURCE",
					width: "5"
				})

				aCols.push({
					label: "INDSOURCE",
					property: "INDSOURCE",
					width: "5"
				})

				aCols.push({
					label: "DESAREA",
					property: "DESAREA",
					width: "5"
				})

				aCols.push({
					label: "DESTINATION",
					property: "DESTINATION",
					width: "5"
				})

				aCols.push({
					label: "INDDEST",
					property: "INDDEST",
					width: "5"
				})

				// aCols.push({
				// 	label: "CLIENT",
				// 	property: "CLIENT",
				// 	width: "5"
				// })

				// aCols.push({
				// 	label: "CLIENTITEM",
				// 	property: "CLIENT_ITEM",
				// 	width: "5"
				// })

				aCols.push({
					label: "MATCH_FLAG",
					property: "MATCH_FLAG",
					width: "5"
				})

				aCols.push({
					label: "NEW_FLAG",
					property: "NEW_FLAG",
					width: "5"
				})


				let oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: oSource,
					fileName: fileName
				}

				let oSheet = new Spreadsheet(oSettings)
				oSheet.build()
					.then(function () {
						MessageToast.show('Spreadsheet export has finished');
					}).finally(function () {
						oSheet.destroy();
					});
			},

			/*DEFAULT METHOD FOR PREVENTING USER FROM CLOSING TAB*/
			itemCloseHandler: function (oEvent) {
				oEvent.preventDefault();
			},

			itemSelect: function (oEvent) {
				/* GET TAB NAME */
				let tabname = this.getView().byId("TabContainer").getSelectedItem();
				let flg_exist; //Flag for checking if the line alread exist
				var index_tmp; //Temporary index

				if (tabname != null) {
					/* LOGIC FOR ALL CHECKBOX */
					// IF USER CLICK BACK TO GRAPH TAB, THEN PROCEED BELOW LOGIC
					if (tabname.includes("tabitem2")) {
						if (isAnalysed == true || isFinal == "X") {
							// GET THE SELECTED CHECKBOX
							let id_green = this.getView().byId("ID_Green").getSelected();
							let id_grey = this.getView().byId("ID_Grey").getSelected();
							let id_black = this.getView().byId("ID_Black").getSelected();
							let id_blue = this.getView().byId("ID_Blue").getSelected();

							/* GREEN CONNECTOR LOGIC */
							// IF CHECKBOX GREEN NOT CHECKED
							if (id_green == false) {
								for (var igreen = 0; igreen < oModel.oData.lines.length; igreen++) {
									var currentLine = oModel.oData.lines[igreen];
									var source = currentLine.SOURCE;
									var destination = currentLine.DESTINATION;
									var lineType = currentLine.lineType;
									var status = currentLine.status;
									if (status == "DemonReleNode") {
										oModel.oData.lines[igreen].status = 'customLine'; //CHANGE GREEN TO NORMAL CONNECTOR
										console.log(source + " , " + destination);
										oModel.refresh();
									}
								}

							} else { //IF CHECKBOX GREEN IS CHECKED
								for (var igreen = 0; igreen < oModel.oData.linetmp.length; igreen++) {
									var currentLine_tmp = oModel.oData.linetmp[igreen];
									var source_tmp = currentLine_tmp.SOURCE;
									var destination_tmp = currentLine_tmp.DESTINATION;
									var lineType_tmp = currentLine_tmp.lineType;
									var status_tmp = currentLine_tmp.status;

									if (status_tmp == "DemonReleNode") {
										for (var i = 0; i < oModel.oData.lines.length; i++) {
											var currentLine = oModel.oData.lines[i];
											var source = currentLine.SOURCE;
											var destination = currentLine.DESTINATION;
											var lineType = currentLine.lineType;
											var status = currentLine.status;

											if (source == source_tmp && destination == destination_tmp) {
												oModel.oData.lines[i].status = status_tmp; //CHANGE NORMAL TO GREEN CONNECTOR
												oModel.refresh();
												console.log("ENABLE GREEN CONNECTOR");
											}
										}
									}
								}

							}

							/* GREY CONNECTOR LOGIC */
							// IF CHECKBOX GREY NOT CHECKED
							if (id_grey == false) {
								for (var igrey = 0; igrey < oModel.oData.lines.length; igrey++) {
									var currentLine = oModel.oData.lines[igrey];
									var source = currentLine.SOURCE;
									var destination = currentLine.DESTINATION;
									var lineType = currentLine.lineType;
									var status = currentLine.status;
									if (status == "NDemonReleNode") {
										oModel.oData.lines[igrey].status = 'customLine'; //CHANGE GREY TO NORMAL CONNECTOR
										oModel.oData.lines[igrey].lineType = 'Solid';
										console.log(source + " , " + destination);
										oModel.refresh();
									}
								}

							} else { //IF CHECKBOX GREY IS CHECKED
								for (var igrey = 0; igrey < oModel.oData.linetmp.length; igrey++) {
									var currentLine_tmp = oModel.oData.linetmp[igrey];
									var source_tmp = currentLine_tmp.SOURCE;
									var destination_tmp = currentLine_tmp.DESTINATION;
									var lineType_tmp = currentLine_tmp.lineType;
									var status_tmp = currentLine_tmp.status;

									if (status_tmp == "NDemonReleNode") {
										for (var i = 0; i < oModel.oData.lines.length; i++) {
											var currentLine = oModel.oData.lines[i];
											var source = currentLine.SOURCE;
											var destination = currentLine.DESTINATION;
											var lineType = currentLine.lineType;
											var status = currentLine.status;

											if (source == source_tmp && destination == destination_tmp) {
												oModel.oData.lines[i].status = status_tmp; //CHANGE NORMAL TO GREY CONNECTOR
												oModel.oData.lines[i].lineType = "Dashed";
												oModel.refresh();
												console.log("ENABLE GREY CONNECTOR");
											}
										}
									}
								}

							}

							/* BLACK CONNECTOR FOR INDICATOR LOGIC */
							// IF BLACK INDICATOR NOT CHECKED
							flg_exist = false;
							if (id_black == false) {
								index_tmp = 0;
								for (var iblack = 0; iblack < oModel.oData.lines.length; iblack++) {

									var currentLine = oModel.oData.lines[iblack];
									var source = currentLine.SOURCE;
									var destination = currentLine.DESTINATION;
									var lineType = currentLine.lineType;
									var status = currentLine.status;
									if (status == "DemonReleInd") {
										index_tmp = iblack
										oModel.oData.lines.splice(iblack, 1);
										console.log(source + " , " + destination);
										oModel.refresh();
										iblack = index_tmp - 1
									}
								}
							} else {
								for (var iblack = 0; iblack < oModel.oData.linetmp.length; iblack++) {
									var currentLine_tmp = oModel.oData.linetmp[iblack];
									var source_tmp = currentLine_tmp.SOURCE;
									var destination_tmp = currentLine_tmp.DESTINATION;
									var lineType_tmp = currentLine_tmp.lineType;
									var status_tmp = currentLine_tmp.status;

									if (status_tmp == "DemonReleInd") {
										for (var i = 0; i < oModel.oData.lines.length; i++) {
											var currentLine = oModel.oData.lines[i];
											var source = currentLine.SOURCE;
											var destination = currentLine.DESTINATION;
											var lineType = currentLine.lineType;
											var status = currentLine.status;

											if (source == source_tmp && destination == destination_tmp) {
												flg_exist = true;
												break;
											}
										}

										if (flg_exist != true) {
											oModel.oData.lines.push({
												SOURCE: source_tmp, DESTINATION: destination_tmp,
												status: status_tmp, lineType: lineType_tmp
											});

											oModel.refresh();
											console.log("ENABLE BLACK CONNECTOR");
											flg_exist = false;
										}

									}
								}
							}

							/* BLUE CONNECTOR FOR INDICATOR LOGIC */
							// IF BLUE INDICATOR NOT CHECKED
							flg_exist = false;
							if (id_blue == false) {
								index_tmp = 0;
								for (var iblue = 0; iblue < oModel.oData.lines.length; iblue++) {

									var currentLine = oModel.oData.lines[iblue];
									var source = currentLine.SOURCE;
									var destination = currentLine.DESTINATION;
									var lineType = currentLine.lineType;
									var status = currentLine.status;
									if (status == "NDemonReleInd") {
										index_tmp = iblue
										oModel.oData.lines.splice(iblue, 1);
										console.log(source + " , " + destination);
										oModel.refresh();
										iblue = index_tmp - 1
									}
								}
							} else {
								for (var iblue = 0; iblue < oModel.oData.linetmp.length; iblue++) {
									var currentLine_tmp = oModel.oData.linetmp[iblue];
									var source_tmp = currentLine_tmp.SOURCE;
									var destination_tmp = currentLine_tmp.DESTINATION;
									var lineType_tmp = currentLine_tmp.lineType;
									var status_tmp = currentLine_tmp.status;

									if (status_tmp == "NDemonReleInd") {
										for (var i = 0; i < oModel.oData.lines.length; i++) {
											var currentLine = oModel.oData.lines[i];
											var source = currentLine.SOURCE;
											var destination = currentLine.DESTINATION;
											var lineType = currentLine.lineType;
											var status = currentLine.status;

											if (source == source_tmp && destination == destination_tmp) {
												flg_exist = true;
												break;
											}
										}

										if (flg_exist != true) {
											oModel.oData.lines.push({
												SOURCE: source_tmp, DESTINATION: destination_tmp,
												status: status_tmp, lineType: lineType_tmp
											});

											oModel.refresh();
											console.log("ENABLE BLUE CONNECTOR");
											flg_exist = false;
										}
									}
								}
							}
						} else {

						}
					}
				}
				oModel.refresh();
			},

			getFinal: function () {
				var sFinURL = `/graph/getFinal(clientkey='${clientData}')`;
				let oFinalInput;
				$.ajax({

					url: sFinURL,

					type: "GET",

					method: "GET",

					success: function (oData, oStatus, oResponse) {
						oFinalInput = oData.value
						console.log(oData);
						oModel.refresh();
					}.bind(this),

					error: function (oError) {
						console.log(oError)
						errMes = 1
					}.bind(this),
				});
			},

			//Duyen add
			displayFinal: function (oEvent) {
				// Get a reference to the table control using its ID
				//var inputField = this.byId("_IDGenInput5");
				if (clientData == "") {
					MessageBox.error('Please choose a client.');
					return;
				}
				var sFinURL = `/graph/getFinal(clientkey='${clientData}')`;
				let oFinalInput;
				$.ajax({

					url: sFinURL,
					type: "GET",
					method: "GET",

					success: function (oData, oStatus, oResponse) {
						oFinalInput = oData.value
						let oInputtable = oModel.oData.input;
						let flag = "";
						let length_input = oModel.oData.input.length;
						oModel.oData.final = [];
						oModel.oData.input = [];

						for (var i = 0; i < oFinalInput.length; i++) {
							if (oFinalInput[i].CLIENT == clientData) {
								flag == ""
								// for (var y = 0; y < length_input; y++) {

								// 	//Modify the flag
								// 	if (oInputtable[y].SOURCE == oFinalInput[i].SOURCE && oInputtable[y].DESTINATION == oFinalInput[i].DESTINATION &&
								// 		oInputtable[y].INDSOURCE == oFinalInput[i].INDSOURCE && oInputtable[y].INDDEST == oFinalInput[i].INDDEST) {
								// 			oModel.oData.input[y].RELATIONSHIP = oFinalInput[i].MATCH_FLAG
								// 			oModel.oData.input[y].editable = true
								// 	}
								// }
								oModel.oData.final.push({
									SOURCE: oFinalInput[i].SOURCE, INDSOURCE: oFinalInput[i].INDSOURCE, DESTINATION: oFinalInput[i].DESTINATION, INDDEST: oFinalInput[i].INDDEST,
									CLIENT: oFinalInput[i].CLIENT, CLIENT_ITEM: oFinalInput[i].CLIENT_ITEM, MATCH_FLAG: oFinalInput[i].MATCH_FLAG, NEW_FLAG: oFinalInput[i].NEW_FLAG, AREA: oFinalInput[i].AREA, DESAREA: oFinalInput[i].DESAREA,
								});
								oModel.oData.input.push({
									SOURCE: oFinalInput[i].SOURCE, INDSOURCE: oFinalInput[i].INDSOURCE, DESTINATION: oFinalInput[i].DESTINATION, INDDEST: oFinalInput[i].INDDEST,
									CLIENT: oFinalInput[i].CLIENT, RELATIONSHIP: oFinalInput[i].MATCH_FLAG, AREA: oFinalInput[i].AREA, DESAREA: oFinalInput[i].DESAREA, editable: true
								});
							}
						}

						if (oModel.oData.final.length != 0) {
							oModel.refresh();

							isFinal = "X"

							//Draw Final without comparing with Significant List
							//this.drawFinal(oModel.oData.input);
							this._drawGraph(oModel.oData.input);

							isAnalysed = false
						} else {
							if (clientData != "") {
								MessageBox.error('Client has no Final data.');
							}
							//clientEmpty = true;
							oModel.oData.input = [];
							oModel.refresh();
							isFinal = ""
							isAnalysed = false
							this._drawGraph(oModel.oData.input);
						}
						console.log(oData);
						oModel.refresh();
					}.bind(this),

					error: function (oError) {
						console.log(oError)
						errMes = 1
						isFinal = ""
						MessageBox.error('Client has no Final data.');
					}.bind(this),
				});
			},

			drawFinal: function (oInput) {
				/**
				 * showcase only
				 */
				let JPIndPairs = [JSON.stringify(['キャリア採用数', '女性管理職比率']),
				JSON.stringify(['女性管理職比率', '社員の定着率']),
				JSON.stringify(['社員の定着率', '特許出願件数']),
				JSON.stringify(['特許出願件数', 'ROE']),
				JSON.stringify(['Industrial waste recycling rate', 'Number of press releases']),
				JSON.stringify(['Number of press releases', 'Number of customers in open factory']),
				JSON.stringify(['Number of customers in open factory', 'Sales amount']),
				JSON.stringify(['Sales amount', 'PBR']),
				JSON.stringify(['Sales amount', 'ROE'])]
				isAnalysed = true

				oModel.oData.linetmp = [];
				oModel.oData.lines = [];
				let id_green = this.getView().byId("ID_Green").getSelected();
				let id_grey = this.getView().byId("ID_Grey").getSelected();
				let id_black = this.getView().byId("ID_Black").getSelected();
				let id_blue = this.getView().byId("ID_Blue").getSelected();

				let inputLength = oInput.length
				let osource_dest = oInput
				osource_dest = []
				for (let i = 0; i < inputLength; i++) {
					let currentLine = oInput[i]
					let source = currentLine.SOURCE.toUpperCase()
					let sourceIn = currentLine.INDSOURCE
					let destination = currentLine.DESTINATION.toUpperCase()
					let destinationIn = currentLine.INDDEST
					let relationship = currentLine.RELATIONSHIP
					let client = clientData //urrentLine.CLIENT.toUpperCase()
					//let clientitem = currentLine.CLIENT_ITEM.toUpperCase()
					let sourceGroupName = currentLine.AREA;
					let destGroupName = currentLine.DESAREA;

					for (var index = 0; index < oModel.oData.lines.length; index++) {
						if (oModel.oData.lines[index].SOURCE.toUpperCase() == source.concat(sourceIn).toUpperCase() && oModel.oData.lines[index].DESTINATION.toUpperCase() == destination.concat(destinationIn).toUpperCase()) {
							// console.log(oModel.oData.lines)
							oModel.oData.lines.splice(index, 1)
							break;
						}
					}
					for (var index_n = 0; index_n < oModel.oData.lines.length; index_n++) {
						if (oModel.oData.lines[index_n].SOURCE.toUpperCase() == source.toUpperCase() && oModel.oData.lines[index_n].DESTINATION.toUpperCase() == destination.toUpperCase()) {
							oModel.oData.lines.splice(index_n, 1)
							break;
						}
					}

					//If line is new line 
					let new_entry = false
					for (var final = 0; final < oModel.oData.final.length; final++) {
						let current_final = oModel.oData.final[final];

						if (current_final.SOURCE.toUpperCase() == source && current_final.INDSOURCE == sourceIn
							&& current_final.DESTINATION.toUpperCase() == destination && current_final.INDDEST == destinationIn
							&& current_final.NEW_FLAG.toUpperCase() == "O") {

							//RED DASHED for Indicators
							oModel.oData.lines.push({
								SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
								status: "ReleventIndicator", lineType: "Dashed"
							});

							//RED Solid for Boxes 
							oModel.oData.lines.push({
								SOURCE: source, DESTINATION: destination,
								status: 'ReleventNode', lineType: "Solid"
							});
							new_entry = true
							break;
						}
					}

					if (new_entry == true) {
						return; //Jump to next line
					}

					//Relevant case
					if (oInput[i].RELATIONSHIP == 'O' || oInput[i].RELATIONSHIP == 'o') {
						//Change Indicator color
						if (sourceIn != '' && destinationIn != '') {

							/**
							 * Showcase only
							 */
							if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
							) {
								//THAI - IF BLACK CONNECTOR CHECKED, THEN PUSH BLACK CONNECTOR TO GRAPH
								if (id_black == true) {
									oModel.oData.lines.push({
										SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										status: "DemonReleInd", lineType: "Solid"
									});
								}

								//THAI - PUSH BLACK CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
									status: "DemonReleInd", lineType: "Solid"
								});

							} else {
								oModel.oData.lines.push({
									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
									//status: 'customLineIndicator', lineType: "Dashed"
									status: "ReleventIndicator", lineType: "Solid"
								});

								// oModel.oData.linetmp.push({
								// 	SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
								// 	//status: 'customLineIndicator', lineType: "Dashed"
								// 	status: "ReleventIndicator", lineType: "Dashed"
								// });
							}
						}

						if (source != '' && destination != '') {
							//THAI - IF GREEN CONNECTOR CHECKED, THEN PUSH GREEN CONNECTOR TO GRAPH
							if (id_green == true) {

								// if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'DemonReleNode', lineType: "Solid" })) {
								// 	// console.log("omg")
								// } else {
								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination,
									status: 'DemonReleNode', lineType: "Solid"
								});

								//THAI - PUSH GREEN CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source, DESTINATION: destination,
									status: 'DemonReleNode', lineType: "Solid"
								});
								//osource_dest.push({ SOURCE: source, DESTINATION: destination });
								//}
							} else { //ELSE PUSH NORMAL CONNECTOR TO GRAPH
								// if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: 'customLine', lineType: "Solid" })) {
								// 	// console.log("omg")
								// } else {
								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination,
									status: 'customLine', lineType: "Solid"
								});
								//}
							}


							// //THAI - PUSH GREEN CONNECTOR TO TEMPORARY MODEL FOR LATER USE
							// oModel.oData.linetmp.push({
							// 	SOURCE: source, DESTINATION: destination,
							// 	status: 'DemonReleNode', lineType: "Solid"
							// });
						}


					} else if (oInput[i].RELATIONSHIP == 'x' || oInput[i].RELATIONSHIP == 'X') {
						if (sourceIn != '' && destinationIn != '') {

							/**
							 * Showcase only
							 */
							if (!JPIndPairs.includes(JSON.stringify([sourceIn, destinationIn]))
							) {
								//THAI - IF BLUE CONNECTOR CHECKED, THEN PUSH CONNECTOR TO GRAPH
								if (id_blue == true) {
									oModel.oData.lines.push({
										SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
										status: "NDemonReleInd", lineType: "Dashed"
									});
								}
								//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
									status: "NDemonReleInd", lineType: "Dashed"
								});

							} else {

								oModel.oData.lines.push({
									SOURCE: source.concat(sourceIn), DESTINATION: destination.concat(destinationIn),
									status: 'customLineIndicator', lineType: "Solid"

								});
							}

						}

						if (source != '' && destination != '') {
							//THAI - IF GREY CONNECTOR CHECKED, THEN PUSH CONNECTOR TO GRAPH

							if (id_grey == true) {


								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination,
									status: 'NDemonReleNode', lineType: "Dashed"
								});

								//PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
								oModel.oData.linetmp.push({
									SOURCE: source, DESTINATION: destination,
									status: "NDemonReleNode", lineType: "Dashed"
								});
								//osource_dest.push({ SOURCE: source, DESTINATION: destination });

							} else { //ELSE PUSH NORMAL CONNECTOR TO GRAPH

								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination,
									status: 'customLine', lineType: "Solid"
								});
								//}
							}
							//THAI - PUSH BLUE CONNECTOR TO TEMPORARY MODEL FOR LATER USE
							// if (oModel.oData.lines.includes({ SOURCE: source, DESTINATION: destination, status: "NDemonReleNode", lineType: "Solid" })) {
							// 	// console.log("omg")
							// } else {
							// oModel.oData.linetmp.push({
							// 	SOURCE: source, DESTINATION: destination,
							// 	status: "NDemonReleNode", lineType: "Solid"
							// });
							//}
						}
					} else { // RELATIONSHIP == EMPTY
						var flag_solid = false

						//Push same as previous defined line if any
						for (let solid = 0; solid < oModel.oData.linetmp.length; solid++) {
							if (oModel.oData.linetmp[solid].SOURCE == source && oModel.oData.linetmp[solid].DESTINATION == destination) {
								oModel.oData.lines.push({
									SOURCE: source, DESTINATION: destination,
									status: oModel.oData.linetmp[solid].status,
									lineType: oModel.oData.linetmp[solid].lineType
								});

								flag_solid = true
								break;
							}
						}
						if (flag_solid == false) { //Push normal line
							oModel.oData.lines.push({
								SOURCE: source, DESTINATION: destination,
								status: 'customLine', lineType: "Solid"
							});
						}
					}
				}
				oModel.refresh();
				console.log(oModel);
			}
		});
		return oPageController;
	});
