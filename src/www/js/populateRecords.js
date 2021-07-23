import onLoad from "./onLoad.js";
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
        let tableRow = `<tr id="table-row">
                            <td>${element.id}</td>
                            <td class="has-text-centered">
                                <span class="money-display positive">
                                    <span class="iconify" data-inline="false" data-icon="teenyicons:rupee-solid"></span>
                                    500 Credited
                                </span>
                            </td>
                            <td class="has-text-centered">19-Jan-2021 5:00 pm</td>
                            <td class="has-text-right">
                                <span class="money-display">
                                    <span class="iconify" data-inline="false" data-icon="teenyicons:rupee-solid"></span> 
                                    4000/- 
                                </span>
                            </td>
                        </tr>`
        recordTableRows.innerHTML = recordTableRows.innerHTML + tableRow;
    });
}
export function populatePagination(){

}

export function manageRecordDisplay(){
    populateRecordTable();
    populatePagination();
}