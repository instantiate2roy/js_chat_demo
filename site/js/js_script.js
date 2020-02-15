const site_url = 'http://localhost/myexamples/CHAT_DEMO/';
function load_notification(message) {
    var snackbar = document.getElementById("snackbar")
    snackbar.className = "show";
    snackbar.innerText = message;
    setTimeout(function () {
        snackbar.className="hide"; 
    },10000);

}
function login() {
    var username = document.getElementById('user');
    var password = document.getElementById('pass');
	var api_url = site_url + 'backend/API/login';
	var chats_url=site_url + 'site/chats';
    if (input_is_valid(username, password) == 1) {
        var data = {
            user: username.value,
            pass: password.value,
        };
		var login_data=postData(api_url, data);
		login_data.then(function(response){
			if(response.login_status!='SUCCESS'){
				load_notification('Invalid Username or Password');
			}else{
				
				//setCookie('chat_owner_data',JSON.stringify(data));
				add_to_localStorage('chat_owner_data',JSON.stringify(data))
				load_page(chats_url,'_self');
			}
		});

    }

}

async function attempt_login(data) {
    
	var result=0;
    login_data= await postData(api_url, data);
	if(login_data.login_status!='SUCCESS'){
		load_notification('Invalid Username or Password');
	}else{
		result=1;
	}
	return result;
	
}
function load_page(url,location_param){
	window.open(url,location_param);
}
function load_messages(){
	var chat_code;
	var user_data;
	//get current chat room and user
	if(key_exists_in_localStorage('current_chatroom')==1 && 
		key_exists_in_localStorage('chat_owner_data')==1) 
	{
			
		chat_code=retreive_from_local_storage("current_chatroom");
		user_data=JSON.parse(retreive_from_local_storage('chat_owner_data'));
		var api_url = site_url + 'backend/API/messages/'+chat_code;
		var chat_data=get_data(api_url);
			chat_data.then(function(response){
			build_message_list(response,user_data.user);
		});
	}
}function send_message(){
	var chat_code;
	var user_data;
	var api_url = site_url + 'backend/API/messages/';
	var input_field = document.getElementById("response");
	var message_txt = input_field.value;
	
	if(key_exists_in_localStorage('current_chatroom')==1 && 
		key_exists_in_localStorage('chat_owner_data')==1 
		&& message_txt.length>0)
	{	
		chat_code=retreive_from_local_storage("current_chatroom");
		user_data=JSON.parse(retreive_from_local_storage('chat_owner_data'));
		user=user_data.user;
		data={
			user:user,
			chat_code:chat_code,
			message:message_txt
		};
		var response=postData(api_url, data);
			response.then(function(res){
				input_field.value='';
		});
		
	}
}
function removeChildElements(htmlelement){
	while (htmlelement.firstChild) {
		htmlelement.removeChild(htmlelement.firstChild);
	}
}
function build_message_list(data,user){
	var keys_array;
	
	if(data!=null){
		var chat_box=document.getElementById('chat_box_id');
		removeChildElements(chat_box);
	
		for(let i=0;i<data.length;i++){
			var  outer_div= document.createElement('div');
			var  inner_div= document.createElement('div');			
			//get all column keys
			if(i==0){
				keys_array=Object.keys(data[i]);
			}
			//check if the user is the send of the message
			if(user_is_sender(data[i],keys_array,user)==1){
				outer_div.className='sent';
				inner_div.className='chat_bubble_sent';
				
				inner_div.appendChild(document.createTextNode(data[i].message_text));
					 outer_div.appendChild(inner_div);
			}else{
				outer_div.className='received';
				inner_div.className='chat_bubble_received';
				
				inner_div.appendChild(document.createTextNode(data[i].message_text));
					 outer_div.appendChild(inner_div);
			}
			chat_box.appendChild(outer_div);
		}
	}
	
}
function user_is_sender(row,keys,user){
	var result=0;
	for(let j=0;j<keys.length;j++){
		var column_key=keys[j];
		if(user===row[column_key]) {
			result=1;
			break;
		}
	}
	return result;
}
async function postData(url, data) {
	var result;
	try{
		var response= await fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			redirect: 'follow',
			referrer: 'no-referrer',
			body: JSON.stringify(data)
			}).then(res=>res.json()).then(
				function(post){
					result=post;
				});
	}catch(error){
		load_notification(error);
		result=null;
	}
    return result;
}
function input_is_valid(username, password) {
    var err_msg = 'Please Fill in all the fields';
	var result;
    if (username.value.length < 1) {
        show_input_err(username, err_msg);
		result=0;
    } else if (password.value.length < 1) {
        show_input_err(password, err_msg);
		result= 0;
    } else {
        result=1;
    }
	return result;

}
function show_input_err(element, err_msg) {
    var err_class = 'input_err';
    var old_class = element.className;
    element.className = err_class;
    load_notification(err_msg);
    setTimeout(function () {
        element.className = element.className.replace(err_class, old_class);
    }, 10000);
}
function get_chats(){
	var user_obj=get_user_det();
	var username=user_obj.user;
	var api_url = site_url + 'backend/API/chat/'+username;
	var chat_data=get_data(api_url);
	chat_data.then(function(response){
		get_chatlist_table(response);
	});
		
}
function load_chatroom(chat_code){
	chatroom_url=site_url+'site/chat_room';
	add_to_localStorage('current_chatroom',chat_code)
	load_page(chatroom_url,'_self');
}
//function to add data stored to browser local storage
function add_to_localStorage(key,value){
	result=1;
	try{
		localStorage.setItem(key,value);
	}catch(error){
		console.log(error);
		result=null;
	}
	return result;
}
//function to retreive data stored in browser local storage
function retreive_from_local_storage(key){
	var result;
	//first checkif the key exists
	if(key_exists_in_localStorage(key)==1){
		try{
			var stored_value=localStorage.getItem(key);
			result=stored_value;
		}catch(error){
			console.log(error);
			result =null;
		}
	}
	return result;
}
//funtion to unset value from local storage
function unset_local_storage(key){
	var result=1;
	//first check if the key exists
	if(key_exists_in_localStorage(key)==1){
		try{
			localStorage.removeItem(key);
		}catch(error){
			console.log(error);
			result=null;
		}
	}
	
	return result;
}
function key_exists_in_localStorage(key){
	var result=1;
	if (localStorage.getItem(key) === null) {
		result=0;
	}
	return result;
}
function get_chatlist_table(chat_data){
	var table_list = document.getElementById('chat_table');
	var tbl = document.createElement('table');
	tbl.className='table_x';
	var thd = document.createElement('thead');
	thd.className='table_header';
	var tbdy = document.createElement('tbody');
	var keys_array;
	for(let i=0; i<chat_data.length;i++){
		if(i==0){
			keys_array=Object.keys(chat_data[i]);
			for(let j=0;j<keys_array.length;j++){
				var th = document.createElement('th');
				 th.appendChild(document.createTextNode(keys_array[j]));
				 thd.appendChild(th);
			}
		}
		var tr = document.createElement('tr');
		tr.className='table_row';
		var current_id;
		for(let k=0;k<keys_array.length;k++){
			var td = document.createElement('td');
			var column_key=keys_array[k];
			var column_val=chat_data[i][column_key];
			if(column_key==='chat_code'){
				current_id=column_val;
			}
			td.setAttribute('id',column_key+'_id_'+i)
			td.appendChild(document.createTextNode(column_val));
			tr.appendChild(td);
			tbdy.appendChild(tr);
		}
		tr.setAttribute("onclick","load_chatroom('"+current_id+"')");			
		
	}
	tbl.appendChild(thd);
	tbl.appendChild(tbdy);
	table_list.appendChild(tbl);
}

async function get_data(url){
	var result;
	try{
		var response= await fetch(url).then(res=>res.json()).then(
				function(post){
					result=post;
				});
	}catch(error){
		load_notification(error);
		result=null;
	}
    return result;

}
function create_new_chat(){
	
}

function get_user_det(){
	var det=JSON.parse(retreive_from_local_storage('chat_owner_data'));
	//var det=JSON.parse(getCookie('chat_owner_data'));
	return det;
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}