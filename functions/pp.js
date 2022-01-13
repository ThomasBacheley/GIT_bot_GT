module.exports = async function (client) {
    try {
        setInterval(() => {
            client.user.setAvatar(`/home/pi/GIT_bot_GT/assets/${Math.floor(Math.random() * 3)}.png`);
        }, getrnd() * 3600 * 1000);
    } catch (error) {
        throw error
    }
}

function getrnd() { return Math.round(Math.random() * (24 - 6) + 6) }
