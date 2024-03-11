/*** Express setup & start ***/

// 1. Opzetten van de webserver
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from "./helpers/fetch-json.js";

// Importeer het npm pakket express uit de node_modules map
import express from "express";

// Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items";

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine
// View engine zorgt ervoor dat data die je ophaalt uit de api , waar je in je code dingen mee doet, daar html van maakt
app.set("view engine", "ejs");

// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static("public"));

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

/*** Routes & data ***/

// 2. Routes die HTTP Request and Responses afhandelen

// Maak een GET route voor de home

app.get("/", function (request, response) {
  Promise.all([
    // Fetch data from all endpoints concurrently using Promise.all()
    fetchJson(apiUrl + "/tm_story"), // Fetch data from the tm_story endpoint
    fetchJson(apiUrl + "/tm_language"), // Fetch data from the tm_language endpoint
    fetchJson(apiUrl + "/tm_playlist"), // Fetch data from the tm_playlist endpoint
    fetchJson(apiUrl + "/tm_audio"), // Fetch data from the tm_audio endpoint
  ]).then(([storyData, languageData, playlistData, audioData]) => {
    // After all promises are resolved, this function will be executed with the fetched data

    // Render the 'index.ejs' template and pass all fetched data to the view
    response.render("home", {
      stories: storyData.data, // Pass fetched story data to the view under the 'stories' key
      languages: languageData.data, // Pass fetched language data to the view under the 'languages' key
      playlists: playlistData.data, // Pass fetched playlist data to the view under the 'playlists' key
      audio: audioData.data,
    }); // Pass fetched audio data to the view under the 'audio' key
  });
});

// Maak een GET route voor de stories pagina

app.get("/stories", function (request, response) {
  Promise.all([
    fetchJson(apiUrl + "/tm_story"),
    fetchJson(apiUrl + "/tm_language"),
    fetchJson(apiUrl + "/tm_playlist"),
    fetchJson(apiUrl + "/tm_audio"),
  ]).then(([storyData, languageData, playlistData, audioData]) => {
    response.render("stories", {
      stories: storyData.data,
      languages: languageData.data,
      playlists: playlistData.data,
      audio: audioData.data,
    });
  });
});

// GET route voor playlists

app.get("/playlists", function (request, response) {
  Promise.all([
    fetchJson(apiUrl + "/tm_story"),
    fetchJson(apiUrl + "/tm_language"),
    fetchJson(apiUrl + "/tm_playlist"),
    fetchJson(apiUrl + "/tm_audio"),
  ]).then(([storyData, languageData, playlistData, audioData]) => {
    response.render("playlists", {
      stories: storyData.data,
      languages: languageData.data,
      playlists: playlistData.data,
      audio: audioData.data,
    });
  });
});

// 3. Start de webserver
// Stelt het port nummer in
app.set("port", process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
