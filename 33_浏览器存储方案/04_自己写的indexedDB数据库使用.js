const request = indexedDB.open("firstSQL", 1)

request.onerror = function(){
	console.log("获取数据库失败");
}

let db = null
request.onsuccess = function(event){
	db = event.target.result
	console.log("获取数据库成功");
}

request.onupgradeneeded = function(event){
	db = event.target.result
	console.log("更新数据库");
	db.createObjectStore("users", {keyPath: "id"})
}

class Users {
	constructor(id, name, age){
		this.id = id;
		this.name = name;
		this.age = age
	}
}

let users = [
	new Users(1, "aaa", 18),
	new Users(2, "bbb", 77),
	new Users(3, "ccc", 15)
]

document.querySelectorAll("button").forEach((item,index) => {
	item.onclick = function(){
		let dbTransaction = db.transaction("users", "readwrite")
		let store = dbTransaction.objectStore("users")

		switch(index){
			case 0:
				add(store)
				break;
			case 1: 
				remove(store)
				break;
			case 2: 
				modify(store)
				break;
			case 3: 
				search(store)
		}
	}
})

function add(store){
	users.forEach(user => {
		store.get(user.id).onsuccess = (event) => {
			let result = event.target.result
			if(!result)	store.add(user)
		}
	})
	store.add()
}

function remove(store, keyPath){
	let request = store.delete(4)
}

function modify(store){
	store.put(new Users(1, "zzc", 21))
}

function search(store){
	store.openCursor().onsuccess = function(event){
		let cursor = event.target.result
		if(cursor){
			console.log("主键值 :", cursor.key);
			console.log("id :", cursor.value.id);
			console.log("name :", cursor.value.name);
			console.log("age :", cursor.value.age);
			console.log("---------------------");
			cursor.continue()
		}else{
			console.log("遍历结束");
		}
	}
}