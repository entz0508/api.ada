"use strict";

import {CMysqlQuery}    from "./CMysqlQuery";
import {CException}     from "../../exceptions/CException";
import {CExceptionCode} from "../../exceptions/CExceptionCode";
import {CDebug}         from "../../CDebug";

export class CMysql
{
    /***********************************************************************************************************
     * default query
     ***********************************************************************************************************/
    public static async queryPure(connect: any, query: string, params: Array<any>): Promise<any[]>
    {
        const conn: any = await connect.getConnection();

        try {
            return await conn.query(query, params).then((rows: any) => {
                conn.connection.release();
                return rows;
            }).catch((exception: any) => {
                CDebug.logError(exception.sqlMessage);
                conn.connection.release();
                throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query, exception);
            });
        } catch (exception) {
	        CDebug.logError(exception);
            conn.connection.release();
            throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query, exception);
        }
    }

    /***********************************************************************************************************
     * query
     ***********************************************************************************************************/
    public static async query(connect: any, query: CMysqlQuery): Promise<any[]>
    {
	    if (!query || query.query === "") {
            return;
        }

        const conn: any = await connect.getConnection();

        try {
            return await conn.query(query.query, query.params).then((rows: any) => {
                conn.connection.release();
                return rows;
            }).catch((exception: any) => {
                conn.connection.release();
                throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query.query, exception);
            });
        } catch (exception) {
            CDebug.logError(exception);
            conn.connection.release();
            throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query.query, exception);
        }
    }

    public static async queryList(conn: any, queries: Array<CMysqlQuery>): Promise<any>
    {
        const query: CMysqlQuery = new CMysqlQuery();
        query.addList(queries);
        return await this.query(conn, query);
    }

    /***********************************************************************************************************
     * transaction
     ***********************************************************************************************************/
    public static async transactionQuery(connect: any, query: CMysqlQuery): Promise<any[]>
    {
        if (!query || query.query === "") {
            return;
        }

        const conn: any = await connect.getConnection();

        try {
            await conn.connection.beginTransaction();

            const results: any = await conn.query(query.query, query.params).then((rows: any) => {
                return rows;
            }).catch((exception: any) => {
                conn.rollback();
                conn.connection.release();
                throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query.query, exception);
            });

            await conn.commit();
            conn.connection.release();

            return results;
        } catch (exception) {
	        CDebug.logError(exception);
            conn.connection.release();
            throw new CException(CExceptionCode.ErrorCode.FailedDB, false, query.query, exception);
        }
    }

    public static async transactionQueryList(conn: any, queries: Array<CMysqlQuery>): Promise<any[]>
    {
        const query: CMysqlQuery = new CMysqlQuery();
        query.addList(queries);
        return await this.transactionQuery(conn, query);
    }
}