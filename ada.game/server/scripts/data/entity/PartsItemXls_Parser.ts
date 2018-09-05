"use strict";

export class PartsItemXls
{
	
	public id : number = 0;
	public res_name : string = "";
	public brand : string = "";
	public closet_parts : boolean = false;
	public default_dress : boolean = false;
	public parts_type : string = "";
	public hair : number = 0;
	public head : number = 0;
	public upperbody : number = 0;
	public lowerbody : number = 0;
	public hand : number = 0;
	public foot : number = 0;
	public underwear : number = 0;
	public socks : number = 0;
	public leggings : number = 0;
	public outer : number = 0;
}

export class PartsItemXls_Parser
{
    public static mapping(data : any[] ) {
		const dataMap : Map<number, PartsItemXls> = new Map<number, PartsItemXls>();

        for (let i = 0; i < data.length; i++) {
            const p: PartsItemXls = new PartsItemXls();
			
            p.id = Number(data[i]["id"]);
            p.res_name = String(data[i]["res_name"]);
            p.brand = String(data[i]["brand"]);
            p.closet_parts = Boolean(data[i]["closet_parts"]);
            p.default_dress = Boolean(data[i]["default_dress"]);
            p.parts_type = String(data[i]["parts_type"]);
            p.hair = Number(data[i]["hair"]);
            p.head = Number(data[i]["head"]);
            p.upperbody = Number(data[i]["upperbody"]);
            p.lowerbody = Number(data[i]["lowerbody"]);
            p.hand = Number(data[i]["hand"]);
            p.foot = Number(data[i]["foot"]);
            p.underwear = Number(data[i]["underwear"]);
            p.socks = Number(data[i]["socks"]);
            p.leggings = Number(data[i]["leggings"]);
            p.outer = Number(data[i]["outer"]);

            dataMap.set(p.id, p);
        }

		return dataMap;
    }
}