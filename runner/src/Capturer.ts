import { LaunchOptions, Browser, launch } from "puppeteer";
import { Readable } from "stream";
import { Logger } from "tslog";
const console = new Logger();

interface CaptureOptions extends LaunchOptions {}

export default class Capturer {
  private options: CaptureOptions;
  private browser: Browser;

  constructor(options: CaptureOptions) {
    this.options = options;
    this.options.args = this.options.args ?? [];

    this.options.args.push(
      "--enable-usermedia-screen-capturing",
      "--allow-http-screen-capture",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--auto-select-desktop-capture-source=CaptureThis"
    );

    this.options.headless = false;
  }

  private async launch() {
    if (this.browser) return;
    console.debug("Launching");
    this.browser = await launch(this.options);
  }

  public async capture(url: string) {
    if (!this.browser) await this.launch();
    const stream = new Readable({ read: () => {} });

    const page = await this.browser.newPage();
    console.debug("goto");
    await page.goto(url, { waitUntil: "networkidle2" });

    console.debug("exposing push");
    await page.exposeFunction("push", (arr: number[]) => {
      stream.push(new Uint8Array(arr));
    });

    console.debug("Setting title");
    await page.evaluate(() => {
      //@ts-ignore
      document.title = "CaptureThis";
    });

    console.debug("Starting stream");
    await page.evaluate(async () => {
      // @ts-ignore
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser"
        }
      });

      //@ts-ignore
      const recorder = new MediaRecorder(captureStream, {
        mimeType: "video/webm;codecs=H264",
        videoBitsPerSecond: 6000000
      });

      // @ts-ignore
      recorder.addEventListener("dataavailable", async evt => {
        //@ts-ignore
        const buffer = await evt.data.arrayBuffer();
        const array = new Uint8Array(buffer);
        //@ts-ignore
        window.push([...array]);
      });

      recorder.start(1000);
    });

    return stream;
  }
}
