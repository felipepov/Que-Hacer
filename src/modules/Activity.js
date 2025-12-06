export default class Activy {
	constructor(key = '', contributedData = undefined) {
			this.key = key;
			this.data = contributedData
	}
	async getResults() {
		if (this.data == undefined){
			try {
				// If key is empty or invalid, fetch random activity. Otherwise fetch specific activity by key
				// Bored API format: /activity for random, /activity?key={key} for specific
				const url = this.key && this.key !== '' ? 
					`https://bored-api.appbrewery.com/activity?key=${this.key}` :
					`https://bored-api.appbrewery.com/activity`;
				const res = await fetch(url).then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json();
				});
				
				// Check if response has error property (Bored API returns {error: "..."} on failure)
				if (res.error) {
					console.error('API Error:', res.error);
					return;
				}
				
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
				console.error('Error fetching activity:', err);
			}
		} else {
			this.title = this.data.title;
			this.type = this.data.type;
			this.people = this.data.people;
			this.price = this.data.price;
			this.link = this.data.link;
			this.access = this.data.access;
			this.liked = !!this.data.liked;
		}
	}
}
