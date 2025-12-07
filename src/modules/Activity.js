export default class Activy {
	constructor(key = '', contributedData = undefined) {
			this.key = key;
			this.data = contributedData
	}
	async getResults() {
		if (this.data == undefined){
			try {
				// Use allorigins.win to bypass CORS restrictions
				const key = this.key && this.key !== '' && !isNaN(this.key) ? this.key : '';
				
				// Bored API endpoint
				const apiUrl = key ? 
					`https://bored-api.appbrewery.com/activity/${key}` :
					`https://bored-api.appbrewery.com/random`;
				
				// Use allorigins.win CORS proxy
				const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
				const response = await fetch(proxyUrl);
				
				if (!response.ok) {
					// Handle rate limiting or other HTTP errors
					if (response.status === 429) {
						console.error('API rate limit exceeded. Please try again later.');
					} else {
						console.error(`HTTP error! status: ${response.status}`);
					}
					return;
				}
				
				// Parse response - handle both JSON and text responses
				const text = await response.text();
				
				// Check if response is a rate limit or error message
				if (text.includes('Too many requests') || text.includes('rate limit') || text.includes('Rate limit')) {
					console.error('API rate limit exceeded. Please try again later.');
					return;
				}
				
				// Check if response looks like HTML (error page)
				if (text.trim().startsWith('<')) {
					console.error('Received HTML response instead of JSON. The API may be down.');
					return;
				}
				
				let res;
				try {
					// Try to parse as JSON
					res = JSON.parse(text);
				} catch (parseError) {
					// If parsing fails, log the actual response for debugging
					console.error('Failed to parse JSON response. Response:', text.substring(0, 200));
					console.error('Parse error:', parseError);
					return;
				}
				
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
