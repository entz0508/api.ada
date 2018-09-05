"use strict";

export class CMysqlQuery
{
    protected m_query: string       = "";
    protected m_params: Object[]    = [];

    public init(query: string = "", params: Object[] = []): boolean
    {
	    this.m_query    = query;
	    this.m_params   = params;

	    return true;
    }

    public get query(): string
    {
        return this.m_query;
    }

    public get params(): object[]
    {
        return this.m_params;
    }

    public add(query: CMysqlQuery): void
    {
        if (! query) {
            return undefined;
        }

        if (query.query === "") {
            return undefined;
        }

        this.m_query += query.query;

        const count: number = query.params.length;
        for (let idx = 0; idx < count; ++idx) {
            const element: Object = query.params[idx];
            this.m_params.push(element);
        }
    }

    public addList(queries: CMysqlQuery[]): void
    {
        const count: number = queries.length;
        for (let idx = 0; idx < count; idx++) {
            this.add(queries[idx]);
        }
    }

    public static merge($queries: CMysqlQuery[], queryArr: CMysqlQuery[]): void
    {
        const count: number = queryArr.length;
        for (let idx: number = 0; idx < count; ++idx) {
            $queries.push(queryArr[idx]);
        }
    }
}