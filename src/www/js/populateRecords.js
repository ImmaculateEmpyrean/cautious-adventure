import { startDate,endDate,transactionType,instigator,rowsPerPage,pageNumber } from "./filterVariables.js";
import onLoad from "./onLoad.js";
import date from 'date-and-time';
import moment from 'moment';

const axios = require('axios').default;

let recordTable = null;
let recordTableRows = null;

let recordTablePagination = null; 
let recordTablePaginationList = null;
let recordTablePaginationPreviousPage = null;
let recordTablePaginationNextPage = null;


onLoad(function(){
    recordTable = document.getElementById('record-table');
    recordTableRows = document.getElementById('table-rows');

    recordTablePagination = document.getElementById('record-table-pagination');
    recordTablePaginationList = document.getElementById('record-table-pagination-list');
    recordTablePaginationPreviousPage = document.getElementById('record-table-pagination-previous-page');
    recordTablePaginationNextPage = document.getElementById('record-table-pagination-next-page');
})

onLoad(function(){
    recordTablePaginationPreviousPage.addEventListener('click',function(e){
        e.preventDefault();
        if(pageNumber > 1){
            pageNumber = pageNumber - 1;
            renderRecords();
        }
    });

    recordTablePaginationNextPage.addEventListener('click',async function(e){
        e.preventDefault();
        
        let result = await axios.get("/getNumberOfRecords");
        result = result.data;
        
        let numberOfPages = Math.ceil(Number(result.numberOfRecords) / Number(rowsPerPage)); 

        if(pageNumber < numberOfPages){
            pageNumber = pageNumber + 1;
            renderRecords();
        }
    })
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

        let newRow = recordTableRows.insertRow();
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
            if(this.classList.contains('is-selected')){
                //display detailed modal about the transaction in question..

            }
            else{
                let rowNodes = recordTable.querySelectorAll('.is-selected');
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
            }
        })
    });
}
export async function populatePagination(){
    recordTablePaginationList.innerHTML = "";
    
    let result = await axios.get("/getNumberOfRecords");
    result = result.data;
    console.log(result);

    let numberOfPages = Math.ceil(Number(result.numberOfRecords) / Number(rowsPerPage));    
   
    let currentPage = Number(pageNumber);
    let prevPage = currentPage - 1;
    let nextPage = currentPage + 1;
    let finalPage = Number(numberOfPages);

    let startNode = document.createElement('li');
    startNode.innerHTML = `<a class="pagination-link">1</a>`
    startNode.addEventListener('click',function(e){
        e.preventDefault();
        pageNumber = 1;
        renderRecords();
    })
    recordTablePaginationList.append(startNode);

    let seperator1 = document.createElement('li');
    seperator1.innerHTML = '<span class="pagination-ellipsis">&hellip;</span>';
    recordTablePaginationList.append(seperator1);

    if(prevPage<1) prevPage=1;
    let prevPageNode = document.createElement('li');
    prevPageNode.innerHTML = `<a class="pagination-link">${prevPage}</a>`
    prevPageNode.dataset.pageNumber = prevPage;
    prevPageNode.addEventListener('click',function(e){
        e.preventDefault();
        pageNumber = this.dataset.pageNumber;
        renderRecords();
    })
    recordTablePaginationList.append(prevPageNode);

    let currentPageNode = document.createElement('li');
    currentPageNode.innerHTML = `<a class="pagination-link is-current">1</a>`
    recordTablePaginationList.append(currentPageNode);

    if(nextPage>finalPage) {
        nextPage = finalPage;
    }
    let nextPageNode = document.createElement('li');
    nextPageNode.innerHTML = `<a class="pagination-link">${nextPage}</a>`
    nextPageNode.dataset.pageNumber = nextPage;
    nextPageNode.addEventListener('click',function(e){
        e.preventDefault();
        console.log('clicked mee')
        pageNumber = this.dataset.pageNumber;
        renderRecords();
    })
    recordTablePaginationList.append(nextPageNode);

    let seperator2 = document.createElement('li');
    seperator2.innerHTML = '<span class="pagination-ellipsis">&hellip;</span>';
    recordTablePaginationList.append(seperator2);

    let finalPageNode = document.createElement('li');
    finalPageNode.innerHTML = `<a class="pagination-link">${finalPage}</a>`
    finalPageNode.dataset.pageNumber = finalPage;
    finalPageNode.addEventListener('click',function(e){
        e.preventDefault();
        pageNumber = this.dataset.pageNumber;
        renderRecords();
    })
    recordTablePaginationList.append(finalPageNode);
}

export function renderRecords(){
    populateRecordTable();
    populatePagination();
}