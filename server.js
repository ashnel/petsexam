var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');
const querystring = require('querystring');

app.use(express.static( __dirname + '/exam/dist' ));
app.use(express.static(path.join(__dirname, './static')));

var mongoose = require('mongoose');

app.get('/', function(req, res) {
})

// Update pet by pet_id
app.put('/update/:id', function(req, res) {
    if (req.body.name.length < 3 || req.body.type.length < 3 || req.body.description.length < 3) {
        res.json({message: 'bad'});
        return false;
    }
    else {
        Pet.update({_id: req.params.id}, {name: req.body.name, type: req.body.type, description: req.body.description}, function (err) {
            if (err) {
                console.log("Pet could not be updated; please try again.");
                res.json({message: 'bad'});
            }
            else {
                console.log("Pet updated!");
                Pet.findById({_id: req.params.id}, function (err, pet) {
                    console.log('finding...');
                    if (err) {
                        console.log('error');
                    }
                    else {
                        pet.skills = {
                            skill1: req.body.skills[0].skill1,
                            skill2: req.body.skills[0].skill2,
                            skill3: req.body.skills[0].skill3
                        }
            
                        pet.save(function(err) {
                            if (err) {
                                console.log('bad', err);
                            }
                            else {
                                console.log('good');
                                console.log('skills', pet.skills);
                                res.json({message: 'good'});
                            }
                        })
                    }
                })
            }
        })
    }
})

// Upvote pet by pet_id
app.put('/upvote/:id', function(req, res) {

    Pet.findById({_id: req.params.id}, function(err, pet){
        pet.likes += 1;
        pet.save(function(err){
            if (err) {
                console.log('There was an error upvoting.');
            }
            else {
                console.log('Your pet has a new vote!');
            }
        }) 
    })
})

// Adopt pet by finding by pet_id and deleting it from database
app.delete('/delete/:id', function(req, res) {
    Pet.remove({_id: req.params.id}, function (err) {
        if (err) {
            console.log("There was an error; pet not deleted.");
        }
        else {
            console.log("Pet was deleted!");
        }
    })
})

// Get details of pet by pet_id
app.get('/details/:id', function(req, res) {
    Pet.find({_id: req.params.id}, function (err, pet) {
        if (err) {
            res.json({message: "error", error: err});
            console.log(err);
        }
        else {
            res.json({message: "Success", data: pet});
            // console.log({message: "Success", data: authors})
        }
    })
})

// Get all pets
app.get('/pets', function(req, res) {
    Pet.find({}).sort({type: 1}).exec(function (err, pets) {
        if (err) {
            res.json({message: "error", error: err});
            console.log(err);
        }
        else {
            res.json({message: "Success", data: pets});
        }
    })
})

// Add a pet with their skills
app.post('/add', function(req, res) {
    var newpet = new Pet({name: req.body.name, type: req.body.type, description: req.body.desc});

    if (req.body.name.length < 3 || req.body.type.length < 3 || req.body.desc.length < 3) {
        res.json({message: 'bad'});
        return false;
    }

    Pet.find({name: req.body.name}, function (err, pet) {
        if (pet.length != 0) {
            console.log('pet', pet)
            res.json({message: 'NOPE'});
            return false;
        }
        else {
            newpet.save(function(err) {
                console.log('saving...');
                if (err) {
                    console.log("There was an error; pet not saved.");
                    res.json({message: 'bad'});
                }
                else {
                    console.log("A new pet was added!");
                    Pet.findOne({name: req.body.name}, function (err, pet) {
                        console.log('finding...');
                        if (err) {
                            console.log('error');
                        }
                        else {
                            console.log('new pet', pet);
                            pet.skills.push({
                                skill1: req.body.skill1,
                                skill2: req.body.skill2,
                                skill3: req.body.skill3
                            })
                
                            pet.save(function(err) {
                                if (err) {
                                    console.log('bad');
                                }
                                else {
                                    console.log('good');
                                    console.log('skills', pet.skills);
                                    res.json({message: 'good'});
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./exam/dist/index.html"))
  });

app.listen(8000, function() {
    console.log("listening on port 8000");
})

mongoose.connect('mongodb://localhost/pets');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var PetSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    type: {type: String, required: true, minlength: 3},
    description: {type: String, minlength: 3},
    skills: [{
        skill1: {type: String},
        skill2: {type: String},
        skill3: {type: String}
    }],
    likes: {type: Number, default: 0}
}, {timestamps: true });

mongoose.model('Pet', PetSchema); // We are setting this Schema in our Models as 'Pet'
var Pet = mongoose.model('Pet');