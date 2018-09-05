export class PartsItemXls
{
	public uuid: number = -1;
	public res_name: string = "";
	public name: string = "";
	public closet_parts: boolean = false;
	public parts_type: string = "";
	public hair: number = -1;
}

export class PartsItem_ParserXls
{

	public static mapping(data: any[])
	{
		const dataMap: Map<number, PartsItemXls> = new Map<number, PartsItemXls>();

		for (let i = 0; i < data.length; i++) {
			const p: PartsItemXls = new PartsItemXls();

			p.res_name = String(data[i]["res_name"]);
			p.name = String(data[i]["name"]);
			p.closet_parts = Boolean(data[i]["closet_parts"]);
			p.parts_type = String(data[i]["closet_parts"]);
			p.hair = Number(data[i]["hair"]);

			dataMap.set(p.uuid, p);
		}

		return dataMap;
	}
}