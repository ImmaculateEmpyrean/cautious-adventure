import { startDate,endDate,transactionType,instigator,rowsPerPage,pageNumber } from "./filterVariables.js";
import onLoad from "./onLoad.js";
import date from 'date-and-time';
import moment from 'moment';

const axios = require('axios').default;

let recordTable = null;
let recordTableRows = null;

let recordTablePagination = null; 
let recordTablePaginationList = null;

onLoad(function(){
    recordTable = document.getElementById('record-table');
    recordTableRows = document.getElementById('table-rows');

    recordTablePagination = document.getElementById('record-table-pagination');
    recordTablePaginationList = document.getElementById('record-table-pagination-list');
})

export async function populateRecordTable(){
    recordTableRows.innerHTML = "";
    let result = await axios.get('/records',{
        params: {
            startDate: startDate,
            endDate: endDate,
            transactionType: transactionType,
            instigator: instigator,
            rowsPerPage: rowsPerPage,
            pageNumber: pageNumber 
        }
    })

    result.data.forEach(element => {
        let moneyDisplayStyling = null;
        let transactionAmount = element.transaction;
        let transactionText = null;
        if(transactionAmount > 0){
            moneyDisplayStyling = 'positive'
            transactionText = 'Credited'
        } 
        else{
            moneyDisplayStyling = 'negative'
            transactionText = 'debited'
        } 

        let formattedDate = date.parse(element.dateandtime,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')        
        formattedDate = moment(formattedDate).format('dddd  Do MMMM YYYY  hh:mm A');        

        let newRow = recordTable.insertRow();
        newRow.classList.add("table-row");

        let idCell = newRow.insertCell();
        idCell.innerHTML = element.id;

        let transactionCell = newRow.insertCell();
        transactionCell.classList.add('has-text-centered')
        transactionCell.innerHTML = `<span class="money-display ${moneyDisplayStyling}">\
                                        <span class="iconify" data-inline="false" data-icon="teenyicons:rupee-solid"></span>
                                        ${transactionAmount} ${transactionText}
                                    </span>`;
        
        let dateCell = newRow.insertCell();
        dateCell.classList.add('has-text-centered')
        dateCell.innerHTML = formattedDate;

        let remBalanceCell = newRow.insertCell();
        remBalanceCell.classList.add('has-text-right');
        remBalanceCell.innerHTML = `<span class="money-display">
                                        <span class="iconify" data-inline="false" data-icon="teenyicons:rupee-solid"></span> 
                                        ${element.remainingbalance}/- 
                                    </span>`;
    });
}
export async function populatePagination(){
    recordTablePaginationList.innerHTML = "";
    let result = await axios.get("/getNumberOfRecords");
    result = result.data;
    console.log(result);

    let numberOfPages = Math.ceil(Number(result.numberOfRecords) / Number(rowsPerPage));    
    console.log(numberOfPages);

    if(numberOfPages > 1) {
        for(let i = 1; i< numberOfPages; i++){
            console.log(i);
            recordTablePaginationList.innerHTML += `<li><a class="pagination-link">${i}</a></li>`;
            if(i == 1)recordTablePaginationList.innerHTML += '<li><span class="pagination-ellipsis">&hellip;</span></li>';  
        }
        if(numberOfPages > 2)
            recordTablePaginationList.innerHTML += '<li><span class="pagination-ellipsis">&hellip;</span></li>';  
        recordTablePaginationList.innerHTML += `<li><a class="pagination-link">${numberOfPages}</a></li>`;
    }
    else{
        recordTablePaginationList.innerHTML = `<li><a class="pagination-link">1</a></li>`;
    }
}

export function manageRecordDisplay(){
    populateRecordTable();
    populatePagination();
}