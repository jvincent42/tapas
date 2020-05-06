interface Message {
  counter: number;
}

const port = browser.runtime.connect(browser.runtime.id, { name: 'content_script/lifecycle' });

port.onMessage.addListener((req: Message) => {
  document.write(
    `<div>Popup opened ${req.counter} time${req.counter === 0 || req.counter > 1 ? 's' : ''} on this tab</div>`,
  );
  document.close();
});
