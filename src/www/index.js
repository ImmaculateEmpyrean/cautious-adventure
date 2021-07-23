import "./js/newButton.js";
import {populatePagination, populateRecordTable} from "./js/populateRecords.js";
import onLoad from "./js/onLoad.js";

onLoad(function(){
    populateRecordTable();
    populatePagination()
})