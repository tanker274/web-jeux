// ====================================
// TOURNOI DE JEUX DE SOCIÉTÉ - APP.JS
// AVEC SYSTÈME DE SÉCURITÉ ET VOTES
// ====================================

document.addEventListener('DOMContentLoaded', function() {

	// ====================================
	// SYSTÈME DE SÉCURITÉ PAR IP
	// ====================================
	
	const AUTHORIZED_IPS = [
		'127.0.0.1',        // Localhost
		'192.168.1.100',    // Exemple - MODIFIE CETTE LISTE
		'192.168.1.101',    
	];

	let userIP = null;
	let isAuthorized = false;

	async function getUserIP() {
		try {
			const response = await fetch('https://api.ipify.org?format=json');
			const data = await response.json();
			userIP = data.ip;
			console.log('IP détectée:', userIP);
		} catch (e) {
			console.log('Mode local détecté');
			userIP = '127.0.0.1';
		}
		
		isAuthorized = AUTHORIZED_IPS.includes(userIP);
		updateUIPermissions();
		showIPStatus();
	}

	function showIPStatus() {
		const statusDiv = document.createElement('div');
		statusDiv.id = 'ip-status';
		statusDiv.style.cssText = `
			position: fixed;
			top: 80px;
			right: 20px;
			padding: 12px 20px;
			border-radius: 12px;
			font-size: 0.85rem;
			font-weight: 600;
			z-index: 999;
			box-shadow: 0 4px 6px rgba(0,0,0,0.3);
			transition: all 0.3s ease;
		`;
		
		if (isAuthorized) {
			statusDiv.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
			statusDiv.style.color = 'white';
			statusDiv.innerHTML = `🔓 Accès autorisé<br><span style="font-size:0.75rem;opacity:0.9">IP: ${userIP}</span>`;
		} else {
			statusDiv.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
			statusDiv.style.color = 'white';
			statusDiv.innerHTML = `👤 Mode visiteur<br><span style="font-size:0.75rem;opacity:0.9">IP: ${userIP}</span>`;
		}
		
		document.body.appendChild(statusDiv);
		
		setTimeout(() => {
			statusDiv.style.opacity = '0';
			setTimeout(() => statusDiv.remove(), 300);
		}, 5000);
	}

	function updateUIPermissions() {
		if (!isAuthorized) {
			const editButtons = [
				'addPlayerBtn', 'addGameBtn', 'saveGameBtn', 
				'editGameBtn', 'deleteGameBtn', 'updateCertBtn'
			];
			
			editButtons.forEach(id => {
				const btn = document.getElementById(id);
				if (btn) {
					btn.disabled = true;
					btn.style.opacity = '0.5';
					btn.style.cursor = 'not-allowed';
					btn.title = 'Accès refusé - IP non autorisée';
				}
			});
			
			const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], input[type="time"], textarea, select');
			inputs.forEach(input => {
				if (!input.id.includes('Search') && !input.id.includes('sort')) {
					input.disabled = true;
					input.style.opacity = '0.6';
					input.title = 'Accès refusé - IP non autorisée';
				}
			});
		}
	}

	function checkPermission(actionName) {
		if (!isAuthorized) {
			alert(`🔒 Accès refusé!\n\nVotre IP (${userIP}) n'est pas autorisée à ${actionName}.\n\nSeules les IPs autorisées peuvent modifier les données.`);
			return false;
		}
		return true;
	}

	getUserIP();

	// ====================================
	// NAVIGATION
	// ====================================
	const navButtons = document.querySelectorAll("nav button");
	const sections = {
		accueil: document.getElementById("section-accueil"),
		classement: document.getElementById("section-classement"),
		jeux: document.getElementById("section-jeux"),
		certificats: document.getElementById("section-certificats"),
	};

	navButtons.forEach(btn => {
		btn.addEventListener("click", () => {
			navButtons.forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			const target = btn.dataset.section;
			Object.keys(sections).forEach(k => {
				sections[k].style.display = (k === target) ? "block" : "none";
			});
		});
	});

	// ====================================
	// DONNÉES - INVITÉS
	// ====================================
	const defaultPlayers = [
		{ nom: "Laétitia", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Nicolas", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Martine", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Nathan", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Laurent", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Maéva", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Joél", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Christine", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Luis", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Agnes", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Zoé", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Jade", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Cameron", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Lilian", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Livia", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Léona", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Melvine", prenom: "", victoires: 0, jeux: 0 }
	];

	// ====================================
	// DONNÉES - JEUX COMPLETS
	// ====================================
	const defaultGames = [
		// AVENTURE
		{
			id: "av1",
			name: "Jumanji",
			category: "aventure",
			difficulty: "Difficile",
			description: "Jeu d'aventure immersif inspiré du film. Affrontez les dangers de la jungle et survivez !",
			date: "2026-02-20",
			time: "14:00",
			timeEnd: "15:30",
			place: "Salle A",
			participants: "4-6 joueurs",
			sessions: [] // Historique des sessions jouées
		},
		{
			id: "av2",
			name: "Les Aventuriers du Rail Express",
			category: "aventure",
			difficulty: "Facile",
			description: "Version express du célèbre jeu de trains. Construisez vos routes à travers le pays !",
			date: "2026-02-20",
			time: "16:00",
			timeEnd: "17:00",
			place: "Salle A",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "av3",
			name: "Goblivion",
			category: "aventure",
			difficulty: "Difficile",
			description: "Jeu d'aventure fantasy avec des gobelins. Stratégie et aventure garanties !",
			date: "2026-02-21",
			time: "14:00",
			timeEnd: "16:00",
			place: "Salle B",
			participants: "3-5 joueurs",
			sessions: []
		},
		{
			id: "av4",
			name: "Loup-Garou",
			category: "aventure",
			difficulty: "Difficile",
			description: "Le classique des jeux de rôle ! Qui sont les loups-garous parmi les villageois ?",
			date: "2026-02-21",
			time: "18:00",
			timeEnd: "19:30",
			place: "Salle C",
			participants: "8-15 joueurs",
			sessions: []
		},

		// STRATÉGIE
		{
			id: "st1",
			name: "Cluedo",
			category: "strategie",
			difficulty: "Facile",
			description: "Résolvez le mystère ! Qui est le coupable, avec quelle arme, dans quelle pièce ?",
			date: "2026-02-22",
			time: "14:00",
			timeEnd: "15:30",
			place: "Salle A",
			participants: "3-6 joueurs",
			sessions: []
		},
		{
			id: "st2",
			name: "Puissance 4",
			category: "strategie",
			difficulty: "Facile",
			description: "Jeu de stratégie classique. Alignez 4 pions de votre couleur !",
			date: "2026-02-22",
			time: "16:00",
			timeEnd: "16:30",
			place: "Salle B",
			participants: "2 joueurs",
			sessions: []
		},
		{
			id: "st3",
			name: "Ligretto",
			category: "strategie",
			difficulty: "Facile",
			description: "Jeu de cartes rapide et frénétique ! Soyez le plus rapide à poser vos cartes.",
			date: "2026-02-22",
			time: "17:00",
			timeEnd: "17:30",
			place: "Salle B",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "st4",
			name: "Skyjo",
			category: "strategie",
			difficulty: "Facile",
			description: "Jeu de cartes stratégique. Obtenez le moins de points possible !",
			date: "2026-02-23",
			time: "14:00",
			timeEnd: "15:00",
			place: "Salle A",
			participants: "2-8 joueurs",
			sessions: []
		},

		// CULTURE
		{
			id: "cu1",
			name: "Quiz des garçons",
			category: "culture",
			difficulty: "Facile",
			description: "Quiz de culture générale amusant. Testez vos connaissances !",
			date: "2026-02-23",
			time: "15:30",
			timeEnd: "16:30",
			place: "Salle C",
			participants: "2-6 joueurs",
			sessions: []
		},
		{
			id: "cu2",
			name: "Dobble",
			category: "culture",
			difficulty: "Facile",
			description: "Jeu d'observation rapide. Trouvez le symbole commun entre deux cartes !",
			date: "2026-02-23",
			time: "17:00",
			timeEnd: "17:30",
			place: "Salle C",
			participants: "2-8 joueurs",
			sessions: []
		},
		{
			id: "cu3",
			name: "Journal d'un Noob",
			category: "culture",
			difficulty: "Facile",
			description: "Jeu inspiré de l'univers Minecraft. Parfait pour les fans !",
			date: "2026-02-24",
			time: "14:00",
			timeEnd: "15:00",
			place: "Salle A",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "cu4",
			name: "Color",
			category: "culture",
			difficulty: "Facile",
			description: "Jeu de couleurs et de rapidité. Soyez le plus rapide !",
			date: "2026-02-24",
			time: "15:30",
			timeEnd: "16:00",
			place: "Salle A",
			participants: "2-6 joueurs",
			sessions: []
		},

		// JEUX VIDÉO / MINI-JEUX
		{
			id: "jv1",
			name: "Traite le lait",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Mini-jeu rigolo ! Qui sera le meilleur fermier ?",
			date: "2026-02-24",
			time: "16:30",
			timeEnd: "17:00",
			place: "Espace Gaming",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "jv2",
			name: "Tennis de table",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Partie de ping-pong virtuel endiablée !",
			date: "2026-02-25",
			time: "14:00",
			timeEnd: "14:30",
			place: "Espace Gaming",
			participants: "2 joueurs",
			sessions: []
		},
		{
			id: "jv3",
			name: "Danse miroir",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Reproduisez les mouvements ! Jeu de danse amusant.",
			date: "2026-02-25",
			time: "15:00",
			timeEnd: "15:30",
			place: "Espace Gaming",
			participants: "1-4 joueurs",
			sessions: []
		},
		{
			id: "jv4",
			name: "Duel au pistolet",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Western virtuel ! Soyez le plus rapide à dégainer.",
			date: "2026-02-25",
			time: "16:00",
			timeEnd: "16:30",
			place: "Espace Gaming",
			participants: "2 joueurs",
			sessions: []
		},
		{
			id: "jv5",
			name: "Entraînement samouraï",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Testez vos réflexes de samouraï ! Jeu de précision.",
			date: "2026-02-25",
			time: "17:00",
			timeEnd: "17:30",
			place: "Espace Gaming",
			participants: "1-2 joueurs",
			sessions: []
		},
		{
			id: "jv6",
			name: "Combat à l'épée",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Duel épique à l'épée ! Montrez vos talents.",
			date: "2026-02-25",
			time: "18:00",
			timeEnd: "18:30",
			place: "Espace Gaming",
			participants: "2 joueurs",
			sessions: []
		},
		{
			id: "jv7",
			name: "Duel magique",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Combat de magie coloré et amusant !",
			date: "2026-02-26",
			time: "14:00",
			timeEnd: "14:30",
			place: "Espace Gaming",
			participants: "2 joueurs",
			sessions: []
		},
		{
			id: "jv8",
			name: "Combat de gélatiteur",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Combat de gelées rebondissantes ! Délire garanti.",
			date: "2026-02-26",
			time: "15:00",
			timeEnd: "15:30",
			place: "Espace Gaming",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "jv9",
			name: "Coffre-fort",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Décodez le coffre-fort ! Jeu de réflexion rapide.",
			date: "2026-02-26",
			time: "16:00",
			timeEnd: "16:30",
			place: "Espace Gaming",
			participants: "1-2 joueurs",
			sessions: []
		},
		{
			id: "jv10",
			name: "Coffre au trésor",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Trouvez le trésor caché ! Aventure et énigmes.",
			date: "2026-02-26",
			time: "17:00",
			timeEnd: "17:30",
			place: "Espace Gaming",
			participants: "1-4 joueurs",
			sessions: []
		},
		{
			id: "jv11",
			name: "Chercher un objet",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Jeu d'observation. Trouvez les objets cachés !",
			date: "2026-02-27",
			time: "14:00",
			timeEnd: "14:30",
			place: "Espace Gaming",
			participants: "1-4 joueurs",
			sessions: []
		},
		{
			id: "jv12",
			name: "Table tournante",
			category: "jeux-video",
			difficulty: "Facile",
			description: "Mini-jeu d'adresse. Gardez l'équilibre !",
			date: "2026-02-27",
			time: "15:00",
			timeEnd: "15:30",
			place: "Espace Gaming",
			participants: "2-4 joueurs",
			sessions: []
		},
		{
			id: "jv13",
			name: "Dessin",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Jeu de dessin créatif. Faites deviner vos œuvres !",
			date: "2026-02-27",
			time: "16:00",
			timeEnd: "17:00",
			place: "Espace Gaming",
			participants: "2-8 joueurs",
			sessions: []
		},
		{
			id: "jv14",
			name: "beat saber",
			category: "jeux-video",
			difficulty: "Difficile",
			description: "Jeu de dessin créatif. Faites deviner vos œuvres !",
			date: "2026-02-27",
			time: "16:00",
			timeEnd: "17:00",
			place: "Espace Gaming",
			participants: "2-8 joueurs",
			sessions: []
		},
		{
			id: "jv15",
			name: "Dominos",
			category: "strategie",
			difficulty: "Difficile",
			description: "Jeu de dessin créatif. Faites deviner vos œuvres !",
			date: "2026-02-27",
			time: "16:00",
			timeEnd: "17:00",
			place: "Espace Gaming",
			participants: "2-8 joueurs",
			sessions: []
		}
	];

	// ====================================
	// LOCAL STORAGE
	// ====================================
	function load(key, fallback) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : fallback;
		} catch (e) {
			console.error('Erreur chargement:', e);
			return fallback;
		}
	}

	function save(key, val) {
		try {
			localStorage.setItem(key, JSON.stringify(val));
			return true;
		} catch (e) {
			console.error('Erreur sauvegarde:', e);
			return false;
		}
	}

	let joueurs = load('tournoi_joueurs', defaultPlayers);
	let games = load('tournoi_games', defaultGames);

	// ====================================
	// SECTION CLASSEMENT
	// ====================================
	const tbody = document.querySelector("#classementTable tbody");
	const searchInput = document.getElementById("searchInput");
	const sortSelect = document.getElementById("sortSelect");
	const resetBtn = document.getElementById("resetBtn");
	const addPlayerBtn = document.getElementById("addPlayerBtn");
	const newNom = document.getElementById("newNom");
	const newPrenom = document.getElementById("newPrenom");
	const newVictoires = document.getElementById("newVictoires");
	const newJeux = document.getElementById("newJeux");
	const countPlayers = document.getElementById("countPlayers");

	function renderTable() {
		tbody.innerHTML = "";
		let list = [...joueurs];

		const query = searchInput.value.trim().toLowerCase();
		if (query) {
			list = list.filter(j => 
				(j.nom + " " + j.prenom).toLowerCase().includes(query)
			);
		}

		const sort = sortSelect.value;
		if (sort === 'victoires_desc') list.sort((a, b) => b.victoires - a.victoires);
		else if (sort === 'victoires_asc') list.sort((a, b) => a.victoires - b.victoires);
		else if (sort === 'jeux_desc') list.sort((a, b) => b.jeux - a.jeux);
		else if (sort === 'jeux_asc') list.sort((a, b) => a.jeux - b.jeux);
		else if (sort === 'nom_asc') list.sort((a, b) => a.nom.localeCompare(b.nom));

		list.forEach((j, i) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td class="rank">${i + 1}</td>
				<td>${escapeHtml(j.nom)}</td>
				<td>${escapeHtml(j.prenom)}</td>
				<td>${j.victoires}</td>
				<td>${j.jeux}</td>
			`;
			tbody.appendChild(tr);
		});

		countPlayers.textContent = joueurs.length;
	}

	searchInput.addEventListener('input', renderTable);
	sortSelect.addEventListener('change', renderTable);
	resetBtn.addEventListener('click', () => {
		searchInput.value = '';
		sortSelect.value = 'victoires_desc';
		renderTable();
	});

	addPlayerBtn.addEventListener('click', () => {
		if (!checkPermission('ajouter un joueur')) return;

		const nom = newNom.value.trim();
		const prenom = newPrenom.value.trim();
		const victoires = parseInt(newVictoires.value, 10) || 0;
		const jeux = parseInt(newJeux.value, 10) || 0;

		if (!nom) {
			alert('Veuillez renseigner au moins le nom');
			return;
		}

		const idx = joueurs.findIndex(j => 
			j.nom.toLowerCase() === nom.toLowerCase()
		);

		if (idx >= 0) {
			joueurs[idx].prenom = prenom;
			joueurs[idx].victoires = victoires;
			joueurs[idx].jeux = jeux;
		} else {
			joueurs.push({ nom, prenom, victoires, jeux });
		}

		newNom.value = '';
		newPrenom.value = '';
		newVictoires.value = '';
		newJeux.value = '';

		if (save('tournoi_joueurs', joueurs)) {
			renderTable();
		}
	});

	// ====================================
	// SECTION JEUX (suite dans le prochain message...)
	// ====================================
	// ====================================
	// SECTION JEUX À VENIR (PARTIE 2)
	// ====================================
	const gamesGrid = document.getElementById('gamesGrid');
	const gameSearch = document.getElementById('gameSearch');
	const categoryButtons = document.querySelectorAll('.category-btn');
	const addGameBtn = document.getElementById('addGameBtn');
	
	const gameModal = document.getElementById('gameModal');
	const addGameModal = document.getElementById('addGameModal');
	const closeModal = document.getElementById('closeModal');
	const closeAddModal = document.getElementById('closeAddModal');
	
	let currentCategory = 'all';
	let currentGameId = null;

	const categoryEmojis = {
		aventure: '🗺️',
		strategie: '♟️',
		culture: '📚',
		'jeux-video': '🎮'
	};

	const categoryNames = {
		aventure: 'Aventure',
		strategie: 'Stratégie',
		culture: 'Culture',
		'jeux-video': 'Jeux vidéo'
	};

	function renderGames() {
		gamesGrid.innerHTML = '';
		let list = [...games];

		if (currentCategory !== 'all') {
			list = list.filter(g => g.category === currentCategory);
		}

		const query = gameSearch.value.trim().toLowerCase();
		if (query) {
			list = list.filter(g => 
				g.name.toLowerCase().includes(query) ||
				g.description.toLowerCase().includes(query)
			);
		}

		list.sort((a, b) => {
			const dateA = a.date + a.time;
			const dateB = b.date + b.time;
			return dateA > dateB ? 1 : -1;
		});

		if (list.length === 0) {
			gamesGrid.innerHTML = '<div class="small muted" style="grid-column: 1 / -1; text-align: center; padding: 40px;">Aucun jeu trouvé</div>';
			return;
		}

		list.forEach(game => {
			const card = document.createElement('div');
			card.className = 'game-card';
			card.dataset.gameId = game.id;
			
			const timeEnd = game.timeEnd ? ` - ${game.timeEnd}` : '';
			const sessionsCount = game.sessions ? game.sessions.length : 0;
			const difficultyBadge = game.difficulty === 'Difficile' 
				? '<span style="background:#ef4444;color:white;padding:4px 8px;border-radius:6px;font-size:0.7rem;font-weight:700;">⚡ DIFFICILE</span>'
				: '<span style="background:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:0.7rem;font-weight:700;">✓ FACILE</span>';
			
			card.innerHTML = `
				<div class="game-card-header">
					<div style="flex: 1;">
						<div class="game-card-title">${escapeHtml(game.name)}</div>
						<div style="margin-top:6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
							${difficultyBadge}
							${sessionsCount > 0 ? `<span style="background:rgba(59,130,246,0.2);color:#60a5fa;padding:4px 8px;border-radius:6px;font-size:0.7rem;font-weight:700;">🎯 ${sessionsCount} session${sessionsCount > 1 ? 's' : ''}</span>` : ''}
						</div>
					</div>
					<span class="game-card-category ${game.category}">
						${categoryEmojis[game.category]} ${categoryNames[game.category]}
					</span>
				</div>
				<div class="game-card-description">${escapeHtml(game.description)}</div>
				<div class="game-card-info">
					<div class="game-card-info-item">
						<span>📅</span>
						<span><strong>Date:</strong> ${game.date}</span>
					</div>
					<div class="game-card-info-item">
						<span>⏰</span>
						<span><strong>Horaire:</strong> ${game.time}${timeEnd}</span>
					</div>
					<div class="game-card-info-item">
						<span>📍</span>
						<span><strong>Lieu:</strong> ${escapeHtml(game.place)}</span>
					</div>
					<div class="game-card-info-item">
						<span>👥</span>
						<span><strong>Participants:</strong> ${escapeHtml(game.participants)}</span>
					</div>
				</div>
			`;

			card.addEventListener('click', () => openGameModal(game.id));
			gamesGrid.appendChild(card);
		});
	}

	categoryButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			categoryButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentCategory = btn.dataset.category;
			renderGames();
		});
	});

	gameSearch.addEventListener('input', renderGames);

	function openGameModal(gameId) {
		const game = games.find(g => g.id === gameId);
		if (!game) return;

		currentGameId = gameId;

		document.getElementById('modalTitle').textContent = game.name;
		document.getElementById('modalDescription').textContent = game.description;
		
		const modalCategory = document.getElementById('modalCategory');
		const difficultyText = game.difficulty === 'Difficile' ? '⚡ Difficile' : '✓ Facile';
		modalCategory.textContent = `${categoryEmojis[game.category]} ${categoryNames[game.category]} • ${difficultyText}`;
		modalCategory.className = `modal-category game-card-category ${game.category}`;

		const timeEnd = game.timeEnd ? ` - ${game.timeEnd}` : '';
		document.getElementById('modalSchedules').innerHTML = `
			<div class="schedule-item">📅 ${game.date}</div>
			<div class="schedule-item">⏰ ${game.time}${timeEnd}</div>
		`;

		document.getElementById('modalPlaces').innerHTML = `
			<div class="place-item">📍 ${escapeHtml(game.place)}</div>
		`;

		document.getElementById('modalParticipants').innerHTML = `
			<div class="place-item">👥 ${escapeHtml(game.participants)}</div>
		`;

		// Afficher l'historique des sessions
		const sessionsDiv = document.getElementById('modalSessions');
		if (game.sessions && game.sessions.length > 0) {
			sessionsDiv.innerHTML = `
				<div class="modal-section">
					<h3>🎯 Historique des sessions (${game.sessions.length})</h3>
					<div class="sessions-list">
						${game.sessions.map((session, idx) => `
							<div class="session-item">
								<div style="display:flex;justify-content:space-between;align-items:center;">
									<div>
										<strong>Session ${idx + 1}</strong>
										<div class="small muted">${session.date} à ${session.time}</div>
									</div>
									<div style="display:flex;gap:8px;">
										<span style="background:rgba(16,185,129,0.2);color:#10b981;padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:600;">✓ ${session.votes} vote${session.votes > 1 ? 's' : ''}</span>
										${isAuthorized ? `<button class="btn-ghost" onclick="removeSession('${game.id}', ${idx})" style="padding:4px 8px;font-size:0.75rem;">Supprimer</button>` : ''}
									</div>
								</div>
							</div>
						`).join('')}
					</div>
				</div>
			`;
		} else {
			sessionsDiv.innerHTML = '<div class="small muted" style="text-align:center;padding:20px;">Aucune session jouée pour l\'instant</div>';
		}

		// Bouton pour marquer comme joué
		const voteBtn = document.getElementById('voteGameBtn');
		voteBtn.textContent = '✓ Marquer comme joué';
		voteBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

		gameModal.classList.add('active');
	}

	// Fonction pour voter (marquer comme joué)
	window.voteForGame = function(gameId) {
		const game = games.find(g => g.id === gameId);
		if (!game) return;

		const now = new Date();
		const dateStr = now.toLocaleDateString('fr-FR');
		const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

		if (!game.sessions) {
			game.sessions = [];
		}

		// Ajouter une nouvelle session
		game.sessions.push({
			date: dateStr,
			time: timeStr,
			votes: 1,
			votedBy: [userIP]
		});

		if (save('tournoi_games', games)) {
			alert(`✓ Session ajoutée !\n\n${game.name} a été marqué comme joué.\nVous pouvez rejouer et revoter autant de fois que vous voulez !`);
			renderGames();
			openGameModal(gameId); // Rafraîchir la modal
		}
	};

	// Fonction pour supprimer une session
	window.removeSession = function(gameId, sessionIndex) {
		if (!checkPermission('supprimer une session')) return;
		if (!confirm('Voulez-vous vraiment supprimer cette session ?')) return;

		const game = games.find(g => g.id === gameId);
		if (!game || !game.sessions) return;

		game.sessions.splice(sessionIndex, 1);

		if (save('tournoi_games', games)) {
			renderGames();
			openGameModal(gameId);
		}
	};

	closeModal.addEventListener('click', () => {
		gameModal.classList.remove('active');
		currentGameId = null;
	});

	gameModal.addEventListener('click', (e) => {
		if (e.target === gameModal) {
			gameModal.classList.remove('active');
			currentGameId = null;
		}
	});

	// Bouton voter
	document.getElementById('voteGameBtn').addEventListener('click', () => {
		if (currentGameId) {
			voteForGame(currentGameId);
		}
	});

	addGameBtn.addEventListener('click', () => {
		if (!checkPermission('ajouter un jeu')) return;

		document.getElementById('formModalTitle').textContent = 'Ajouter un jeu';
		document.getElementById('formGameName').value = '';
		document.getElementById('formGameCategory').value = 'aventure';
		document.getElementById('formGameDifficulty').value = 'Facile';
		document.getElementById('formGameDescription').value = '';
		document.getElementById('formGameDate').value = '';
		document.getElementById('formGameTime').value = '';
		document.getElementById('formGameTimeEnd').value = '';
		document.getElementById('formGamePlace').value = '';
		document.getElementById('formGameParticipants').value = '';
		currentGameId = null;
		addGameModal.classList.add('active');
	});

	document.getElementById('editGameBtn').addEventListener('click', () => {
		if (!checkPermission('éditer un jeu')) return;

		const game = games.find(g => g.id === currentGameId);
		if (!game) return;

		document.getElementById('formModalTitle').textContent = 'Éditer le jeu';
		document.getElementById('formGameName').value = game.name;
		document.getElementById('formGameCategory').value = game.category;
		document.getElementById('formGameDifficulty').value = game.difficulty || 'Facile';
		document.getElementById('formGameDescription').value = game.description;
		document.getElementById('formGameDate').value = game.date;
		document.getElementById('formGameTime').value = game.time;
		document.getElementById('formGameTimeEnd').value = game.timeEnd || '';
		document.getElementById('formGamePlace').value = game.place;
		document.getElementById('formGameParticipants').value = game.participants;

		gameModal.classList.remove('active');
		addGameModal.classList.add('active');
	});

	document.getElementById('deleteGameBtn').addEventListener('click', () => {
		if (!checkPermission('supprimer un jeu')) return;
		if (!confirm('Voulez-vous vraiment supprimer ce jeu ?')) return;
		
		const idx = games.findIndex(g => g.id === currentGameId);
		if (idx !== -1) {
			games.splice(idx, 1);
			if (save('tournoi_games', games)) {
				renderGames();
				gameModal.classList.remove('active');
				currentGameId = null;
			}
		}
	});

	closeAddModal.addEventListener('click', () => {
		addGameModal.classList.remove('active');
	});

	document.getElementById('cancelAddBtn').addEventListener('click', () => {
		addGameModal.classList.remove('active');
	});

	addGameModal.addEventListener('click', (e) => {
		if (e.target === addGameModal) {
			addGameModal.classList.remove('active');
		}
	});

	document.getElementById('saveGameBtn').addEventListener('click', () => {
		if (!checkPermission('sauvegarder un jeu')) return;

		const name = document.getElementById('formGameName').value.trim();
		const category = document.getElementById('formGameCategory').value;
		const difficulty = document.getElementById('formGameDifficulty').value;
		const description = document.getElementById('formGameDescription').value.trim();
		const date = document.getElementById('formGameDate').value;
		const time = document.getElementById('formGameTime').value;
		const timeEnd = document.getElementById('formGameTimeEnd').value.trim();
		const place = document.getElementById('formGamePlace').value.trim();
		const participants = document.getElementById('formGameParticipants').value.trim();

		if (!name || !date || !time || !place) {
			alert('Veuillez remplir au moins le nom, la date, l\'heure et le lieu');
			return;
		}

		const gameData = {
			name,
			category,
			difficulty,
			description,
			date,
			time,
			timeEnd,
			place,
			participants
		};

		if (currentGameId) {
			const idx = games.findIndex(g => g.id === currentGameId);
			if (idx !== -1) {
				games[idx] = { ...games[idx], ...gameData };
			}
		} else {
			gameData.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
			gameData.sessions = [];
			games.push(gameData);
		}

		if (save('tournoi_games', games)) {
			addGameModal.classList.remove('active');
			currentGameId = null;
			renderGames();
		}
	});

	// ====================================
	// SECTION CERTIFICATS
	// ====================================
	const certNom = document.getElementById('certNom');
	const certPrenom = document.getElementById('certPrenom');
	const certTexte = document.getElementById('certTexte');
	const certDate = document.getElementById('certDate');
	const certOrganisateur = document.getElementById('certOrganisateur');
	const previewName = document.getElementById('previewName');
	const previewText = document.getElementById('previewText');
	const previewDate = document.getElementById('previewDate');
	const previewOrg = document.getElementById('previewOrg');
	const updateCertBtn = document.getElementById('updateCertBtn');

	function updateCertificate() {
		const nom = certNom.value.trim();
		const prenom = certPrenom.value.trim();

		previewName.textContent = (prenom || nom) ? 
			(prenom + ' ' + nom).trim() : 'Nom Prénom';
		
		previewText.textContent = certTexte.value.trim() || 
			'a participé officiellement au tournoi de jeux de société';
		
		previewDate.textContent = certDate.value.trim() || 'À compléter';
		previewOrg.textContent = certOrganisateur.value.trim() || 'À compléter';
	}

	updateCertBtn.addEventListener('click', () => {
		if (!checkPermission('mettre à jour le certificat')) return;
		updateCertificate();
	});

	certNom.addEventListener('input', updateCertificate);
	certPrenom.addEventListener('input', updateCertificate);
	certTexte.addEventListener('input', updateCertificate);
	certDate.addEventListener('input', updateCertificate);
	certOrganisateur.addEventListener('input', updateCertificate);

	// ====================================
	// SÉCURITÉ HTML
	// ====================================
	function escapeHtml(str) {
		const text = String(str || '');
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return text.replace(/[&<>"']/g, char => map[char]);
	}

	// ====================================
	// INITIALISATION
	// ====================================
	renderTable();
	renderGames();
	updateCertificate();

	if (!localStorage.getItem('tournoi_joueurs')) {
		save('tournoi_joueurs', joueurs);
	}
	if (!localStorage.getItem('tournoi_games')) {
		save('tournoi_games', games);
	}

});
