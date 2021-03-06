//import { axios } from "axios/dist/axios";
const axios = require('axios').default;
import onLoad from "./onLoad.js";
import {renderRecords} from './populateRecords.js';

let FtransactionAmountFieldNormal = true;

let tickIcon = '<span class="icon is-small">\
                <i class="fas fa-check"></i>\
                </span>';

let exclamationIcon = '<span class="icon is-small">\
                       <i class="fas fa-exclamation-triangle"></i>\
                       </span>';

let newButton = null;
let newButtonModal = null;
let creditButton = null;
let debitButton = null;
let closeButton = null;

let transactionAmountField = null;
let transactionAmountFieldStatusIcon = null;
let transactionAmountControl = null;

let transactionCommentField = null;

let transactionInitiatorField = null;


onLoad(function(){
    newButton = document.getElementById('new-button');
    newButtonModal = document.getElementById('new-button-modal');
    creditButton = document.querySelector('#new-button-modal .modal-card-foot .button.is-success');
    debitButton  = document.querySelector('#new-button-modal .modal-card-foot .button.is-danger');
    closeButton  = document.querySelector('#new-button-modal .modal-card-head .delete');
    
    transactionAmountField = document.getElementById('input-transaction-amount');
    transactionAmountFieldStatusIcon = document.getElementById('input-transaction-amount-field-status');
    transactionAmountControl = document.getElementById('transaction-amount-control');

    transactionCommentField = document.getElementById('input-transaction-comment');

    transactionInitiatorField = document.getElementById('input-transaction-initiator');
});

onLoad(function(){
    newButton.addEventListener('click',function(e){
        e.preventDefault();
        newButtonModal.classList.add('is-active');
    });

    transactionAmountField.addEventListener("focusin",function(){
        if(transactionAmountField !== true){
            let innerIcon = transactionAmountFieldStatusIcon.querySelector('.fas');
            innerIcon.style.color = "#A9A9A9";
        }
    })
    transactionAmountField.addEventListener("focusout",function(){
        if(transactionAmountField !== true){
            let innerIcon = transactionAmountFieldStatusIcon.querySelector('.fas');
            innerIcon.style.color = "#dbdbdb";
        }
    })

    creditButton.addEventListener('click',async function(e){
        await postNewTransaction(e,true);
        renderRecords();
    });
    debitButton.addEventListener('click',async function(e){
        await postNewTransaction(e,false);
        renderRecords();
    });
    closeButton.addEventListener('click',function(e){
        e.preventDefault();
        newButtonModal.classList.remove('is-active');
        FmodalActive = false;
    });
})
async function postNewTransaction(e,credit = true){
    let FallValid = true; //this flag teels me if all the fields are valid or not
        e.preventDefault(); //what is the default?
        
        //deal with the transaction field
        let transactionAmount = Number(transactionAmountField.value);
        if(transactionAmount <= 0){
            transactionAmountFieldInvalid();
            FallValid = false;
        }
        else transactionAmountFieldValid();
        if(credit === false) transactionAmount = transactionAmount * -1;

        //deal with the comment
        let transactionComment = transactionCommentField.value;
        
        //deal with the initiator of the transaction
        let transactionInitiator = transactionInitiatorField.value;
        if(transactionInitiator === "none"){
            transactionInitiatorFieldInvalid();
            FallValid = false;
        }
        else transactionInitiatorFieldValid();

        if(FallValid === true){
            //start posting to the database at this point..
            try{
                let result = await axios.post('/records', {
                    transaction: transactionAmount,
                    instigator: transactionInitiator,
                    comment: transactionComment
                 });
            }
            catch(error){
                console.log('error communicating with the server');
                console.log(error);
            }

             console.log("successfully pushed the post request");
             newButtonModal.classList.remove('is-active');
        }
}

function transactionAmountFieldInvalid()
{
    transactionAmountFieldNormal();
    transactionAmountField.classList.add('is-danger');
    transactionAmountControl.classList.add('has-icons-right');
    transactionAmountFieldStatusIcon.classList.remove('is-hidden');

    let errorMessage = document.createElement('div');
    errorMessage.classList.add("error-message");
    errorMessage.innerHTML = '<p class="subtitle is-size-6 has-text-danger">Please enter a positive number</p>';

    transactionAmountField.parentNode.append(errorMessage);

    transactionAmountFieldStatusIcon.innerHTML = exclamationIcon;
}
function transactionAmountFieldNormal(){
    transactionAmountField.classList.remove('is-danger');
    transactionAmountField.classList.remove('is-success');

    transactionAmountControl.classList.remove('has-icons-right');
    transactionAmountFieldStatusIcon.classList.add('is-hidden');

    let errorMessage = transactionAmountField.parentNode.querySelector('.error-message');
    if(errorMessage != null) 
        errorMessage.remove();
}
function transactionAmountFieldValid()
{
    transactionAmountFieldNormal();
    transactionAmountField.classList.add('is-success');
    transactionAmountControl.classList.add('has-icons-right');
    transactionAmountFieldStatusIcon.classList.remove('is-hidden');

    transactionAmountFieldStatusIcon.innerHTML = tickIcon;
}

function transactionInitiatorFieldInvalid(){
    transactionInitiatorFieldNormal();
    let selectSpan = transactionInitiatorField.parentNode;
    selectSpan.classList.add("is-danger");
}
function transactionInitiatorFieldNormal(){
    let selectSpan = transactionInitiatorField.parentNode;
    selectSpan.classList.remove("is-danger");
    selectSpan.classList.remove("is-success");
}
function transactionInitiatorFieldValid(){
    transactionInitiatorFieldNormal();
    let selectSpan = transactionInitiatorField.parentNode;
    selectSpan.classList.add("is-success");
}