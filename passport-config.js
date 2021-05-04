const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const password = bcrypt.hashSync('password', 10)
var testUser = {
    name: 'TestUser',
    email: 'example@email.com',
    password: password,
}

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        if (email !== testUser.email) {
            return done(null, false, { message: 'Wrong email' })
        }

        try {
            if (await bcrypt.compare(password, testUser.password)) {
                return done(null, true)
            } else {
                return done(null, false, { message: 'Wrong Password' })
            }
        } catch (e) {
            done(e)
        }
    }

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, authenticateUser)
    )

    /* passport.serializeUser((user, done) => done(null, user.name))
    passport.deserializeUser((email, done) => {
        return done(null, testUser)
    })*/
}

module.exports = initialize
