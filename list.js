import * as https from "https";
import * as jsdom from "jsdom";

const data = [];

for (let i = 1; i <= 245; i++) {
  const uri = `https://botanical-garden.city.fukuoka.lg.jp/plants/detail/${i}`;
  const htmlPromise = new Promise((resolve, reject) => {
    https.get(uri, (res) => {
      let html = [];
      res.on("data", (chunk) => html.push(chunk));
      res.on("end", () => resolve(Buffer.concat(html).toString()));
    });
  });
  const dom = new jsdom.JSDOM(await htmlPromise);
  const texts = [...dom.window.document.querySelectorAll("td")].map((t) =>
    t.textContent.trim()
  );
  data.push({
    uri: uri,
    image: `https://botanical-garden.city.fukuoka.lg.jp/index/files/Plant/0/Plant_${i}_image.jpg`,
    name: texts[2],
    where: texts[0],
    when: texts[1],
    englishName: texts[3],
    family: texts[4],
    genus: texts[5],
  });
}

console.log(JSON.stringify(data));
