require("dotenv").config();
var axios = require("axios");
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
var value = process.argv.slice(3).join(" ");
var OmdbQueryUrl = "https://www.omdbapi.com/?t=" + value + "&apikey=trilogy";
console.log("query url: " + OmdbQueryUrl);
var bandsInTownQueryUrl =
  "https://rest.bandsintown.com/artists/" +
  value +
  "/events?app_id=codingbootcamp";

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
    // code block
    break;
  default:
  // code block
}

// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.
function concertData() {
  axios.get(bandsInTownQueryUrl).then(function(response) {
    console.log("Concert Response: " + JSON.stringify(response[0].id));
  });
}
function spotifyData() {
  spotify
    .search({ type: "track", query: value })
    .then(function(response) {
      console.log(
        "song title: " + JSON.stringify(response.tracks.items[0].name, null, 4)
      );
      console.log(
        "Artist: " +
          JSON.stringify(response.tracks.items[0].artists[0].name, null, 2)
      );
      console.log(
        "Preview URL: " +
          JSON.stringify(response.tracks.items[0].preview_url, null, 4)
      );
      console.log(
        "Album: " + JSON.stringify(response.tracks.items[0].album.name, null, 4)
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}
function movieData() {
  axios.get(OmdbQueryUrl).then(function(response) {
    console.log("Movie Response: " + JSON.stringify(response));
  });
}
