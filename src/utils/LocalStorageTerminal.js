export const LocalStorageTerminal = {
    setItem: function (key, value) {
        const stringfiedVal = JSON.stringify(value);
        return Promise.resolve().then(function () {
            window.localStorage.setItem(key, stringfiedVal);
        })
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return JSON.parse(window.localStorage.getItem(key));
        })
    }
};