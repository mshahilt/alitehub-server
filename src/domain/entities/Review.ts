export class Review {
    public id!:string;
    public userId!:string;
    public companyId!:string;
    public rating!:number;
    public review!:string;

    constructor(data:Partial<Review>){
        Object.assign(this,data);
    }
}