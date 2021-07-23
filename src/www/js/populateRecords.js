import onLoad from "./onLoad.js";
import date from 'date-and-time';
import moment from 'moment';

const axios = require('axios').default;

let recordTable = null;
let recordTableRows = null;

onLoad(function(){
    recordTable = document.getElementById('record-table');
    recordTableRows = document.getElementById('table-rows');
})

export async function populateRecordTable(){
    recordTableRows.innerHTML = "";
    let result = await axios.get('/records',{
        params: {
            startDate: '2012-05-25 00:00:00',
            endDate: '2021-07-25 23:59:59',
            transactionType: "Credit",
            instigator: "Veeru",
            rowsPerPage: "10",
            pageNumber: 1
        }
    })
    console.log(result.data);

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

        console.log(element.dateandtime);        
        let formattedDate = date.parse(element.dateandtime,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
        console.log(formattedDate);
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
export function populatePagination(){

}

export function manageRecordDisplay(){
    populateRecordTable();
    populatePagination();
}