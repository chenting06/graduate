import {makeAutoObservable} from "mobx";
class Store{
    userInform={};
    themeColor="";
    setUserInform(userInform){
        this.userInform=userInform;
        // console.log(userInform);
    };
    setThemeColor(color){
        this.themeColor=color;
    }
    constructor(){
        makeAutoObservable(this)
    }
}
export default new Store();