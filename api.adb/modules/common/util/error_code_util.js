
const RES_SUCCESS = 0;
const RES_NO_ERROR = 0;
const RES_FAILED_DB = -1;
const RES_FAILED_UNKNOWN = -2;
const RES_FAILED_HTTP_REQUEST = -3;

const RES_ERROR_PARAMETER = -1000;

const RES_NO_AUTH_APP_ID                            = -100000; // 존재하지 않는 APP ID, Not Found APP ID

const RES_DUPLICATE_DEVELOPER_EMAIL                 = -100101;
const RES_FAILED_CREATE_DEVELOPER_ACCOUNT           = -100102;

const RES_FAILED_CREATE_USER_ACCOUNT                = -200000; // 계정 생성 실패
const RES_DUPLICATE_USER_EMAIL                      = -200001; // 사용중인 이메일
const RES_FAILED_ADD_ACCOUNT                        = -200002; // 계정 추가 실패
const RES_FAILED_ADD_MILEAGE_1                      = -200003; // 마일리지 추가 실패, failed, Add Mileage
const RES_FAILED_ADD_MILEAGE_2                      = -200004; // 마일리지 추가 실패, failed, Add Mileage
const RES_FAILED_ADD_PROFILE                        = -200005; // 프로파일 추가 실패, failed, Add Profile
const RES_FAILED_ADD_PROFILE_HIDDEN                 = -200006; // 프로파일(히든) 추가 실패 failed, Add Profile Hidden
const RES_FAILED_INSERT_SIGNUP_PATH                 = -200007; // 가입경로 정보 추가 실패, failed, Insert SignupInfo
const RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP    = -200008; // 접근 허용된 APP 추가 실패, failed, Insert Account Allow Access APP
const RES_FAILED_UPDATE_APP_ACCESS_TOKEN            = -200009; // App Access Token 업데이트실패, failed, Update App Access Token
const RES_NOT_MATCH_EMAIL_OR_PWD                    = -200010; // 이메일과 비밀번호가 일치하지 않음, Not Match E-Mail or Password
const RES_NOT_MATCH_SIGNUP_PATH                     = -200011; // 이메일의 가입경로가 다름 Not Match signup path
const RES_NOT_FOUND_PROFILE_ID                      = -200013; // failed, Not found Profile ID
const RES_FAILED_UPDATE_APP_ACCESS_CURRENT_PROFILE_ID = -200014; // failed, Update App Access Current Profile ID
const RES_PROFILE_MAX                               = -200015; //failed, Profile Add Max
const RES_NOT_FOUND_ACCOUNT                         = -200016; // failed, Not found Account ID
const RES_NOT_FOUND_EMAIL                           = -200017; // 찾을수 없는 이메일, NOT FOUND EMAIL
const RES_FORGOT_PWD_ONLY_SLP                       = -200018; // 비밀번호 초기화는 SLP 만 가능
const RES_PROFILE_MIN                               = -200019; // 현재 프로파일 갯수가 1개 이하
const RES_NOT_ALLOW_APP                             = -200020; // 이 계정에서는 접근이 허용되지 않은 APP 입니다.


const RES_NOT_LOGIN                                 = -200100; // 로그인 되지 않음
const RES_NOT_SEQID                                 = -201111; // SEQID 확인 불가

const RES_NOT_FOUND_DATA                            = -300000; // 조회내역 없음, NOT FOUND DATA


