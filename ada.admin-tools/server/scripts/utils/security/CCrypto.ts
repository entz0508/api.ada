"use strict";

import * as crypto from "crypto";
import * as md5    from "md5";

export interface IEncrypted
{
	content: string,
	tag: Buffer
}

export class CCrypto
{
	protected static m_securityKey: string  = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";
	protected static m_iv: string           = "60iP0h6vJoEa";

	/***********************************************************************************************************
	 * md5
	 ***********************************************************************************************************/
	public static createMD5(bufferString: string)
	{
		const buffer: string = bufferString + this.m_securityKey;
		return md5(buffer);
	}

	/***********************************************************************************************************
	 * cipher
	 ***********************************************************************************************************/
	// public static createCipheriv(bufferString: string, algorithm: string = "aes-256-gcm", key: string = this.m_securityKey, iv: string = this.m_iv): IEncrypted
	// {
	// 	const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);
	//
	// 	let content: string = cipher.update(bufferString, "utf8", "hex");
	// 	content += cipher.final("hex");
	//
	// 	const tag: Buffer = cipher.getAuthTag();
	//
	// 	return {
	// 		content,
	// 		tag
	// 	}
	// }
	//
	// public static createDecipheriv(encrypted: IEncrypted, algorithm: string = "aes-256-gcm", key: string = this.m_securityKey, iv: string = this.m_iv): string
	// {
	// 	const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, key, iv);
	//
	// 	decipher.setAuthTag(encrypted.tag);
	//
	// 	let dec: string = decipher.update(encrypted.content, "hex", "utf8");
	// 	dec += decipher.final("utf8");
	//
	// 	return dec;
	// }

	public static createCipheriv(bufferString: string, algorithm: string = "aes-256-gcm", key: string = this.m_securityKey, iv: string = this.m_iv): string
	{
		const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, key, iv);

		let encrypted: string = cipher.update(bufferString, "utf8", "hex");
		encrypted += cipher.final("hex");

		return encrypted;
	}

	public static createDecipheriv(encrypted: string, algorithm: string = "aes-256-gcm", key: string = this.m_securityKey, iv: string = this.m_iv): string
	{
		const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, key, iv);

		return decipher.update(encrypted, "hex", "utf8");
	}
}