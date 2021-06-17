function createTab(link, authuser, autojoin, autoleave, endtime) {
  const gmeetregexExp = 'https://meet.google.com/[a-zA-Z0-9?&=]+';
  const zoomregexExp = 'https://zoom.us/+';
  if (link.match(gmeetregexExp)) {
    var link = link.split('?')[0];
    link = link + `?authuser=${authuser}&pli=1`;
  }
  if (link.match(zoomregexExp)) {
    var sp = link.split('/')[4];
    var code = sp.split('?')[0];
    link = `https://zoom.us/wc/${code}/join`;
  }
  console.log(`joining meeting ${link}`);
  return new Promise((resolve) => {
    chrome.tabs.create({ url: link }, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === tab.id) {
          if (link.match(gmeetregexExp)) {
            console.log('URL matched the google meet regex');
            if (autojoin) {
              console.log('Intiating autojoin');
              chrome.tabs.executeScript(tab.id, { file: 'meet.bundle.js' });
            }
            console.log(endtime);
            console.log(new Date(endtime).getTime());
            console.log(new Date().getTime());
            console.log(`Status : ${info.status} and ID : ${tab.id}`);
            if (autoleave) {
              console.log('Initiating auto leave')
              var etime = new Date(endtime).getTime();
              while (true) {
                var ctime = new Date().getTime();
                console.log(ctime, etime)
                if (ctime === etime) {
                  chrome.tabs.executeScript(tab.id, { file: "meetAutoLeave.bundle.js" })
                  break;
                }
              }
              // setTimeout(chrome.tabs.executeScript(tab.id, { code: "document.getElementsByClassName('VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c jh0Tpd Gt6sbf QQrMi ftJPW')[0].click()" }), 30000);
            }
          } else if (link.match(zoomregexExp)) {
            console.log('URL matched the zoom regex');
            if (autojoin) {
              console.log('Intiating autojoin');
              chrome.tabs.executeScript(tab.id, {});
              console.log(`Status : ${info.status} and ID : ${tab.id}`);
            }
          } else {
            console.log('URL did not mtach the regex');
          }

          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

function sendMessage(type, key) {
  let message = {};
  message['type'] = type;
  message['key'] = key;
  chrome.runtime.sendMessage(message, () => {});
}

export { createTab, sendMessage };
