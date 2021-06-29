import { launch, Page } from "puppeteer";
import { performance } from "perf_hooks";
import ffmpeg from "fluent-ffmpeg";
import { Stream, Readable, ReadableOptions } from "stream";
import Capturer from "./Capturer";
import settings from "../../settings.json";
Object.assign(settings, process.env);
import { Logger } from "tslog";
const console = new Logger();

async function wait(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
//https://peter.sh/experiments/chromium-command-line-switches/#max-gum-fps
//https://peter.sh/experiments/chromium-command-line-switches/#webrtc-max-cpu-consumption-percentage

class ReadableFromPuppeteer extends Readable {
  private page: Page;

  constructor(options: ReadableOptions & { page: Page }) {
    super(options);

    this.page = options.page;

    this.page.exposeFunction("push", (arr: number[]) => {
      console.silly(arr.length);
      this.push(new Uint8Array(arr));
    });
  }

  _read() {}
}

async function main() {
  // const browser = await launch({
  //   headless: false,
  //   defaultViewport: { width: 1920, height: 1080 },
  //   args: [
  //     "--enable-usermedia-screen-capturing",
  //     "--allow-http-screen-capture",
  //     "--no-sandbox",
  //     "--auto-select-desktop-capture-source=Renderer",
  //     "--disable-setuid-sandbox"
  //     // "--load-extension=" + __dirname,
  //     // "--disable-extensions-except=" + __dirname
  //   ],
  //   executablePath: "chromium"
  // });
  // const page = (await browser.pages())[0];
  // try {
  //   await page.goto("http://localhost:5000", { waitUntil: "networkidle2" });
  // } catch (e) {
  //   console.error(e);
  // }

  // const readable = new ReadableFromPuppeteer({ page });

  // await page.evaluate(async () => {
  //   console.log(this);
  //   // @ts-ignore
  //   const captureStream = await navigator.mediaDevices.getDisplayMedia({
  //     video: {
  //       displaySurface: "browser"
  //     }
  //   });

  //   //@ts-ignore
  //   const recorder = new MediaRecorder(captureStream, {
  //     mimeType: "video/webm;codecs=H264"
  //   });

  //   //@ts-ignore
  //   window.captureStream = captureStream;
  //   //@ts-ignore
  //   window.recorder = recorder;
  //   console.log(captureStream);
  //   console.log(recorder);

  //   // @ts-ignore
  //   recorder.addEventListener("dataavailable", async evt => {
  //     //@ts-ignore
  //     const buffer = await evt.data.arrayBuffer();
  //     const array = new Uint8Array(buffer);
  //     console.log(array);
  //     //@ts-ignore
  //     window.push([...array]);
  //   });
  //   recorder.start(1000);

  //   // @ts-ignore
  //   //document.write("ABC");
  // });

  const capturer = new Capturer({ executablePath: "chromium" });

  const source = await capturer.capture("http://localhost:5000");

  console.debug(source);

  const cmd = ffmpeg({ source })
    .videoBitrate(2000, true)
    .videoCodec("copy")
    .audioCodec("aac")
    .audioFrequency(44100)
    .format("flv")
    //  .saveToFile("output.flv");
    .save(`rtmp://live-fra05.twitch.tv/app/${settings.STREAM_KEY}`);

  //cmd.on("start", console.log);
  cmd.on("codecData", d => console.info("codecData", d));
  cmd.on("progress", p => console.info("progress", p));

  // page.on("dialog", async dialog => {
  //   console.log(dialog.message());
  //   // await dialog.dismiss();
  //   // await browser.close();
  // });

  // const t = performance.now();
  // await page.screenshot({ path: "screen.jpeg", fullPage: true });
  // console.log(performance.now() - t);

  // await wait(2000);

  // const dt = new MovingAvg(50, 0);
  // let t: number;
  // while (true) {
  //   t = performance.now();
  //   await page.screenshot({ encoding: "binary" });
  //   dt.push(performance.now() - t);
  //   console.log(dt.avg);
  // }

  // const pages = await browser.pages();
  // console.log("pages", await Promise.all(pages.map(p => p.viewport())));
}

main();
