const express = require('express');
const {User} = require('../models/user');
const express = require('express');

const bcrypt = require('bcryptjs');



const router = express.Router();

router.get('/')