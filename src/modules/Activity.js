export default class Activy {
	constructor(key = '') {
			this.key = key;
	}
	async getResults() {
		try {
			const res = await fetch(
				`https://www.boredapi.com/api/activity?key=${this.key}`
			).then((response) => response.json());
			this.title = res.activity;
			this.type = res.type;
			this.people = res.participants;
			this.price = res.price;
			this.link = res.link;
			this.access = res.accessibility;
			this.liked = false;
			this.key = res.key;
			return res;
		} catch (err) {
			console.log(err);
		}
	}
}
