module.exports = async function (client) {
    try {
        var nbr_pp = 0;
        setInterval(() => {
            if (nbr_pp == 0) { nbr_pp++ }
            else { nbr_pp-- }
            client.user.setAvatar(`../assets/${nbr_pp}.png`);
        }, getrnd() * 3600 * 1000);
    } catch (error) {
        throw error
    }
}

function getrnd() { return Math.round(Math.random() * (24 - 6) + 6) }