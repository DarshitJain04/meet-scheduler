chrome.alarms.clearAll(function () {
    console.log("Clearing all alarms");
});


chrome.storage.sync.get(["Data"], function (res) {

    var data = res.Data
    console.log(`If condition data : ${ JSON.stringify(data) }`)

    for (let i = 0; i < data.length; i++) {
        const link = data[i]["link"];
        if (data[i]["start_time"] >= Date.now()) {
            chrome.alarms.create(link, {
                when : data[i]["start_time"]
            });
            console.log(`alarm ${ i } created`);
        };
    };

    chrome.alarms.getAll(function (alarms) {
        console.log(`Alarms : ${ JSON.stringify(alarms) }`)
    });

    chrome.alarms.onAlarm.addListener( function (alarm) {
        window.open(alarm["name"], "_blank");
        chrome.alarms.clear(alarm["name"]);
    });

});