"use strict";

import * as jwt from "jsonwebtoken";

export class CJsonWebToken
{
	protected static m_secretKey: string        = "SeCrEtKeYfOrHaShInG";

	protected static m_expireSeconds: number    = 60*10;

	protected static async sign(uuid: string, expiresIn: number): Promise<string>
	{
		/**
		 * options
		 *  expiresIn: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
		 *             If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
		 *  notBefore: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
		 *             If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
		 *  audience
		 *  issuer
		 *  jwtid
		 *  subject
		 *  noTimestamp
		 *  header
		 *  keyid
		 *  mutatePayload: if true, the sign function will modify the payload object directly. This is useful if you need a raw reference to the payload after claims have been applied to it but before it has been encoded into a token.
		 */
		return await jwt.sign({id: uuid}, this.m_secretKey, {
			expiresIn: expiresIn,
			issuer: "sensitive.com",
			subject: "session"
		});
	}

	public static async verify(token: string): Promise<boolean>
	{
		try {
			const decoded: any = await jwt.verify(token, this.m_secretKey);
			if (! decoded) {
				// error
			}
			const uuid: string = decoded.id;
			const issuedAt: number = decoded.iat;       // register
			const expiration: number = decoded.exp;     // expire
		}
		catch (exception) {
			if (exception.name === "TokenExpiredError") {
				/**
				 * message
				 *  'jwt expired'
				 */
			}
			if (exception.name === "JsonWebTokenError") {
				/**
				 * message
				 *  'jwt malformed'
				 *  'jwt signature is required'
				 *  'invalid signature'
				 *  'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
				 *  'jwt issuer invalid. expected: [OPTIONS ISSUER]'
				 *  'jwt id invalid. expected: [OPTIONS JWT ID]'
				 *  'jwt subject invalid. expected: [OPTIONS SUBJECT]'
				 */
			}

			console.error(exception);

			return false;
		}

		return true;
	}

	public static async publishToken(uuid: string): Promise<string>
	{
		return await this.sign(uuid, this.m_expireSeconds);
	}

	public static async refreshToken(uuid: string, token: string): Promise<string>
	{
		return await this.sign(uuid, this.m_expireSeconds);
	}
}