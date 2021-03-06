const d = document,
  w = window,
  $form = d.getElementById("song-search"),
  $loader = d.querySelector(".loader"),
  $error = d.querySelector(".error"),
  $main = d.querySelector("main"),
  $artist = d.querySelector(".artist"),
  $song = d.querySelector(".song");

const clearFields = () => {
  d.querySelector(".name-value").value = "";
  d.querySelector(".song-value").value = "";
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    $loader.style.display = "block";

    let artist = e.target.artist.value.toLowerCase(),
      song = e.target.song.value.toLowerCase(),
      $artistTemplate = "",
      $songTemplate = "",
      artistAPI = `https://theaudiodb.com/api/v1/json/1/search.php?s=${artist}`,
      songAPI = `https://api.lyrics.ovh/v1/${artist}/${song}`,
      artistFetch = fetch(artistAPI),
      songFectch = fetch(songAPI),
      [artistRes, songRes] = await Promise.all([artistFetch, songFectch]),
      artistData = await artistRes.json(),
      songData = await songRes.json();

    //console.log(artist, song);
    //console.log(artistData, songData);

    if (artistData.artists === null) {
      $artistTemplate = `<h2>No results found search for artist: <mark>${query}</mark></h2>`;
    } else {
      let artist = artistData.artists[0];
      $artistTemplate = `<h2>${artist.strArtist}</h2>
      <img src="${artist.strArtistThumb}" alt="${artist.strArtist}">
      <p>${artist.intBornYear}--${artist.intDieYear || "Actuallity"}</p>
      <p><b>NATIONALITY: </b>${artist.strCountry}</p>
      <p><b>GENDER: </b>${artist.strGenre}-- <b>STYLE: </b>${
        artist.strStyle
      }</p>
      <a href="https://${artist.strWebsite}" target="_blank">Go to Web Site</a>
      <h2>BIOGRAPHY</h2>
      <p>${artist.strBiographyEN}</p>
      `;
    }

    if (songData.error) {
      $songTemplate = `<h2>Song: <mark>${song}</mark> does not exists</h2>`;
    } else {
      $songTemplate = `<h2>${song.toUpperCase()}</h2>
        <blockquote>${songData.lyrics}</blockquote>
        `;
    }

    $loader.style.display = "none";
    $artist.innerHTML = $artistTemplate;
    $song.innerHTML = $songTemplate;
    clearFields();

    const screenWidth = w.screen.width;
    //console.log(screenWidth);
    if (screenWidth >= 856) {
      w.scrollTo({
        top: 480,
        left: 0,
      });
    }
    if (screenWidth >= 551 && screenWidth <= 855) {
      w.scrollTo({
        top: 320,
        left: 0,
      });
    }
    if (screenWidth <= 550) {
      w.scrollTo({
        top: 300,
        left: 0,
      });
    }
  } catch (error) {
    console.log(error);
    $artist.innerHTML = "";
    $song.innerHTML = "";
    let message = error.statusText || "Ocurri?? un ERROR";
    $error.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
    setTimeout(() => {
      $error.innerHTML = "";
    }, 2500);
    clearFields();
    $loader.style.display = "none";
  }
});
