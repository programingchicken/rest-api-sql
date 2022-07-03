const express = require('express');
const Course = require('../models').Course
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');
const User = require('../models').User
const { body, validationResult } = require("express-validator")

// This array is used to keep track of user records

// Construct a router instance.
const router = express.Router();
 const validate = [
    body("title").notEmpty().withMessage('You need a title'),
    body("description").notEmpty().withMessage('You need a description')
]

//show all courses 
router.get("/courses", asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
        attributes: ["id", "title", "description", "userId"],
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName", "emailAddress"]
            }
        ]
    });
    if (courses.length !== 0) {
        res.status(200).json(courses).end();
    } else {
        console.log({ message: "Sorry, no courses found. :(" })
        next(err)
    }
}));

//sellect a course
router.get("/courses/:id", asyncHandler(async (req, res, next) => {
    const reqID = req.params.id
    const courses = await Course.findOne({ where: { id: reqID } })
    if (courses) {
        res.status(200).json(courses).end()
    } else {
        next(err)
    }
}));

//create a course
router.post("/courses", authenticateUser, asyncHandler(async (req, res, next) => {
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
router.put("/courses/:id", authenticateUser, validate, asyncHandler(async (req, res, next) => {
            const reqID = req.params.id
            const course = await Course.findOne({ where: { id: reqID } })
            // await courses.update(req.body)
            if (course) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    const arrayErr = errors.array()
                    const messageArray = arrayErr.map((err) => err.msg)
                    return res.status(400).json(messageArray)
                } else {
                    await Course.update(req.body, { where: { id: reqID } })
                    console.log('successfully updated course!')
                    res// .send('successfully updated course!')
                        .status(204)
                        .end()
                }
            } else {
                next(err)
            }
        }
    ));

//delete a course
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res, next) => {
    const reqID = req.params.id
    const courses = await Course.destroy({ where: { id: reqID } })
    if (courses) {
        console.log('successfully deleted the course!')
        res
            // .send('successfully deleted the course!')
            .status(204)
            .end()
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
//     "userId": 1
// }