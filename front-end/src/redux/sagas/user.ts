import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import history from "../../history";
import jwt from "jwt-decode";
import * as userActionTypes from "../actionTypes/user";
import * as userActionCreators from "../actionCreators/user";
import * as userTypes from "../../types/user";
import * as cartActionCreators from "../actionCreators/cart";
import { API_URL } from "../../API";

function* fetchSignupSagas(action: userTypes.IFetchSignup) {
  try {
    yield axios.post(`${API_URL}/users/signup`, action.payload);
    yield put(userActionCreators.fetchSignupFulfilled());
    alert("가입이 완료되었습니다.");
    history.push("/signin");
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchSignupRejected(error.response));
  }
}

function* fetchSigninSagas(action: userTypes.IFetchSignin) {
  try {
    const response = yield axios.post(`${API_URL}/users/signin`, action.payload);
    // 토큰에서 유저 정보를 가져와 상태에 저장한다.
    const jwtToken = jwt(response.data.authorization) as userTypes.IJwtToken;
    const parsedUserInfo = JSON.parse(jwtToken.userInfo);
    yield put(userActionCreators.setUser(parsedUserInfo));
    // jwt를 로컬 스토리지에 저장한다.
    localStorage.setItem("jwt", response.data.authorization);
    alert("환영합니다!");
    yield put(userActionCreators.fetchSigninFulfilled());
    // 로그인 후 유저의 장바구니를 가져온다. 순서를 보장하기 위해 로그인 사가에.
    yield put(cartActionCreators.fetchSetCart());
    history.push("/");
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchSigninRejected(error.response));
  }
}

function* fetchSigninActiveSagas(action: userTypes.IFetchSigninActive) {
  try {
    yield axios.get(`${API_URL}/users/active`, {
      params: {
        id: action.payload.id,
        token: action.payload.token
      }
    });
    alert("인증이 완료되었습니다. 이제 로그인이 가능합니다.");
    yield put(userActionCreators.fetchSigninActiveFulfilled());
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchSigninActiveRejected(error.response));
  }
}

function* fetchFindIdSagas(action: userTypes.IFetchFindId) {
  try {
    yield axios.get(`${API_URL}/users/findid`, {
      params: {
        email: action.payload
      }
    });
    alert("입력하신 이메일로 인증코드가 전송되었습니다.");
    yield put(userActionCreators.fetchFindIdFulfilled());
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchFindIdRejected(error.response));
  }
}

function* fetchFindIdConfirmSagas(action: userTypes.IFetchFindIdConfirm) {
  try {
    const response = yield axios.post(`${API_URL}/users/findid/confirm`, {
      authCode: action.payload
    });
    // 배열로 오면 바꿔줘야 한다.
    alert(`회원님의 아이디는 ${response.data.userIdList}입니다.`);
    yield put(userActionCreators.fetchFindIdConfirmFulfilled());
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchFindIdConfirmRejected(error.response));
  }
}

function* fetchFindPasswordSagas(action: userTypes.IFetchFindPassword) {
  try {
    yield axios.get(`${API_URL}/users/findpw`, {
      params: {
        email: action.payload.email,
        id: action.payload.id
      }
    });
    alert("입력하신 이메일로 임시 비밀번호가 전송되었습니다.");
    yield put(userActionCreators.fetchFindPasswordFulfilled());
  } catch (error) {
    alert(error.response.data.exceptionMessage);
    yield put(userActionCreators.fetchFindPasswordRejected(error.response));
  }
}

export default function* userSagas() {
  yield takeLatest(userActionTypes.FETCH_SIGNUP, fetchSignupSagas);
  yield takeLatest(userActionTypes.FETCH_SIGNIN, fetchSigninSagas);
  yield takeLatest(userActionTypes.FETCH_SIGNIN_ACTIVE, fetchSigninActiveSagas);
  yield takeLatest(userActionTypes.FETCH_FIND_ID, fetchFindIdSagas);
  yield takeLatest(userActionTypes.FETCH_FIND_ID_CONFIRM, fetchFindIdConfirmSagas);
  yield takeLatest(userActionTypes.FETCH_FIND_PASSWORD, fetchFindPasswordSagas);
}
