# App-Web-gym

Structure actuelle du projet:

```
index.html
manifest.json
README.md
assets/
	css/
		tokens.css
		base.css
		components.css
		views.css
	html/
		partials/
			dashboard.html
			goals.html
			measurements.html
			settings.html
			workouts.html
	icons/
		android/
		ios/
		windows/
js/
	app.js
	charts.js
	forms.js
	partials.js
	pwa.js
	state.js
	ui.js
```
Responsabilites:

- HTML: structure de la page uniquement
- CSS: separe par couches (variables, base, composants, vues)
- JS: separe par modules fonctionnels (etat, rendu, formulaires, PWA, bootstrap)
