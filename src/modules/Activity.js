export default class Activy {
	constructor(key = '', contributedData = undefined) {
			this.key = key;
			this.data = contributedData
	}
	async getResults() {
		if (this.data == undefined){
			try {
				// If key is empty or invalid, fetch random activity. Otherwise fetch specific activity by key
				// Bored API format: /activity for random, /activity/{key} for specific activity
				const url = this.key && this.key !== '' && !isNaN(this.key) ? 
					`https://bored-api.appbrewery.com/activity/${this.key}` :
					`https://bored-api.appbrewery.com/activity`;
				const response = await fetch(url);
				
				if (!response.ok) {
					// Handle rate limiting or other HTTP errors
					if (response.status === 429) {
						console.error('API rate limit exceeded. Please try again later.');
					} else {
						console.error(`HTTP error! status: ${response.status}`);
					}
					return;
				}
				
				const res = await response.json();
				
				// Check if response has error property (Bored API returns {error: "..."} on failure)
				if (res.error) {
					console.error('API Error:', res.error);
					return;
				}
				
				// Validate response has required fields
				if (!res.activity || res.activity === '') {
					console.error('Invalid API response: missing activity field');
					return;
				}
				
				this.title = res.activity;
				this.type = res.type;
				this.people = res.participants;
				this.price = res.price;
				this.link = res.link || '';
				this.access = res.accessibility;
				this.liked = false;
				this.key = res.key;
				return res;
			} catch (err) {
				console.error('Error fetching activity:', err);
				// Don't throw - let the calling code handle undefined title
				return;
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
