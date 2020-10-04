export default class Activy {
	constructor(key = '', contributedData = undefined) {
			this.key = key;
			this.data = contributedData
	}
	async getResults() {
		if (this.data == undefined){
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
		} else {
			this.title = this.data.title;
			this.type = this.data.type;
			this.people = this.data.people;
			this.price = this.data.price;
			this.link = this.data.link;
			this.access = this.data.access;
			this.liked = this.data.liked;
		}
	}
}
