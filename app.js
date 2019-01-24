var browserify = require("browserify");
var _ = require("lodash");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(8080);

// io.on('connection', function (socket) {
//     socket.emit('message', "hello there");
// });

var privateKeys = {"http://localhost:8001": "/Z1+Fe3tRAf+lyyXKZCil8pkSebWW+O0XELGRNquIlE=",
                   "http://localhost:8002": "3f/cPMz+tu1bPUXRgGjNVFbWQly45ix9s6STZYQ8Dh4=",
                   "http://localhost:8003": "rZpUaM5y4yk3qbAchczsFpSX+RmJHpLho8eAxf2h6Do=",
                   "http://localhost:8004": "WC0NbFD3f3bSOymsNTWYuCvIi3gWeOCU6DKqDpqBexU="};


var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8001"));

var compiledContract = '0x6060604052341561000f57600080fd5b6107378061001e6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063693ec85e14610048578063e942b5161461012557600080fd5b341561005357600080fd5b6100a3600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506101c5565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156100e95780820151818401526020810190506100ce565b50505050905090810190601f1680156101165780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b341561013057600080fd5b6101c3600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506102ec565b005b60006101cf610652565b600080846040518082805190602001908083835b60208310151561020857805182526020820191506020810190506020830392506101e3565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390209050806000015481600101808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102db5780601f106102b0576101008083540402835291602001916102db565b820191906000526020600020905b8154815290600101906020018083116102be57829003601f168201915b505050505090509250925050915091565b600080826040518082805190602001908083835b6020831015156103255780518252602082019150602081019050602083039250610300565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060000154141561052f576040805190810160405280428152602001838152506000826040518082805190602001908083835b6020831015156103af578051825260208201915060208101905060208303925061038a565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600082015181600001556020820151816001019080519060200190610408929190610666565b509050507f0d3bbc3c02da6ed436712ca1a0f626f1269df703a105f034e4637c7b10fb7ba5600142848460405180851515151581526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561048657808201518184015260208101905061046b565b50505050905090810190601f1680156104b35780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156104ec5780820151818401526020810190506104d1565b50505050905090810190601f1680156105195780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a161064e565b7f0d3bbc3c02da6ed436712ca1a0f626f1269df703a105f034e4637c7b10fb7ba5600042848460405180851515151581526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156105a957808201518184015260208101905061058e565b50505050905090810190601f1680156105d65780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b8381101561060f5780820151818401526020810190506105f4565b50505050905090810190601f16801561063c5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15b5050565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106a757805160ff19168380011785556106d5565b828001600101855582156106d5579182015b828111156106d45782518255916020019190600101906106b9565b5b5090506106e291906106e6565b5090565b61070891905b808211156107045760008160009055506001016106ec565b5090565b905600a165627a7a723058207176027723d240e9ad1b72b1097da01fd495487de683c87031bbe742915a73140029';
var abi = [{"constant":false,"inputs":[{"name":"fileHash","type":"string"}],"name":"get","outputs":[{"name":"timestamp","type":"uint256"},{"name":"owner","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"string"},{"name":"fileHash","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"owner","type":"string"},{"indexed":false,"name":"fileHash","type":"string"}],"name":"logFileAddedStatus","type":"event"}];
var proofContract = web3.eth.contract(abi); 

var address = web3.eth.accounts[0];
web3.personal.unlockAccount(address)
var proof;

// web3.eth.subscribe("newBlockHeders", function(error, result){
//     io.emit('message', 'sub: current block #' + result);
// });
var proofLogWatch = function(error, result){
    if (!error) {
        if (result.args.status == true) {
            io.emit("message", result);
        }
    }
}
/*
/Z1+Fe3tRAf+lyyXKZCil8pkSebWW+O0XELGRNquIlE=,3f/cPMz+tu1bPUXRgGjNVFbWQly45ix9s6STZYQ8Dh4=,rZpUaM5y4yk3qbAchczsFpSX+RmJHpLho8eAxf2h6Do=,WC0NbFD3f3bSOymsNTWYuCvIi3gWeOCU6DKqDpqBexU=
*/ 
var submit = function(req, res){
    var {hash, owner, pkeys} = req.query;
    //var {hash, owner} = req.query;
    var privateFor = pkeys.split(",");
    var from = web3.eth.accounts[0];
    web3.personal.unlockAccount(from);
    var opts = {from};
    opts.gas = 0x47b760;
    opts.privateFor = _.without(_.values(privateKeys), "/Z1+Fe3tRAf+lyyXKZCil8pkSebWW+O0XELGRNquIlE=");

    proof.set.sendTransaction(owner, hash, opts, (err, txhash) => {
        var o = owner;
        var h = hash;
        var op = opts;
        // console.log("=====================error!!");
        // console.log(err);/Z1+Fe3tRAf+lyyXKZCil8pkSebWW+O0XELGRNquIlE=,3f/cPMz+tu1bPUXRgGjNVFbWQly45ix9s6STZYQ8Dh4=,rZpUaM5y4yk3qbAchczsFpSX+RmJHpLho8eAxf2h6Do=,WC0NbFD3f3bSOymsNTWYuCvIi3gWeOCU6DKqDpqBexU=
        res.send(_.find([err, txhash]))
    });
};

var getInfo = function(req, res) {
    var {hash} = req.query;
    var details = proof.get.call(hash);
    res.send(details);
};

var deployedContractTransaction;
var proof;
var filter = web3.eth.filter('latest');
//wait for the central contract to be mined before setting up all things dependant on it
filter.watch(function(error, result){ 
    if (deployedContractTransaction && deployedContractTransaction.transactionHash) {
        var tx = web3.eth.getTransactionReceipt(deployedContractTransaction.transactionHash);
        if (tx && tx.contractAddress) {
            proof = proofContract.at(tx.contractAddress);
            proof.logFileAddedStatus().watch(proofLogWatch);
            app.get("/submit", submit);
            app.get("/getInfo", getInfo);
            filter.stopWatching();
        }
    }
});

proofContract.new({
    from: address,
    data: compiledContract,
    gas: 4700000,
    privateFor: _.without(_.values(privateKeys), "/Z1+Fe3tRAf+lyyXKZCil8pkSebWW+O0XELGRNquIlE=")
}, function(e, contract) {
    if (e) {
        console.log("couldn't deploy contract");
        console.log(e);
        return;
    }
    deployedContractTransaction = contract;        
});


var ord = 0;
app.get("/send", function(req, res) {
    ord += 1;
    io.emit('message', `hello there ${ord}`);
    res.send("dddddddddddddddddddddddddddddddd");
});

app.get("/", function(req, res) {
    res.sendFile(`${__dirname}/index.html`);
});
app.get("/css/bootstrap.min.css", function(req, res) {
    var path = `${__dirname}/node_modules/bootstrap/dist/css/bootstrap.min.css`;
    res.sendFile(path);
});
app.get("/js/main.js", function(req, res) {
    browserify(`${__dirname}/main.js`).bundle().pipe(res);
});
