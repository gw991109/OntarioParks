const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000;

const default_radius = 1

//read user data from ./data/user_data.json
const fs = require('fs')
let userjson = fs.readFileSync("./data/user_data.json", "utf-8")
let user_data = JSON.parse(userjson)
// read attraction data from ./data/attraction_data.json
let attractionjson = fs.readFileSync("./data/attraction_data.json", "utf-8")
let attraction_data = JSON.parse(attractionjson)

//handle login request
app.post('/login', (req, res) => {
    const useremail = req.body.email
    const userpassword = req.body.password
    let found = false
    user_data.forEach((user)=>{
        if(user.email === useremail){
            if(user.password === userpassword){
                found = true
                res.status(200).send(user.name+" loged in!!")
                console.log("Logged in!!")
                console.log(user.name)

            }
        }
    })
    if(!found){
        res.status(404).send("email or password incorrect")
    }
})
//handle signup request
app.post('/signup', (req, res)=>{
    const useremail = req.body.email
    let found = false
    user_data.forEach((user)=>{
        if(user.email === useremail){
            found = true
            res.status(409).send("This email is already registered")
        }
    })
    if(!found){
        const user = {
            "name": req.body.name,
            "email": req.body.email,
            "password": req.body.password,
            "preference": req.body.preference
        }
        user_data.push(user)
        userjson = JSON.stringify(user_data,null, 2)
        fs.writeFileSync("./data/user_data.json",userjson, "utf-8")
        res.status(201).send("success")
    }
})
//handle setting user preference request
app.post('/preference', (req, res)=>{
    const useremail = req.body.email
    const userpreference = req.body.preference
    let found = false
    user_data.forEach((user)=>{
        if(user.email === useremail){
            found = true
            user.preference = userpreference
            res.status(201).send("success")
        }
    })
    if(!found){
        res.status(404).send("user doesn't exist")
    }
    userjson = JSON.stringify(user_data,null, 2)
    fs.writeFileSync("./data/user_data.json",userjson, "utf-8")
})
//handle map request
app.post('/attractions', (req, res)=>{
    const userlat = req.body.lat
    const userlng = req.body.lng
    let preference = []
    let useremail = ""
    let radius = default_radius
    let attractions = []
    console.log("getting attractions:")
    //If user is logged in, then we use user account's preference
    if(req.body.email){
        console.log(req.body.email)
        useremail = req.body.email
        let found = false
        user_data.forEach((user)=>{
            if(user.email === useremail){
                found = true
                preference = user.preference
                console.log(user.name)
                console.log(preference)
            }
        })
        if(!found){
            console.log("user not found")
            if(req.body.preference){
                preference = req.body.preference
            }
        }

    }
    //If user is not logged in, then we use req.body.preference if defined
    else{
        if(req.body.preference){
            preference = req.body.preference
        }
    }
    if(req.body.radius){
        radius = req.body.preference
    }
    if(preference.length === 0){
        attractions = attraction_data
    }
    else{  
        attraction_data.forEach((attraction)=>{
            const filtered = attraction.categories.filter(value => preference.includes(value))
            if(filtered.length !== 0){
                attractions.push(attraction)
            }
        })
    }
    let result = []
    attractions.forEach((attraction)=>{
        let num1 = attraction.lat-userlat
        let num2 = attraction.lng-userlng
        let distance = num1*num1+num2*num2
        if(distance<=radius*radius){
            result.push(attraction)
        }
    })
    res.json(result)
})

console.log("server listen at PORT:")
console.log(PORT)
app.listen(PORT)