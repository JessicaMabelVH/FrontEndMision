/*jshint esversion: 6 */

const pokemonApi = "https://pokeapi.co/api/v2/pokemon/";
const pokemonApiSpritesAlt = "https://unpkg.com/pokeapi-sprites@2.0.4/sprites/pokemon/versions/generation-v/black-white/animated/";
const pokemonSearchInput = document.getElementById("pokeSearch");
const pokemonSprites = document.getElementById("pokeSprite");
const pokemonName = document.getElementById("pokeName");
const pokemonID = document.getElementById("pokeID");
const pokemonType = document.getElementsByClassName("pokeType")[0];
const pokemonHeight = document.getElementById("pokeHeight");
const pokemonWeight = document.getElementById("pokeWeight");
const pokemonAbility = document.getElementsByClassName("pokeAbility")[0];
const pokemonStats = document.getElementById("pokeStats");
const pokemonExp = document.getElementById("pokeExp");
const pokemonMoves = document.getElementById("pokeMoves");
const statsMax = [255, 181, 230, 180, 230, 200];
const statsNamesAbbr = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];
const statsColors = ["is-error", "is-success", "is-primary", "is-purple", "is-orange", "is-warning"];

/* Enter key */
function keyListener(event) {
    if (event.defaultPrevented) {
        return;
    }
    let key = event.key || event.keyCode;
    if (key === "Enter" || key === "enter" || key === 13) {
        document.getElementById("pokeFetch").click();
    }
}
document.addEventListener("keyup", keyListener);

