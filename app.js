// ====================================
// TOURNOI DE JEUX DE SOCIÉTÉ - APP.JS
// AVEC SYSTÈME DE SÉCURITÉ ET VOTES
// ====================================

document.addEventListener('DOMContentLoaded', async function() {

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

	// CORRECTION IMPORTANTE : Attendre que l'IP soit récupérée
	await getUserIP();

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
		{ nom: "Nicola", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Martine", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Natan", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Leuran", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Maéva", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Joéle", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Crisetine", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Luis", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Agnes", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Zoé", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Jade", prenom: "", victoires: 0, jeux: 0 },
		{ nom: "Camerone", prenom: "", victoires: 0, jeux: 0 },
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
		{
			id: "st5",
			name: "Dobble",
			category: "strategie",
			difficulty: "Facile",
			description: "Jeu d'observation et de rapidité. Trouvez le symbole identique !",
			date: "2026-02-23",
			time: "15:30",
			timeEnd: "16:00",
			place: "Salle B",
			participants: "2-8 joueurs",
			sessions: []
		},

		// PARTY GAMES
		{
			id: "pg1",
			name: "La Bonne Paye",
			category: "party",
			difficulty: "Facile",
			description: "Gérez votre budget et traversez le mois sans être à découvert !",
			date: "2026-02-24",
			time: "14:00",
			timeEnd: "15:30",
			place: "Salle A",
			participants: "2-6 joueurs",
			sessions: []
		},
		{
			id: "pg2",
			name: "Unanimo",
			category: "party",
			difficulty: "Facile",
			description: "Jeu d'ambiance ! Trouvez les mêmes réponses que les autres joueurs.",
			date: "2026-02-24",
			time: "16:00",
			timeEnd: "17:00",
			place: "Salle B",
			participants: "3-12 joueurs",
			sessions: []
		},
		{
			id: "pg3",
			name: "Molky",
			category: "party",
			difficulty: "Facile",
			description: "Jeu d'extérieur finlandais. Lancez et visez avec précision !",
			date: "2026-02-24",
			time: "17:30",
			timeEnd: "18:30",
			place: "Extérieur",
			participants: "2-6 joueurs",
			sessions: []
		},

		// COOPÉRATIF
		{
			id: "coop1",
			name: "Le Roi des Nains",
			category: "cooperatif",
			difficulty: "Moyen",
			description: "Jeu coopératif dans l'univers des nains. Travaillez ensemble pour gagner !",
			date: "2026-02-25",
			time: "14:00",
			timeEnd: "16:00",
			place: "Salle A",
			participants: "2-5 joueurs",
			sessions: []
		},
		{
			id: "coop2",
			name: "Pandemic",
			category: "cooperatif",
			difficulty: "Difficile",
			description: "Sauvez le monde des épidémies ! Jeu coopératif stratégique.",
			date: "2026-02-25",
			time: "16:30",
			timeEnd: "18:30",
			place: "Salle B",
			participants: "2-4 joueurs",
			sessions: []
		}
	];

	// ====================================
	// STOCKAGE LOCAL
	// ====================================
	function load(key, fallback) {
		try {
			const data = localStorage.getItem(key);
			return data ? JSON.parse(data) : fallback;
		} catch (e) {
			console.error('Erreur chargement', e);
			return fallback;
		}
	}

	function save(key, val) {
		try {
			localStorage.setItem(key, JSON.stringify(val));
			return true;
		} catch (e) {
			console.error('Erreur sauvegarde', e);
			alert('Impossible de sauvegarder. Vérifiez le stockage local.');
			return false;
		}
	}

	let joueurs = load('tournoi_joueurs', defaultPlayers);
	let games = load('tournoi_games', defaultGames);

	// ====================================
	// SECTION CLASSEMENT
	// ====================================
	const tbody = document.getElementById('tbody');
	const searchInput = document.getElementById('searchInput');
	const sortOptions = document.getElementById('sortOptions');
	const addPlayerBtn = document.getElementById('addPlayerBtn');

	function renderTable(filter = '', sortBy = 'rank') {
		let list = joueurs.slice();

		if (filter) {
			const lower = filter.toLowerCase();
			list = list.filter(p => 
				(p.nom && p.nom.toLowerCase().includes(lower)) || 
				(p.prenom && p.prenom.toLowerCase().includes(lower))
			);
		}

		if (sortBy === 'rank') {
			list.sort((a, b) => {
				const ratioA = a.jeux > 0 ? a.victoires / a.jeux : 0;
				const ratioB = b.jeux > 0 ? b.victoires / b.jeux : 0;
				if (ratioB !== ratioA) return ratioB - ratioA;
				return b.victoires - a.victoires;
			});
		} else if (sortBy === 'name') {
			list.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
		} else if (sortBy === 'victories') {
			list.sort((a, b) => b.victoires - a.victoires);
		} else if (sortBy === 'games') {
			list.sort((a, b) => b.jeux - a.jeux);
		}

		tbody.innerHTML = '';
		list.forEach((p, i) => {
			const ratio = p.jeux > 0 ? ((p.victoires / p.jeux) * 100).toFixed(0) : 0;
			const tr = document.createElement('tr');

			let medal = '';
			if (sortBy === 'rank') {
				if (i === 0) medal = '🥇';
				else if (i === 1) medal = '🥈';
				else if (i === 2) medal = '🥉';
			}

			tr.innerHTML = `
				<td>${medal} ${i + 1}</td>
				<td class="name-cell">${escapeHtml((p.prenom || '') + ' ' + (p.nom || '')).trim()}</td>
				<td>${p.victoires}</td>
				<td>${p.jeux}</td>
				<td>
					<div class="progress-bar">
						<div class="progress-fill" style="width:${ratio}%"></div>
					</div>
					<span class="small">${ratio}%</span>
				</td>
				<td>
					<button class="btn btn-sm" onclick="editPlayer(${i})">✏️</button>
					<button class="btn btn-sm btn-danger" onclick="deletePlayer(${i})">🗑️</button>
				</td>
			`;
			tbody.appendChild(tr);
		});
	}

	searchInput.addEventListener('input', () => {
		renderTable(searchInput.value, sortOptions.value);
	});

	sortOptions.addEventListener('change', () => {
		renderTable(searchInput.value, sortOptions.value);
	});

	window.editPlayer = function(index) {
		if (!checkPermission('éditer un joueur')) return;

		const p = joueurs[index];
		const newNom = prompt("Modifier le nom:", p.nom);
		const newPrenom = prompt("Modifier le prénom:", p.prenom);
		const newVictoires = parseInt(prompt("Modifier les victoires:", p.victoires), 10);
		const newJeux = parseInt(prompt("Modifier les jeux joués:", p.jeux), 10);

		if (newNom !== null) p.nom = newNom.trim();
		if (newPrenom !== null) p.prenom = newPrenom.trim();
		if (!isNaN(newVictoires) && newVictoires >= 0) p.victoires = newVictoires;
		if (!isNaN(newJeux) && newJeux >= 0) p.jeux = newJeux;

		if (save('tournoi_joueurs', joueurs)) {
			renderTable(searchInput.value, sortOptions.value);
		}
	};

	window.deletePlayer = function(index) {
		if (!checkPermission('supprimer un joueur')) return;
		if (!confirm('Voulez-vous vraiment supprimer ce joueur ?')) return;
		
		joueurs.splice(index, 1);
		if (save('tournoi_joueurs', joueurs)) {
			renderTable(searchInput.value, sortOptions.value);
		}
	};

	addPlayerBtn.addEventListener('click', () => {
		if (!checkPermission('ajouter un joueur')) return;

		const nom = prompt("Nom du nouveau joueur:");
		const prenom = prompt("Prénom du nouveau joueur:");
		if (!nom && !prenom) return;

		joueurs.push({
			nom: (nom || '').trim(),
			prenom: (prenom || '').trim(),
			victoires: 0,
			jeux: 0
		});

		if (save('tournoi_joueurs', joueurs)) {
			renderTable(searchInput.value, sortOptions.value);
		}
	});

	// ====================================
	// SECTION JEUX
	// ====================================
	const gamesGrid = document.getElementById('gamesGrid');
	const categoryFilter = document.getElementById('categoryFilter');
	const difficultyFilter = document.getElementById('difficultyFilter');
	const gameSearchInput = document.getElementById('gameSearchInput');
	const addGameBtn = document.getElementById('addGameBtn');
	const gameModal = document.getElementById('gameModal');
	const addGameModal = document.getElementById('addGameModal');
	const closeModal = document.getElementById('closeModal');
	const closeAddModal = document.getElementById('closeAddModal');
	let currentGameId = null;

	const categoryIcons = {
		aventure: '🗺️',
		strategie: '♟️',
		party: '🎉',
		cooperatif: '🤝'
	};

	const difficultyColors = {
		'Facile': '#10b981',
		'Moyen': '#f59e0b',
		'Difficile': '#ef4444'
	};

	function renderGames() {
		const category = categoryFilter.value;
		const difficulty = difficultyFilter.value;
		const search = gameSearchInput.value.toLowerCase();

		let filtered = games.filter(g => {
			const matchCategory = !category || g.category === category;
			const matchDifficulty = !difficulty || g.difficulty === difficulty;
			const matchSearch = !search || g.name.toLowerCase().includes(search);
			return matchCategory && matchDifficulty && matchSearch;
		});

		filtered.sort((a, b) => {
			const dateA = new Date(a.date + ' ' + a.time);
			const dateB = new Date(b.date + ' ' + b.time);
			return dateA - dateB;
		});

		gamesGrid.innerHTML = '';

		if (filtered.length === 0) {
			gamesGrid.innerHTML = '<div class="no-games">Aucun jeu trouvé</div>';
			return;
		}

		filtered.forEach(game => {
			const card = document.createElement('div');
			card.className = 'game-card';
			card.style.borderLeft = `4px solid ${difficultyColors[game.difficulty] || '#6b7280'}`;

			const icon = categoryIcons[game.category] || '🎮';
			const sessionsCount = game.sessions ? game.sessions.length : 0;
			const totalVotes = game.sessions ? game.sessions.reduce((sum, s) => sum + (s.votes || 0), 0) : 0;

			card.innerHTML = `
				<div class="game-header">
					<h3>${icon} ${escapeHtml(game.name)}</h3>
					<span class="difficulty-badge" style="background: ${difficultyColors[game.difficulty] || '#6b7280'}">${escapeHtml(game.difficulty)}</span>
				</div>
				<p class="game-description">${escapeHtml(game.description)}</p>
				<div class="game-info">
					<div class="info-item">
						<strong>📅 Date:</strong> ${escapeHtml(game.date)}
					</div>
					<div class="info-item">
						<strong>🕐 Heure:</strong> ${escapeHtml(game.time)}${game.timeEnd ? ' - ' + escapeHtml(game.timeEnd) : ''}
					</div>
					<div class="info-item">
						<strong>📍 Lieu:</strong> ${escapeHtml(game.place)}
					</div>
					<div class="info-item">
						<strong>👥 Participants:</strong> ${escapeHtml(game.participants)}
					</div>
					<div class="info-item sessions-count">
						<strong>🎮 Sessions jouées:</strong> ${sessionsCount} (${totalVotes} votes)
					</div>
				</div>
				<button class="btn btn-primary" onclick="openGameModal('${game.id}')">
					Voir détails
				</button>
			`;

			gamesGrid.appendChild(card);
		});
	}

	categoryFilter.addEventListener('change', renderGames);
	difficultyFilter.addEventListener('change', renderGames);
	gameSearchInput.addEventListener('input', renderGames);

	window.openGameModal = function(gameId) {
		currentGameId = gameId;
		const game = games.find(g => g.id === gameId);
		if (!game) return;

		document.getElementById('modalGameName').textContent = game.name;
		document.getElementById('modalGameCategory').textContent = categoryIcons[game.category] + ' ' + 
			game.category.charAt(0).toUpperCase() + game.category.slice(1);
		document.getElementById('modalGameDifficulty').textContent = game.difficulty;
		document.getElementById('modalGameDifficulty').style.background = difficultyColors[game.difficulty] || '#6b7280';
		document.getElementById('modalGameDescription').textContent = game.description;
		document.getElementById('modalGameDate').textContent = game.date;
		document.getElementById('modalGameTime').textContent = game.time + (game.timeEnd ? ' - ' + game.timeEnd : '');
		document.getElementById('modalGamePlace').textContent = game.place;
		document.getElementById('modalGameParticipants').textContent = game.participants;

		const sessionsDiv = document.getElementById('modalGameSessions');
		
		if (game.sessions && game.sessions.length > 0) {
			sessionsDiv.innerHTML = '<h4 style="margin-top:0;">📊 Historique des sessions</h4>';
			
			game.sessions.forEach((session, index) => {
				const sessionCard = document.createElement('div');
				sessionCard.className = 'session-card';
				sessionCard.innerHTML = `
					<div style="display:flex;justify-content:space-between;align-items:center;">
						<div>
							<strong>📅 ${escapeHtml(session.date)}</strong> à <strong>🕐 ${escapeHtml(session.time)}</strong>
							<br>
							<span class="small muted">👥 ${session.votes || 1} vote(s)</span>
						</div>
						${isAuthorized ? `<button class="btn btn-sm btn-danger" onclick="removeSession('${game.id}', ${index})">🗑️</button>` : ''}
					</div>
				`;
				sessionsDiv.appendChild(sessionCard);
			});
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
		// CORRECTION : Vérifier que l'IP est disponible
		if (!userIP) {
			alert('⚠️ Erreur : Impossible de détecter votre IP. Veuillez rafraîchir la page.');
			return;
		}

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
