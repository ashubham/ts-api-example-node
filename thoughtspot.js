const { TS_API_BASE } = require("./constants");
const { Cookie, CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios").default;
const jar = new CookieJar();

const instance = wrapper(
  axios.create({
    baseURL: TS_API_BASE,
    timeout: 2000,
    jar,
    validateStatus: (status) => {
      return (status >= 200 && status < 300) || status === 302;
    }
  })
);

async function authenticate(username) {
  try {
    const { data: auth_token } = await instance.post(
      `/session/auth/token`,
      new URLSearchParams({
        secret_key: process.env.TS_SECRET_KEY,
        username: username,
        access_level: "FULL"
      }),
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          accept: "text/plain"
        }
      }
    );

    const loginResp = await instance.post(
      `/session/login/token`,
      new URLSearchParams({
        username,
        auth_token,
        redirect_url: ""
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Accept: "text/plain"
        },
        maxRedirects: 0
      }
    );
    console.log(loginResp.headers);
    const cookie = loginResp.headers["set-cookie"].map(Cookie.parse);
    console.log(cookie.toString());
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  authenticate,
  tsApi: instance
};
