// ====================================
// TOURNOI DE JEUX DE SOCIÉTÉ - APP.JS
// VERSION : CODE ADMIN + JEUX CORRIGÉS
// ====================================

document.addEventListener('DOMContentLoaded', function() {

	// ====================================
	// SYSTÈME DE SÉCURITÉ PAR CODE ADMIN
	// ====================================
	
	const ADMIN_CODE = "ADIN274fr"; // MODIFIE TON CODE ICI
	let isAuthorized = false;

	// Création du bouton de connexion Admin (flottant en bas à droite)
	function setupAdminAuth() {
		const authBtn = document.createElement('button');
		authBtn.id = 'admin-login-btn';
		authBtn.innerHTML = "🔒 Accès Admin";
		authBtn.style.cssText = `
			position: fixed;
			bottom: 20px;
			right: 20px;
			padding: 14px 24px;
			border-radius: 50px;
			background: #3b82f6;
			color: white;
			border: none;
			font-weight: 700;
			cursor: pointer;
			box-shadow: 0 10px 25px rgba(0,0,0,0.4);
			z-index: 1000;
			transition: all 0.3s ease;
			font-size: 0.95rem;
		`;
		
		authBtn.addEventListener('click', () => {
			if (isAuthorized) {
				isAuthorized = false;
				alert("Déconnexion réussie. Mode visiteur activé.");
				location.reload();
			} else {
				const pass = prompt("Entrez le code secret pour modifier les scores :");
				if (pass === ADMIN_CODE) {
					isAuthorized = true;
					alert("🔓 Accès accordé ! Vous pouvez maintenant gérer le tournoi.");
					updateUIPermissions();
					authBtn.innerHTML = "🔓 Quitter Admin";
					authBtn.style.background = "#ef4444";
				} else {
					alert("❌ Code incorrect.");
				}
			}
		});
		
		authBtn.addEventListener('mouseenter', () => {
			if (!isAuthorized) {
				authBtn.style.transform = 'translateY(-3px)';
				authBtn.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5)';
			}
		});
		
		authBtn.addEventListener('mouseleave', () => {
			authBtn.style.transform = 'translateY(0)';
			authBtn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
		});
		
		document.body.appendChild(authBtn);
	}

	function updateUIPermissions() {
		const editButtons = [
			'addPlayerBtn', 'addGameBtn', 'saveGameBtn', 
			'editGameBtn', 'deleteGameBtn', 'updateCertBtn'
		];
		
		editButtons.forEach(id => {
			const btn = document.getElementById(id);
			if (btn) {
				btn.disabled = !isAuthorized;
				btn.style.opacity = isAuthorized ? '1' : '0.5';
				btn.style.cursor = isAuthorized ? 'pointer' : 'not-allowed';
				btn.title = isAuthorized ? '' : 'Accès réservé à l\'administrateur';
			}
		});

		const inputs = document.querySelectorAll('input:not(#searchInput):not(#gameSearch), textarea, select:not(#sortSelect)');
		inputs.forEach(input => {
			input.disabled = !isAuthorized;
			input.style.opacity = isAuthorized ? '1' : '0.6';
		});
	}

	function checkPermission(actionName) {
		if (!isAuthorized) {
			alert(`🔒 Action refusée !\n\nVous devez être en mode Admin pour ${actionName}.`);
			return false;
		}
		return true;
	}

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
	// DONNÉES - INVITÉS (LISTE MISE À JOUR)
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
	// DONNÉES - JEUX (LISTE COMPLÈTE)
	// ====================================
	const defaultGames = [
		// AVENTURE
		{ id: "av1", name: "Jumanji", category: "aventure", difficulty: "Difficile", description: "Survivez aux dangers de la jungle.", date: "2026-02-20", time: "14:00", place: "Table A", participants: "2-4", sessions: [] },
		{ id: "av2", name: "Les Aventuriers du Rail Express", category: "aventure", difficulty: "Facile", description: "Construisez vos rails le plus vite possible.", date: "2026-02-20", time: "15:00", place: "Table B", participants: "2-4", sessions: [] },
		{ id: "av3", name: "Goblivion", category: "aventure", difficulty: "Difficile", description: "Défendez votre royaume.", date: "2026-02-20", time: "16:00", place: "Table A", participants: "1-2", sessions: [] },
		{ id: "av4", name: "Loup-Garou", category: "aventure", difficulty: "Difficile", description: "Le célèbre jeu de bluff.", date: "2026-02-20", time: "21:00", place: "Salon", participants: "8-15", sessions: [] },

		// STRATÉGIE
		{ id: "st1", name: "Cluedo", category: "strategie", difficulty: "Facile", description: "Trouvez le coupable.", date: "2026-02-21", time: "14:00", place: "Table A", participants: "3-6", sessions: [] },
		{ id: "st2", name: "Puissance 4", category: "strategie", difficulty: "Facile", description: "Alignez 4 jetons.", date: "2026-02-21", time: "15:00", place: "Table B", participants: "2", sessions: [] },
		{ id: "st3", name: "Ligretto", category: "strategie", difficulty: "Facile", description: "Rapidité et cartes.", date: "2026-02-21", time: "15:30", place: "Table B", participants: "2-4", sessions: [] },
		{ id: "st4", name: "Skyjo", category: "strategie", difficulty: "Facile", description: "Minimisez vos points.", date: "2026-02-21", time: "16:00", place: "Table A", participants: "2-8", sessions: [] },
		{ id: "st5", name: "Dominos", category: "strategie", difficulty: "Facile", description: "NA.", date: "2026-02-21", time: "16:00", place: "Table A", participants: "2-8", sessions: [] },


		// CULTURE
		{ id: "cu1", name: "Quiz des garçons", category: "culture", difficulty: "Facile", description: "Testez votre culture.", date: "2026-02-22", time: "14:00", place: "Salon", participants: "2-10", sessions: [] },
		{ id: "cu2", name: "Dobble", category: "culture", difficulty: "Facile", description: "Observation rapide.", date: "2026-02-22", time: "14:30", place: "Table B", participants: "2-8", sessions: [] },
		{ id: "cu3", name: "Journal d'un Boob", category: "culture", difficulty: "Facile", description: "Inspiré de l'univers Minecraft.", date: "2026-02-22", time: "15:00", place: "Table A", participants: "2-4", sessions: [] },
		{ id: "cu4", name: "Color", category: "culture", difficulty: "Facile", description: "Jeu de couleurs.", date: "2026-02-22", time: "15:30", place: "Table B", participants: "2-6", sessions: [] },

		// JEUX VIDÉO / MINI-JEUX
		{ id: "jv1", name: "Traite le lait", category: "jeux-video", difficulty: "Facile", description: "Mini-jeu de ferme.", date: "2026-02-23", time: "14:00", place: "Écran", participants: "2", sessions: [] },
		{ id: "jv2", name: "Tennis de table", category: "jeux-video", difficulty: "Facile", description: "Match de ping-pong.", date: "2026-02-23", time: "14:30", place: "Écran", participants: "2", sessions: [] },
		{ id: "jv3", name: "Danse miroir", category: "jeux-video", difficulty: "Facile", description: "Suivez le rythme.", date: "2026-02-23", time: "15:00", place: "Écran", participants: "1-4", sessions: [] },
		{ id: "jv4", name: "Duel au pistolet", category: "jeux-video", difficulty: "Difficile", description: "Dégainez le premier.", date: "2026-02-23", time: "15:30", place: "Écran", participants: "2", sessions: [] },
		{ id: "jv5", name: "Entraînement samouraï", category: "jeux-video", difficulty: "Difficile", description: "Tranchez les cibles.", date: "2026-02-23", time: "16:00", place: "Écran", participants: "1-2", sessions: [] },
		{ id: "jv6", name: "Combat à l'épée", category: "jeux-video", difficulty: "Difficile", description: "Battez l'adversaire.", date: "2026-02-23", time: "16:30", place: "Écran", participants: "2", sessions: [] },
		{ id: "jv7", name: "Duel magique", category: "jeux-video", difficulty: "Facile", description: "Magie et réflexes.", date: "2026-02-24", time: "14:00", place: "Écran", participants: "2", sessions: [] },
		{ id: "jv8", name: "Combat de gélatiteur", category: "jeux-video", difficulty: "Facile", description: "Combat de gelée.", date: "2026-02-24", time: "14:30", place: "Écran", participants: "2-4", sessions: [] },
		{ id: "jv9", name: "Coffre-fort", category: "jeux-video", difficulty: "Difficile", description: "Décryptez le code.", date: "2026-02-24", time: "15:00", place: "Écran", participants: "1-2", sessions: [] },
		{ id: "jv10", name: "Coffre au trésor", category: "jeux-video", difficulty: "Facile", description: "Pillez le trésor.", date: "2026-02-24", time: "15:30", place: "Écran", participants: "1-4", sessions: [] },
		{ id: "jv11", name: "Chercher un objet", category: "jeux-video", difficulty: "Facile", description: "Observation.", date: "2026-02-24", time: "16:00", place: "Écran", participants: "1-4", sessions: [] },
		{ id: "jv12", name: "Table tournante", category: "jeux-video", difficulty: "Facile", description: "Gardez l'équilibre.", date: "2026-02-24", time: "16:30", place: "Écran", participants: "2-4", sessions: [] }
	];

	// ====================================
	// LOGIQUE DE STOCKAGE
	// ====================================
	function load(key, fallback) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : fallback;
		} catch (e) {
			console.error('Erreur de chargement:', e);
			return fallback;
		}
	}

	function save(key, val) {
		try {
			localStorage.setItem(key, JSON.stringify(val));
			return true;
		} catch (e) {
			console.error('Erreur de sauvegarde:', e);
			return false;
		}
	}

	let joueurs = load('tournoi_joueurs', defaultPlayers);
	let games = load('tournoi_games', defaultGames);

	// ====================================
	// GESTION DU CLASSEMENT
	// ====================================
	const tbody = document.querySelector("#classementTable tbody");
	const searchInput = document.getElementById("searchInput");
	const sortSelect = document.getElementById("sortSelect");
	const countPlayers = document.getElementById("countPlayers");

	function renderTable() {
		if (!tbody) return;
		tbody.innerHTML = "";
		let list = [...joueurs];

		// Recherche
		const query = searchInput.value.trim().toLowerCase();
		if (query) {
			list = list.filter(j => j.nom.toLowerCase().includes(query));
		}

		// Tri
		const sort = sortSelect.value;
		if (sort === 'victoires_desc') list.sort((a, b) => b.victoires - a.victoires);
		else if (sort === 'victoires_asc') list.sort((a, b) => a.victoires - b.victoires);
		else if (sort === 'nom_asc') list.sort((a, b) => a.nom.localeCompare(b.nom));

		list.forEach((j, i) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td class="rank">${i + 1}</td>
				<td><strong>${escapeHtml(j.nom)}</strong></td>
				<td>${escapeHtml(j.prenom || '-')}</td>
				<td><span class="badge-score">${j.victoires}</span></td>
				<td>${j.jeux}</td>
			`;
			tbody.appendChild(tr);
		});

		if (countPlayers) countPlayers.textContent = joueurs.length;
	}

	// ====================================
	// GESTION DES JEUX
	// ====================================
	const gamesGrid = document.getElementById('gamesGrid');
	const gameSearch = document.getElementById('gameSearch');
	const categoryButtons = document.querySelectorAll('.category-btn');

	function renderGames() {
		if (!gamesGrid) return;
		gamesGrid.innerHTML = '';
		let list = [...games];

		// Filtre catégorie
		const activeCat = document.querySelector('.category-btn.active').dataset.category;
		if (activeCat !== 'all') {
			list = list.filter(g => g.category === activeCat);
		}

		// Recherche
		const query = gameSearch.value.trim().toLowerCase();
		if (query) {
			list = list.filter(g => g.name.toLowerCase().includes(query));
		}

		if (list.length === 0) {
			gamesGrid.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">Aucun jeu trouvé</p>';
			return;
		}

		// Afficher le nombre de jeux
		const gameCountDiv = document.createElement('div');
		gameCountDiv.style.cssText = 'text-align: center; margin-bottom: 20px; color: var(--primary-light); font-weight: 600;';
		gameCountDiv.innerHTML = `📊 ${list.length} jeu${list.length > 1 ? 'x' : ''} affiché${list.length > 1 ? 's' : ''} (Total: ${games.length})`;
		gamesGrid.parentElement.insertBefore(gameCountDiv, gamesGrid);

		// Supprimer l'ancien compteur s'il existe
		const oldCounter = gamesGrid.parentElement.querySelector('div[style*="text-align: center"]');
		if (oldCounter && oldCounter !== gameCountDiv) {
			oldCounter.remove();
		}

		list.forEach(game => {
			const difficultyClass = game.difficulty === 'Difficile' ? 'diff-hard' : 'diff-easy';
			const card = document.createElement('div');
			card.className = 'game-card';
			card.innerHTML = `
				<div class="game-card-header">
					<div class="game-card-title">${escapeHtml(game.name)}</div>
					<span class="difficulty-badge ${difficultyClass}">${game.difficulty}</span>
				</div>
				<p class="muted">${escapeHtml(game.description)}</p>
				<div class="game-card-info">
					<span>📍 ${escapeHtml(game.place)}</span>
					<span>👥 ${game.participants}</span>
				</div>
			`;
			card.onclick = () => showGameDetails(game);
			gamesGrid.appendChild(card);
		});
	}

	function showGameDetails(game) {
		alert(`🎮 ${game.name}\n\n📁 Catégorie : ${getCategoryName(game.category)}\n⚡ Difficulté : ${game.difficulty}\n👥 Joueurs : ${game.participants}\n📍 Lieu : ${game.place}\n\n${game.description}\n\nPréparez-vous à jouer !`);
	}

	function getCategoryName(cat) {
		const names = {
			'aventure': 'Aventure',
			'strategie': 'Stratégie',
			'culture': 'Culture',
			'jeux-video': 'Jeux Vidéo'
		};
		return names[cat] || cat;
	}

	// ====================================
	// GESTION DES CERTIFICATS
	// ====================================
	const updateCertBtn = document.getElementById('updateCertBtn');
	const certNom = document.getElementById('certNom');
	const certTexte = document.getElementById('certTexte');
	const previewName = document.getElementById('previewName');
	const previewText = document.getElementById('previewText');

	if (updateCertBtn) {
		updateCertBtn.addEventListener('click', () => {
			if (!checkPermission("générer un certificat")) return;
			
			const nom = certNom.value.trim() || "Nom du Joueur";
			const texte = certTexte.value.trim() || "a participé au tournoi";
			
			previewName.textContent = nom;
			previewText.textContent = texte;
			
			alert("✅ Certificat mis à jour !\n\nVous pouvez maintenant l'imprimer ou le capturer.");
		});
	}

	// ====================================
	// GESTION DES JOUEURS (ADMIN)
	// ====================================
	const addPlayerBtn = document.getElementById('addPlayerBtn');
	const newNom = document.getElementById('newNom');
	const newVictoires = document.getElementById('newVictoires');
	const newJeux = document.getElementById('newJeux');

	if (addPlayerBtn) {
		addPlayerBtn.addEventListener('click', () => {
			if (!checkPermission("mettre à jour les scores")) return;

			const nom = newNom.value.trim();
			const victoires = parseInt(newVictoires.value) || 0;
			const jeux = parseInt(newJeux.value) || 0;

			if (!nom) {
				alert("❌ Veuillez entrer un nom.");
				return;
			}

			// Chercher si le joueur existe déjà
			const existingPlayer = joueurs.find(j => j.nom.toLowerCase() === nom.toLowerCase());

			if (existingPlayer) {
				// Mettre à jour
				existingPlayer.victoires = victoires;
				existingPlayer.jeux = jeux;
				alert(`✅ Score mis à jour pour ${nom} !\n\nVictoires : ${victoires}\nJeux joués : ${jeux}`);
			} else {
				// Ajouter nouveau joueur
				joueurs.push({ nom, prenom: "", victoires, jeux });
				alert(`✅ Nouveau joueur ajouté : ${nom} !`);
			}

			save('tournoi_joueurs', joueurs);
			renderTable();

			// Réinitialiser les champs
			newNom.value = '';
			newVictoires.value = '';
			newJeux.value = '';
		});
	}

	// Event Listeners
	if (searchInput) searchInput.addEventListener('input', renderTable);
	if (sortSelect) sortSelect.addEventListener('change', renderTable);
	if (gameSearch) gameSearch.addEventListener('input', renderGames);
	
	const resetGamesBtn = document.getElementById('resetGamesBtn');
	if (resetGamesBtn) {
		resetGamesBtn.addEventListener('click', resetGames);
	}
	
	const syncBtn = document.getElementById('syncBtn');
	if (syncBtn) {
		syncBtn.addEventListener('click', syncData);
	}
	
	categoryButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			categoryButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			renderGames();
		});
	});

	// ====================================
	// SÉCURITÉ HTML & INITIALISATION
	// ====================================
	function escapeHtml(str) {
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return String(str).replace(/[&<>"']/g, s => map[s]);
	}

	// ====================================
	// SYSTÈME DE SYNCHRONISATION PAR QR CODE
	// ====================================
	
	// Générer un identifiant unique pour cette session
	const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
	
	// Fonction pour exporter les données
	function exportData() {
		const data = {
			joueurs: joueurs,
			games: games,
			timestamp: new Date().toISOString(),
			sessionId: sessionId
		};
		return JSON.stringify(data);
	}
	
	// Fonction pour importer les données
	function importData(jsonString) {
		try {
			const data = JSON.parse(jsonString);
			
			if (!data.joueurs || !data.games) {
				throw new Error('Format de données invalide');
			}
			
			joueurs = data.joueurs;
			games = data.games;
			
			save('tournoi_joueurs', joueurs);
			save('tournoi_games', games);
			
			renderTable();
			renderGames();
			
			return true;
		} catch (e) {
			console.error('Erreur d\'import:', e);
			return false;
		}
	}
	
	// Fonction pour générer un QR Code
	function generateQRCode() {
		const data = exportData();
		
		// Créer une modal pour afficher le QR Code
		const modal = document.createElement('div');
		modal.style.cssText = `
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.9);
			backdrop-filter: blur(5px);
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
		`;
		
		const content = document.createElement('div');
		content.style.cssText = `
			background: white;
			padding: 40px;
			border-radius: 20px;
			text-align: center;
			max-width: 500px;
			width: 100%;
			box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
		`;
		
		content.innerHTML = `
			<h2 style="color: #0f172a; margin-bottom: 10px; font-size: 1.5rem;">📱 Scannez pour synchroniser</h2>
			<p style="color: #64748b; margin-bottom: 30px;">Les autres appareils peuvent scanner ce QR code pour recevoir les données</p>
			<div id="qrcode" style="display: flex; justify-content: center; margin-bottom: 30px;"></div>
			<div style="background: #f1f5f9; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
				<p style="color: #0f172a; font-weight: 600; margin-bottom: 5px;">📊 Contenu :</p>
				<p style="color: #64748b; font-size: 0.9rem;">👥 ${joueurs.length} joueurs • 🎮 ${games.length} jeux</p>
			</div>
			<button id="closeQRModal" style="
				padding: 12px 30px;
				background: #3b82f6;
				color: white;
				border: none;
				border-radius: 10px;
				font-weight: 600;
				cursor: pointer;
				font-size: 1rem;
			">Fermer</button>
		`;
		
		modal.appendChild(content);
		document.body.appendChild(modal);
		
		// Générer le QR Code
		new QRCode(document.getElementById("qrcode"), {
			text: data,
			width: 280,
			height: 280,
			colorDark: "#0f172a",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.L
		});
		
		// Fermer la modal
		document.getElementById('closeQRModal').addEventListener('click', () => {
			document.body.removeChild(modal);
		});
		
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
			}
		});
	}
	
	// Fonction pour scanner un QR Code
	function scanQRCode() {
		// Créer une modal pour l'import
		const modal = document.createElement('div');
		modal.style.cssText = `
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.9);
			backdrop-filter: blur(5px);
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
		`;
		
		const content = document.createElement('div');
		content.style.cssText = `
			background: white;
			padding: 40px;
			border-radius: 20px;
			text-align: center;
			max-width: 500px;
			width: 100%;
			box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
		`;
		
		content.innerHTML = `
			<h2 style="color: #0f172a; margin-bottom: 10px; font-size: 1.5rem;">📥 Importer les données</h2>
			<p style="color: #64748b; margin-bottom: 20px;">Collez le code de synchronisation obtenu en scannant le QR code</p>
			
			<textarea id="importData" placeholder="Collez le code ici..." style="
				width: 100%;
				height: 150px;
				padding: 15px;
				border: 2px solid #e2e8f0;
				border-radius: 10px;
				font-family: monospace;
				font-size: 0.85rem;
				margin-bottom: 20px;
				resize: vertical;
			"></textarea>
			
			<div style="display: flex; gap: 10px; justify-content: center;">
				<button id="importBtn" style="
					padding: 12px 30px;
					background: #10b981;
					color: white;
					border: none;
					border-radius: 10px;
					font-weight: 600;
					cursor: pointer;
					font-size: 1rem;
				">✅ Importer</button>
				<button id="cancelImportBtn" style="
					padding: 12px 30px;
					background: #64748b;
					color: white;
					border: none;
					border-radius: 10px;
					font-weight: 600;
					cursor: pointer;
					font-size: 1rem;
				">Annuler</button>
			</div>
		`;
		
		modal.appendChild(content);
		document.body.appendChild(modal);
		
		// Import
		document.getElementById('importBtn').addEventListener('click', () => {
			const data = document.getElementById('importData').value.trim();
			if (data) {
				if (importData(data)) {
					document.body.removeChild(modal);
					alert(
						"✅ SYNCHRONISATION RÉUSSIE !\n\n" +
						`👥 ${joueurs.length} joueurs synchronisés\n` +
						`🎮 ${games.length} jeux synchronisés\n\n` +
						"Les données sont maintenant à jour !"
					);
				} else {
					alert(
						"❌ ERREUR DE SYNCHRONISATION\n\n" +
						"Le code fourni est invalide ou corrompu.\n\n" +
						"Vérifiez que vous avez copié le code complet."
					);
				}
			}
		});
		
		// Annuler
		document.getElementById('cancelImportBtn').addEventListener('click', () => {
			document.body.removeChild(modal);
		});
		
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
			}
		});
	}
	
	// Fonction de synchronisation principale
	function syncData() {
		// Créer une modal de choix
		const modal = document.createElement('div');
		modal.style.cssText = `
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.9);
			backdrop-filter: blur(5px);
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
		`;
		
		const content = document.createElement('div');
		content.style.cssText = `
			background: white;
			padding: 40px;
			border-radius: 20px;
			text-align: center;
			max-width: 500px;
			width: 100%;
			box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
		`;
		
		content.innerHTML = `
			<h2 style="color: #0f172a; margin-bottom: 10px; font-size: 1.8rem;">🔄 Synchronisation</h2>
			<p style="color: #64748b; margin-bottom: 30px;">Choisissez une option pour synchroniser les données</p>
			
			<div style="display: grid; gap: 15px; margin-bottom: 20px;">
				<button id="generateQR" style="
					padding: 20px;
					background: linear-gradient(135deg, #3b82f6, #2563eb);
					color: white;
					border: none;
					border-radius: 12px;
					font-weight: 600;
					cursor: pointer;
					font-size: 1.1rem;
					transition: transform 0.2s;
				">
					📱 Générer un QR Code<br>
					<span style="font-size: 0.85rem; opacity: 0.9;">Partagez vos données</span>
				</button>
				
				<button id="scanQR" style="
					padding: 20px;
					background: linear-gradient(135deg, #10b981, #059669);
					color: white;
					border: none;
					border-radius: 12px;
					font-weight: 600;
					cursor: pointer;
					font-size: 1.1rem;
					transition: transform 0.2s;
				">
					📥 Importer des données<br>
					<span style="font-size: 0.85rem; opacity: 0.9;">Après avoir scanné un QR code</span>
				</button>
			</div>
			
			<button id="closeSyncModal" style="
				padding: 10px 20px;
				background: transparent;
				color: #64748b;
				border: 1px solid #e2e8f0;
				border-radius: 8px;
				font-weight: 600;
				cursor: pointer;
			">Annuler</button>
		`;
		
		modal.appendChild(content);
		document.body.appendChild(modal);
		
		// Ajouter les effets hover
		const buttons = content.querySelectorAll('button[id^="generate"], button[id^="scan"]');
		buttons.forEach(btn => {
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'translateY(-3px)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'translateY(0)';
			});
		});
		
		// Actions
		document.getElementById('generateQR').addEventListener('click', () => {
			document.body.removeChild(modal);
			generateQRCode();
		});
		
		document.getElementById('scanQR').addEventListener('click', () => {
			document.body.removeChild(modal);
			scanQRCode();
		});
		
		document.getElementById('closeSyncModal').addEventListener('click', () => {
			document.body.removeChild(modal);
		});
		
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
			}
		});
	}
	
	// Rendre la fonction accessible globalement
	window.syncData = syncData;
	window.generateQRCode = generateQRCode;
	window.scanQRCode = scanQRCode;
	window.exportData = exportData;
	window.importData = importData;

	// ====================================
	// FONCTION DE RÉINITIALISATION
	// ====================================
	function resetGames() {
		if (confirm('⚠️ ATTENTION !\n\nCette action va réinitialiser la liste des jeux avec les 24 jeux par défaut.\n\nVoulez-vous continuer ?')) {
			games = [...defaultGames];
			save('tournoi_games', games);
			renderGames();
			alert(`✅ Réinitialisation réussie !\n\n${games.length} jeux ont été chargés.`);
			console.log('Jeux réinitialisés:', games.length);
		}
	}

	function resetPlayers() {
		if (confirm('⚠️ ATTENTION !\n\nCette action va réinitialiser tous les scores des joueurs.\n\nVoulez-vous continuer ?')) {
			joueurs = [...defaultPlayers];
			save('tournoi_joueurs', joueurs);
			renderTable();
			alert(`✅ Scores réinitialisés !\n\n${joueurs.length} joueurs réinitialisés.`);
		}
	}

	// Ajouter les boutons de réinitialisation en console
	window.resetGames = resetGames;
	window.resetPlayers = resetPlayers;

	// Initialisation
	setupAdminAuth();
	updateUIPermissions();
	renderTable();
	renderGames();

	// Vérification automatique du nombre de jeux
	if (games.length < 24) {
		console.warn(`⚠️ ATTENTION : Seulement ${games.length} jeux chargés au lieu de 24 !`);
		console.log('%c🔧 Pour corriger, tapez: resetGames()', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
	}

	// Message de bienvenue en console
	console.log('%c🏆 Tournoi de Jeux de Société', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
	console.log('%cSystème chargé avec succès !', 'color: #10b981; font-size: 14px;');
	console.log(`Joueurs : ${joueurs.length} | Jeux : ${games.length}`);
	console.log('%c📝 Commandes disponibles:', 'color: #3b82f6; font-weight: bold;');
	console.log('  - syncData() : Synchroniser les données entre appareils');
	console.log('  - resetGames() : Réinitialiser les jeux (charger les 24 jeux)');
	console.log('  - resetPlayers() : Réinitialiser les scores');

});
