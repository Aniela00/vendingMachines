const express = require('express');
const Joi = require('joi'); //class thats why witch capital "J"
const app = express();


const vendingMachinesList = [
{ id:100 , productList : [{chips : 1}, {soda : 1}, {milk : 3}], change : 100 , earnings : 0},
{ id:200 , productList : [{chips : 6}, {soda : 8}, {milk : 1}], change : 100 , earnings : 0},
{ id:300 , productList : [{chips : 10}, {soda : 4}, {milk : 3}], change : 100 , earnings : 0},
{ id:400 , productList : [{chips : 15}, {soda : 7}, {milk : 0}], change : 100 , earnings : 0}
];

app.get('/api/v1/vending_machine/all', (req, res) =>{
    res.send(vendingMachinesList);
});

app.get('/api/v1/vending_machine/:id', (req , res) =>{
    const vending = vendingMachinesList.find(c => c.id === parseInt(req.params.id));
    if (!vending) return res.status(404).send('Given Id was not found');
    res.send(vending);
});

app.post('/api/v1/vending_machine', (req, res) =>{
    const vending = { 
        id : vendingMachinesList.length +100, //tu będzie generowane id z bazy danych, co nie 
        productList : [{chips : 15}, {soda : 15}, {milk : 15}],
        change : 100 ,
        earnings : 0
    }
    vendingMachinesList.push(vending); 
    res.send(vending);
    res.status(201);
});

app.put( '/api/v1/vending_machine/:id', (req, res)=> {
    const vending = vendingMachinesList.find(c => c.id === parseInt(req.params.id));

    if (!vending) return res.status(404).send("Given Id does not exists");

        // for the sake of simplicity we'll ignore this validation.
        //const result = validateVending(req.body)
        //const { error } = validateVending(req.body) // { error } == result.error
        //if (error!=null) return res.status(400).send(error.details[0].message);
    
    //vending.productList = req.body.ProductList;
    vending.change = req.body?.change;
    //vending.earnings = req.body.Earnings;
    res.send(vending);
});

app.delete('/api/v1/vending_machine/:id', (req,res)=>{
    const vending = vendingMachinesList.find(c => c.id === parseInt(req.params.id));
    if (!vending) return res.status(404).send("Id does not exists");

    const index = vendingMachinesList.indexOf(vending);
    vendingMachinesList.splice(index, 1);

    res.send(vending);
});

function validateVending (vending)
{
    const schema = Joi.object().keys()
    ({  
        productList : Joi.array().items(Joi.object.keys
            ({ 
            name: Joi.string().required(), 
            quantity: Joi.number().min(0).required(),
            })),
            change: Joi.number().min(0),
            earnings: Joi.number().min(0).optional() 
});
    return Joi.validate(vending, schema)
}

app.listen(3000, () => console.log('listening on port 3000'));