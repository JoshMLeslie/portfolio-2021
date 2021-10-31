const routes = [
	{path: '/'},
	{path: '/angular'},
	{path: '/react'}
];

const pathToRegex = (path) =>
	new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = (match) => {
	const values = match.result.slice(1);
	const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
		(result) => result[1]
	);

	return Object.fromEntries(
		keys.map((key, i) => {
			return [key, values[i]];
		})
	);
};

const router = async () => {
	const potentialMatches = routes.map((route) => {
		return {
			route,
			result: location.pathname.match(pathToRegex(route.path)),
		};
	});

	let match = potentialMatches.find(
		(potentialMatch) => potentialMatch.result !== null
	);

	/* Route not found - return first route OR a specific "not-found" route */
	if (!match) {
		match = {
			route: routes[0],
			result: [location.pathname],
		};
	}

	console.log(match)
	// const view = new match.route.view(getParams(match));
	// document.querySelector("#app").innerHTML = await view.getHtml();
};

const navigateTo = (url) => {
	history.pushState(null, null, url);
	router();
};

window.addEventListener('popstate', router);

window.onload = () => {
	document.body.addEventListener('click', (e) => {
		if (e.target.matches('[data-link]')) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	router();
};
