import { startDate,endDate,transactionType,instigator,rowsPerPage,pageNumber } from "./filterVariables.js";
import onLoad from "./onLoad.js";
import { renderRecords } from "./populateRecords.js";

onLoad(function(){
    //constructor to setup default values for the filter variables..

})

let filterButton = null;
let filterTagsDisplay = null;
let filterModal = null;

let filterStartDate = null;
let filterEndDate = null;

onLoad(function(){
    //initialize the module varianbles..

    filterButton = document.getElementById('filter-button');
    filterTagsDisplay = document.getElementById('filter-tags-display');
    filterModal = document.getElementById('filter-button-modal');

    filterStartDate = document.getElementById('filter-start-date');
    filterEndDate = document.getElementById('filter-end-date');
})

onLoad(function(){
    //setup default filters
    // startDate = `${e.detail.data.value()} 00:00:00`; //format must be preserved 
        
    // let startDateTag = document.getElementById('start-date-tag');
    // startDateTag.innerHTML = `Start Date : ${e.detail.data.value()}`;

    // endDate = `${e.detail.data.value()} 23:59:59`; //format must be preserved 
        
    // let endDateTag = document.getElementById('end-date-tag');
    // endDateTag.innerHTML = `End Date : ${e.detail.data.value()}`;
})

onLoad(function(){
    //setup default bindings which are trivial and dont change much

    filterButton.addEventListener('click',function(e){
        e.preventDefault();
        filterModal.classList.add('is-active');
    })

    let deleteButton = filterModal.querySelector('.delete');
    deleteButton.addEventListener('click',function(e){
        e.preventDefault();
        renderRecords();
        filterModal.classList.remove('is-active');
    });

    let okButton = filterModal.querySelector('#filter-modal-ok-button');
    okButton.addEventListener('click',function(e){
        e.preventDefault();
        renderRecords();
        filterModal.classList.remove('is-active');
    })
})

onLoad(function(){
    //constructor

})

onLoad(function(){
    //setup the filter modal working
    
    document.addEventListener("start-dateChange", function(e) {
        // e.detail.data.value() is the date
        startDate = `${e.detail.data.value()} 00:00:00`; //format must be preserved 
        
        let startDateTag = document.getElementById('start-date-tag');
        startDateTag.innerHTML = `Start Date : ${e.detail.data.value()}`;
    });
    document.addEventListener("end-dateChange", function(e) {
        // e.detail.data.value() is the date
        endDate = `${e.detail.data.value()} 23:59:59`; //format must be preserved 
        
        let endDateTag = document.getElementById('end-date-tag');
        endDateTag.innerHTML = `End Date : ${e.detail.data.value()}`;
    });

    let transactionTypeFilter = document.getElementById('transaction-type-filter');
    transactionTypeFilter.addEventListener('input',function(e){
        //e.preventDefault();
        console.log(e.target.value);
        let transactionTypeTag = document.getElementById('transaction-type-tag');
        if(e.target.value === "Credit"){
            transactionTypeTag.classList.remove("is-hidden");
            transactionTypeTag.classList.remove("is-danger")
            transactionTypeTag.classList.remove("is-black")

            transactionTypeTag.classList.add("is-success");

            transactionTypeTag.innerHTML = `Credit`;

            transactionType = 'Credit';
        }
        else if(e.target.value === "Debit"){
            transactionTypeTag.classList.remove("is-hidden");
            transactionTypeTag.classList.remove("is-success")
            transactionTypeTag.classList.remove("is-black")

            transactionTypeTag.classList.add("is-danger");

            transactionTypeTag.innerHTML = `Debit`;

            transactionType = 'Debit';
        }
        else{ 
            transactionTypeTag.classList.add("is-hidden");
            transactionType = 'All';
        }
    })

    let transactionInstigatorFilterTag = document.getElementById('transaction-instigator-tag');
    let transactionInstigatorFilter = document.getElementById('transaction-instigator-filter');
    transactionInstigatorFilter.addEventListener('input',function(e){
        let value = e.target.value;
        if(value === "None"){
            transactionInstigatorFilterTag.classList.add('is-hidden');
            instigator="any";
        } else{
            transactionInstigatorFilterTag.classList.remove("is-hidden");
            transactionInstigatorFilterTag.innerHTML = value;

            instigator = value;
        }
    })

    let numberOfRowsPerPageTag = document.getElementById('number-of-rows-filter-tag');
    let numberOfRowsPerPageInput = document.getElementById('number-of-rows-filter');
    numberOfRowsPerPageInput.addEventListener('input',function(e){
        let value = e.target.value;
        rowsPerPage = value;

        numberOfRowsPerPageTag.innerHTML = `Rows Per Page : ${value}`;
    })

})