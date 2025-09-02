
// === CONFIG ==================================================
const MAPTILER_KEY = "oxGerkqsH1sd3FHLxKpP";
const TILE_URL = `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;
const DEFAULT_VIEW = { lat: -3.7319, lng: -38.5267, zoom: 12 };

// === ÍCONES ==================================================
const userIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const ecoIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// === DADOS ===================================================
const ECOPONTOS_BY_CIDADE = {
  amontada: {
    name: "Amontada",
    view: { lat: -3.360315, lng: -39.828848, zoom: 14 },
    points: [
      {
        nome: "Ecoponto Atacarejo",
        endereco: "R. Padre Joaquim Teodoro, 600-766 - Amontada - CE",
        lat: -3.359509,
        lng: -39.832705,
        imagem: "assets/ecopontos/atras-atacarejo.jpg"
      },
      {
        nome: "Ecoponto Praça Matriz",
        endereco: "R. Padre Pedro Vitorino, 561 - Amontada - CE",
        lat: -3.359565,
        lng: -39.833997,
        imagem: "assets/ecopontos/praca-matriz.jpg"
      },
      {
        nome: "Ecoponto Posto Bolão ",
        endereco: "CE-176, 33-57 - Amontada - CE",
        lat: -3.359287,
        lng: -39.834187,
        imagem: "assets/ecopontos/posto.jpg"
      },
      {
        nome: "Ecoponto Perto da Igreja ",
        endereco: "R. Jose Maria de Queiroz, 215 - Amontada - CE",
        lat: -3.360264,
        lng: -39.834076,
        imagem: "assets/ecopontos/perto-do-banco.jpg"
      },
      {
        nome: "Ecoponto Perto Da Assembleia ",
        endereco: "R. Dr. Luiz Henrique, 780 - Amontada - CE",
        lat: -3.3599711,
        lng: -39.8321678,
        imagem: "assets/ecopontos/paraguai.jpg"
      },
      {
        nome: "flores ",
        endereco: "R. Antero Gáspar Rodrigues, 134-258 - Amontada - CE",
        lat: -3.365374,
        lng: -39.831678,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "triangulo ",
        endereco: "Av. Jaime Assis Henriques - Amontada - CE",
        lat: -3.366166,
        lng: -39.831956,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "triangulo sentido carneiro grill",
        endereco: "R. Lindolfo Praxedes Téles - Amontada - CE",
        lat: -3.366349,
        lng:  -39.832110,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "do lado da rua francisco cardono",
        endereco: "BR 402, Bairro das Flores",
        lat: -3.366133,
        lng: -39.832588,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "do lado esquerdo da rua francisco cardono",
        endereco: "R. Ver. Francisco Cadorno, 389-377 - Amontada - CE",
        lat: -3.365993,
        lng: -39.832783,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "rua joaquim tome",
        endereco: "Praça da Matriz",
        lat: -3.366292,
        lng: -39.833016,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
      {
        nome: "R. Ver. Francisco Cadorno",
        endereco: "R. Ver. Francisco Cadorno, 140-196 - Amontada - CE",
        lat: -3.365195,
        lng: -39.832495,
        imagem: "assets/ecopontos/amontada1.jpg"
      },
    ]
  }
};

// === VARIÁVEIS ===============================================
let map, rotaControl = null, userLatLng = null, currentMarkers = [];
let userMarker = null, userCircle = null;
let followUser = false; // estado: seguir localização

// Painel de rota (distância e tempo)
let routeInfoBox = null;

// === FUNÇÕES =================================================
function clearMarkers() {
  currentMarkers.forEach(m => map.removeLayer(m));
  currentMarkers = [];
}

function initMap() {
  map = L.map("map");
  const v = DEFAULT_VIEW;
  map.setView([v.lat, v.lng], v.zoom);

  L.tileLayer(TILE_URL, {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 150);

  // Localização em tempo real
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        userLatLng = L.latLng(lat, lng);

        if (!userMarker) {
          userMarker = L.marker(userLatLng, { icon: userIcon })
            .addTo(map)
            .bindPopup("Você está aqui");

          userCircle = L.circle(userLatLng, {
            radius: 8,
            color: "#136AEC",
            fillColor: "#136AEC",
            fillOpacity: 0.5
          }).addTo(map);
        } else {
          userMarker.setLatLng(userLatLng);
          userCircle.setLatLng(userLatLng);
        }

        // seguir automaticamente
        if (followUser) {
          map.setView(userLatLng, map.getZoom(), { animate: true });
        }
      },
      (err) => {
        console.warn("Erro ao obter localização:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );
  }
}

function buildCitySelect() {
  const select = document.querySelector("#cidade");
  if (!select) return;

  select.innerHTML = '<option value="">Selecione</option>';
  Object.keys(ECOPONTOS_BY_CIDADE).forEach((slug) => {
    const opt = document.createElement("option");
    opt.value = slug;
    opt.textContent = ECOPONTOS_BY_CIDADE[slug].name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    renderCidade(select.value);
  });
}

function renderCidade(slug) {
  if (!slug || !ECOPONTOS_BY_CIDADE[slug]) return;

  cancelarRota();
  clearMarkers();

  const v = ECOPONTOS_BY_CIDADE[slug].view || DEFAULT_VIEW;
  map.setView([v.lat, v.lng], v.zoom);

  ECOPONTOS_BY_CIDADE[slug].points.forEach((p) => {
    const marker = L.marker([p.lat, p.lng], { icon: ecoIcon }).addTo(map);
    marker.bindPopup(`
      <div class="popup-content">
        <img src="${p.imagem}" class="popup-img" alt="${p.nome}">
        <div class="popup-title">${p.nome}</div>
        <div class="popup-address">${p.endereco}</div>
        <button class="popup-btn" onclick="rastrearRota(${p.lat}, ${p.lng})">Rotas</button>
      </div>
    `);
    currentMarkers.push(marker);
  });
}

function rastrearRota(destLat, destLng) {
  if (!userLatLng) { alert("Localização do usuário não disponível."); return; }
  cancelarRota();

  rotaControl = L.Routing.control({
    waypoints: [
      L.latLng(userLatLng.lat, userLatLng.lng),
      L.latLng(destLat, destLng)
    ],
    lineOptions: {
      styles: [{ color: "#0F8C75", weight: 5, opacity: 0.9 }]
    },
    routeWhileDragging: false,
    addWaypoints: false,
    show: false
  }).addTo(map);

  // Mostrar distância/tempo
  rotaControl.on("routesfound", function(e) {
    const summary = e.routes[0].summary;
    const dist = (summary.totalDistance / 1000).toFixed(2) + " km";
    const tempo = Math.round(summary.totalTime / 60) + " min";

    if (!routeInfoBox) {
      routeInfoBox = L.control({ position: "bottomleft" });
      routeInfoBox.onAdd = function() {
        this._div = L.DomUtil.create("div", "route-info alert alert-success p-2");
        return this._div;
      };
      routeInfoBox.addTo(map);
    }
    routeInfoBox._div.innerHTML = `<b>Distância:</b> ${dist} <br><b>Tempo:</b> ${tempo}`;
  });
}

function centralizarLocalizacao() {
  if (!userLatLng) {
    alert("Sua localização ainda não foi detectada.");
    return;
  }
  map.setView(userLatLng, 15);
}

function cancelarRota() {
  if (rotaControl) {
    map.removeControl(rotaControl);
    rotaControl = null;
  }
  if (routeInfoBox) {
    map.removeControl(routeInfoBox);
    routeInfoBox = null;
  }
}

// === CSS EXTRA PARA POPUPS ===================================
const style = document.createElement("style");
style.innerHTML = `
.popup-content {
  width: 240px;
  font-family: "Segoe UI", Arial, sans-serif;
}
.popup-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}
.popup-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #2e7d32;
}
.popup-address {
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;
}
.popup-btn {
  display: inline-block;
  width: 100%;
  background: #0F8C75;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}
.popup-btn:hover { background: #0c6a5a; }

.route-info {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  font-size: 14px;
}
`;
document.head.appendChild(style);

// === INICIALIZAÇÃO ===========================================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.L) {
    console.error("Leaflet não carregado.");
    return;
  }
  initMap();
  buildCitySelect();

  // Botões extras
  document.getElementById("btn-locate").addEventListener("click", centralizarLocalizacao);
  document.getElementById("btn-clear-route").addEventListener("click", cancelarRota);
  document.getElementById("btn-follow").addEventListener("click", () => {
    followUser = !followUser;
    alert(followUser ? "Modo seguir ativado" : "Modo seguir desativado");
  });
});

// Expor função global
window.rastrearRota = rastrearRota;
