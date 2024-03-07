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

// Haal alle data uit de API op
const storyData = await fetchJson(apiUrl + "/tm_story");
const playlistData = await fetchJson(apiUrl + "/playlist");
const languageData = await fetchJson(apiUrl + '/tm_language');
const speakerData = await fetchJson(apiUrl + '/tm_speaker_profile');
const audioData = await fetchJson(apiUrl + '/tm_audio');

// Maak een GET route voor de index
// Stap 1
app.get("/", function (request, response) {
  // Stap 2
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + "/tm_story").then((apiData) => {
    //hier kan je ook filters mee geven
    // Stap 3
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons

    // Stap 4
    // HTML maken op basis van JSON data
    response.render("home", {
      stories: storyData.data,
      playlists: playlistData.data,
      language: languageData.data,
      speaker: speakerData.data,
      audio: audioData.data,
    });
  });
});

app.get("/stories", function (request, response) {
  response.render("stories", {
    stories: storyData.data,
  })
})

app.get("/playlists", function (request, response) {
  response.render("playlists", {
    playlists: playlistData.data,
  })
})

// 3. Start de webserver
// Stelt het port nummer in
app.set("port", process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
