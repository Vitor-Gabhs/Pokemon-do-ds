let allPokemons = [];

const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`
const generatePokemonPromises = () => Array(1024).fill().map((_, index) =>
  (fetch(getPokemonUrl(index + 1)).then(response => response.json()))
)

const generateHTML = pokemons => {
  return pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name)

    const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

    accumulator += `
      <li class="card ${elementTypes[0]}">
      <img class="card-image" alt="${name}" src="${artworkUrl}">
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${elementTypes.join(" | ")}</p>
      </li>
    `
    return accumulator
  }, "")
}

const insertPokemonsIntoPage = pokemonsHTML => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML = pokemonsHTML
}

// LÓGICA DE FILTRAGEM
const handleSearchInput = event => {
  const searchTerm = event.target.value.toLowerCase().trim();

  // Filtra por nome OU ID
  const filteredPokemons = allPokemons.filter(pokemon => {
    const pokemonName = pokemon.name.toLowerCase();
    const pokemonId = String(pokemon.id);

    return pokemonName.includes(searchTerm) || pokemonId.includes(searchTerm);
  });

  const pokemonsHTML = generateHTML(filteredPokemons);
  insertPokemonsIntoPage(pokemonsHTML);
}

// CARREGAMENTO E INICIALIZAÇÃO
const pokemonPromises = generatePokemonPromises()

Promise.all(pokemonPromises)
  .then(pokemons => {
    allPokemons = pokemons; // Armazena a lista completa
    const searchInput = document.querySelector('[data-js="search-input"]');
    
    // Configura o evento de busca APÓS os dados serem carregados
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
    
    return generateHTML(pokemons);
  })
  .then(insertPokemonsIntoPage)
  .catch(error => console.error("Erro ao carregar os Pokémons:", error));