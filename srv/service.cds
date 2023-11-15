using db from '../db/data';

service GraphService {

   entity NODES_VIEW  as projection on db.NODES_VIEW;
   entity LINES_VIEW  as projection on db.LINES_VIEW;
   entity INPUT_VIEW  as projection on db.INPUT_VIEW;
   entity SIGNIFICANT as projection on db.SIGNIFICANT;
   entity GROUP_VIEW  as projection on db.GROUP_VIEW;
   entity CLIENT_VIEW as projection on db.CLIENT_VIEW;
   entity FINAL_VIEW  as projection on db.FINAL;
   function hdbprocedure()                                        returns Boolean;
   function deletesingle(clientkey : String)                      returns Boolean;
   function deleteclient(clientkey : String)                      returns Boolean;
   function deletefinal(clientkey : String ) returns Boolean;
   function deleteInput(clientkey : String ) returns Boolean; 
   function getInput()                                            returns array of INPUT_VIEW;
   function getFinal(clientkey : String)                          returns array of FINAL_VIEW;
   function getSignificant(clientkey : String) returns array of SIGNIFICANT;
   action   upload(uploadData : array of GraphService.INPUT_VIEW) returns Boolean;
   //function get_client returns array of GraphService.CLIENT_VIEW;
   //Duyen add Begin
   function get_client(client: String) returns array of GraphService.CLIENT_VIEW;
   function get_client_from_inputview() returns array of {CLIENT: String; }; 
   //End
   action post_client(client : GraphService.CLIENT_VIEW) returns Boolean;
   action upload_final(finalData: array of GraphService.FINAL_VIEW) returns Boolean;
}
