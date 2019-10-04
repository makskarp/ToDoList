//for date-time
let dtt = document.getElementById("deadline");
dtt.onclick = function (event) {
    if(event.target == dtt){
        dtt.type = "datetime-local";
        dtt.focus();
    }
};

let modal = document.getElementById("myModal");
let modalEdit = document.getElementById("myModalEdit");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];
let spanEdit = document.getElementsByClassName("close")[1];
let itemsStorageFlex = document.getElementById("itemsStorageFlex");


btn.onclick = function() {
    modal.style.display = "block";
};

span.onclick = function() {
    modal.style.display = "none";
};

spanEdit.onclick = function() {
    modalEdit.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if(event.target == modalEdit) {
        modalEdit.style.display = "none";
    }
};
const localStorageName = "objects";
const station = "station";

const resetLocalStorage = function (obj) {
    let oldObjs = JSON.parse(localStorage.getItem(localStorageName)) || [];
    oldObjs.push(obj);

    localStorage.setItem(localStorageName, JSON.stringify(oldObjs));
};

const addInfoToLocalStorage = function(){
    const name = document.getElementById("name");
    const desc = document.getElementById("description");
    const prior = document.getElementById("select");
    const deadline = document.getElementById("deadline");
    const obj = {
        "name": name.value,
        "desc": desc.value,
        "prior": prior.value,
        "deadline": deadline.value
    };
    resetLocalStorage(obj);
};

const addInfoToLocalStorageEditMode = function () {
    const nameEdit = document.getElementById("nameEdit");
    const descEdit = document.getElementById("descriptionEdit");
    const priorEdit = document.getElementById("selectEdit");
    const deadlineEdit = document.getElementById("deadline");
    const indexToEdit = document.getElementById("indexToEdit");
    const obj = {
        "name": nameEdit.value,
        "desc": descEdit.value,
        "prior": priorEdit.value,
        "deadline": deadlineEdit.value
    };
    let index = indexToEdit.value;
    let oldObjs = JSON.parse(localStorage.getItem(localStorageName));
    let newObjs = oldObjs.map( (item,indx) => {
        if(indx === index){
            return obj;
        }
        return item;
    });
    localStorage.setItem(localStorageName, JSON.stringify(newObjs));
};


const deleteFromLocalStorage = function (index) {
    let oldObjs = JSON.parse(localStorage.getItem(localStorageName)) || [];
    let newObjs = oldObjs.filter( (item,indx) => {
        let bool = indx === index ? false : true;
        return bool;
    });
    localStorage.setItem(localStorageName, JSON.stringify(newObjs));
};

const mark = function (index,done) {
    const stationObj = {
        "index" : index,
    };
    const itemsToChange = document.getElementsByClassName("listItems");
    const itemToChange = Array.prototype.filter.call(itemsToChange, function(itemsToChange){
        return (itemsToChange.id === `${index}`);
    });
    let pTagsToChange = itemToChange[0].getElementsByTagName("p");
    console.log(pTagsToChange);
    for(let item of pTagsToChange){
        if(done === true){
            item.style.cssText += "text-decoration: line-through";
            stationObj["decoration"] = "text-decoration: line-through";
        }
        else{
            item.style.cssText += "text-decoration: none";
            stationObj["decoration"] = "text-decoration: none";
        }

    }
    const buttonToChange = document.getElementById(`marker${index}`);
    if(done === true){
        buttonToChange.textContent = "Mark as undone";
        stationObj["button"] = "Mark as undone";
        const editButtonToDelete = document.getElementById(`edit${index}`);
        editButtonToDelete.style.display = "none";
    }
    else{
        buttonToChange.textContent = "Mark as done";
        stationObj["button"] = "Mark as done";
        const editButtonToDelete = document.getElementById(`edit${index}`);
        editButtonToDelete.style.display = "inline-block";
    }
    let stationLocalStorage = JSON.parse(localStorage.getItem(station)) || [];
    if(stationLocalStorage.length === 0){
        stationLocalStorage.push(stationObj);
    }
    else{
        let changedObj = false;
        stationLocalStorage.forEach( (item) => {
            if(item["index"] === index){
                item["decoration"] = stationObj["decoration"];
                item["button"] = stationObj["button"];
                changedObj = true;
            }
        });
        if(!changedObj){
            stationLocalStorage.push(stationObj);
        }
    }
    localStorage.setItem(station, JSON.stringify(stationLocalStorage));
};

