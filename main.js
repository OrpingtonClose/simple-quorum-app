var io = require("socket.io-client");
var sha1 = require("sha1");
var $ = require("jquery");

submit = function() {
    var file = document.getElementById("file").files[0];
    if (!file) {
        alert("Please select a file");
        return;
    }
    var owner = document.getElementById("owner").value;
    if(owner == "") {
        alert("Please enter owner name");
        return;
    }
    var publicKeys = document.getElementById("pkeys").value;
    if(publicKeys == "") {
        alert("Please enter the other enterprise's public keys");
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        var hash = sha1(event.target.result);
        $.get("/submit?hash=" + hash + "&owner=" + owner + "&pkeys=" + encodeURIComponent(publicKeys), function(data){
            if (data == "Error") {
                $("#message").text("An Error occured");
            } else {
                $("#message").html("Transaction hash: " + data);
            }
        });
    }
    reader.readAsArrayBuffer(file);
}

getInfo = function getInfo() {
    var file = document.getElementById("file").files[0];
    if (!file) {
        alert("Please select a file");
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        var hash = sha1(event.target.result);
        $.get("/getInfo?hash=" + hash, function(data){
            //var msg = $("#message").html;
            var msg = alert;
            if(data[0] == "" && data[0] == "" ) {
                msg("file not found");
            } else {
                msg("Timestamp: " + data[0] + " Owner: " + data[1]);
            }
        });
    }
    reader.readAsArrayBuffer(file);
}

var socket = io("http://localhost:8080");

socket.on("message", function(msg) {
    var list = $("#event_list");
    var listItem = "<li>" + msg + "</li>";
    if(list.text() == "No Transactions Found") {
        list.html(listItem);
    } else {
        list.prepend(listItem);
    }
});

socket.on("message", function(msg) {
    var list = $("#event_list");
    var listItem = "<li>Txn Hash: " + msg.transactionHash 
                                    + "\nOwner " + msg.args.owner 
                                    + "\nFile Hash:" + msg.args.fileHash 
                                    + "</li>";
    if(list.text() == "No Transactions Found") {
        list.html(listItem);
    } else {
        list.prepend(listItem);
    }
});
