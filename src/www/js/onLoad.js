//this module gives me a wrapper on onDOMContentLoaded
let onLoadedEvents = [];

document.addEventListener('DOMContentLoaded',function(){
    onLoadedEvents.forEach(function(element){
        element();
    })
})

export default function onLoad(callback){
    onLoadedEvents.push(callback);
}