const markAsDone = function (index) {
    mark(index,true);
};

const markAsUndone = function (index) {
    mark(index,false);
};

const load = function () {
    let objInLocStorage = JSON.parse(localStorage.getItem(localStorageName)) || [];
    if(objInLocStorage.length === 0){
        return null;
    }
    else{
        objInLocStorage.forEach( (item,index) =>{
            let itemDiv = document.createElement("div");
            let itemName = item["name"];
            let itemDesc = item["desc"];
            let itemPrior = item["prior"];
            if(itemDesc.length === 0){
                itemDesc = "No description";
            }
            itemDiv.classList.add("listItems");
            itemDiv.style.width = "19%";
            itemDiv.setAttribute("id",index + "");
            let itemButtons = document.createElement("div");
            itemButtons.classList.add("listItemsButtons");
            let arrPTags = [];
            let arrButtons = [];
            let arrClassesForP = ["listItemsName","listItemsDescription","listItemsPriority"];
            for(let i = 0; i < 3; i++){
                arrPTags.push(document.createElement("p"));
                arrPTags[i].classList.add(arrClassesForP[i]);
                arrButtons.push(document.createElement("button"));
                arrButtons[i].type = "button";
                arrButtons[i].style.cssText = `border: none;color: white; margin-right: 10px;padding: 4px 14px ;text-align: center;font-size: 14px;`;
            }
            arrPTags[0].textContent = itemName;
            arrPTags[1].textContent = itemDesc;
            arrPTags[2].textContent = itemPrior;
            arrButtons[0].textContent = "Delete";
            arrButtons[0].style.cssText += "background-color: rgb(243, 65, 11);";
            arrButtons[0].onclick = function(){
              deleteFromLocalStorage(index);
              location.reload();
            };
            arrButtons[1].textContent = "Edit";
            arrButtons[1].id = `edit${index}`;
            arrButtons[1].style.cssText += "background-color: #4CAF50;";
            arrButtons[1].onclick = function(){
                modalEdit.style.display = "block";
                const name = document.getElementById("nameEdit");
                const desc = document.getElementById("descriptionEdit");
                const prior = document.getElementById("selectEdit");
                const deadline = document.getElementById("deadlineEdit");
                const indexToEdit = document.getElementById("indexToEdit");
                indexToEdit.value = index;
                name.value = item.name;
                desc.value = item.desc;
                prior.value = item.prior;
                deadline.value = item.deadline;
            };
            arrButtons[2].style.cssText += "background-color: #254266;";
            arrButtons[2].id = `marker${index}`;
            arrButtons[2].textContent = "Mark as done";
            arrButtons[2].onclick = function(){
                if(arrButtons[2].textContent === "Mark as done") {
                    markAsDone(index);
                }
                else{
                    markAsUndone(index);
                }
            };
            arrButtons.forEach((elem) => {
                itemButtons.appendChild(elem);
            });
            if(item["prior"] === 'High'){
                arrPTags[2].style.color = "red";
            }
            else if(item["prior"] === "Medium"){
                arrPTags[2].style.color = "yellow";
            }
            else{
                arrPTags[2].style.color = "blue ";
            }
            arrPTags.forEach( (elem) => {
                itemDiv.appendChild(elem);
            });
            itemDiv.appendChild(itemButtons);
            itemsStorageFlex.insertAdjacentElement("afterbegin", itemDiv);
            let stationLocalStorage = JSON.parse(localStorage.getItem(station)) || [];
            if(stationLocalStorage.length !== 0){
                stationLocalStorage.forEach( (item) => {
                        if(item["index"] === index){
                            arrPTags.forEach( (tag) => {
                                tag.style.cssText += item["decoration"];
                            });
                            arrButtons[2].textContent = item["button"];
                            if(arrButtons[2].textContent === "Mark as undone"){
                                const editButtonToDelete = document.getElementById(`edit${index}`);
                                editButtonToDelete.style.display = "none";
                            }
                        }
                    }
                );
            }
            localStorage.setItem(station, JSON.stringify(stationLocalStorage));
    })
    }
};

window.addEventListener('load',load(),false);

