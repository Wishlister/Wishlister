var steam = require("./steam")
var sql = require("./sql_db.js")
var gog = require("./gog.js")
var server = require("./server.js")
const _ = require('lodash');

beforeAll(() => {
    return steam.steam(590380).then((result) => {
        steam_object = result;
        return sql.fetch_wishlist(60);
    }).then((result) => {
        db_list = result

        mock_steam_obj =
        {
            "name": "Into the Breach",
            "price_overview": {
                "initial": 1749,
                "discount_percent": 0
            },
            "header_image": "https://steamcdn-a.akamaihd.net/steam/apps/590380/header.jpg?t=1519989363",
            "steam_appid": 590380
        }
    }).then((tyler) => {
      return sql.check_email_existence('test@test.com', 'userEmail').then((validEmail) => {
        validEmailTest = validEmail;
      }).then((tyler) => {
      return sql.get_uid_from_email('test@test.com').then((userID) => {
        userIDTest = userID;
      })
    })
    })
})

afterAll(() => {
    // Rebase Test - 1
    // Rebase Test - 2
    sql.connection.end()
})

describe("Steam Tests", () => {
  test("Receive JSON object from Steam API", () => {
      expect(steam_object.type).
      toBe("game")

  }),
  test("Process steam object - Game Title", () => {
      expect(steam.process_object(mock_steam_obj)[0]).
      toBe("Into the Breach")
  }),
  test("Calculte steam app price", () => {
    expect(steam.calculate_price(10020, 50)).
    toBe("50.10")
  })
})

describe('SQL DB Tests', () => {
    test("Fetch Wishlist from MySQL Database", () => {
        expect(db_list[1].appid).
        toBe(376520)
    })
})

describe('Tyler SQL_db Tests', () => {
  test('Check if email is in database', () => {
    expect(validEmailTest).toBe(true)
  })
  test('Fetch uid from input email', () => {
    expect(userIDTest).toBe(63)
  })
})

describe('GOG Tests', () => {
    test("Receive JSON object from GOG API", () => {
        return gog.gog_api("Witcher").then((result) => {
            expect(_.isArray(result)).
            toBeTruthy()
        })

    }),
    test("Return empty list for unmatched name", () => {
        return gog.gog_api("afdsafdsaf").then((result) => {
            expect(result).
            toHaveLength(0)
        })
    }),
    test("Return just the specified game object", () => {
        return gog.gog_api("The Witcher: Enhanced Edition").then((result) => {
            return gog.isolate_game_obj("The Witcher: Enhanced Edition", result)
        }).then((game_obj) => {
            expect(game_obj.title).
            toBe("The Witcher: Enhanced Edition")
        })
    }),
    test("Return undefined for unmatched names", () => {
        return gog.gog_api("afdsafdsaf").then((result) => {
            return gog.isolate_game_obj("afdsafdsaf", result)
        }).then((game_obj) => {
            expect(game_obj).
            toBe(undefined)
        })
    })
})
