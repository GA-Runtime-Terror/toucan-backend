const express = require('express');
const router = express.Router();
const User = require('../models/user');
const List = require('../models/toDoList');

//Get all the users
router.get('/', (req, res) => {
	User.find({})
		.populate('toDoLists')
		.then((allUsers) => {
			res.json({
				status: 200,
				Users: allUsers,
			});
		});
});

//Get a user by id
// router.get('/:id', (req, res) => {
// 	User.find({ _id: req.params.id }).then((user) => {
// 		res.json({
// 			status: 200,
// 			User: user.userName,
// 			Lists: user.toDoLists,
// 		});
// 	});
// });

//Get a user by userName
router.get('/:name', (req, res) => {
	User.findOne({ userName: req.params.name })
		.populate()
		.then((user) => {
			res.json({
				status: 200,
				User: user.userName,
				Lists: user.toDoLists,
			});
		});
});

router.get('/login/:userName', (req, res) => {
	User.findOne({ userName: req.params.userName }).then((user) => {
		res.json({
			status: 200,
			User: user.userName,
			Lists: user.toDoLists,
		});
	});
});

//Add a user in database
router.post('/', (req, res) => {
	User.create(req.body, (err) => {
		if (err) console.log(err);
		else {
			User.find({}).then((Users) => res.json(Users));
		}
	});
});

//Add a list to user by of both user and the list adding to
router.post('/:userId/addList/:listId', async (req, res) => {
	const list = await List.findById(req.params.listId);
	const user = await User.findByIdAndUpdate(req.params.userId, {
		$push: { toDoLists: list.id },
		new: true,
	});
	res.json({ status: 200, data: user });
});

//Update a user by id
router.put('/:id', (req, res) => {
	User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, item) => {
			if (err) console.log(err);
			else res.json(item);
		}
	);
});

//Delete a user by id
router.delete('/:id', (req, res) => {
	User.findByIdAndDelete(req.params.id, (err, item) => {
		if (err) console.log(err);
		else res.json(item);
	});
});

module.exports = router;