//for date-time
let dtt = document.getElementById("deadline");
dtt.onclick = function (event) {
    if(event.target == dtt){
        dtt.type = "datetime-local";
        dtt.focus();
    }
};
const modal = document.getElementById("myModal");
const modalEdit = document.getElementById("myModalEdit");
const btnAddItemToList = document.getElementById("btnAddToList");
const btnSortAllList = document.getElementById("btnSortAllList");
const textSearch = document.getElementById("textSearch");

const span = document.getElementsByClassName("close")[0];
const spanEdit = document.getElementsByClassName("close")[1];
const itemsStorageFlex = document.getElementById("itemsStorageFlex");


btnAddItemToList.onclick = function() {
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

textSearch.addEventListener("input", (event) => {
    const {value} = event.target;
    if(value.length){
        showSearch(value)
    }
    else{
        const divs = document.getElementsByClassName("listItems");
        for (let i = divs.length - 1; i >= 0; i--) {
            divs[i].remove();
        }
        load();
    }
} );
const localStorageName = "objects";

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
        "id": Date.now(),
        "name": name.value,
        "desc": desc.value,
        "prior": prior.value,
        "deadline": deadline.value,
        "done" : false,
    };
    resetLocalStorage(obj);
};

const addInfoToLocalStorageEditMode = function () {
    const nameEdit = document.getElementById("nameEdit");
    const descEdit = document.getElementById("descriptionEdit");
    const priorEdit = document.getElementById("selectEdit");
    const deadlineEdit = document.getElementById("deadlineEdit");
    const indexToEdit = document.getElementById("indexToEdit");
    let index = indexToEdit.value;
    const obj = {
        "id": index,
        "name": nameEdit.value,
        "desc": descEdit.value,
        "prior": priorEdit.value,
        "deadline": deadlineEdit.value,
        "done": false,
    };
    let oldObjs = JSON.parse(localStorage.getItem(localStorageName));
    let newObjs = oldObjs.map( (item) => {
        if(item["id"] === index){
            return obj;
        }
        return item;
    });
    localStorage.setItem(localStorageName, JSON.stringify(newObjs));
};


const deleteFromLocalStorage = function (index) {
    let oldObjs = JSON.parse(localStorage.getItem(localStorageName)) || [];
    let newObjs = oldObjs.filter( (item) => {
        let bool = item["id"] === index ? false : true;
        return bool;
    });
    localStorage.setItem(localStorageName, JSON.stringify(newObjs));
};

const mark = function (index,done) {
    const itemsToChange = document.getElementsByClassName("listItems");
    const itemToChange = Array.prototype.filter.call(itemsToChange, function(itemsToChange){
        return (itemsToChange.id === `${index}`);
    });
    let pTagsToChange = itemToChange[0].getElementsByTagName("p");
    for(let item of pTagsToChange){
        if(done === true){
            item.style.cssText += "text-decoration: line-through";
        }
        else{
            item.style.cssText += "text-decoration: none";
        }
    }
    const buttonToChange = document.getElementById(`marker${index}`);
    if(done === true){
        buttonToChange.textContent = "Mark as undone";
        const editButtonToDelete = document.getElementById(`edit${index}`);
        editButtonToDelete.style.display = "none";
    }
    else{
        buttonToChange.textContent = "Mark as done";
        const editButtonToDelete = document.getElementById(`edit${index}`);
        editButtonToDelete.style.display = "inline-block";
    }
    let stationLocalStorage = JSON.parse(localStorage.getItem(localStorageName)) || [];
    stationLocalStorage.forEach( (item) => {
        if(item["id"] === index){
            done === true ? item["done"] = true : item["done"] = false;
        }
    });
    localStorage.setItem(localStorageName, JSON.stringify(stationLocalStorage));
};

const markAsDone = function (index) {
    mark(index,true);
};

const markAsUndone = function (index) {
    mark(index,false);
};

