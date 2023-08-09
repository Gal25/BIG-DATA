const express = require('express')
const router = express.Router()
const controller = require('../controllers/inventory');

const {
    getMainPage
} = require("../controllers/inventory")

router.route("/").get(getMainPage)

function setEvent(events,last){
    controller.setEvents(events,last);
}

module.exports = router
module.exports.setEvent = setEvent;

