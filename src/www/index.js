import onLoad from "./js/onLoad.js";
import "./js/newButton.js";
import "./js/filterModal.js";
import {populatePagination, populateRecordTable, renderRecords} from "./js/populateRecords.js";

onLoad(function(){
    renderRecords();
})