const NewNamedDB = ({ dbName ="templateDB" , dbVersionNumber =1 , errorCallback ={
    useErrorParameter: true,
    callback: (event)=>console.dir(event)
} , successCallback ={
    useResultParameter: true,
    callback: (event)=>console.dir(event)
} , updateCallback ={
    useUpdateParameter: true,
    callback: (event)=>console.dir(event)
} , dataBaseObjectsCreate =[
    {
        name: "authorData",
        keyPath: "ssn",
        children: [
            {
                property: "fullName",
                keyPath: "name",
                options: {
                    unique: false
                }
            },
            {
                property: "email",
                keyPath: "email",
                options: {
                    unique: true,
                    multiEntry: true
                }
            }
        ]
    }
] , dataBaseObjectsItems =[
    {
        name: "authorData",
        children: [
            {
                fullName: "Oleh Hrechukh",
                email: "dimeloss@gmail.com"
            }
        ]
    }
]  })=>{
    const requestOpenDataBase = (name = dbName, version = dbVersionNumber)=>indexedDB.open(name, version);
    const dataBaseItems = {
        previousVersion: null,
        dataBase: null,
        requestResult: requestOpenDataBase(dbName, dbVersionNumber)
    };
    let { dataBase , previousVersion , requestResult  } = dataBaseItems;
    requestResult.addEventListener("error", (error)=>{
        errorCallback.callback instanceof Function && errorCallback.callback(error);
        return reportError(error);
    });
    requestResult.addEventListener("success", (event)=>{
        successCallback.callback instanceof Function && successCallback.callback(event);
        return dataBase = requestOpenDataBase.result;
    });
    requestResult.addEventListener("upgradeneeded", (event)=>{
        const db = event.target.result;
        previousVersion = event.oldVersion;
        const storageContainers = dataBaseObjectsCreate.map((item)=>{
            let storage = db.createObjectStore(item.name, {
                keyPath: item.keyPath ? item.keyPath : "ssn"
            });
            item.children.forEach((item)=>{
                item.property !== "" && storage.createIndex(item.property, item.keyPath || `value_${item.property}`, item.options);
            });
            return storage;
        });
        const mappedStorages = storageContainers.filter((item)=>dataBaseObjectsItems.some((collection)=>collection.name === item.name)).map((item)=>{
            const itemsToAdd = dataBaseObjectsItems.find((element)=>element.name === item.name);
            item.transaction.addEventListener("complete", (event)=>{
                const storeElement = dataBase.transaction(item.name, "readwrite").objectStore(item.name);
                updateCallback.callback instanceof Function && updateCallback.callback(event);
                itemsToAdd.children.length > 0 && itemsToAdd.children.forEach((childNode)=>storeElement.add(childNode));
            });
        });
    });
};

//# sourceMappingURL=firebase.41d0c27b.js.map
