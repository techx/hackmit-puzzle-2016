window.onload = function(){
    document.getElementById("logout").onclick = function(event){
        event.preventDefault();
        logout();
    }

    var logout = function(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/auth/logout", true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200 || xmlhttp.status == 201) {  
                    window.location = '/';
                } else {
                    document.getElementById("error").innerHTML = "Oops, something went wrong.";
                }
            }
        };
        xmlhttp.send();
    }
    
    document.getElementById("update-email").onclick = function(event){
        event.preventDefault();
        updateEmail();
    }

    document.forms[0].onsubmit = function(event){
        event.preventDefault();
        updateEmail();
    }

    var updateEmail = function(){
        if (!document.forms[0].email.value.trim()){
            return;
        }
        var xmlhttp = new XMLHttpRequest();
        var email = document.forms[0].email.value;
        xmlhttp.open("POST", "/puzzle/user?email=" + email, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200 || xmlhttp.status == 201) { 
                    document.getElementById("email").style.color = "#07D900";
                } else {
                    document.getElementById("error").innerHTML 
                        = JSON.parse(xmlhttp.responseText).error;
                }
            }
        };
        
        xmlhttp.send();
    }
}