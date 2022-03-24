const express = require('express');
const Course = require('../models').Course
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler }  = require('../middleware/async-handler');
const User = require('../models').User

// This array is used to keep track of user records

// Construct a router instance.
const router = express.Router();


//show all courses 
router.get("/", asyncHandler(async(req, res, next) => {
    const courses = await Course.findAll({ 
        attributes: ["id", "title", "description", "UserId"],
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName", "emailAddress"]
            }
        ] 
    });
    if (courses.length !== 0) {
        res.status(200).json(courses);
    } else {
        console.log({message: "Sorry, no courses found. :(" })
        next(err) 
    }
}));

//sellect a course
router.get("/:id", asyncHandler(async(req, res, next) => {
    const reqID = req.params.id
    const courses = await Course.findOne({where: {id: reqID}})
    if (courses) {
        res.status(200).json(courses)
    } else {
        next(err)
    } 
}));

//create a course
router.post("/", authenticateUser, asyncHandler(async(req, res, next) => {
    console.log()
    const courses = await Course.create(req.body)
    if (courses) {
        const reqID = courses.id
        console.log('successfully created the course')
        res
        // .send('successfully created the course')
            .status(201)
            .location(`/courses/${reqID}`)
            .end()
    } else {
        next(err) 
    }

})); 

//update a course
router.put("/:id", authenticateUser, asyncHandler(async(req, res, next) => {
    const reqID = req.params.id
    const courses = await Course.findOne({where: {id: reqID}})
    const courseUpdate = await courses.update(req.body)
    if (courseUpdate) {
        console.log('successfully updated course!')
        res
        // .send('successfully updated course!')
        .status(204)
    } else {
        next(err)
    }
}));

//delete a course
router.delete("/:id", authenticateUser, asyncHandler(async(req, res, next) => {
    const reqID = req.params.id
    const courses = await Course.destroy({where: {id: reqID}})
    if (courses) {
        console.log('successfully deleted the course!')
        res
            // .send('successfully deleted the course!')
            .status(204)
    } else {
        next(err) 
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