const RES_GUEST_ALREADY_CREATED_FROM_CLIENT_UID = -400100; //이 clientUID 는 이미 게스트 ID가 존재함
const RES_FAILED_CREATE_DLA_USER_1 = -400101; //SLP DLA 계정 생성 실패, Failed, INSERT INTO `user_slp_account_tb`
const RES_FAILED_CREATE_DLA_USER_2 = -400102; //SLP DLA 계정 생성 실패, Failed, INSERT INTO `guest_client_uid_tb`
const RES_FAILED_CREATE_DLA_USER_3 = -400103; //SLP DLA 계정 생성 실패, Failed, INSERT INTO `user_slp_account_tb`
const RES_GUEST_ALREADY_CREATED_FROM_SLP_ACCOUNT = -400104; //SLP ACCOUNT로 이미 계정을 생성 했음
const RES_FAILED_USER_LOGIN_GUEST = -400110; //SLP DLA User 로그인 실패(guest)
const RES_FAILED_USER_LOGIN_SLP = -400111; //SLP DLA User 로그인 실패(slp)
const RES_FAILED_UPDATE_USER_ACCESS_TOKEN = -400112; //SLP DLA User ACCESS_TOKEN 업데이트 오류
const RES_NOT_LOGGED_IN = -400113; //SLP DLA User 로그인 상태 아님, AccessToken Not Match
const RES_NO_GUEST_USER = -400114; //SLP DLA User 게스트 계정이 아님
const RES_ALREADY_CONVERSION = -400115; //SLP DLA User SLP와 연동된 ( spConversion )  된 계정
const RES_FAILED_CONVERSION = -400116; //SLP DLA User spConversion, Failed, INSERT INTO `user_slp_account_tb`
const RES_NOT_FOUND_USER = -400117; //SLP DLA User 계정을 찾을 수 없음
const RES_NOT_FOUND_SHOP_PACKAGE = -401000; //SLP DLA Shop 패키지를 찾을 수 없습니다.
const RES_FAILED_GENERATE_GOOGLE_PAYLOAD = -401001; //SLP DLA Shop google payload 생성 실패.
const RES_NOT_MATCH_STORE_GOOGLE = -401002; //SLP DLA Shop google payload, store 구글 아님
const RES_FAILED_SHOP_GOOGLE_PLAY_VERIFIER = -401003; //SLP DLA Shop google palay googlePlayVerifier 실패
const RES_FAILED_UPDATE_SHOP_BUY_HISTORY = -401004; //SLP DLA Shop shop_buy_history 상태 변경 실패.
const RES_FAILED_VERIFY_PAYMENT_APPLE = -401005; //SLP DLA Shop google palay googlePlayVerifier 실패


const RES_ERROR_PHOTO_UPLOAD_PARAMS_FILES = -401050; // SLP DLA Use Photo, Upload, error params files
const RES_ERROR_PHOTO_UNKNOWN_FILE_TYPE = -401051; // SLP DLA Use Photo, Upload, 이미지 파일 아님
const RES_ERROR_PHOTO_READ = -401052; // SLP DLA Use Photo, Error Read
const RES_ERROR_PHOTO_WRITE_TO_TEMP = -401053; // SLP DLA Use Photo, 임시 폴더에 업로드 실패


var isNull = function isNull(chk_value) {
    "use strict";
    if( (typeof chk_value === "undefined") || (null===chk_value) || (undefined===chk_value) || (""===chk_value) )  {
        return true;
    } else {
        return false;
    }
};

var convertDbErrorCodeToResultCode = function(errCode) {
    if( isNull(errCode) || isNaN(errCode)) {
        return RES_FAILED_UNKNOWN;
    } else {
        return errCode;
    }

};


