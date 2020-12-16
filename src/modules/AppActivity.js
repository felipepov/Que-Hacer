const db = firebase.firestore();

export default class AppActivity {
	constructor(key) {
		this.key = key;
	}
	async getData() {
		const activity = db.collection('activities').doc(`${this.key}`);
		try {
			const doc = await activity.get();
			if (!doc.exists) {
				return false;
			} else {
				this.data = doc.data();
				return true;
			}
		} catch (err) {
			return false;
		}
	}
	async updateLike(bool) {
		const activity = db.collection('activities').doc(`${this.key}`);
		try {
			const oldDoc = await activity.get();
			if (!oldDoc.exists) {
				return false;
			} else {
				if (bool) {
					try {
						await activity.update({
							liked: oldDoc.data().liked + 1,
						});
						return true;
					} catch (err) {
						return false;
					}
				} else {
					try {
						await activity.update({
							liked: oldDoc.data().liked - 1,
						});
						return true;
					} catch (err) {
						return false;
					}
				}
			}
		} catch (err) {
			return false;
		}
	}
}
