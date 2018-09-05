"use strict";

const ipaddr    = require("ipaddr.js");
const Address6  = require("ip-address").Address6;

export class CIPAddress
{
	public static isValid(ip: string): boolean
	{
		return ipaddr.IPv4.isValid(ip);
	}

	public static getIPAddress(ip: string): string
	{
		const splitIPList: string[] = ip.split(",");

		const count: number = splitIPList.length;
		for (let idx: number = 0; idx < count; idx++) {
			const parseIP: string = splitIPList[idx];

			/********************************************************************************************
			 * ipv4
			 ********************************************************************************************/
			if (ipaddr.IPv4.isValid(parseIP)) {
				return parseIP;
			}

			/********************************************************************************************
			 * ipv6
			 ********************************************************************************************/
			if (ipaddr.IPv6.isValid(parseIP)) {
				const address = ipaddr.IPv6.parse(parseIP);
				if (address.isIPv4MappedAddress()) {
					return address.toIPv4Address().toString();
				}
				else {
					if ("::1" === parseIP) {
						return "127.0.0.1";
					} else {
						const address: any = new Address6(parseIP);
						if (address.isValid()) {
							return address.inspectTeredo().client4;
						}
					}
				}
			}
		}

		return splitIPList[0].split(":").slice(-1).toString();
	}
}