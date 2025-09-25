const http = require('http');
const express = require('express');
const fs = require('fs');

const server = http.createServer();
const app = express();
app.use(express.json());

app.post('/users', (req, res)=>{
	if(!req.body || Object.keys(req.body) === 0){
		return res.status(400).json({message:'empty field not allowed'})
	};
	try{
	fs.writeFileSync('users.json', 	JSON.stringify(req.body, null, 2));
	res.status(201).json({message:'new user added', user: req.body});
	}catch(err){
		res.status(500).json({message:'unable to save new user'})
	}

});

app.get('/users', (req, res)=>{
	try{
	const data = fs.readFileSync('users.json');
	const users = JSON.parse(data);
	res.json(users)
	}catch (err){
		res.status(500).json({message:'unable to read users'});
	}
});

server.on('request', app);


server.listen(4000, () => {
	console.log('node is listening on port 4000');
});
