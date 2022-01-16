export interface DialogData {
    animal: string;
    name: string;
}

export interface ItemData {
    name:string,
    id:string,
    hsn:string,
    unit:string,
    price:string,
    quantity:number,
    discount:{
        percentage:number,
        amount:number
    }
    tax:{
        percentage:number,
        amount:number
    },
    amount:number
}

export interface ProfileData {
    name:string,
    mobile:string,
    user:{
        username:string,
        email:string
    },
    shop:{
        name:string,
        address:string,
        city:string,
        mobile:string,
        gst:string,
        email:string,
        phone:string
    }
}

export interface Material {
    name:string,
    hsn:string,
    rate:number
}

export interface Ornament {
    name:string,
    vat:number,
    gross_weight:number,
    net_weight:number,
    material:{
        name:string,
        hsn:string
    },
    code:string,
    stone_price:number
}

export interface billItem {
    item:Ornament,
    index:number,
    pricing:any
}