"use strict";

import {CConfig}    from "../../config/CConfig";
import {CDebug}     from "../CDebug";
import {CSingleton} from "../CSingleton";

const FCMPush = require("fcm-push"); /** https://github.com/nandarustam/fcm-push */

export class CFirebasePush extends CSingleton
{
	protected m_FCMInstance: any = null;

	/********************************************************************************************
	 * abstract
	 ********************************************************************************************/
	protected onInstantiate(): void
	{
		this.m_FCMInstance = new FCMPush(CConfig.Environment.Google.webAPIKey);
	};

	protected onDestroyInstance(): void
	{

	};

	/**
	 * https://firebase.google.com/docs/cloud-messaging/http-server-ref?hl=ko
	 */
	public async send(tokens: string[], uuids: string[], title: string, body: string, failOver?: Object): Promise<boolean>
	{
		const message: Object = {
			/**
			 * 이 값은 멀티캐스트 메시지를 보낼 등록 토큰의 배열이어야 합니다. 배열에 포함될 수 있는 등록 토큰 수는 1~1,000개입니다. 단일 기기로 메시지를 보내려면 to 매개변수를 사용하세요.
			 */
			registration_ids: tokens,

			/**
			 * 이 매개변수는 사용자에게 표시되는 사전 정의된 알림 페이로드의 키-값 쌍을 지정합니다.
			 * 자세한 내용은 알림 페이로드 지원을 참조하세요. 알림 메시지 및 데이터 메시지 옵션의 자세한 내용은 메시지 유형을 참조하세요.
			 * iOS 기기로 보내는 메시지에 알림 페이로드가 제공되었거나 content_available 옵션이 true로 설정된 경우 메시지가 APN을 통해 전송되고, 그렇지 않은 경우 FCM 연결 서버를 통해 전송됩니다.
			 */
			notification: {title, body}
		};

		try {
			await this.push(message, uuids, failOver);
			return true;
		}
		catch (exception) {
			CDebug.logError(exception);
			return false;
		}
	}

	public async sendAll(): Promise<boolean>
	{
		return true;
	}

	protected async push(message: Object, uuids: string[], failOver?: Object): Promise<Object>
	{
		const response: Object = await this.m_FCMInstance.send(message, {});
		await this.failOver(response, uuids, failOver);
		return response;
	}

