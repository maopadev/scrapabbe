/** */
const cheero = require("cheerio");
const fs = require("fs");

const url = `https://www.discogs.com/es/`;

const records = {};

const getLatestsRecords = async () => {
  const res = await fetch(url);
  if (res.ok) {
    return await res.text();
  }
};

const getInfoRecord = async (href) => {
  const res = await fetch(href);
  if (res.ok) {
    return await res.text();
  }
};

getLatestsRecords().then((resTitle) => {
  const $ = cheero.load(resTitle);
  $("#carousel-1 .release_card").each((i, album) => {
    const cover = $(album).find("img").attr("src");
    const title = $(album).find("h4").text();
    const artist = $(album).find("h5").text();

    const href = $(album).find("a").attr("href");
    let index = href.match(/release\/(\d+)-/)[1];

    
    const information = {};
    getInfoRecord(href).then((resInfo) => {
      const $ = cheero.load(resInfo);
      $(".content_pzwez .table_1fWaB tbody").each((j, info) => {
        information[i] = {
          label: $(info).find("tr td").eq(0).text(),
          format: $(info).find("tr td").eq(1).text(),
          country: $(info).find("tr td").eq(2).text(),
          released: $(info).find("tr td").eq(3).text(),
          genre: $(info).find("tr td").eq(4).text(),
          style: $(info).find("tr td").eq(5).text(),
        };
        console.log(information);
      });
    });

    console.log(information[i]);

    records[i] = {
      id: index,
      cover,
      title,
      artist,
      information: information[i],
    };
  });

  /** Registramos los  */
  fs.writeFile("./db/records.json", JSON.stringify(records), (err) => {
    if (err) console.log("Error");
    console.log("The file has been saved!");
  });
});
