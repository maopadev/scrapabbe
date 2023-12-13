/** */
const cheero = require("cheerio");
const fs = require("fs");

const url = `https://www.discogs.com/es/`;

const records = {};

const getHTML = async () => {
  const res = await fetch(url);
  if (res.ok) {
    return await res.text();
  }
};

getHTML().then((response) => {
    const $ = cheero.load(response);
    $(".release_card").each((i, album) => {
        const cover = $(album).find("img").attr("src");
        const title = $(album).find("h4").text();
        const artist = $(album).find("h5").text();

        let href = $(album).find('a').attr("href");
        let index = href.match(/release\/(\d+)-/)[1];

        records[index] = {
            id: i,
            cover: cover,
            title: title,
            artist: artist,
            href: href
        };
    });
    fs.writeFile("./db/newest.json", JSON.stringify(records), (err) => {
        if (err) console.log("Error");
        console.log("The file has been saved!");
    });
});
