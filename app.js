var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/ocean');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('views', './views/pages')
app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname,'public')));
app.locals.moment = require('moment');
app.listen(port)

console.log('iMovie started on port ' + port)

//index page
app.get('/', function (req, res)  {
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render('index', {
			title:'iMovie 首页',
			movies: movies
		})
	})
})

//detail page
app.get('/movie/:id', function (req, res) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		res.render('detail', {
			title: 'iMovie' + movie.title,
			movie: movie
		})
	})

})

//admin page
app.get('/admin/movie', function (req, res)  {
	res.render('admin', {
		title:'iMovie 后台管理',
		movie: {
			// title: ' ',
			// doctor: ' ',
			// country: ' ',
			// year: ' ',
			// language: ' ',
			// summary: ' ',
			// poster: ' ',
			// flash: ' '
		}
	})
})

// admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res){
	// console.log(req.body.movie._id);

	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash,
		});

		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}

			res.redirect('/movie/' + movie._id);
		})
	}
});

//list page
app.get('/admin/list', function (req, res)  {
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
	
		res.render('list', {
			title:'iMovie 后台-影片列表',
			movies: movies
		})
	})

});

// list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1});
			}
		})
	}
})