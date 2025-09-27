// Array of bike objects
const bikes = [
  { 
    name: "KTM 125 Duke",
    price: "$1200", 
    brand: "KTM", 
    image: "images/KTMDUKE125.jpg",
    engine: "124cc",
    mileage: "40 km/l"
  },
  { 
    name: "YamahaFZ", 
    price: "$1500", 
    brand: "Yamaha", 
    image: "images/YamahaFZ.jpg",
    engine: "149cc",
    mileage: "45 km/l"
  },
  {
    name: "Suzuki Gixxer",
    price: "$1400", 
    brand: "Suzuki", 
    image: "images/Suzukigixxer.jpeg",
    engine: "155cc",
    mileage: "46 km/l"
  },
  { 
    name: "Honda Activa", 
    price: "$900", 
    brand: "Honda",
    image: "images/Hondaactiva.jpeg",
    engine: "109cc",
    mileage: "55 km/l"
  },
  { 
    name: "Yamaha R15",
    price: "$1600",
    brand: "Yamaha",
    image: "images/YamahaR15.jpeg",
    engine: "155cc",
    mileage: "48 km/l"
  },
  { 
    name: "Suzuki Access", 
    price: "$1100", 
    brand: "Suzuki",
    image: "images/access.jpeg",
    engine: "125cc",
    mileage: "52 km/l"
  },
];

// Get references to HTML elements
const bikeList = document.getElementById("bikeList");
const brandFilter = document.getElementById("brandFilter");

// Function to display bikes
function displayBikes(bikeArray) {
  bikeList.innerHTML = ""; // clear list

  bikeArray.forEach(bike => {
    const bikeCard = document.createElement("div");
    bikeCard.classList.add("bike-card");

    bikeCard.innerHTML = `
      <img src="${bike.image}" alt="${bike.name}">
      <h3>${bike.name}</h3>
      <p>Brand: ${bike.brand}</p>
      <p>Engine: ${bike.engine}</p>
      <p>Mileage: ${bike.mileage}</p>
      <p class="price">Price: ${bike.price}</p>
      <button class="button">View Details</button>
    `;

    bikeList.appendChild(bikeCard);
  });
}

// Event listener for brand filter
brandFilter.addEventListener("change", () => {
  const selectedBrand = brandFilter.value;

  if (selectedBrand === "All") {
    displayBikes(bikes);
  } else {
    const filteredBikes = bikes.filter(bike => bike.brand === selectedBrand);
    displayBikes(filteredBikes);
  }
});

// Initial display of all bikes
displayBikes(bikes);