const showSearch = function (value) {
    let objInLocStorage = JSON.parse(localStorage.getItem(localStorageName)) || [];
    if(objInLocStorage.length === 0){
        alert("No items");
        return null;
    }
    else{
        const divs = document.getElementsByClassName("listItems");
        for (let i = divs.length - 1; i >= 0; i--) {
            divs[i].remove();
        }
        const nameFilltered = objInLocStorage.filter( (item) => {
           return item["name"].includes(value);
        });
        const descFilltered = objInLocStorage.filter( (item) => {
            return item["desc"].includes(value);
        });
        const matches = nameFilltered.concat(descFilltered);
        const result = matches.filter( (item,indx) => {
            return matches.indexOf(item) === indx;
        });
        result.forEach( (item) =>{
            let itemDiv = document.createElement("div");
            let itemName = item["name"];
            let itemDesc = item["desc"];
            let itemPrior = item["prior"];
            if(itemDesc.length === 0){
                itemDesc = "No description";
            }
            itemDiv.classList.add("listItems");
            itemDiv.style.width = "19%";
            itemDiv.setAttribute("id",item["id"] + "");
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
                deleteFromLocalStorage(item["id"]);
                location.reload();
            };
            arrButtons[1].textContent = "Edit";
            arrButtons[1].id = `edit${item["id"]}`;
            arrButtons[1].style.cssText += "background-color: #4CAF50;";
            arrButtons[1].onclick = function(){
                modalEdit.style.display = "block";
                const name = document.getElementById("nameEdit");
                const desc = document.getElementById("descriptionEdit");
                const prior = document.getElementById("selectEdit");
                const deadline = document.getElementById("deadlineEdit");
                const indexToEdit = document.getElementById("indexToEdit");
                indexToEdit.value = item["id"];
                name.value = item.name;
                desc.value = item.desc;
                prior.value = item.prior;
                deadline.value = item.deadline;
            };
            arrButtons[2].style.cssText += "background-color: #254266;";
            arrButtons[2].id = `marker${item["id"]}`;
            arrButtons[2].textContent = "Mark as done";
            arrButtons[2].onclick = function(){
                if(arrButtons[2].textContent === "Mark as done") {
                    markAsDone(item["id"]);
                }
                else{
                    markAsUndone(item["id"]);
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
            if(item["done"] === true) {
                arrPTags.forEach((tag) => {
                    tag.style.cssText += "text-decoration: line-through;";
                });
                arrButtons[2].textContent = "Mark as undone";
                if (arrButtons[2].textContent === "Mark as undone") {
                    const editButtonToDelete = document.getElementById(`edit${item["id"]}`);
                    editButtonToDelete.style.display = "none";
                }
            }
        });
    }

};

const sortList = function () {
    let objInLocStorage = JSON.parse(localStorage.getItem(localStorageName)) || [];
    objInLocStorage.sort( (a,b) => {
        if(a["done"] === true && b["done"] === false) {
            return -1;
        }
        else if(a["done"] === false && b["done"] === true) {return 1;}
        else {
            let priorA = a["prior"];
            let priorB = b["prior"];
            let compareObj = {
                "Low" : 0,
                "Medium" : 1,
                "High" : 2,
            };
            if(compareObj[priorA] > compareObj[priorB]){
                return 1;
            }
            else if(compareObj[priorA] === compareObj[priorB]){
                return 0;
            }
            else{
                return -1;
            }
        }
    });
    localStorage.setItem(localStorageName, JSON.stringify(objInLocStorage));
    location.reload();
};
const load = function () {
    let objInLocStorage = JSON.parse(localStorage.getItem(localStorageName)) || [];
    if(objInLocStorage.length === 0){
        return null;
    }
    else{
            objInLocStorage.forEach( (item) =>{
                let itemDiv = document.createElement("div");
                let itemName = item["name"];
                let itemDesc = item["desc"];
                let itemPrior = item["prior"];
                if(itemDesc.length === 0){
                    itemDesc = "No description";
                }
                itemDiv.classList.add("listItems");
                itemDiv.style.width = "19%";
                itemDiv.setAttribute("id",item["id"] + "");
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
                  deleteFromLocalStorage(item["id"]);
                  location.reload();
                };
                arrButtons[1].textContent = "Edit";
                arrButtons[1].id = `edit${item["id"]}`;
                arrButtons[1].style.cssText += "background-color: #4CAF50;";
                arrButtons[1].onclick = function(){
                    modalEdit.style.display = "block";
                    const name = document.getElementById("nameEdit");
                    const desc = document.getElementById("descriptionEdit");
                    const prior = document.getElementById("selectEdit");
                    const deadline = document.getElementById("deadlineEdit");
                    const indexToEdit = document.getElementById("indexToEdit");
                    indexToEdit.value = item["id"];
                    name.value = item.name;
                    desc.value = item.desc;
                    prior.value = item.prior;
                    deadline.value = item.deadline;
                };
                arrButtons[2].style.cssText += "background-color: #254266;";
                arrButtons[2].id = `marker${item["id"]}`;
                arrButtons[2].textContent = "Mark as done";
                arrButtons[2].onclick = function(){
                    if(arrButtons[2].textContent === "Mark as done") {
                        markAsDone(item["id"]);
                    }
                    else{
                        markAsUndone(item["id"]);
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
                if(item["done"] === true) {
                    arrPTags.forEach((tag) => {
                        tag.style.cssText += "text-decoration: line-through;";
                    });
                    arrButtons[2].textContent = "Mark as undone";
                    if (arrButtons[2].textContent === "Mark as undone") {
                        const editButtonToDelete = document.getElementById(`edit${item["id"]}`);
                        editButtonToDelete.style.display = "none";
                    }
                }
    });
    }
};

btnSortAllList.onclick = function(){
    sortList();
};

window.addEventListener('load',load(),false);