	protected async failOver(response: any, uuids: string[], failOver: Object): Promise<void>
	{
		if (response.failure < 1) {
			return;
		}

		const count: number = response.results.length;
		for (let idx: number = 0; idx < count; ++idx) {
			const errorStr: string = response.results[idx].error;

			if (! errorStr) {
				continue;
			}

			switch (errorStr) {
				case "MissingRegistration": {
					/**
					 * 누락된 등록 토큰 200 + error:MissingRegistration
					 *      요청에 등록 토큰이 포함되어 있는지 확인하세요. 일반 텍스트 메시지의 registration_id나 JSON의 to 또는 registration_ids 필드를 확인하세요.
					 */
					CDebug.logErrorFormat("MissingRegistration. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidRegistration": {
					/**
					 * 잘못된 등록 토큰 200 + error:InvalidRegistration
					 *      서버에 전달한 등록 토큰의 형식을 확인하세요. Firebase 알림을 사용해 등록할 때 클라이언트 앱이 수신한 등록 토큰과 일치해야 합니다. 일부분 자르거나 다른 문자를 추가해서는 안 됩니다.
					 */
					CDebug.logErrorFormat("InvalidRegistration. uuid(%s)", uuids[idx]);
					break;
				}
				case "NotRegistered": {
					/**
					 * 등록되지 않은 기기 200 + error:NotRegistered
					 *      다음을 비롯한 몇몇 상황에서는 기존 등록 코드가 더 이상 유효하지 않게 될 수 있습니다.
					 *          - 클라이언트 앱이 FCM에서 등록 해제되었습니다.
					 *          - 클라이언트 앱이 자동으로 등록 해제되었습니다. 사용자가 애플리케이션을 제거한 경우에 발생할 수 있습니다. 예를 들어 iOS에서 APNS 피드백 서비스가 APNS 토큰이 잘못되었다고 보고한 경우입니다.
					 *          - 등록 토큰이 만료되었습니다. 예를 들어 Google에서 등록 토큰 새로고침을 결정한 경우이거나 APNS 토큰이 iOS 기기에서 만료된 경우입니다.
					 *          - 클라이언트 앱이 업데이트되었지만 새 버전이 메시지를 수신할 수 있도록 구성되지 않았습니다. 위와 같은 경우에는 앱 서버에서 등록 토큰을 삭제하고 더 이상 메시지 전송에 이 등록 토큰을 사용하지 마세요.
					 */
					CDebug.logErrorFormat("NotRegistered. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidPackageName": {
					/**
					 * 잘못된 패키지 이름	200 + error:InvalidPackageName
					 *      요청에서 전달한 값과 패키지 이름과 일치하는 등록 토큰으로 메시지를 보내도록 지정했는지 확인합니다.
					 */
					CDebug.logErrorFormat("InvalidPackageName. uuid(%s)", uuids[idx]);
					break;
				}
				case "MismatchSenderId": {
					/**
					 * 일치하지 않는 발신자 200 + error:MismatchSenderId
					 *      등록 토큰은 특정 발신자 그룹에 연결됩니다. 클라이언트 앱을 FCM에 등록할 때 메시지를 보낼 수 있는 발신자를 지정해야 합니다.
					 *      클라이언트 앱에 메시지를 보낼 때는 지정한 발신자 ID를 사용해야 합니다. 다른 발신자로 전환하면 기존 등록 토큰이 작동하지 않습니다.
					 */
					CDebug.logErrorFormat("MismatchSenderId. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidParameters": {
					/**
					 * 잘못된 매개변수 400 + error:InvalidParameters
					 *      제공한 매개변수의 이름과 유형이 올바른지 확인하세요.
					 */
					CDebug.logErrorFormat("InvalidParameters. uuid(%s)", uuids[idx]);
					break;
				}
				case "MessageTooBig": {
					/**
					 * 너무 큰 메시지 200 + error:MessageTooBig
					 *      메시지에 포함된 페이로드 데이터의 총 크기가 FCM 한도를 초과하지 않았는지 확인하세요. 대부분의 메시지는 4,096바이트이며 주제로 보내는 메시지의 경우는 2,048바이트입니다. 여기에는 키와 값이 모두 포함됩니다.
					 */
					CDebug.logErrorFormat("MessageTooBig. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidDataKey": {
					/**
					 * 잘못된 데이터 키 200 + error:InvalidDataKey
					 *      페이로드 데이터에 FCM에서 내부적으로 사용하는 키(예: from, gcm 또는 프리픽스가 google인 모든 값)가 포함되지 않았는지 확인하세요.
					 *      또한 페이로드 값이 FCM 값에 의해 재정의되는 경우에는 FCM에서 사용하는 collapse_key와 같은 일부 단어가 페이로드에 허용된다는 점에 유의하세요.
					 */
					CDebug.logErrorFormat("InvalidDataKey. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidTtl": {
					/**
					 * 잘못된 수명 200 + error:InvalidTtl
					 *      time_to_live에서 사용한 값이 0초에서 2,419,200초(4주) 사이의 기간을 나타내는 정수인지 확인하세요.
					 */
					CDebug.logErrorFormat("InvalidTtl. uuid(%s)", uuids[idx]);
					break;
				}
				case "Unavailable": {
					/**
					 * 시간 초과	5xx 또는 200 + error:Unavailable
					 *      서버에서 시간 내에 요청을 처리하지 못했습니다. 동일한 요청을 다시 시도하되 다음을 수행해야 합니다.
					 *          - Retry-After 헤더가 FCM 연결 서버의 응답에 포함된 경우 이 헤더를 반영합니다.
					 *          - 재시도 방식에서 지수 백오프를 구현합니다. 예를 들어 첫 번째 재시도 전에 1초 동안 기다렸다면 두 번째 재시도는 2초 이상 기다리고 다음 시도는 4초 동안 기다리는 식으로 대기 시간을 늘려 나갑니다.
					 *            여러 메시지를 보내는 경우에는 동시에 모든 메시지에 대한 새로운 요청을 만들지 않도록 메시지마다 개별적으로 임의의 지연 시간을 추가하세요.
					 *      문제를 유발하는 발신자는 차단될 수 있습니다.
					 */
					CDebug.logErrorFormat("Unavailable. uuid(%s)", uuids[idx]);
					break;
				}
				case "InternalServerError": {
					/**
					 * 내부 서버 오류 500 또는 200 + error:InternalServerError
					 *      요청을 처리하려고 시도하는 중에 서버에 오류가 발생했습니다. '제한 시간'에 나와 있는 요구사항에 따라 동일한 요청을 다시 시도할 수 있습니다. 위의 행을 참조하세요.
					 */
					CDebug.logErrorFormat("InternalServerError. uuid(%s)", uuids[idx]);
					break;
				}
				case "DeviceMessageRateExceeded": {
					/**
					 * 기기 메시지 비율 초과	200 + error:DeviceMessageRateExceeded
					 *      특정 기기로 전달되는 메시지 비율이 너무 높습니다. iOS 앱의 메시지 전송 속도가 APN 한도를 초과하면 이 오류 메시지가 표시될 수 있습니다.
					 */
					CDebug.logErrorFormat("DeviceMessageRateExceeded. uuid(%s)", uuids[idx]);
					break;
				}
				case "TopicsMessageRateExceeded": {
					/**
					 * 주제 메시지 비율 초과	200 + error:TopicsMessageRateExceeded
					 *      특정 주제의 구독자에게 전달되는 메시지 비율이 너무 높습니다.
					 */
					CDebug.logErrorFormat("TopicsMessageRateExceeded. uuid(%s)", uuids[idx]);
					break;
				}
				case "InvalidApnsCredential": {
					/**
					 * 잘못된 APN 인증 정보	200 + error:InvalidApnsCredential
					 *      필수 APN SSL 인증서가 업로드되지 않았거나 만료되어 iOS 기기를 타겟팅한 메시지를 보내지 못했습니다. 개발 및 프로덕션 인증서의 유효성을 확인하세요.
					 */
					CDebug.logErrorFormat("InvalidApnsCredential. uuid(%s)", uuids[idx]);
					break;
				}
				default: {
					CDebug.logErrorFormat("None. uuid(%s)", uuids[idx]);
					break;
				}
			}
		}
	}

	protected debug(message: string): void
	{
		CDebug.logInfoFormat(message);
	}
}