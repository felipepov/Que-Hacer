export default class Likes {
    constructor(){
        this.likes = [];
    }
    addLike(key, title, type) {
        const like = {key, title, type };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData();
        return true;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.key === id);
        this.likes.splice(index, 1);
        
        // Perist data in localStorage
        this.persistData();

        return false
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.key === id) !== -1;
    }

    getLast(){
        return this.likes.length - 1
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}