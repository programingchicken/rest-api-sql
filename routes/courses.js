const express = require('express');
const Course = require('../models').Course
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler }  = require('../middleware/async-handler');
const User = require('../models').User

// This array is used to keep track of user records

// Construct a router instance.
const router = express.Router();


//show all courses 
router.get("/", asyncHandler(async(req, res) => {
    const coursess = await Course.findAll({ 
        attributes: ["id", "title", "description", "UserId"],
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName", "email"]
            }
        ] 
    });
    if (coursess.length > 0) {
        res.status(200).json(coursess);
    } else {
        console.log({message: "Sorry, no courses found. :(" })
        return err
    }
}));

//sellect a course
router.get("/:id", asyncHandler(async(req, res) => {
    const reqID = req.params.id
    const coursess = await Course.findOne({where: {id: reqID}})
    if (coursess) {
        res.status(200).json(coursess)
    } else {
        return err
    } 
}));

//create a course
router.post("/", authenticateUser, asyncHandler(async(req, res) => {
    console.log()
    const courses = await Course.create(req.body)
    const reqID = courses.id
        res
            .status(201)
            .location(`/courses/${reqID}`)
            .end()
})); 

//update a course
router.put("/:id", authenticateUser, asyncHandler(async(req, res) => {
    const reqID = req.params.id
    const coursess = await Course.findOne({where: {id: reqID}})
    const courseUpdate = await coursess.update(req.body)
    if (courseUpdate) {
        res.send(courseUpdate).status(204)
    } else {
        return err
    }
}));

//delete a course
router.delete("/:id", authenticateUser, asyncHandler(async(req, res) => {
    const reqID = req.params.id
    const coursess = await Course.destroy({where: {id: reqID}})
    if (coursess) {
        res.status(204).send('deleted')
    } else {
        return err
    }
}));

module.exports = router

// {
//     "title": "SQL and JavaScript",
//     "description": "JavaScript with Sequelize",
//     "estimatedTime": "40 hours",
//     "materialsNeeded": "JavaScript, ExpressJS, Sequelize",
//     "UserId": 1
// }