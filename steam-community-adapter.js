const SteamCommunity = require("steamcommunity");

class SteamCommunityAdapter {
  community;
  credentials;

  constructor(username, password) {
    this.community = new SteamCommunity();

    this.credentials = [username, password];
  }

  getCredentials() {
    return new Promise((resolve, reject) => {
      this.community.loggedIn((err, loggedIn) => {
        if (err) {
          return reject(err);
        }

        if (loggedIn) {
          return resolve(this.getSession());
        }

        this.community.login(
          {
            accountName: this.credentials[0],
            password: this.credentials[1],
          },
          (err) => {
            if (err) {
              return reject(err);
            }

            return resolve(this.getSession());
          }
        );
      });
    });
  }

  getSession() {
    const [sessionid, steamLoginSecure] = [
      this.community._jar._jar.store.idx["steamcommunity.com"]["/"]["sessionid"]
        .value,
      this.community._jar._jar.store.idx["steamcommunity.com"]["/"][
        "steamLoginSecure"
      ].value,
    ];

    return [
      sessionid,
      `sessionid=${sessionid}; steamLoginSecure=${steamLoginSecure};`,
    ];
  }
}

module.exports = SteamCommunityAdapter;
