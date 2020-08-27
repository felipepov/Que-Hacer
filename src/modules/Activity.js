export default class Activy {
    constructor(key = ''){
        if(parseInt(key, 10) !== NaN)  {this.key = key}
        else {this.key = parseInt(key,10)}
    }
    async getResults(){
        try{
            const res = await fetch(`https://www.boredapi.com/api/activity?key=${this.key}`).then(response => response.json());
            this.title = res.activity
            this.type = res.type
            this.people = res.participants
            this.price = res.price
            this.link = res.link
            this.access = res.accessibility
            this.key = res.key;
            return res;
        }
        catch(err){
            console.log(err)
        }
    }
}