module.exports = {
    convertDbErrorCodeToResultCode : convertDbErrorCodeToResultCode,

    RES_SUCCESS              : RES_SUCCESS,
    RES_NO_ERROR             : RES_NO_ERROR,
    RES_FAILED_DB            : RES_FAILED_DB,
    RES_FAILED_UNKNOWN       : RES_FAILED_UNKNOWN,
    RES_ERROR_PARAMETER      : RES_ERROR_PARAMETER,

    //
    RES_NO_AUTH_APP_ID                  : RES_NO_AUTH_APP_ID,

    //
    RES_DUPLICATE_DEVELOPER_EMAIL       : RES_DUPLICATE_DEVELOPER_EMAIL,
    RES_FAILED_CREATE_DEVELOPER_ACCOUNT : RES_FAILED_CREATE_DEVELOPER_ACCOUNT,


    //
    RES_FAILED_CREATE_USER_ACCOUNT  : RES_FAILED_CREATE_USER_ACCOUNT,
    RES_DUPLICATE_USER_EMAIL        : RES_DUPLICATE_USER_EMAIL,
    RES_NOT_LOGIN                   : RES_NOT_LOGIN,
    RES_NOT_SEQID                   : RES_NOT_SEQID,

    RES_NOT_FOUND_DATA              : RES_NOT_FOUND_DATA,

    RES_FAILED_ADD_ACCOUNT  : RES_FAILED_ADD_ACCOUNT,
    RES_FAILED_ADD_MILEAGE_1    : RES_FAILED_ADD_MILEAGE_1,
    RES_FAILED_ADD_MILEAGE_2    : RES_FAILED_ADD_MILEAGE_2,
    RES_FAILED_ADD_PROFILE  : RES_FAILED_ADD_PROFILE,
    RES_FAILED_ADD_PROFILE_HIDDEN   : RES_FAILED_ADD_PROFILE_HIDDEN,
    RES_FAILED_INSERT_SIGNUP_PATH   : RES_FAILED_INSERT_SIGNUP_PATH,
    RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP  : RES_FAILED_INSERT_ACCOUNT_ALLOW_ACCESS_APP,
    RES_FAILED_UPDATE_APP_ACCESS_TOKEN  : RES_FAILED_UPDATE_APP_ACCESS_TOKEN,
    RES_FAILED_NOT_MATCH_EMAIL_OR_PWD   : RES_NOT_MATCH_EMAIL_OR_PWD,
    RES_FAILED_NOT_MATCH_SIGNUP_PATH    : RES_NOT_MATCH_SIGNUP_PATH,
    RES_FAILED_NOT_FOUND_PROFILE_ID : RES_NOT_FOUND_PROFILE_ID,
    RES_FAILED_UPDATE_APP_ACCESS_CURRENT_PROFILE_ID : RES_FAILED_UPDATE_APP_ACCESS_CURRENT_PROFILE_ID,

    RES_PROFILE_MAX : RES_PROFILE_MAX,
    RES_NOT_FOUND_ACCOUNT : RES_NOT_FOUND_ACCOUNT,
    RES_NOT_FOUND_EMAIL   : RES_NOT_FOUND_EMAIL,
    RES_FORGOT_PWD_ONLY_SLP  : RES_FORGOT_PWD_ONLY_SLP,
    RES_PROFILE_MIN  : RES_PROFILE_MIN,
    RES_NOT_ALLOW_APP  : RES_NOT_ALLOW_APP,
    RES_FAILED_HTTP_REQUEST     : RES_FAILED_HTTP_REQUEST,


    RES_GUEST_ALREADY_CREATED_FROM_CLIENT_UID : RES_GUEST_ALREADY_CREATED_FROM_CLIENT_UID,
    RES_FAILED_CREATE_DLA_USER_1 : RES_FAILED_CREATE_DLA_USER_1,
    RES_FAILED_CREATE_DLA_USER_2 : RES_FAILED_CREATE_DLA_USER_2,
    RES_FAILED_CREATE_DLA_USER_3 : RES_FAILED_CREATE_DLA_USER_3,
    RES_GUEST_ALREADY_CREATED_FROM_SLP_ACCOUNT : RES_GUEST_ALREADY_CREATED_FROM_SLP_ACCOUNT,
    RES_FAILED_USER_LOGIN_GUEST : RES_FAILED_USER_LOGIN_GUEST,
    RES_FAILED_USER_LOGIN_SLP : RES_FAILED_USER_LOGIN_SLP,
    RES_FAILED_UPDATE_USER_ACCESS_TOKEN : RES_FAILED_UPDATE_USER_ACCESS_TOKEN,
    RES_NOT_LOGGED_IN : RES_NOT_LOGGED_IN,
    RES_NO_GUEST_USER   : RES_NO_GUEST_USER,
    RES_ALREADY_CONVERSION : RES_ALREADY_CONVERSION,
    RES_FAILED_CONVERSION : RES_FAILED_CONVERSION,
    RES_NOT_FOUND_USER : RES_NOT_FOUND_USER,
    RES_NOT_FOUND_SHOP_PACKAGE : RES_NOT_FOUND_SHOP_PACKAGE,
    RES_FAILED_GENERATE_GOOGLE_PAYLOAD : RES_FAILED_GENERATE_GOOGLE_PAYLOAD,
    RES_NOT_MATCH_STORE_GOOGLE : RES_NOT_MATCH_STORE_GOOGLE,
    RES_FAILED_SHOP_GOOGLE_PLAY_VERIFIER : RES_FAILED_SHOP_GOOGLE_PLAY_VERIFIER,
    RES_FAILED_UPDATE_SHOP_BUY_HISTORY : RES_FAILED_UPDATE_SHOP_BUY_HISTORY,
    RES_FAILED_VERIFY_PAYMENT_APPLE : RES_FAILED_VERIFY_PAYMENT_APPLE,
    RES_ERROR_PHOTO_UPLOAD_PARAMS_FILES : RES_ERROR_PHOTO_UPLOAD_PARAMS_FILES,
    RES_ERROR_PHOTO_UNKNOWN_FILE_TYPE   : RES_ERROR_PHOTO_UNKNOWN_FILE_TYPE,
    RES_ERROR_PHOTO_READ   : RES_ERROR_PHOTO_READ,
    RES_ERROR_PHOTO_WRITE_TO_TEMP   : RES_ERROR_PHOTO_WRITE_TO_TEMP


};