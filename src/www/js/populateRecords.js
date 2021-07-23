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
        newRow.classList.add("is-clickable");

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
        
        newRow.addEventListener('click',function(){
            let rowNodes = recordTable.querySelectorAll('.is-selected');
            console.log(rowNodes)
            rowNodes.forEach(function(rowNode){
                rowNode.classList.remove('is-selected');

                let moneyDisplayText = rowNode.querySelector('.money-display.placeholderPositive');
                moneyDisplayText.classList.remove('placeholderPositive');
                moneyDisplayText.classList.add('positive');
            });
            
            this.classList.add('is-selected');
            let moneyDisplayText = this.querySelector('.money-display.positive');
            moneyDisplayText.classList.remove('positive');
            moneyDisplayText.classList.add('placeholderPositive');
        })
    });
}
export async function populatePagination(){
    recordTablePaginationList.innerHTML = "";
    let result = await axios.get("/getNumberOfRecords");
    result = result.data;
    console.log(result);

    let numberOfPages = Math.ceil(Number(result.numberOfRecords) / Number(rowsPerPage));    
   
    let startPage = pageNumber;
    let endPage = numberOfPages;
    let midPage = Math.floor((pageNumber + numberOfPages)/2);
    let midPageAnterior = midPage -1;
    let midPageSuperior = midPage+1;

    let startNode = document.createElement('li');
    startNode.innerHTML = `<a class="pagination-link">${startPage}</a>`
    recordTablePaginationList.append(startNode);

    recordTablePaginationList.innerHTML += '<li><span class="pagination-ellipsis">&hellip;</span></li>';  

    if(midPageAnterior < startPage) midPageAnterior = startPage
    let midPageAnteriorNode = document.createElement('li');
    midPageAnteriorNode.innerHTML = `<a class="pagination-link">${midPageAnterior}</a>`
    recordTablePaginationList.append(midPageAnteriorNode);

    let midPageNode = document.createElement('li');
    midPageNode.innerHTML = `<a class="pagination-link">${midPage}</a>`
    recordTablePaginationList.append(midPageNode);

    if(midPageSuperior > endPage) midPageSuperior = endPage
    let midPageSuperiorNode = document.createElement('li');
    midPageSuperiorNode.innerHTML = `<a class="pagination-link">${midPageSuperior}</a>`
    recordTablePaginationList.append(midPageSuperiorNode);

    recordTablePaginationList.innerHTML += '<li><span class="pagination-ellipsis">&hellip;</span></li>';  

    let endPageNode = document.createElement('li');
    endPageNode.innerHTML = `<a class="pagination-link">${endPage}</a>`
    recordTablePaginationList.append(endPageNode);
}

export function manageRecordDisplay(){
    populateRecordTable();
    populatePagination();
}