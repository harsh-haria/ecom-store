const fs = require('fs');
const path = require('path');
const products = require('../controllers/products');

const rootDir = require('../util/path');

const p = path.join(path.dirname(require.main.filename),'data','products.json');

module.exports = class Products{
    constructor(t,p){
        this.title = t;
        this.price = p;
    }

    save(){
        fs.readFile(p, (err,fileContent)=>{
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb){
        fs.readFile(p, (err,fileContent)=>{
            let products = [];
            if(!err){
                cb(JSON.parse(fileContent)); 
            }
            else{
                cb([]);
            }
        });
    }
}