/* Run search */
function fetchPokemon() {
    if (pokemonSearchInput.value.length == 0) {
        notInput();
    } else {
        const pokemonSearch = pokemonSearchInput.value.toLowerCase();
        const url = pokemonApi + pokemonSearch;
        fetch(url)
            .then((res) => {
                if (res.status != "200") {
                    // console.log(res);
                    notFound();
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                if (data) {
                    console.log(data);
                    fetchPokemonSprite(data);
                    fetchPokemonInfo(data);
                    fetchPokemonStats(data);
                    fetchPokemonMoves(data);
                }
            });
    }
}

/* Get Information */
function fetchPokemonInfo(data) {
    pokemonName.textContent = data.name;
    pokemonID.textContent = data.id;
    pokemonType.innerHTML = "";
    for (let i = 0; i < data.types.length; i++) {
        const type = document.createElement("li");
        type.textContent = data.types[i].type.name;
        pokemonType.appendChild(type);
    }
    pokemonHeight.textContent = data.height / 10 + "m";
    pokemonWeight.textContent = data.weight / 10 + "kg";
    pokemonAbility.innerHTML = "";
    for (let i = 0; i < data.abilities.length; i++) {
        const ability = document.createElement("li");
        ability.textContent = data.abilities[i].ability.name;
        pokemonAbility.appendChild(ability);
    }
    pokemonExp.textContent = data.base_experience;
}

/* Get Front Sprite */
function fetchPokemonSprite(data) {
    pokemonSprites.src = "img/pokeball.gif";
    if (data.id > 649) {
        const pokeSprite = data.sprites.front_default;
        pokemonSprites.src = pokeSprite;
        // console.log(pokemonSprites);
    } else {
        const url = pokemonApiSpritesAlt;
        fetch(url).then((res) => {
            if (res.status != "200") {
                const pokeSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
                pokemonSprites.src = pokeSprite;
                // console.log(pokemonSprites);
            } else {
                const pokeSprite = url + data.id + ".gif";
                pokemonSprites.src = pokeSprite;
                // console.log(pokemonSprites);
            }
        });
    }
}

/* Get Stats */
function fetchPokemonStats(data) {
    pokemonStats.innerHTML = "";
    const y = data.stats.length;
    const x = y / 2;
    // console.log(`x= ${x}, y= ${y}`);
    createStatsColumns(0, x, data);
    createStatsColumns(x, y, data);
}

/* Columns for stats */
function createStatsColumns(x, y, data) {
    const stats = document.createElement("div");
    stats.classList.add("col-lg-6");
    for (let i = x; i < y; i++) {
        const statsValue = document.createElement("div");
        const statsProgress = document.createElement("progress");
        statsValue.classList.add("value");
        statsValue.dataset.label = `${statsNamesAbbr[i]}: ${data.stats[i].base_stat}`;
        statsValue.title = data.stats[i].stat.name.toUpperCase();
        statsProgress.classList.add("nes-progress", `${statsColors[i]}`);
        statsProgress.value = data.stats[i].base_stat;
        statsProgress.max = statsMax[i];
        statsValue.appendChild(statsProgress);
        stats.appendChild(statsValue);
        pokemonStats.appendChild(stats);
    }
}

/* Show pokemon moves */
function showModalInfo() {
    const numberID = parseInt(pokemonID.innerText);
    console.log(numberID);
    if (!numberID || isNaN(numberID)) {
        return false;
    } else {
        openModal(document.getElementById("pokeMovesModal"));
    }
}

/* Get pokemon moves */
function fetchPokemonMoves(data) {
    pokemonMoves.innerHTML = "";
    for (let i = 0; i < data.moves.length; i++) {
        const move = document.createElement("li");
        move.textContent = data.moves[i].move.name;
        pokemonMoves.appendChild(move);
    }
}

/* Show not input message */
function notInput() {
    const replaceValue = "";
    const replaceSprite = "img/not-found.png";
    const replaceName = "Ingresa un valor";
    const replaceInput = pokemonSearchInput.value;
    replacePokemonInfo(replaceSprite, replaceInput, replaceName, replaceValue);
}

/* Show not found message */
function notFound() {
    const replaceValue = "¿?";
    const replaceSprite = "img/not-found.png";
    const replaceName = "No se encontró";
    const replaceInput = pokemonSearchInput.value;
    replacePokemonInfo(replaceSprite, replaceInput, replaceName, replaceValue);
}

/* Clear search */
function clearSearch() {
    const replaceValue = "";
    const replaceSprite = "img/pokemon.png";
    const replaceName = "";
    const replaceInput = "";
    replacePokemonInfo(replaceSprite, replaceInput, replaceName, replaceValue);
    // console.log(replacePokemonInfo);
}

/* Replace values */
function replacePokemonInfo(replaceSprite, replaceInput, replaceName, replaceValue) {
    pokemonSprites.src = replaceSprite;
    pokemonSearchInput.value = replaceInput;
    pokemonName.textContent = replaceName;
    pokemonID.textContent = replaceValue;
    pokemonType.textContent = replaceValue;
    pokemonHeight.textContent = replaceValue;
    pokemonWeight.textContent = replaceValue;
    pokemonAbility.textContent = replaceValue;
    pokemonExp.textContent = replaceValue;
    pokemonStats.innerHTML = `
    <div class="col-6">
        <div class="value" data-label="HP ${replaceValue}" title="HP">
            <progress class="nes-progress"></progress>
        </div>
        <div class="value" data-label="ATK ${replaceValue}" title="ATTACK">
            <progress class="nes-progress"></progress>
        </div>
        <div class="value" data-label="DEF ${replaceValue}" title="DEFENSE">
            <progress class="nes-progress"></progress>
        </div>
    </div>
    <div class="col-6">
        <div class="value" data-label="SPA ${replaceValue}" title="SPECIAL-ATTACK">
            <progress class="nes-progress"></progress>
        </div>
        <div class="value" data-label="SPD ${replaceValue}" title="SPECIAL-DEFENSE">
            <progress class="nes-progress"></progress>
        </div>
        <div class="value" data-label="SPE ${replaceValue}" title="SPEED">
            <progress class="nes-progress"></progress>
        </div>
    </div>`;
}

/* Random pokemon */
function randomPokemon() {
    const min = 1;
    const max = 898;
    const randomID = Math.floor(Math.random() * (max - min + 1)) + min;
    pokemonSearchInput.value = randomID;
    fetchPokemon();
}

/* Previous pokemon */
function previousPokemon() {
    const numberID = parseInt(pokemonID.innerText);
    if (numberID > 1) {
        // console.log(numberID);
        let prevPokemon = numberID - 1;
        // console.log(prevPokemon);
        pokemonSearchInput.value = prevPokemon;
        fetchPokemon();
    } else {
        return false;
    }
}

/* Next pokemon */
function nextPokemon() {
    const numberID = parseInt(pokemonID.innerText);
    if (numberID < 898) {
        // console.log(numberID);
        let prevPokemon = numberID + 1;
        // console.log(prevPokemon);
        pokemonSearchInput.value = prevPokemon;
        fetchPokemon();
    } else {
        return false;
    }
}

/* Credits modal */
function showModalCredits() {
    openModal(document.getElementById("modalCredits"));
}

/* Actual year */
document.getElementById("year").appendChild(document.createTextNode(new Date().getFullYear()));
