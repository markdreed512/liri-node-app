require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
moment().format();
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// inquirer
//   .prompt([
//     {
//       type: "input",
//       name: "userInput",
//       message: "I am Liri.  How may I help you?"
//     }
//   ])
//   .then(function() {});

var command = process.argv[2];
var value = "";
// Loop through all the words in the node argument
// builds a url-ready variable with the "+"s.
for (var i = 3; i < process.argv.length; i++) {
  if (i > 3 && i < process.argv.length) {
    value = value + "+" + process.argv[i];
  } else {
    value += process.argv[i];
  }
}
var OmdbQueryUrl = "https://www.omdbapi.com/?t=" + value + "&apikey=trilogy";
var bandsInTownQueryUrl =
  "https://rest.bandsintown.com/artists/" +
  value +
  "/events?app_id=codingbootcamp";
//check command given from user
switch (command) {
  case "concert-this":
    concertData();
    break;
  case "spotify-this-song":
    spotifyData();
    break;
  case "movie-this":
    movieData();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log(
      'Choose from the following commands: "concert-this", "spotify-this-song", "movie-this" or "do-what-it-says". '
    );
}

function concertData() {
  axios
    .get(bandsInTownQueryUrl)
    .then(function(response) {
      var date = moment(response.data[0].datetime).format("MM/DD/YYYY");
      console.log(`
Venue: ${response.data[0].venue.name}
City: ${response.data[0].venue.city +
        ", " +
        response.data[0].venue.region +
        ", " +
        response.data[0].venue.country}
Date: ${date};
        `);
    })
    .catch(function(error) {
      console.log(error);
    });
}
function spotifyData() {
  //If no song is provided then your program will default to "The Sign" by Ace of Base.
  if (value === "") {
    spotify
      .search({ type: "track", query: "the sign" })
      .then(function(response) {
        console.log("ace of base: " + JSON.stringify(response, null, 4));
      })
      .catch(function(err) {
        console.log(err);
      });
  } else {
    spotify
      .search({ type: "track", query: value })
      .then(function(response) {
        console.log(`
Song title: ${response.tracks.items[0].name}
Artist: ${response.tracks.items[0].artists[0].name}
Preview URL: ${response.tracks.items[0].preview_url}
Album: ${response.tracks.items[0].album.name}
        `);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
function movieData() {
  axios.get(OmdbQueryUrl).then(function(response) {
    console.log(`
    Title: ${response.data.Title}
    Year: ${response.data.Year}
    IMDB Rating: ${response.data.Ratings[0].Value}
    Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Year: ${response.data.Year}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
    `);
  });
}
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log("error!!!");
    } else {
      var text = data.split(",");
      if (text[0] === "spotify-this-song") {
        value = text[1];
        spotifyData();
      } else {
        console.log("cannot access data");
      }
    }
  });
}
